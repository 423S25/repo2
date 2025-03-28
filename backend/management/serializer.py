from rest_framework import serializers
from .models import InventoryItem

class ItemSerializer(serializers.ModelSerializer):
    status = serializers.CharField(allow_blank=True, required=False)
    brand = serializers.CharField(allow_blank=True, required=False)
    class Meta:
        model = InventoryItem
        fields = '__all__'
