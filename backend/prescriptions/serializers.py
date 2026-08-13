from rest_framework import serializers
from .models import Prescription


class PrescriptionUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'file', 'extracted_text', 'qr_code', 'uploaded_at']
        read_only_fields = ['id', 'extracted_text', 'qr_code', 'uploaded_at']


class PrescriptionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'file', 'extracted_text', 'qr_code', 'uploaded_at']


class PublicPrescriptionSerializer(serializers.ModelSerializer):
    """
    Shown when someone scans the QR — includes patient info too.
    """
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    patient_age = serializers.IntegerField(source='patient.age', read_only=True)
    patient_gender = serializers.CharField(source='patient.gender', read_only=True)
    patient_blood_group = serializers.CharField(source='patient.blood_group', read_only=True)

    class Meta:
        model = Prescription
        fields = [
            'id', 'patient_name', 'patient_age', 'patient_gender',
            'patient_blood_group', 'extracted_text', 'uploaded_at'
        ]