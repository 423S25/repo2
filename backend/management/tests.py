from django.test import TestCase
from rest_framework.test import APIClient
# Create your tests here.

class TestInventoryViewAPI(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
