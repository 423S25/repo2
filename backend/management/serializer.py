from rest_framework import serializers
from .models import InventoryItem
from simple_history.models import HistoricalRecords

class ItemSerializer(serializers.ModelSerializer):
    status = serializers.CharField(allow_blank=True, required=False)
    brand = serializers.CharField(allow_blank=True, required=False)
    class Meta:
        model = InventoryItem
        fields = '__all__'

class HistoricalInventoryItemSerializer(serializers.ModelSerializer):
    """Serializer for the historical records of inventory items."""
    
    history_date = serializers.DateTimeField(read_only=True)
    history_user = serializers.SerializerMethodField()
    history_type = serializers.CharField(read_only=True)
    
    
    class Meta:
        model = InventoryItem.history.model
        fields = [
            'history_id',
            'history_date',
            'history_user',
            'history_type',
            'item_name',
            'stock_count',
            'base_count',
            'bulk_count',
            'amount_in_bulk',
            'brand',
            'item_category',
            'individual_cost',
            'bulk_cost',
            'donated',
            'is_bulk',
            'status',
        ]

    def get_history_user(self, obj):
        """Return the username of the user who made the change."""
        if obj.history_user:
            return obj.history_user.username
        return None

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalRecords
        fields = '__all__'
