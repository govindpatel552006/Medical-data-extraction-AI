from django.urls import path
from .views import GenerateDietPlanView, DietPlanDetailView

urlpatterns = [
    path('generate/<uuid:prescription_id>/', GenerateDietPlanView.as_view(), name='generate-diet-plan'),
    path('<uuid:prescription_id>/', DietPlanDetailView.as_view(), name='diet-plan-detail'),
]