from rest_framework import serializers
from .models import Task
from .services import calculate_priority_score

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority',
            'status', 'deadline', 'urgency_score',
            'importance_score', 'final_score',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'urgency_score', 'importance_score', 'final_score', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        task = Task.objects.create(user=user, **validated_data)
        calculate_priority_score(task)
        return task

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        calculate_priority_score(instance)
        return instance