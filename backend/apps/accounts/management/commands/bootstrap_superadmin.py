import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.accounts.models import User
from apps.audit_logs.models import AdminAuditLog

class Command(BaseCommand):
    help = 'Bootstrap the Owner Superadmin account with lifetime free privileges'

    def handle(self, *args, **options):
        username = os.getenv('SUPERADMIN_USERNAME', 'admin')
        email = os.getenv('SUPERADMIN_EMAIL', 'ashutosh@calcmasterpro.com')
        password = os.getenv('SUPERADMIN_PASSWORD', 'Admin@CalcMaster2026')

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.role = 'SUPERADMIN'
        user.set_password(password)
        user.save()

        action_msg = 'Created new' if created else 'Updated existing'
        self.stdout.write(self.style.SUCCESS(f"{action_msg} Owner Superadmin account: '{username}' (Lifetime Free Access)."))

        AdminAuditLog.objects.create(
            admin=user,
            action='SYSTEM_BOOTSTRAP',
            description=f"Owner Superadmin account '{username}' bootstrapped successfully."
        )
