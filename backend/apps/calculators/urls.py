from django.urls import path
from .views import (
    CalculationHistoryListCreateView, ClearCalculationHistoryView,
    SavedCalculationListCreateView, SavedCalculationDetailView,
    FavoriteCalculatorToggleView, CustomFormulaListCreateView,
    ExportCalculationHistoryCSVView, ExportCalculationHistoryPDFView
)

urlpatterns = [
    path('history/', CalculationHistoryListCreateView.as_view(), name='calculation_history'),
    path('history/clear/', ClearCalculationHistoryView.as_view(), name='clear_calculation_history'),
    path('history/export-csv/', ExportCalculationHistoryCSVView.as_view(), name='export_history_csv'),
    path('history/export-pdf/', ExportCalculationHistoryPDFView.as_view(), name='export_history_pdf'),

    path('saved/', SavedCalculationListCreateView.as_view(), name='saved_calculations'),
    path('saved/<int:pk>/', SavedCalculationDetailView.as_view(), name='saved_calculation_detail'),

    path('favorites/', FavoriteCalculatorToggleView.as_view(), name='favorite_calculators'),
    path('custom-formulas/', CustomFormulaListCreateView.as_view(), name='custom_formulas'),
]
