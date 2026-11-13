from rest_framework import serializers
from .models import CalculationHistory, SavedCalculation, FavoriteCalculator, CustomFormula

class CalculationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationHistory
        fields = [
            'id', 'calculator_id', 'calculator_name',
            'category', 'inputs', 'results', 'formula_used', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SavedCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedCalculation
        fields = [
            'id', 'title', 'calculator_id', 'calculator_name',
            'category', 'inputs', 'results', 'folder_name',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FavoriteCalculatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteCalculator
        fields = ['id', 'calculator_id', 'calculator_name', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']


class CustomFormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomFormula
        fields = ['id', 'name', 'expression', 'variables', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
