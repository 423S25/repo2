import json
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import InventoryItem
from .views import update_status

# Create your tests here.

class SimpleTestCase(TestCase):
    def setUp(self):
        self.item = InventoryItem.objects.create(
            item_name="Test Item",
            stock_count=10,
            cost=80
        )

    def test_item_is_added(self):
        initial_count = InventoryItem.objects.count()
        new_item = InventoryItem.objects.create(
            item_name="New Item",
            stock_count=5,
            cost=50
        )
        new_count = InventoryItem.objects.count()

        self.assertEqual(new_count, initial_count + 1)
        self.assertEqual(new_item.item_name, "New Item")
        self.assertEqual(new_item.stock_count, 5)
        self.assertEqual(new_item.cost, 50)

'''
    def test_item_is_deleted(self):
        url = reverse('inventory') 
        response = self.client.delete(url, 
                                      data=json.dumps({'pk': self.item.pk}),  
                                    content_type='application/json')  
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(InventoryItem.objects.filter(pk=self.item.pk).exists())
'''

class UpdateStatusTestCase(TestCase):
    def setUp(self):
        self.item_good = InventoryItem.objects.create(
            item_name="Good",
            stock_count=10,  
            base_count=20,
            cost=100
        )
        self.item_low = InventoryItem.objects.create(
            item_name="Low Stock",
            stock_count=8,   
            base_count=20,
            cost=50
        )
        self.item_very_low = InventoryItem.objects.create(
            item_name="Very Low Stock", 
            base_count=20,
            cost=30
        )
        self.item_no_base = InventoryItem.objects.create(
            item_name="No Stock",
            stock_count=10,
            base_count=0,     
            cost=20
        )

    def test_update_status(self):
        self.assertEqual(update_status(self.item_good.pk), "Good")
        self.assertEqual(update_status(self.item_low.pk),"Low Stock" )
        self.assertEqual(update_status(self.item_very_low.pk), "Very Low Stock")
        self.assertEqual(update_status(self.item_no_base.pk), "No Stock")


    