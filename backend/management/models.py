from django.db import models

# Create your models here.

class InventoryItem(models.Model):
    item_name = models.TextField(default="")
    stock_count = models.IntegerField(default=0)
    minimum_count = models.IntegerField(default=0)
    # Not sure what this means
    new_item = models.TextField(default="")
    last_update = models.TextField(default="")
    description = models.TextField(default="")
    category = models.TextField(default="")
    buy_price = models.IntegerField(default=0)
    # TODO possibly remove sell price? I dont think we are selling anything haha
    sell_price = models.IntegerField(default=0)
    location = models.TextField(default="")
    code_num = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    sold_out = models.TextField(default="")
    donated = models.BooleanField(default= False)
    



