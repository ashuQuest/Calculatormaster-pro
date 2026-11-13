from django.urls import path
from .views import AdminAuditLogListView

urlpatterns = [
    path('admin/logs/', AdminAuditLogListView.as_view(), name='admin_audit_logs'),
]
