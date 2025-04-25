from rest_framework import serializers
from .models import InventoryItem, ItemCategory
from simple_history.models import HistoricalRecords




class ItemSerializer(serializers.ModelSerializer):
    status = serializers.CharField(allow_blank=True, required=False)
    brand = serializers.CharField(allow_blank=True, required=False)
    item_category = serializers.CharField()  # Now it's a CharField

    class Meta:
        model = InventoryItem
        fields = '__all__'

    def create(self, validated_data):
        category_name = validated_data.pop('item_category')
        try:
            item_category = ItemCategory.objects.get(category=category_name)
        except ItemCategory.DoesNotExist:
            item_category = ItemCategory.objects.create(category=category_name)
        inventory_item = InventoryItem.objects.create(item_category=item_category, **validated_data)
        return inventory_item

    def update(self, instance, validated_data):
        category_name = validated_data.pop('item_category', None)
        if category_name:
            try:
                item_category = ItemCategory.objects.get(category=category_name)
            except ItemCategory.DoesNotExist:
                item_category = ItemCategory.objects.create(category=category_name)
            instance.item_category = item_category

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['item_category'] = instance.item_category.category
        return representation


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = "__all__"


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
