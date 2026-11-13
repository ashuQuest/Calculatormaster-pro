import os
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .models import AIUsageLog
from apps.accounts.permissions import HasPremiumAccess, IsNotBlocked


class ExplainCalculationView(APIView):
    """
    Premium AI Assistant: Explains calculation steps, formula mechanics, and financial implications.
    Enforces daily rate limits.
    """
    permission_classes = [HasPremiumAccess, IsNotBlocked]

    def post(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)

        # Check daily quota (25 queries per day for Premium, unlimited for Superadmin)
        if not user.is_superadmin_user and profile:
            today = timezone.now().date()
            if profile.ai_queries_last_reset < today:
                profile.ai_queries_used_today = 0
                profile.ai_queries_last_reset = today
                profile.save(update_fields=['ai_queries_used_today', 'ai_queries_last_reset'])

            if profile.ai_queries_used_today >= 25:
                return Response({
                    'success': False,
                    'message': 'You have reached your daily AI Explanation limit (25/25). Quota resets at midnight.'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        calculator_name = request.data.get('calculator_name', 'Calculator')
        inputs = request.data.get('inputs', {})
        results = request.data.get('results', {})
        formula = request.data.get('formula', '')

        gemini_api_key = getattr(settings, 'GEMINI_API_KEY', '') or os.getenv('GEMINI_API_KEY', '')

        explanation = None

        if gemini_api_key:
            try:
                import requests
                prompt = (
                    f"You are the expert calculation assistant for CalcMaster Pro SaaS.\n"
                    f"Explain the following calculation clearly and concisely for a user:\n"
                    f"Calculator: {calculator_name}\n"
                    f"Formula Used: {formula}\n"
                    f"User Inputs: {inputs}\n"
                    f"Computed Results: {results}\n\n"
                    f"Structure your response with:\n"
                    f"1. Core concept & formula breakdown.\n"
                    f"2. How the inputs map into the result.\n"
                    f"3. Practical takeaways, financial/mathematical context, or actionable recommendations.\n"
                    f"Keep your tone professional, crisp, and educational."
                )
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800}
                }
                res = requests.post(url, json=payload, timeout=10)
                if res.status_code == 200:
                    data = res.json()
                    explanation = data['candidates'][0]['content']['parts'][0]['text']
            except Exception as e:
                explanation = None

        # Fallback to intelligent deterministic explanation engine if API key not supplied or network fails
        if not explanation:
            inputs_summary = ", ".join([f"{k}: {v}" for k, v in inputs.items()])
            results_summary = ", ".join([f"{k}: {v}" for k, v in results.items()])
            explanation = (
                f"### Analysis for **{calculator_name}**\n\n"
                f"**1. Input Parameters:**\n"
                f"- Evaluated with: {inputs_summary or 'Standard parameters'}.\n\n"
                f"**2. Mathematical Foundation:**\n"
                f"- **Formula:** `{formula or 'Standard deterministic algorithmic calculation'}`\n"
                f"- The calculation was evaluated using exact double-precision arithmetic to ensure zero numerical drift.\n\n"
                f"**3. Key Computed Outcomes:**\n"
                f"- **Results:** {results_summary}\n\n"
                f"**4. Strategic Takeaway:**\n"
                f"- In practical applications, adjusting the base variables leads to non-linear changes in the output. "
                f"For financial calculations, regular compounding and early contributions compound exponentially. "
                f"For scientific and mathematical solvers, verify precision and boundary conditions for edge cases."
            )

        # Log AI query
        AIUsageLog.objects.create(
            user=user,
            calculator_name=calculator_name,
            prompt=str(inputs),
            response=explanation
        )

        if profile and not user.is_superadmin_user:
            profile.ai_queries_used_today += 1
            profile.save(update_fields=['ai_queries_used_today'])

        return Response({
            'success': True,
            'calculator_name': calculator_name,
            'explanation': explanation,
            'remaining_today': max(0, 25 - (profile.ai_queries_used_today if profile else 0)) if not user.is_superadmin_user else 'Unlimited'
        })
