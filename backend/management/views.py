from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from management.models import InventoryItem
# Create your views here.

class InventoryManagementView(APIView):
    def post(self, request):
        count = request.get("count")
        pk = request.get("pk")
        item = InventoryItem.object.filter(pk=pk)
        item.count = count 
        item.update()

    def delete(self, request):
        pk = request.get("pk")
        item = InventoryItem.object.filter(pk=pk)
        item.delete()

    def create(self, request):
        item_name = request.POST.get("item_name")
        count = request.POST.get("count")
        item = InventoryItem.objects.create(item_name=item_name, count=count)

    def search(self, request):
        pk = request.get("pk")
        search_item = InventoryItem.object.filter(pk=pk)
        item_info = [
            {"pk": item.pk, "item_name": item.item_name, "count": item.count, "description": item.description, "price": item.sell_price}
            for item in search_item
        ]
        return Response(item_info)
    
    #def stock_count(self.request):
        #get the stock count
        #if the stock count is under 20, label it as low need more stock
        #if the stock count is above 20, label it as good amount stock.
        #return stock_count

    def get(self, request):
        pk = request.query_params.get("pk")
        action = request.query_params.get("action")
        if action == "search":
            return self.all_item(request)
        if action == "search":
            return self.all_item(request)
        try:
            item = InventoryItem.objects.filter(pk=pk).first()
        except Exception:
            print("item not found")
            return Response({})
        return Response({"item_name" : item.item_name})


class InventoryManagementListView(APIView):
    def get(self, request):
        all_item = InventoryItem.objects.all()
        all_item_info = [
            {"pk": item.pk, "item_name": item.item_name, "count": item.stock_count, "description": item.description, "price": item.sell_price}
            for item in all_item
        ]
        return Response(all_item_info)
    

class TestView(APIView):
    items = InventoryItem.objects.all()

    def get(self, request):
        return Response({"hello" : "hello"})

from django.http import HttpResponse

def management(request):
    return HttpResponse("Hello World!")
