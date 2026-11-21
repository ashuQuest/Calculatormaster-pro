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


# ---------------------------------------------------------------------------
# ADVANCED FORMULA LIBRARY MODELS
# ---------------------------------------------------------------------------

class FormulaCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='BookOpen')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Formula Categories'

    def __str__(self):
        return self.name


class FormulaItem(models.Model):
    DIFFICULTY_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Engineering', 'Engineering'),
    )

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(FormulaCategory, on_delete=models.CASCADE, related_name='formulas')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Intermediate')
    latex_expression = models.TextField()
    plain_formula = models.CharField(max_length=300, blank=True, default='')
    description = models.TextField()
    theory = models.TextField(blank=True, default='')
    derivation = models.TextField(blank=True, default='')
    boundary_conditions = models.JSONField(default=list, blank=True)
    common_mistakes = models.JSONField(default=list, blank=True)
    related_calculator_slug = models.CharField(max_length=100, blank=True, default='')
    default_inputs = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title} ({self.category.name})"


class FormulaVariable(models.Model):
    formula = models.ForeignKey(FormulaItem, on_delete=models.CASCADE, related_name='variables')
    name = models.CharField(max_length=100)
    symbol_latex = models.CharField(max_length=100)
    unit = models.CharField(max_length=50, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name} ({self.symbol_latex}) for {self.formula.title}"


class FormulaExample(models.Model):
    formula = models.ForeignKey(FormulaItem, on_delete=models.CASCADE, related_name='examples')
    problem_statement = models.TextField()
    solution_steps = models.JSONField(default=list)
    final_result = models.CharField(max_length=150)

    def __str__(self):
        return f"Example for {self.formula.title}"


class FormulaFavorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='formula_favorites')
    formula = models.ForeignKey(FormulaItem, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'formula')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} favorited {self.formula.title}"
