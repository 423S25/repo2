from django.db import models

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField()
    count = models.IntegerField()
