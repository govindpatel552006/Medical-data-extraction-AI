import uuid
from django.db import models
from django.conf import settings


class Prescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )

    file = models.FileField(upload_to='prescriptions/')
    extracted_text = models.TextField(blank=True, null=True)

    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True)

    # Public token used in the QR code URL — separate from `id` for extra safety
    public_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription {self.id} - {self.patient.full_name}"