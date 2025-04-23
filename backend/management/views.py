from django.shortcuts import render
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
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json
import csv

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

# Filters data by a specified date range and returns a response with all item quantity changes within that period
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

# Takes a request with a start date and end date and generates a csv report 
@api_view(['GET'])
def generate_csv_report(request):
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    items = InventoryItem.objects.all().order_by('item_category')
    report_data = []

    for item in items:  
        item_history = list(item.history.filter(
            history_date__date__range=(start_date, end_date)
            ).order_by('history_date'))

        used_stock = 0
        purchased_stock = 0
        donated_stock = 0
        total_cost = 0 
        
        for i in range(len(item_history) - 1):
            current = item_history[i]
            next = item_history[i + 1]
            delta = abs(current.stock_count - next.stock_count)

            if next.stock_count <= current.stock_count:
                used_stock += (delta)
            else:
                if next.is_bulk == True:
                    if next.donated == True:
                        donated_stock += (next.amount_in_bulk * next.bulk_count)
                    else:
                        purchased_stock += (next.amount_in_bulk * next.bulk_count)
                        total_cost += (next.bulk_cost * next.bulk_count)
                else: 
                    if next.donated == True:
                        donated_stock += (delta)
                    else:
                        purchased_stock += (delta)
                        total_cost += ((delta) * next.individual_cost)
        
        report_data.append({
            "Item Name": item.item_name,
            "Category": item.item_category,
            "Used Stock": used_stock,
            "Purchased Stock": purchased_stock,
            "Donated Stock": donated_stock,
            "Total Cost": total_cost,
        })

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = "attachment; filename=inventory_report.csv"

    writer = csv.DictWriter(response, fieldnames=report_data[0].keys())
    writer.writeheader()
    writer.writerows(report_data)

    return response

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
@method_decorator(csrf_exempt, name='dispatch')  # Disables CSRF for this view
class RegisterUserView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

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
