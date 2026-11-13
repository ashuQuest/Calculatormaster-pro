from django.db import models
from django.conf import settings
from django.utils import timezone

class SubscriptionPlan(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    description = models.CharField(max_length=255, blank=True, default='')
    features = models.JSONField(default=list, blank=True)
    badge = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'price']

    def __str__(self):
        return f"{self.name} - ₹{self.price} ({self.duration_days} days)"


class Subscription(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
        ('PENDING_APPROVAL', 'Pending Approval'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name='user_subscriptions')
    start_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def is_valid(self):
        return self.status == 'ACTIVE' and self.expiry_date >= timezone.now()

    @property
    def remaining_days(self):
        if not self.is_valid:
            return 0
        diff = self.expiry_date - timezone.now()
        return max(0, diff.days + (1 if diff.seconds > 0 else 0))

    def check_and_update_status(self):
        """Automatically transition status to EXPIRED if past expiry date."""
        if self.status == 'ACTIVE' and self.expiry_date < timezone.now():
            self.status = 'EXPIRED'
            self.save(update_fields=['status'])
            # Also update user role if no other active subscription
            if not self.user.is_superadmin_user and not self.user.has_active_premium:
                self.user.role = 'FREE'
                self.user.save(update_fields=['role'])

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"
