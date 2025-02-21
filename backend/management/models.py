from django.db import models

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField()
    stock_count = models.IntegerField()
    minimum_count = models.IntegerField()
    new_item = models.TextField()
    last_update = models.TextField()
    description = models.TextField()
    category_num = models.IntegerField()
    buy_price = models.IntegerField()
    sell_price = models.IntegerField()
    location = models.TextField()
    code_num = models.IntegerField()
    weight = models.IntegerField()
    sold_out = models.TextField()
    donated
    purchased
    



