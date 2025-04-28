from rest_framework.permissions import BasePermission, SAFE_METHODS

class InventoryPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuse)
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_superuser:
            return True
        if request.user.is_staff and request.method == "PUT":
            data = request.data
            allowed_fields = {"stock_count"}
            return set(data.keys()).issubset(allowed_fields)
        return False