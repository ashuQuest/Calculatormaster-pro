from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, CurrentUserProfileView,
    ChangePasswordView, AdminUserListView, AdminUserActionView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', CurrentUserProfileView.as_view(), name='current_user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Superadmin User Management
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:user_id>/action/', AdminUserActionView.as_view(), name='admin_user_action'),
]
