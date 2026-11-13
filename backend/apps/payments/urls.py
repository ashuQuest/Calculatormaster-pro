from django.urls import path
from .views import (
    PublicWebsiteSettingsView,
    GenerateUPIPaymentQRView,
    SubmitPaymentRequestView,
    UserPaymentHistoryView,
    AdminPaymentRequestListView,
    AdminPaymentDecisionView,
    AdminWebsiteSettingsUpdateView
)

urlpatterns = [
    path('settings/', PublicWebsiteSettingsView.as_view(), name='public_website_settings'),
    path('generate-qr/', GenerateUPIPaymentQRView.as_view(), name='generate_upi_qr'),
    path('submit/', SubmitPaymentRequestView.as_view(), name='submit_payment_request'),
    path('my-history/', UserPaymentHistoryView.as_view(), name='user_payment_history'),

    # Superadmin Payment Management
    path('admin/requests/', AdminPaymentRequestListView.as_view(), name='admin_payment_requests'),
    path('admin/requests/<int:pk>/decision/', AdminPaymentDecisionView.as_view(), name='admin_payment_decision'),
    path('admin/settings/', AdminWebsiteSettingsUpdateView.as_view(), name='admin_website_settings'),
]
