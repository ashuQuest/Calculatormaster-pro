from django.db import models
from django.conf import settings

class CalculationHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calculation_histories')
    calculator_id = models.CharField(max_length=100, db_index=True)
    calculator_name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, db_index=True)
    inputs = models.JSONField(default=dict)
    results = models.JSONField(default=dict)
    formula_used = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.calculator_name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class SavedCalculation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_calculations')
    title = models.CharField(max_length=200)
    calculator_id = models.CharField(max_length=100)
    calculator_name = models.CharField(max_length=150)
    category = models.CharField(max_length=50)
    inputs = models.JSONField(default=dict)
    results = models.JSONField(default=dict)
    folder_name = models.CharField(max_length=100, default='Default')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.calculator_name}) by {self.user.username}"


class FavoriteCalculator(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_calculators')
    calculator_id = models.CharField(max_length=100)
    calculator_name = models.CharField(max_length=150)
    category = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'calculator_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.calculator_id}"


class CustomFormula(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='custom_formulas')
    name = models.CharField(max_length=150)
    expression = models.CharField(max_length=500)
    variables = models.JSONField(default=list)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name}: {self.expression}"
