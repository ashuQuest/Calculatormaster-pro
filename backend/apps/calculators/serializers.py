from rest_framework import serializers
from .models import (
    CalculationHistory, SavedCalculation, FavoriteCalculator, CustomFormula,
    FormulaCategory, FormulaItem, FormulaVariable, FormulaExample, FormulaFavorite
)

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


# ---------------------------------------------------------------------------
# FORMULA LIBRARY SERIALIZERS
# ---------------------------------------------------------------------------

class FormulaCategorySerializer(serializers.ModelSerializer):
    formula_count = serializers.IntegerField(source='formulas.count', read_only=True)

    class Meta:
        model = FormulaCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'display_order', 'formula_count']


class FormulaVariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormulaVariable
        fields = ['id', 'name', 'symbol_latex', 'unit', 'description', 'order']


class FormulaExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormulaExample
        fields = ['id', 'problem_statement', 'solution_steps', 'final_result']


class FormulaItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = FormulaItem
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'difficulty', 'latex_expression', 'plain_formula', 'description',
            'related_calculator_slug', 'created_at'
        ]


class FormulaItemDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    variables = FormulaVariableSerializer(many=True, read_only=True)
    examples = FormulaExampleSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = FormulaItem
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'difficulty', 'latex_expression', 'plain_formula', 'description',
            'theory', 'derivation', 'boundary_conditions', 'common_mistakes',
            'related_calculator_slug', 'default_inputs', 'variables', 'examples',
            'is_favorite', 'created_at'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FormulaFavorite.objects.filter(user=request.user, formula=obj).exists()
        return False
