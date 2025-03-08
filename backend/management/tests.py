import json
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import InventoryItem

# Create your tests here.

class SimpleTestCase(TestCase):
    def setUp(self):
        self.item = InventoryItem.objects.create(
            item_name="Test Item",
            stock_count=10,
            sell_price=80
        )

    def test_item_is_added(self):
        initial_count = InventoryItem.objects.count()
        new_item = InventoryItem.objects.create(
            item_name="New Item",
            stock_count=5,
            sell_price=50
        )
        new_count = InventoryItem.objects.count()

        self.assertEqual(new_count, initial_count + 1)
        self.assertEqual(new_item.item_name, "New Item")
        self.assertEqual(new_item.stock_count, 5)
        self.assertEqual(new_item.sell_price, 50)

   
    def test_item_is_deleted(self):
        url = reverse('inventory') 
        response = self.client.delete(url, 
                                      data=json.dumps({'pk': self.item.pk}),  
                                    content_type='application/json')  
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(InventoryItem.objects.filter(pk=self.item.pk).exists())

    