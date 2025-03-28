from django.shortcuts import render
# from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from management.models import InventoryItem
from management.serializer import ItemSerializer
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import json

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

@api_view(['GET'])
def get_item_quantity_changes(request, pk):
    item = InventoryItem.objects.get(pk=pk)    
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if  start_date and end_date:
        item_history = item.history.filter(history_date__date__range=(start_date, end_date))
    else: 
        item_history = item.history.all()
        
    history_data = {record.history_date.date().isoformat(): record.stock_count for record in item_history}    
    return Response(history_data)
    
class DownloadCSV(APIView):
    def get(self, request):
        items = InventoryItem.objects.all()
        items = map(lambda e : ItemSerializer(e).data, items)
        df = pd.DataFrame(items)
        csv_string = df.to_csv()
        return Response({"csv" : csv_string})

    

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
'''
@csrf_exempt  # Disable CSRF for testing; handle it better in production
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)

