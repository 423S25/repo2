from rest_framework import serializers
from .models import InventoryItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class ItemHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem.history.model
        fields = '__all__'