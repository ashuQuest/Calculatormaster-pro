from rest_framework import serializers
from .models import AdminAuditLog

class AdminAuditLogSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin.username', read_only=True)
    target_username = serializers.CharField(source='target_user.username', read_only=True)

    class Meta:
        model = AdminAuditLog
        fields = [
            'id', 'admin', 'admin_username', 'action', 'description',
            'target_user', 'target_username', 'ip_address', 'created_at'
        ]
