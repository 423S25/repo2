from django.contrib import admin
from management.models import InventoryItem, ItemCategory
# Register your models here.

admin.site.register(InventoryItem)
admin.site.register(ItemCategory)

