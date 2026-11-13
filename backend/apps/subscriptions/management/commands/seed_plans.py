from django.core.management.base import BaseCommand
from apps.subscriptions.models import SubscriptionPlan
from apps.payments.models import WebsiteSettings

class Command(BaseCommand):
    help = 'Seed the standard subscription plans and website UPI settings'

    def handle(self, *args, **options):
        plans_data = [
            {
                'code': 'starter',
                'name': 'Starter',
                'price': 9.00,
                'duration_days': 7,
                'badge': 'Quick Trial',
                'sort_order': 1,
                'description': 'Ideal for quick assignments and immediate project calculations.',
                'features': [
                    '7 Days Full Premium Access',
                    'All 40+ Advanced Calculators',
                    'Unlimited Cloud History',
                    'Save Formulas & Favorites',
                    'Export Calculations to PDF & CSV',
                    'AI Step-by-Step Explanations',
                ]
            },
            {
                'code': 'monthly',
                'name': 'Monthly',
                'price': 29.00,
                'duration_days': 30,
                'badge': 'Most Popular',
                'sort_order': 2,
                'description': 'Perfect for active students, professionals, and daily users.',
                'features': [
                    '30 Days Unlimited Premium Access',
                    'All 40+ Advanced Calculators',
                    'Detailed Loan Amortization Schedules',
                    'Unlimited Cloud History & Folders',
                    'Priority AI Assistant Access',
                    'One-click PDF & CSV Data Exports',
                    'Priority Support',
                ]
            },
            {
                'code': 'half_yearly',
                'name': 'Half-Yearly',
                'price': 59.00,
                'duration_days': 180,
                'badge': 'Super Saver',
                'sort_order': 3,
                'description': 'Unmatched value for 6 months of continuous productivity.',
                'features': [
                    '180 Days Full Premium Access',
                    'Save over 65% compared to monthly',
                    'Advanced Financial Modeling & Scenario Comparisons',
                    'Unlimited Formula Storage',
                    'Unlimited PDF/CSV Report Generation',
                    'Full AI Assistant Quota',
                ]
            },
            {
                'code': 'yearly',
                'name': 'Yearly',
                'price': 99.00,
                'duration_days': 365,
                'badge': 'Best Value',
                'sort_order': 4,
                'description': 'Complete annual pass for students, engineers, and financial analysts.',
                'features': [
                    '365 Days Full Premium Access',
                    'Less than ₹0.27 per day',
                    'All current and upcoming calculators included',
                    'Unlimited Calculation Exports',
                    'Dedicated Priority Customer Support',
                    'VIP Early Access to New Features',
                ]
            },
        ]

        for p in plans_data:
            plan, created = SubscriptionPlan.objects.update_or_create(
                code=p['code'],
                defaults=p
            )
            state = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{state} plan: {plan.name} (₹{plan.price}, {plan.duration_days} days)"))

        # Seed Website Settings with user PhonePe details
        settings_obj = WebsiteSettings.get_settings()
        settings_obj.upi_id = '6205433088-2@ybl'
        settings_obj.payee_name = 'ASHUTOSH KUMAR'
        settings_obj.scanner_image_url = '/media/qr/phonepe_scanner.jpg'
        settings_obj.save()
        self.stdout.write(self.style.SUCCESS(f"Initialized Website Settings for UPI ID: {settings_obj.upi_id} ({settings_obj.payee_name})"))
