from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from prescriptions.models import Prescription
from .models import DietPlan
from .serializers import DietPlanSerializer
from .diet_logic import generate_7_day_plan


class GenerateDietPlanView(APIView):
    """
    POST /api/dietplan/generate/<uuid:prescription_id>/
    Add ?force=true to regenerate even if a plan already exists.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, prescription_id):
        try:
            prescription = Prescription.objects.get(id=prescription_id, patient=request.user)
        except Prescription.DoesNotExist:
            return Response({'error': 'Prescription not found'}, status=status.HTTP_404_NOT_FOUND)

        force = request.query_params.get('force', 'false').lower() == 'true'

        if hasattr(prescription, 'diet_plan') and not force:
            return Response(
                DietPlanSerializer(prescription.diet_plan).data,
                status=status.HTTP_200_OK
            )

        conditions, plan_data = generate_7_day_plan(prescription.extracted_text or "")

        if hasattr(prescription, 'diet_plan'):
            diet_plan = prescription.diet_plan
            diet_plan.plan_data = plan_data
            diet_plan.detected_conditions = conditions
            diet_plan.save()
        else:
            diet_plan = DietPlan.objects.create(
                prescription=prescription,
                plan_data=plan_data,
                detected_conditions=conditions
            )

        return Response(DietPlanSerializer(diet_plan).data, status=status.HTTP_201_CREATED)


class DietPlanDetailView(APIView):
    """
    GET /api/dietplan/<uuid:prescription_id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, prescription_id):
        try:
            prescription = Prescription.objects.get(id=prescription_id, patient=request.user)
            diet_plan = prescription.diet_plan
        except (Prescription.DoesNotExist, DietPlan.DoesNotExist):
            return Response({'error': 'Diet plan not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(DietPlanSerializer(diet_plan).data, status=status.HTTP_200_OK)