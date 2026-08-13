import uuid
from django.db import models
from prescriptions.models import Prescription


class DietPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    prescription = models.OneToOneField(
        Prescription,
        on_delete=models.CASCADE,
        related_name='diet_plan'
    )

    plan_data = models.JSONField()  # stores the 7-day plan as structured JSON
    detected_conditions = models.JSONField(default=list)  # e.g. ["high_sugar", "low_hemoglobin"]

    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diet Plan for {self.prescription.patient.full_name}"