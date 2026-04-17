from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Decision
from .serializers import DecisionSerializer

class DecisionViewSet(viewsets.ModelViewSet):
    serializer_class = DecisionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Decision.objects.filter(user=self.request.user)