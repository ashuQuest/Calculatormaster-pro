from rest_framework import serializers
from .models import SubscriptionPlan, Subscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'code', 'name', 'price', 'duration_days',
            'description', 'features', 'badge', 'is_active', 'sort_order'
        ]


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    remaining_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'plan', 'start_date', 'expiry_date',
            'status', 'is_valid', 'remaining_days', 'created_at'
        ]
