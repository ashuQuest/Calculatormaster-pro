import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_health_check(request):
    db_engine = settings.DATABASES['default']['ENGINE']
    is_postgres = 'postgresql' in db_engine
    return JsonResponse({
        'status': 'online',
        'platform': 'CalcMaster Pro',
        'version': '1.0.0',
        'database': 'Neon PostgreSQL' if is_postgres else 'Local Development DB',
        'database_engine': db_engine,
        'upi_payment_enabled': settings.UPI_PAYMENT_ENABLED,
        'message': 'CalcMaster Pro SaaS API is running smoothly.'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health_check, name='api_health_check'),

    # API Modular Endpoints
    path('api/auth/', include('apps.accounts.urls')),
    path('api/subscriptions/', include('apps.subscriptions.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/calculators/', include('apps.calculators.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/audit/', include('apps.audit_logs.urls')),
    path('api/ai/', include('apps.ai_assistant.urls')),
]

# Serve media and static files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
