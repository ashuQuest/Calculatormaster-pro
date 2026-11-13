import csv
import io
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from .models import CalculationHistory, SavedCalculation, FavoriteCalculator, CustomFormula
from .serializers import (
    CalculationHistorySerializer, SavedCalculationSerializer,
    FavoriteCalculatorSerializer, CustomFormulaSerializer
)
from apps.accounts.permissions import HasPremiumAccess, IsNotBlocked


class CalculationHistoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]
    serializer_class = CalculationHistorySerializer

    def get_queryset(self):
        user = self.request.user
        queryset = CalculationHistory.objects.filter(user=user)

        # Free users limited to last 10 calculations
        if not user.has_active_premium:
            # Get IDs of last 10
            last_10_ids = list(queryset.values_list('id', flat=True)[:10])
            queryset = queryset.filter(id__in=last_10_ids)

        calculator_id = self.request.query_params.get('calculator_id')
        category = self.request.query_params.get('category')
        if calculator_id:
            queryset = queryset.filter(calculator_id=calculator_id)
        if category:
            queryset = queryset.filter(category=category)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)
        # Increment total calculations in user profile
        if hasattr(user, 'profile'):
            user.profile.total_calculations += 1
            user.profile.save(update_fields=['total_calculations'])


class ClearCalculationHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]

    def delete(self, request):
        CalculationHistory.objects.filter(user=request.user).delete()
        return Response({'success': True, 'message': 'Calculation history cleared successfully.'})


class SavedCalculationListCreateView(generics.ListCreateAPIView):
    permission_classes = [HasPremiumAccess]
    serializer_class = SavedCalculationSerializer

    def get_queryset(self):
        return SavedCalculation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedCalculationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [HasPremiumAccess]
    serializer_class = SavedCalculationSerializer

    def get_queryset(self):
        return SavedCalculation.objects.filter(user=self.request.user)


class FavoriteCalculatorToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNotBlocked]

    def get(self, request):
        favorites = FavoriteCalculator.objects.filter(user=request.user)
        return Response({'success': True, 'favorites': FavoriteCalculatorSerializer(favorites, many=True).data})

    def post(self, request):
        calculator_id = request.data.get('calculator_id')
        calculator_name = request.data.get('calculator_name', '')
        category = request.data.get('category', '')

        if not calculator_id:
            return Response({'success': False, 'message': 'calculator_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        fav = FavoriteCalculator.objects.filter(user=request.user, calculator_id=calculator_id).first()
        if fav:
            fav.delete()
            return Response({'success': True, 'is_favorite': False, 'message': 'Removed from favorites.'})
        else:
            FavoriteCalculator.objects.create(
                user=request.user,
                calculator_id=calculator_id,
                calculator_name=calculator_name,
                category=category
            )
            return Response({'success': True, 'is_favorite': True, 'message': 'Added to favorites.'})


class CustomFormulaListCreateView(generics.ListCreateAPIView):
    permission_classes = [HasPremiumAccess]
    serializer_class = CustomFormulaSerializer

    def get_queryset(self):
        return CustomFormula.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -------------------------------------------------------------------------
# Premium Export Endpoints (CSV & PDF)
# -------------------------------------------------------------------------
class ExportCalculationHistoryCSVView(APIView):
    permission_classes = [HasPremiumAccess]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="calcmaster_history_{timezone.now().strftime("%Y%m%d_%H%M")}.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Date & Time', 'Calculator', 'Category', 'Inputs', 'Results', 'Formula Used'])

        history = CalculationHistory.objects.filter(user=request.user).order_by('-created_at')
        for item in history:
            writer.writerow([
                item.id,
                item.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                item.calculator_name,
                item.category,
                str(item.inputs),
                str(item.results),
                item.formula_used
            ])

        return response


class ExportCalculationHistoryPDFView(APIView):
    permission_classes = [HasPremiumAccess]

    def get(self, request):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            name='TitleStyle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#0284C7'),
            spaceAfter=12
        )
        subtitle_style = ParagraphStyle(
            name='SubTitleStyle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#64748B'),
            spaceAfter=20
        )

        elements.append(Paragraph("CalcMaster Pro - Calculation History Report", title_style))
        elements.append(Paragraph(f"Generated for: {request.user.username} ({request.user.email}) | Date: {timezone.now().strftime('%Y-%m-%d %H:%M')}", subtitle_style))

        history = CalculationHistory.objects.filter(user=request.user).order_by('-created_at')[:50]

        data = [["Timestamp", "Calculator", "Category", "Result Summary"]]
        for item in history:
            res_summary = ", ".join([f"{k}: {v}" for k, v in list(item.results.items())[:3]])
            data.append([
                item.created_at.strftime('%Y-%m-%d %H:%M'),
                item.calculator_name,
                item.category,
                res_summary[:60]
            ])

        table = Table(data, colWidths=[110, 140, 90, 210])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        elements.append(table)
        doc.build(elements)

        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="calcmaster_history_{timezone.now().strftime("%Y%m%d_%H%M")}.pdf"'
        return response
