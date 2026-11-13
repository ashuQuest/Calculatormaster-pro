import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.subscriptions.models import SubscriptionPlan

def screenshot_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    unique_name = f"payment_{instance.request_id}_{uuid.uuid4().hex[:8]}.{ext}"
    return f"screenshots/{timezone.now().strftime('%Y/%m')}/{unique_name}"


class WebsiteSettings(models.Model):
    upi_id = models.CharField(max_length=100, default='6205433088-2@ybl')
    payee_name = models.CharField(max_length=150, default='ASHUTOSH KUMAR')
    is_upi_enabled = models.BooleanField(default=True)
    payment_instructions = models.TextField(
        default="1. Scan the dynamic UPI QR code with any UPI app (PhonePe, Google Pay, Paytm, BHIM).\n"
                "2. Ensure the exact amount matches the plan selected.\n"
                "3. Complete payment and copy the 12-digit UTR / UPI Reference Number.\n"
                "4. Take a screenshot of the completed payment receipt.\n"
                "5. Submit the form below with your details for manual admin verification."
    )
    support_contact = models.CharField(max_length=200, default='+91 6205433088 | support@calcmasterpro.com')
    scanner_image_url = models.CharField(max_length=500, default='/media/qr/phonepe_scanner.jpg')
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj

    def __str__(self):
        return f"UPI Settings ({self.upi_id})"


class PaymentRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('APPROVED', 'Approved & Activated'),
        ('REJECTED', 'Rejected'),
    )

    request_id = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payment_requests')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name='payment_requests')
    
    # Server-verified amount vs user claimed amount
    expected_amount = models.DecimalField(max_digits=10, decimal_places=2)
    claimed_amount = models.DecimalField(max_digits=10, decimal_places=2)

    payer_name = models.CharField(max_length=150)
    payer_upi_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Normalized UTR for duplicate prevention
    utr = models.CharField(max_length=100, db_index=True)
    
    payment_date = models.DateField()
    payment_time = models.CharField(max_length=20, blank=True, default='')
    screenshot = models.ImageField(upload_to=screenshot_upload_path)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    rejection_reason = models.TextField(blank=True, null=True)

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_payments'
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def normalize_utr(cls, raw_utr):
        """Strip spaces, hyphens, and uppercase for consistent duplicate checking."""
        if not raw_utr:
            return ""
        return "".join(c for c in str(raw_utr) if c.isalnum()).upper()

    def __str__(self):
        return f"[{self.request_id}] {self.user.username} - ₹{self.claimed_amount} ({self.status})"


class PaymentTransaction(models.Model):
    payment_request = models.OneToOneField(PaymentRequest, on_delete=models.CASCADE, related_name='transaction_record')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    utr = models.CharField(max_length=100, unique=True)
    verified_at = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Verified Tx: {self.utr} - ₹{self.amount}"
