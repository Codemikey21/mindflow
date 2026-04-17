from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'

    def test_register_user(self):
        data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'Test1234!'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

    def test_login_user(self):
        User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='Test1234!'
        )
        data = {
            'email': 'test@test.com',
            'password': 'Test1234!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)