from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task

User = get_user_model()

class TaskTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='Test1234!'
        )
        self.client.force_authenticate(user=self.user)
        self.tasks_url = '/api/tasks/'

    def test_create_task(self):
        data = {
            'title': 'Tarea de prueba',
            'description': 'Descripcion de prueba',
            'priority': 'high',
            'status': 'pending'
        }
        response = self.client.post(self.tasks_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Tarea de prueba')

    def test_list_tasks(self):
        Task.objects.create(
            user=self.user,
            title='Tarea 1',
            priority='high',
            status='pending'
        )
        response = self.client.get(self.tasks_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_prioritization_score(self):
        data = {
            'title': 'Tarea urgente',
            'priority': 'critical',
            'status': 'pending'
        }
        response = self.client.post(self.tasks_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertGreater(response.data['final_score'], 0)