from django.db import models
from simple_history.models import HistoricalRecords

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField(default="")
    stock_count = models.IntegerField(default=0)
    base_count = models.IntegerField(default=0)
    brand = models.TextField(default="")
    item_category = models.TextField(default="")
    cost = models.IntegerField(default=0)
    location = models.TextField(default="")
    donated = models.BooleanField(default=False)
    status = models.TextField(default="")
    history = HistoricalRecords()

