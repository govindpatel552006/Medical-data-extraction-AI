from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Prescription
from .serializers import (
    PrescriptionUploadSerializer,
    PrescriptionListSerializer,
    PublicPrescriptionSerializer,
)
from .ocr_utils import extract_text_from_image_file
from .qr_utils import generate_qr_code

FRONTEND_BASE_URL = "https://medical-data-extraction-ai-17s3.vercel.app"


class PrescriptionUploadView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PrescriptionUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = request.FILES['file']
        extracted_text = extract_text_from_image_file(uploaded_file)

        prescription = serializer.save(patient=request.user, extracted_text=extracted_text)

        public_url = f"{FRONTEND_BASE_URL}/record/{prescription.public_token}"
        qr_file = generate_qr_code(public_url)
        prescription.qr_code.save(f"{prescription.id}_qr.png", qr_file, save=False)
        prescription.save()

        return Response(
            PrescriptionUploadSerializer(prescription, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class PrescriptionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PrescriptionListSerializer

    def get_queryset(self):
        return Prescription.objects.filter(patient=self.request.user).order_by('-uploaded_at')

    def get_serializer_context(self):
        return {'request': self.request}


class PublicPrescriptionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            prescription = Prescription.objects.get(public_token=token)
        except Prescription.DoesNotExist:
            return Response({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PublicPrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PrescriptionDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prescription.objects.filter(patient=self.request.user)