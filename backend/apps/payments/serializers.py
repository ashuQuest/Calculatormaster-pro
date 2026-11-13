import uuid
from rest_framework import serializers
from django.utils import timezone
from .models import PaymentRequest, WebsiteSettings
from apps.subscriptions.models import SubscriptionPlan
from apps.subscriptions.serializers import SubscriptionPlanSerializer
from apps.accounts.serializers import UserSerializer

class WebsiteSettingsSerializer(models_serializer := serializers.ModelSerializer):
    class Meta:
        model = WebsiteSettings
        fields = [
            'upi_id', 'payee_name', 'is_upi_enabled',
            'payment_instructions', 'support_contact',
            'scanner_image_url', 'updated_at'
        ]


class PaymentRequestSubmissionSerializer(serializers.ModelSerializer):
    plan_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = PaymentRequest
        fields = [
            'plan_id', 'payer_name', 'payer_upi_id',
            'utr', 'claimed_amount', 'payment_date',
            'payment_time', 'screenshot'
        ]

    def validate_screenshot(self, value):
        max_size = 5 * 1024 * 1024  # 5MB
        if value.size > max_size:
            raise serializers.ValidationError("Screenshot file size cannot exceed 5MB.")
        
        valid_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if hasattr(value, 'content_type') and value.content_type.lower() not in valid_types:
            raise serializers.ValidationError("Unsupported image format. Please upload JPEG, PNG, or WebP.")
        return value

    def validate_utr(self, value):
        normalized = PaymentRequest.normalize_utr(value)
        if len(normalized) < 6:
            raise serializers.ValidationError("Please enter a valid UTR / Transaction Reference number.")
        
        # Check if already approved
        if PaymentRequest.objects.filter(utr=normalized, status='APPROVED').exists():
            raise serializers.ValidationError("This transaction reference has already been approved in a previous subscription.")
        
        return normalized

    def validate(self, attrs):
        plan_id = attrs.get('plan_id')
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
            attrs['plan'] = plan
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError({"plan_id": "Invalid or inactive subscription plan selected."})

        attrs['expected_amount'] = plan.price
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        plan = validated_data.pop('plan')
        validated_data.pop('plan_id')

        # Generate unique request ID e.g. CMP-REQ-20261112-XXXX
        date_str = timezone.now().strftime('%Y%m%d')
        random_suffix = uuid.uuid4().hex[:6].upper()
        req_id = f"CMP-{date_str}-{random_suffix}"

        payment_request = PaymentRequest.objects.create(
            request_id=req_id,
            user=user,
            plan=plan,
            **validated_data
        )
        return payment_request


class PaymentRequestDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    plan = SubscriptionPlanSerializer(read_only=True)
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True)

    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'request_id', 'user', 'plan',
            'expected_amount', 'claimed_amount',
            'payer_name', 'payer_upi_id', 'utr',
            'payment_date', 'payment_time', 'screenshot',
            'status', 'rejection_reason',
            'approved_by_username', 'approved_at',
            'created_at', 'updated_at'
        ]
