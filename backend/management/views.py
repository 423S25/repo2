from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import InventoryItem
from .serializer import ItemSerializer, ItemHistorySerializer
from django.http import HttpResponse
import csv

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

# Filters data by a specified date range and returns a response with all item quantity changes within that period
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
    # return Response(report_data)

# def generate_csv():
