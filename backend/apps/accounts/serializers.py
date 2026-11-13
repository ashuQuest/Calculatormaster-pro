from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile

class UserProfileDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'avatar_url', 'preferred_theme', 'default_angle_unit',
            'default_currency', 'total_calculations',
            'ai_queries_used_today', 'created_at'
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileDetailsSerializer(read_only=True)
    is_superadmin = serializers.BooleanField(source='is_superadmin_user', read_only=True)
    has_premium = serializers.BooleanField(source='has_active_premium', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'is_blocked', 'is_superadmin',
            'has_premium', 'profile', 'date_joined'
        ]
        read_only_fields = ['id', 'role', 'is_blocked', 'is_superadmin', 'has_premium', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email__iexact=attrs.get('email', '')).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='FREE'
        )
        return user


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        # Allow login by email or username
        user = None
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            user = authenticate(username=username_or_email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials. Please verify your username/email and password.")

        if user.is_blocked:
            raise serializers.ValidationError("Your account has been suspended. Please contact support.")

        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is not correct.")
        return value


class AdminUserManagementSerializer(serializers.ModelSerializer):
    profile = UserProfileDetailsSerializer(read_only=True)
    is_superadmin = serializers.BooleanField(source='is_superadmin_user', read_only=True)
    has_premium = serializers.BooleanField(source='has_active_premium', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'is_blocked', 'is_active',
            'is_superadmin', 'has_premium', 'profile', 'date_joined'
        ]
