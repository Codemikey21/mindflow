from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Decision(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='decisions')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    recommendation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Option(models.Model):
    decision = models.ForeignKey(Decision, on_delete=models.CASCADE, related_name='options')
    name = models.CharField(max_length=255)
    weight = models.FloatField(default=1.0)
    impact = models.FloatField(default=1.0)
    risk = models.FloatField(default=1.0)
    final_score = models.FloatField(default=0.0)

    def __str__(self):
        return self.name