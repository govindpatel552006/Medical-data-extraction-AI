from rest_framework import serializers
from .models import DietPlan


class DietPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlan
        fields = ['id', 'prescription', 'plan_data', 'detected_conditions', 'generated_at']