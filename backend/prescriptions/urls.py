from django.urls import path
from .views import PrescriptionUploadView, PrescriptionListView, PublicPrescriptionView, PrescriptionDeleteView

urlpatterns = [
    path('upload/', PrescriptionUploadView.as_view(), name='prescription-upload'),
    path('my-records/', PrescriptionListView.as_view(), name='prescription-list'),
    path('public/<uuid:token>/', PublicPrescriptionView.as_view(), name='prescription-public'),
    path('<uuid:pk>/delete/', PrescriptionDeleteView.as_view(), name='prescription-delete'),
]