from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('GUEST', 'Guest'),
        ('FREE', 'Registered Free User'),
        ('PREMIUM', 'Premium User'),
        ('SUPERADMIN', 'Superadmin Owner'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FREE')
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def is_superadmin_user(self):
        return self.role == 'SUPERADMIN' or self.is_superuser

    @property
    def has_active_premium(self):
        """
        Check if user has active premium entitlement.
        SUPERADMIN has lifetime free premium with no expiration.
        """
        if self.is_superadmin_user:
            return True
        
        # Check active subscription
        from apps.subscriptions.models import Subscription
        active_sub = Subscription.objects.filter(
            user=self,
            status='ACTIVE',
            expiry_date__gte=timezone.now()
        ).first()

        return active_sub is not None

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_url = models.CharField(max_length=500, blank=True, null=True)
    preferred_theme = models.CharField(max_length=10, default='dark', choices=[('dark', 'Dark'), ('light', 'Light')])
    default_angle_unit = models.CharField(max_length=5, default='DEG', choices=[('DEG', 'Degrees'), ('RAD', 'Radians')])
    default_currency = models.CharField(max_length=5, default='INR')
    total_calculations = models.PositiveIntegerField(default=0)
    ai_queries_used_today = models.PositiveIntegerField(default=0)
    ai_queries_last_reset = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
