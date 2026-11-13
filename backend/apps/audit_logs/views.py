from rest_framework import generics
from .models import AdminAuditLog
from .serializers import AdminAuditLogSerializer
from apps.accounts.permissions import IsSuperAdminUser

class AdminAuditLogListView(generics.ListAPIView):
    permission_classes = [IsSuperAdminUser]
    serializer_class = AdminAuditLogSerializer

    def get_queryset(self):
        queryset = AdminAuditLog.objects.all().select_related('admin', 'target_user')
        action = self.request.query_params.get('action')
        search = self.request.query_params.get('search')
        if action:
            queryset = queryset.filter(action=action)
        if search:
            queryset = queryset.filter(description__icontains=search)
        return queryset
