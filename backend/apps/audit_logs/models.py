from django.db import models
from django.conf import settings

class AdminAuditLog(models.Model):
    ACTION_CHOICES = (
        ('ADMIN_LOGIN', 'Admin Login'),
        ('PAYMENT_APPROVED', 'Payment Approved'),
        ('PAYMENT_REJECTED', 'Payment Rejected'),
        ('USER_BLOCK_TOGGLE', 'User Block / Unblock'),
        ('PREMIUM_GRANT', 'Manual Premium Grant'),
        ('PREMIUM_REVOKE', 'Manual Premium Revoke'),
        ('PLAN_UPDATE', 'Plan Configuration Updated'),
        ('UPI_SETTINGS_UPDATE', 'UPI Settings Updated'),
        ('SYSTEM_BOOTSTRAP', 'System Bootstrap'),
    )

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    target_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='targeted_audit_logs'
    )
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.action} by {self.admin}"
