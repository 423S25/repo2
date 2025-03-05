from django.test import TestCase
from .models import InventoryItem

# Create your tests here.

class SimpleTestCase(TestCase):
    def setUp(self):
        item = InventoryItem.objects.create(
            item_name="Test Item",
            stock_count=10,
            sell_price=80
        )

    def test_item_is_added(self):
        item_name = InventoryItem.objects.get(name="item_name")
        stock_count = InventoryItem.objects.get(name="stock_count")
        sell_price = InventoryItem.objects.get(name="sell_price")
        new_count = InventoryItem.objects.count()
        self.assertEqual(new_count, initial_count + 1)
        self.assertEqual(item.item_name, "Test Item")
        self.assertEqual(item.stock_count, 10)
        self.assertEqual(item.sell_price, 99.99)

