from django.urls import path
from .views import AdminDashboardOverviewView, ExportRevenueReportCSVView

urlpatterns = [
    path('admin/overview/', AdminDashboardOverviewView.as_view(), name='admin_analytics_overview'),
    path('admin/export-revenue/', ExportRevenueReportCSVView.as_view(), name='admin_export_revenue'),
]
