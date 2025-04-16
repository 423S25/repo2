from django.urls import path
from .views import get_items, create_item, modify_item, get_item_quantity_changes, generate_csv_report

urlpatterns = [
    path('inventory/', get_items, name='get_books'),
    path('inventory/create/', create_item, name='create_item'),
    path('inventory/<int:pk>', modify_item, name='modify_item'),
    path('inventory/history/<int:pk>', get_item_quantity_changes, name='get_item_quantity_changes'),
    path('inventory/report/', generate_csv_report, name='report' )
]