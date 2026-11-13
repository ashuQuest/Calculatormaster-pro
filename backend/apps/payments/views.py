import uuid
from decimal import Decimal
from django.db import transaction, models
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import PaymentRequest, PaymentTransaction, WebsiteSettings
from .serializers import (
    WebsiteSettingsSerializer,
    PaymentRequestSubmissionSerializer,
    PaymentRequestDetailSerializer
)
from .qr_generator import generate_upi_qr_data_url
from apps.subscriptions.models import SubscriptionPlan, Subscription
from apps.accounts.permissions import IsSuperAdminUser, IsNotBlocked
from apps.audit_logs.models import AdminAuditLog


class PublicWebsiteSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings_obj = WebsiteSettings.get_settings()
        serializer = WebsiteSettingsSerializer(settings_obj)
        return Response({'success': True, 'settings': serializer.data})


class GenerateUPIPaymentQRView(APIView):
    """
    Generates a trusted fixed-amount UPI QR code using server-verified plan pricing.
    Allows guests and registered users to view the dynamic QR code.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({'success': False, 'message': 'plan_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid subscription plan.'}, status=status.HTTP_404_NOT_FOUND)

        settings_obj = WebsiteSettings.get_settings()
        if not settings_obj.is_upi_enabled:
            return Response({'success': False, 'message': 'UPI payments are currently disabled.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Generate a temporary reference token for QR tracking
        user_identifier = request.user.id if (request.user and request.user.is_authenticated) else 'GUEST'
        ref_code = f"CMP-{user_identifier}-{uuid.uuid4().hex[:6].upper()}"

        qr_payload = generate_upi_qr_data_url(
            upi_id=settings_obj.upi_id,
            payee_name=settings_obj.payee_name,
            amount=plan.price,
            transaction_note=ref_code
        )

        return Response({
            'success': True,
            'plan': {
                'id': plan.id,
                'name': plan.name,
                'price': str(plan.price),
                'duration_days': plan.duration_days,
            },
            'payment_details': qr_payload,
            'scanner_image_url': settings_obj.scanner_image_url,
            'instructions': settings_obj.payment_instructions,
            'support_contact': settings_obj.support_contact,
        })


class SubmitPaymentRequestView(generics.CreateAPIView):
    """
    Authenticated user submits payment receipt details with screenshot.
    """
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = PaymentRequestSubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        payment_request = serializer.save()

        return Response({
            'success': True,
            'message': 'Payment request submitted successfully. It is now awaiting manual Superadmin verification.',
            'request_id': payment_request.request_id,
            'status': payment_request.status,
            'expected_amount': str(payment_request.expected_amount),
            'claimed_amount': str(payment_request.claimed_amount),
        }, status=status.HTTP_201_CREATED)


class UserPaymentHistoryView(generics.ListAPIView):
    """
    View user's own payment submissions.
    """
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]
    serializer_class = PaymentRequestDetailSerializer

    def get_queryset(self):
        return PaymentRequest.objects.filter(user=self.request.user).select_related('user', 'plan')


# -------------------------------------------------------------------------
# Superadmin Payment Verification Dashboard
# -------------------------------------------------------------------------
class AdminPaymentRequestListView(generics.ListAPIView):
    permission_classes = [IsSuperAdminUser]
    serializer_class = PaymentRequestDetailSerializer

    def get_queryset(self):
        queryset = PaymentRequest.objects.all().select_related('user', 'plan', 'approved_by')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if status_param and status_param.upper() != 'ALL':
            queryset = queryset.filter(status=status_param.upper())

        if search:
            queryset = queryset.filter(
                models.Q(request_id__icontains=search) |
                models.Q(utr__icontains=search) |
                models.Q(payer_name__icontains=search) |
                models.Q(user__username__icontains=search) |
                models.Q(user__email__icontains=search)
            )

        return queryset


class AdminPaymentDecisionView(APIView):
    """
    Superadmin approves or rejects payment requests with database transaction safety.
    """
    permission_classes = [IsSuperAdminUser]

    def post(self, request, pk):
        decision = request.data.get('decision') # 'ACCEPT' or 'REJECT'
        rejection_reason = request.data.get('rejection_reason', '').strip()

        if decision not in ['ACCEPT', 'REJECT']:
            return Response({'success': False, 'message': 'Invalid decision. Must be ACCEPT or REJECT.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            try:
                payment_req = PaymentRequest.objects.select_for_update().get(id=pk)
            except PaymentRequest.DoesNotExist:
                return Response({'success': False, 'message': 'Payment request not found.'}, status=status.HTTP_404_NOT_FOUND)

            if payment_req.status != 'PENDING':
                return Response({
                    'success': False,
                    'message': f"Request is already {payment_req.status}. Cannot reprocess."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Rejection Flow
            if decision == 'REJECT':
                if not rejection_reason:
                    return Response({
                        'success': False,
                        'message': 'A rejection reason is strictly required.'
                    }, status=status.HTTP_400_BAD_REQUEST)

                payment_req.status = 'REJECTED'
                payment_req.rejection_reason = rejection_reason
                payment_req.approved_by = request.user
                payment_req.approved_at = timezone.now()
                payment_req.save()

                AdminAuditLog.objects.create(
                    admin=request.user,
                    action='PAYMENT_REJECTED',
                    description=f"Rejected request {payment_req.request_id} for user {payment_req.user.username}. Reason: {rejection_reason}",
                    target_user=payment_req.user,
                    ip_address=request.META.get('REMOTE_ADDR')
                )

                return Response({
                    'success': True,
                    'message': f"Payment request {payment_req.request_id} rejected.",
                    'status': 'REJECTED'
                })

            # Approval Flow
            # 1. Amount Verification Check: Claimed amount must equal expected plan price
            if Decimal(str(payment_req.claimed_amount)) != Decimal(str(payment_req.expected_amount)):
                payment_req.status = 'REJECTED'
                payment_req.rejection_reason = (
                    f"Amount mismatch: Claimed ₹{payment_req.claimed_amount} does not match "
                    f"plan price ₹{payment_req.expected_amount}."
                )
                payment_req.approved_by = request.user
                payment_req.approved_at = timezone.now()
                payment_req.save()

                AdminAuditLog.objects.create(
                    admin=request.user,
                    action='PAYMENT_REJECTED',
                    description=f"Auto-rejected request {payment_req.request_id} due to amount mismatch.",
                    target_user=payment_req.user,
                    ip_address=request.META.get('REMOTE_ADDR')
                )

                return Response({
                    'success': False,
                    'message': 'Amount mismatch detected. The request has been rejected.',
                    'rejection_reason': payment_req.rejection_reason
                }, status=status.HTTP_400_BAD_REQUEST)

            # 2. UTR Duplicate Check: Check if UTR is already in PaymentTransaction
            if PaymentTransaction.objects.filter(utr=payment_req.utr).exists():
                return Response({
                    'success': False,
                    'message': f"Duplicate UTR detected: Transaction {payment_req.utr} has already been approved."
                }, status=status.HTTP_400_BAD_REQUEST)

            # 3. Mark Approved
            payment_req.status = 'APPROVED'
            payment_req.approved_by = request.user
            payment_req.approved_at = timezone.now()
            payment_req.save()

            # 4. Create Ledger Record
            PaymentTransaction.objects.create(
                payment_request=payment_req,
                user=payment_req.user,
                amount=payment_req.expected_amount,
                utr=payment_req.utr,
                verified_by=request.user
            )

            # 5. Activate or Extend Subscription
            plan = payment_req.plan
            now = timezone.now()

            active_sub = Subscription.objects.filter(
                user=payment_req.user,
                status='ACTIVE',
                expiry_date__gt=now
            ).order_by('-expiry_date').first()

            if active_sub:
                # Extend from existing expiry
                new_start = active_sub.expiry_date
                new_expiry = active_sub.expiry_date + timedelta(days=plan.duration_days)
                active_sub.expiry_date = new_expiry
                active_sub.plan = plan
                active_sub.save()
            else:
                # Fresh subscription
                new_start = now
                new_expiry = now + timedelta(days=plan.duration_days)
                Subscription.objects.create(
                    user=payment_req.user,
                    plan=plan,
                    start_date=new_start,
                    expiry_date=new_expiry,
                    status='ACTIVE'
                )

            # 6. Update user role to PREMIUM if not superadmin
            target_user = payment_req.user
            if not target_user.is_superadmin_user:
                target_user.role = 'PREMIUM'
                target_user.save(update_fields=['role'])

            # 7. Audit Log
            AdminAuditLog.objects.create(
                admin=request.user,
                action='PAYMENT_APPROVED',
                description=(
                    f"Approved payment {payment_req.request_id} for user {target_user.username}. "
                    f"Plan: {plan.name} (₹{plan.price}), UTR: {payment_req.utr}, Valid till {new_expiry.strftime('%Y-%m-%d')}."
                ),
                target_user=target_user,
                ip_address=request.META.get('REMOTE_ADDR')
            )

            return Response({
                'success': True,
                'message': f"Payment approved successfully. Premium activated for {target_user.username} until {new_expiry.strftime('%Y-%m-%d')}.",
                'status': 'APPROVED'
            })


class AdminWebsiteSettingsUpdateView(APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        settings_obj = WebsiteSettings.get_settings()
        return Response({'success': True, 'settings': WebsiteSettingsSerializer(settings_obj).data})

    def patch(self, request):
        settings_obj = WebsiteSettings.get_settings()
        serializer = WebsiteSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        AdminAuditLog.objects.create(
            admin=request.user,
            action='UPI_SETTINGS_UPDATE',
            description=f"Updated UPI and platform settings (UPI ID: {settings_obj.upi_id}, Payee: {settings_obj.payee_name})",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': 'Website settings updated successfully.',
            'settings': serializer.data
        })
