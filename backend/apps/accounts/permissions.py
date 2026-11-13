from rest_framework import permissions

class IsNotBlocked(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and not request.user.is_blocked)


class IsSuperAdminUser(permissions.BasePermission):
    """
    Allows access only to Superadmin Owner accounts.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_blocked:
            return False
        return request.user.is_superadmin_user


class HasPremiumAccess(permissions.BasePermission):
    """
    Allows access to users with active premium entitlement.
    Superadmin always gets lifetime access.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_blocked:
            return False
        return request.user.has_active_premium
