from django.db import models
from simple_history.models import HistoricalRecords

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField(default="")
    stock_count = models.IntegerField(default=0) # number of items in inventory
    base_count = models.IntegerField(default=0) # number of minimum individual items
    bulk_count = models.IntegerField(default=0) # number of bulk cases
    amount_in_bulk = models.IntegerField(default=0) # number of items in bulk case
    brand = models.TextField(default="")
    item_category = models.TextField(default="")
    individual_cost = models.DecimalField(default=0) # cost of indiviudal items
    bulk_cost = models.DecimalField(default=0) # cost of a bulk case
    donated = models.BooleanField(default=False)
    is_bulk = models.BooleanField(default=False)
    status = models.TextField(default="")
    history = HistoricalRecords()