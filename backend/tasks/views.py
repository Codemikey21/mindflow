from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def prioritized(self, request):
        tasks = self.get_queryset().filter(
            status__in=['pending', 'in_progress']
        ).order_by('-final_score')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        today = timezone.now().date()
        tasks = self.get_queryset()
        active = tasks.filter(status__in=['pending', 'in_progress'])
        completed_today = tasks.filter(
            status='completed',
            updated_at__date=today
        )
        overloaded = active.count() > 10

        top_tasks = active.order_by('-final_score')[:5]
        serializer = self.get_serializer(top_tasks, many=True)

        return Response({
            'date': today,
            'active_tasks': active.count(),
            'completed_today': completed_today.count(),
            'overloaded': overloaded,
            'top_priority_tasks': serializer.data,
        })