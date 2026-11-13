import csv
from django.db.models import Sum, Count
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.models import User
from apps.accounts.permissions import IsSuperAdminUser
from apps.subscriptions.models import Subscription, SubscriptionPlan
from apps.payments.models import PaymentRequest, PaymentTransaction
from apps.calculators.models import CalculationHistory
from apps.audit_logs.models import AdminAuditLog
from apps.audit_logs.serializers import AdminAuditLogSerializer


class AdminDashboardOverviewView(APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        now = timezone.now()

        # Users overview
        total_users = User.objects.count()
        free_users = User.objects.filter(role='FREE').count()
        
        # Active premium users (including role=PREMIUM and active valid subscription)
        active_premium_users = User.objects.filter(
            models.Q(role='PREMIUM') | models.Q(subscriptions__status='ACTIVE', subscriptions__expiry_date__gte=now)
        ).distinct().count()

        # Payments overview
        pending_payments = PaymentRequest.objects.filter(status='PENDING').count()
        approved_payments = PaymentRequest.objects.filter(status='APPROVED').count()
        rejected_payments = PaymentRequest.objects.filter(status='REJECTED').count()

        # Total verified revenue from ledger
        total_revenue_aggr = PaymentTransaction.objects.aggregate(total=Sum('amount'))['total'] or 0

        # Subscriptions
        expired_subscriptions = Subscription.objects.filter(status='EXPIRED').count()

        # Popular calculators
        popular_calculators = CalculationHistory.objects.values('calculator_id', 'calculator_name', 'category') \
            .annotate(usage_count=Count('id')) \
            .order_by('-usage_count')[:8]

        # Plan-wise breakdown
        plan_breakdown = PaymentTransaction.objects.values('payment_request__plan__name') \
            .annotate(revenue=Sum('amount'), count=Count('id')) \
            .order_by('-revenue')

        # Recent activities
        recent_logs = AdminAuditLog.objects.all().select_related('admin', 'target_user')[:10]

        return Response({
            'success': True,
            'stats': {
                'total_users': total_users,
                'free_users': free_users,
                'active_premium_users': active_premium_users,
                'expired_subscriptions': expired_subscriptions,
                'pending_payments': pending_payments,
                'approved_payments': approved_payments,
                'rejected_payments': rejected_payments,
                'verified_revenue': float(total_revenue_aggr),
            },
            'popular_calculators': list(popular_calculators),
            'plan_breakdown': list(plan_breakdown),
            'recent_activities': AdminAuditLogSerializer(recent_logs, many=True).data,
        })


class ExportRevenueReportCSVView(APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="revenue_report_{timezone.now().strftime("%Y%m%d_%H%M")}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Transaction ID', 'Request ID', 'Username', 'Email', 'Plan', 'Amount (INR)', 'UTR', 'Verified Date', 'Verified By'])

        transactions = PaymentTransaction.objects.all().select_related('payment_request__plan', 'user', 'verified_by').order_by('-verified_at')
        for tx in transactions:
            writer.writerow([
                tx.id,
                tx.payment_request.request_id,
                tx.user.username,
                tx.user.email,
                tx.payment_request.plan.name if tx.payment_request and tx.payment_request.plan else 'N/A',
                tx.amount,
                tx.utr,
                tx.verified_at.strftime('%Y-%m-%d %H:%M:%S'),
                tx.verified_by.username if tx.verified_by else 'Admin'
            ])

        return response
