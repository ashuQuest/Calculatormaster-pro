from django.urls import path
from .views import (
    SubscriptionPlanListView, CurrentUserSubscriptionView,
    AdminSubscriptionPlanListView, AdminSubscriptionPlanDetailView
)

urlpatterns = [
    path('plans/', SubscriptionPlanListView.as_view(), name='public_subscription_plans'),
    path('my-subscription/', CurrentUserSubscriptionView.as_view(), name='current_user_subscription'),

    # Superadmin plan management
    path('admin/plans/', AdminSubscriptionPlanListView.as_view(), name='admin_plan_list_create'),
    path('admin/plans/<int:pk>/', AdminSubscriptionPlanDetailView.as_view(), name='admin_plan_detail'),
]
