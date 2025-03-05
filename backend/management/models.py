from django.db import models

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField(default="")
    stock_count = models.IntegerField(default=0)
    minimum_count = models.IntegerField(default=0)
    new_item = models.TextField(default="")
    last_update = models.TextField(default="")
    description = models.TextField(default="")
    category_num = models.IntegerField(default=0)
    buy_price = models.IntegerField(default=0)
    sell_price = models.IntegerField(default=0)
    location = models.TextField(default="")
    code_num = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    sold_out = models.TextField(default="")
    # donated
    # purchased
    



