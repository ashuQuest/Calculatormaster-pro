from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import SubscriptionPlan, Subscription
from .serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer
from apps.accounts.permissions import IsSuperAdminUser
from apps.audit_logs.models import AdminAuditLog

class SubscriptionPlanListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SubscriptionPlanSerializer
    queryset = SubscriptionPlan.objects.filter(is_active=True).order_by('sort_order', 'price')


class CurrentUserSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_superadmin_user:
            return Response({
                'success': True,
                'is_superadmin': True,
                'is_lifetime': True,
                'has_premium': True,
                'plan_name': 'Owner Lifetime Access',
                'status': 'ACTIVE',
                'remaining_days': 999999,
                'message': 'You have full unrestricted Superadmin Lifetime Access.'
            })

        # Check and update any expired subscriptions
        active_sub = Subscription.objects.filter(
            user=user,
            status='ACTIVE'
        ).order_by('-expiry_date').first()

        if active_sub:
            active_sub.check_and_update_status()
            if active_sub.is_valid:
                return Response({
                    'success': True,
                    'is_superadmin': False,
                    'is_lifetime': False,
                    'has_premium': True,
                    'subscription': UserSubscriptionSerializer(active_sub).data
                })

        return Response({
            'success': True,
            'is_superadmin': False,
            'is_lifetime': False,
            'has_premium': False,
            'message': 'No active premium subscription found. Upgrade to access all advanced features.'
        })


class AdminSubscriptionPlanListView(generics.ListCreateAPIView):
    permission_classes = [IsSuperAdminUser]
    serializer_class = SubscriptionPlanSerializer
    queryset = SubscriptionPlan.objects.all().order_by('sort_order', 'price')

    def perform_create(self, serializer):
        plan = serializer.save()
        AdminAuditLog.objects.create(
            admin=self.request.user,
            action='PLAN_UPDATE',
            description=f"Created new plan {plan.name} (₹{plan.price}, {plan.duration_days} days)",
            ip_address=self.request.META.get('REMOTE_ADDR')
        )


class AdminSubscriptionPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperAdminUser]
    serializer_class = SubscriptionPlanSerializer
    queryset = SubscriptionPlan.objects.all()

    def perform_update(self, serializer):
        plan = serializer.save()
        AdminAuditLog.objects.create(
            admin=self.request.user,
            action='PLAN_UPDATE',
            description=f"Updated plan {plan.name} (Price: ₹{plan.price}, Duration: {plan.duration_days} days, Active: {plan.is_active})",
            ip_address=self.request.META.get('REMOTE_ADDR')
        )
