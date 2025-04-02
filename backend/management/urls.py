
from django.urls import path
from .views import get_items, create_item, modify_item, get_item_quantity_changes,  register_user, DownloadCSV

urlpatterns = [
    path('inventory/', get_items, name='inventory-list'),
    path('inventory/add/', create_item, name='inventory-create'),
    path('inventory/<int:pk>/', modify_item, name='inventory-detail'),
    path('register/', register_user, name='register'),
    path('inventory/history/<int:pk>', get_item_quantity_changes, name='get_item_quantity_changes'),
    path("inventory/csv/", DownloadCSV.as_view())
]
