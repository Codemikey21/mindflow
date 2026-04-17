from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class DecisionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='Test1234!'
        )
        self.client.force_authenticate(user=self.user)
        self.decisions_url = '/api/decisions/'

    def test_create_decision(self):
        data = {
            'title': 'Decision de prueba',
            'description': 'Cual opcion elegir',
            'options': [
                {'name': 'Opcion A', 'weight': 1.0, 'impact': 8.0, 'risk': 3.0},
                {'name': 'Opcion B', 'weight': 1.0, 'impact': 6.0, 'risk': 2.0},
            ]
        }
        response = self.client.post(self.decisions_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['recommendation'])

    def test_list_decisions(self):
        response = self.client.get(self.decisions_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)