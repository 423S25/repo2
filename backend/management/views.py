from django.shortcuts import render
# from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from management.models import InventoryItem
from management.serializer import HistorySerializer, ItemSerializer, HistoricalInventoryItemSerializer
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json

# Create your views here.

@api_view(['GET'])
def get_items(request):
    items = InventoryItem.objects.all()
    # for item in items:
        # update_status(item.pk)
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
            # update_status(pk)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_item_quantity_changes(request, pk):
    try:
        item = InventoryItem.objects.get(pk=pk)  
    except ObjectDoesNotExist:
        return Response({"error" : "Object Does not Exist!"}, status= status.HTTP_400_BAD_REQUEST)
    
    # for i in item:
        # update_status(i.pk)  
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if  start_date and end_date:
        item_history = item.history.filter(history_date__date__range=(start_date, end_date))
    else: 
        item_history = item.history.all()
        
    history_data = {record.history_date.date().isoformat(): record.stock_count for record in item_history}    
    return Response(history_data)

@api_view(['GET'])
def get_item_history(request, pk):
    try:
        item = InventoryItem.objects.get(pk=pk)  
    except ObjectDoesNotExist:
        return Response({"error" : "Object Does not Exist!"}, status= status.HTTP_400_BAD_REQUEST)
    # page indicates at which interval to get values
    page = request.GET.get("page")
    history = item.history.all()
    # if page is not None:
    #     history = history[(page-1):10*page]
    history = [HistoricalInventoryItemSerializer(h).data for h in history][:6]

    return Response(history)

def get_item_cost_month(item_history):
    total_cost = 0
    for i in range(len(item_history)-1):
        if item_history[i].stock_count < item_history[i+1].stock_count:

            total_cost += (item_history[i+1].stock_count - item_history[i].stock_count) * item_history[i+1].individual_cost
    return total_cost

def get_item_cost_total(start, today):
    items = InventoryItem.objects.all()  
    total_cost = 0
    for item in items:
        item_history = item.history.filter(history_date__date__range=(start, today))
        item_cost = get_item_cost_month(item_history)
        total_cost += item_cost
    return total_cost
        

@api_view(["GET"])
def get_dashboard_summary(request):
    today = datetime.now()
    start = today - relativedelta(months=1)
    two_months= today - relativedelta(months=1)
    month_cost = get_item_cost_total(start, today)
    previous = get_item_cost_total(two_months, start)
    cost_diff = 0
    if month_cost != 0:
        cost_diff = (month_cost - previous)/month_cost

    response_value = [
        {
            "title" : "Total Cost",
            "value" : month_cost,
            "diff" : cost_diff * 100
        }
    ]
    return Response(response_value)
        

    
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
    
    def update_status(pk):
        item = InventoryItem.objects.get(pk=pk)
        if item.base_count == 0:
            status_value = "No Stock"
        else:
            ratio = item.stock_count / item.base_count
            if ratio < 0.25:
                status_value = "Very Low Stock"
            elif ratio < 0.5:
                status_value = "Low Stock"
            else:
                status_value = "Good"
        item.status = status_value
        item.save()  
        return item.status

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

class UserDetailsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            "staff" : user.is_staff,
            "superuser" : user.is_superuser
            # Add other user details as needed
        }
        return Response(user_data)



class AnalyticsStatistics(APIView):
    def bulk_vs_individual(self, items):
        # Filter our items by if they are bulk or not
        bulk_items = items.objects.filter(is_bulk=True)
        return {
            "bulk_items" : len(bulk_items),
            "individual_items" : len(items) - len(bulk_items)
        }

        



    def get(self, request):
        time_period = request.get("days")
        today = datetime.now()
        start = today - relativedelta(days=time_period)
        # Only query history once and pass all objects to the other methods
        items_history = InventoryItem.objects.filter(start)

        pass
