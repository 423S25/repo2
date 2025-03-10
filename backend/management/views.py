from django.shortcuts import render, redirect
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
# Create your views here.

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            # user = authenticate(username=username, password=password)
            #TODO: Add Jackson's login code
            messages.success(request, ("Registration Success!"))
    else:
        form = UserCreationForm()
    return render(request, 'authenticate/register.html', {'form':form})