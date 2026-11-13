from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta

from .models import User, UserProfile
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    ChangePasswordSerializer, AdminUserManagementSerializer
)
from .permissions import IsSuperAdminUser, IsNotBlocked
from apps.audit_logs.models import AdminAuditLog


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'Account registered successfully.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        # Log admin login
        if user.is_superadmin_user:
            AdminAuditLog.objects.create(
                admin=user,
                action='ADMIN_LOGIN',
                description=f"Admin {user.username} logged into CalcMaster Pro.",
                ip_address=request.META.get('REMOTE_ADDR')
            )

        return Response({
            'success': True,
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class CurrentUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'success': True, 'user': serializer.data})

    def patch(self, request):
        user = request.user
        profile = user.profile

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone = request.data.get('phone')

        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if phone is not None:
            user.phone = phone
        user.save()

        # Update profile fields
        preferred_theme = request.data.get('preferred_theme')
        default_angle_unit = request.data.get('default_angle_unit')
        default_currency = request.data.get('default_currency')

        if preferred_theme:
            profile.preferred_theme = preferred_theme
        if default_angle_unit:
            profile.default_angle_unit = default_angle_unit
        if default_currency:
            profile.default_currency = default_currency
        profile.save()

        return Response({
            'success': True,
            'message': 'Profile updated successfully.',
            'user': UserSerializer(user).data
        })


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'success': True, 'message': 'Password changed successfully.'})


# -------------------------------------------------------------------------
# Superadmin User Management
# -------------------------------------------------------------------------
class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsSuperAdminUser]
    serializer_class = AdminUserManagementSerializer

    def get_queryset(self):
        queryset = User.objects.all().select_related('profile')
        search = self.request.query_params.get('search')
        role = self.request.query_params.get('role')
        status_filter = self.request.query_params.get('status')

        if search:
            queryset = queryset.filter(
                models.Q(username__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search)
            )
        if role:
            queryset = queryset.filter(role=role)
        if status_filter == 'blocked':
            queryset = queryset.filter(is_blocked=True)
        elif status_filter == 'active':
            queryset = queryset.filter(is_blocked=False)

        return queryset


class AdminUserActionView(APIView):
    permission_classes = [IsSuperAdminUser]

    def post(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'toggle_block', 'grant_premium', 'revoke_premium'

        if target_user.is_superadmin_user and action in ['toggle_block', 'revoke_premium']:
            return Response({'success': False, 'message': 'Cannot modify Superadmin Owner privileges.'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'toggle_block':
            target_user.is_blocked = not target_user.is_blocked
            target_user.save()
            act_text = "Blocked" if target_user.is_blocked else "Unblocked"
            AdminAuditLog.objects.create(
                admin=request.user,
                action='USER_BLOCK_TOGGLE',
                description=f"Admin {request.user.username} {act_text} user {target_user.username}.",
                target_user=target_user,
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({
                'success': True,
                'message': f"User {target_user.username} has been {act_text.lower()}."
            })

        elif action == 'grant_premium':
            from apps.subscriptions.models import Subscription, SubscriptionPlan
            days = int(request.data.get('days', 365))
            plan = SubscriptionPlan.objects.filter(is_active=True).first()

            # Create or update subscription
            sub, _ = Subscription.objects.get_or_create(
                user=target_user,
                defaults={
                    'plan': plan,
                    'start_date': timezone.now(),
                    'expiry_date': timezone.now() + timedelta(days=days),
                    'status': 'ACTIVE'
                }
            )
            sub.status = 'ACTIVE'
            sub.start_date = timezone.now()
            sub.expiry_date = timezone.now() + timedelta(days=days)
            sub.save()

            target_user.role = 'PREMIUM'
            target_user.save()

            AdminAuditLog.objects.create(
                admin=request.user,
                action='PREMIUM_GRANT',
                description=f"Admin {request.user.username} granted {days} days premium to {target_user.username}.",
                target_user=target_user,
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({'success': True, 'message': f"Granted {days} days premium to {target_user.username}."})

        elif action == 'revoke_premium':
            from apps.subscriptions.models import Subscription
            Subscription.objects.filter(user=target_user, status='ACTIVE').update(status='CANCELLED')
            target_user.role = 'FREE'
            target_user.save()

            AdminAuditLog.objects.create(
                admin=request.user,
                action='PREMIUM_REVOKE',
                description=f"Admin {request.user.username} revoked premium from {target_user.username}.",
                target_user=target_user,
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({'success': True, 'message': f"Revoked premium from {target_user.username}."})

        return Response({'success': False, 'message': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
