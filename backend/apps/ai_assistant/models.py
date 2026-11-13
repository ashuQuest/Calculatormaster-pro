from django.db import models
from django.conf import settings

class AIUsageLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_usage_logs')
    calculator_name = models.CharField(max_length=150)
    query_type = models.CharField(max_length=50, default='EXPLAIN_RESULT')
    prompt = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.calculator_name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
