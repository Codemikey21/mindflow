from rest_framework import serializers
from .models import Decision, Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name', 'weight', 'impact', 'risk', 'final_score']
        read_only_fields = ['id', 'final_score']

class DecisionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Decision
        fields = ['id', 'title', 'description', 'options', 'recommendation', 'created_at']
        read_only_fields = ['id', 'recommendation', 'created_at']

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        user = self.context['request'].user
        decision = Decision.objects.create(user=user, **validated_data)

        options = []
        for option_data in options_data:
            option = Option.objects.create(decision=decision, **option_data)
            options.append(option)

        from .services import evaluate_options
        recommendation = evaluate_options(options)
        decision.recommendation = recommendation
        decision.save()

        return decision