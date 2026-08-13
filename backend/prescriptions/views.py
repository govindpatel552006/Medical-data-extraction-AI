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
from .ocr_utils import extract_text_from_image
from .qr_utils import generate_qr_code

FRONTEND_BASE_URL = "medical-data-extraction-ai-17s3-7awic5l7z.vercel.app"  # change this when you deploy


class PrescriptionUploadView(generics.CreateAPIView):
    """
    POST /api/prescriptions/upload/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PrescriptionUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prescription = serializer.save(patient=request.user)

        # Run OCR on the uploaded file
        extracted_text = extract_text_from_image(prescription.file.path)
        prescription.extracted_text = extracted_text

        # Generate QR code pointing to the public record page
        public_url = f"{FRONTEND_BASE_URL}/record/{prescription.public_token}"
        qr_file = generate_qr_code(public_url)
        prescription.qr_code.save(f"{prescription.id}_qr.png", qr_file, save=False)

        prescription.save()

        return Response(
            PrescriptionUploadSerializer(prescription, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class PrescriptionListView(generics.ListAPIView):
    """
    GET /api/prescriptions/my-records/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PrescriptionListSerializer

    def get_queryset(self):
        return Prescription.objects.filter(patient=self.request.user).order_by('-uploaded_at')


class PublicPrescriptionView(APIView):
    """
    GET /api/prescriptions/public/<uuid:token>/
    No auth needed — this is what the QR code links to.
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            prescription = Prescription.objects.get(public_token=token)
        except Prescription.DoesNotExist:
            return Response({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PublicPrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_200_OK)
class PrescriptionDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/prescriptions/<uuid:pk>/delete/
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prescription.objects.filter(patient=self.request.user)