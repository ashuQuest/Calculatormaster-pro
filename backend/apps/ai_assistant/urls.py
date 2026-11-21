from django.urls import path
from .views import ExplainCalculationView

urlpatterns = [
    path('explain/', ExplainCalculationView.as_view(), name='ai_explain_calculation'),
]

