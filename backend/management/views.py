from django.shortcuts import render
# from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import InventoryItem
from .serializer import ItemSerializer

# Create your views here.

@api_view(['GET'])
def get_items(request):
    items = InventoryItem.objects.all()
    serialized_data = ItemSerializer(items, many=True).data
    return Response(serialized_data)

@api_view(['POST'])
def create_item(request):
    data = request.data
    serializer = ItemSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def modify_item(request, pk):
    try:
        item = InventoryItem.objects.get(pk=pk)
    except InventoryItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = ItemSerializer(item, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
def update_status(pk):
    item = InventoryItem.objects.get(pk=pk)
    if  item.stock_count / item.base_count >= 0.5:
        return "good"
    elif item.stock_count / item.base_count < 0.5:
        return "low"
    elif item.stock_count / item.base_count < 0.25:
        return "very low"
'''

'''
class InventoryManagementView(APIView): 
    def post(self, request):
        count = request.get("count")
        pk = request.get("pk")
        item = InventoryItem.object.filter(pk=pk)
        item.count = count 
        item.update()
    
    def delete(self, request):
        # Getting pk from the JSON request body
        pk = request.data.get("pk")
        item = InventoryItem.objects.filter(pk=pk).first()
        if item:
            item.delete()
            return Response({"message": f"Item with pk {pk} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "Item not found"}, status=status.HTTP_404_NOT_FOUND)


    def create(self, request):
        item_name = request.POST.get("item_name")
        count = request.POST.get("count")
        item = InventoryItem.objects.create(item_name=item_name, count=count)

    def search(self, request):
        pk = request.get("pk")
        search_item = InventoryItem.object.filter(pk=pk)
        item_info = [
            {"pk": item.pk, "item_name": item.item_name, "count": item.stock_count, "description": item.description, "price": item.cost}
            for item in search_item
        ]
        return Response(item_info)
    

    #def item_status(self.request):
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
    

class InventoryManagementListView(APIView):
    def get(self, request):
        items = InventoryItem.objects.all()
        serialized_data = ItemSerializer(items, many=True).data
        return Response(serialized_data)
       
'''
class TestView(APIView):
    items = InventoryItem.objects.all()

    def get(self, request):
        return Response({"hello" : "hello"})
