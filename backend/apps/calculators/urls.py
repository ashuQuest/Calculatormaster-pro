from django.urls import path
from .views import (
    CalculationHistoryListCreateView, ClearCalculationHistoryView,
    SavedCalculationListCreateView, SavedCalculationDetailView,
    FavoriteCalculatorToggleView, CustomFormulaListCreateView,
    ExportCalculationHistoryCSVView, ExportCalculationHistoryPDFView,
    FormulaCategoryListView, FormulaItemListView, FormulaItemDetailView, FormulaFavoriteToggleView
)

urlpatterns = [
    # Calculation History
    path('history/', CalculationHistoryListCreateView.as_view(), name='calculation_history'),
    path('history/clear/', ClearCalculationHistoryView.as_view(), name='clear_calculation_history'),
    path('history/export-csv/', ExportCalculationHistoryCSVView.as_view(), name='export_history_csv'),
    path('history/export-pdf/', ExportCalculationHistoryPDFView.as_view(), name='export_history_pdf'),

    # Saved & Favorites
    path('saved/', SavedCalculationListCreateView.as_view(), name='saved_calculations'),
    path('saved/<int:pk>/', SavedCalculationDetailView.as_view(), name='saved_calculation_detail'),
    path('favorites/', FavoriteCalculatorToggleView.as_view(), name='favorite_calculators'),
    path('custom-formulas/', CustomFormulaListCreateView.as_view(), name='custom_formulas'),

    # Formula Library
    path('formulas/categories/', FormulaCategoryListView.as_view(), name='formula_categories'),
    path('formulas/', FormulaItemListView.as_view(), name='formula_list'),
    path('formulas/<slug:slug>/', FormulaItemDetailView.as_view(), name='formula_detail'),
    path('formulas/<slug:slug>/favorite/', FormulaFavoriteToggleView.as_view(), name='formula_favorite'),
]
