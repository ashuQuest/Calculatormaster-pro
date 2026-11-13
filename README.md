# CalcMaster Pro — One Platform. Every Calculation.
> **A Complete Premium Production-Ready SaaS Calculator Platform**

[![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-336791?logo=postgresql)](https://neon.tech)
[![Django](https://img.shields.io/badge/Backend-Django%206.0%20%2B%20DRF-092E20?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![UPI](https://img.shields.io/badge/Payment-Manual%20UPI%20QR-purple)](https://phonepe.com)

---

## 🌟 Executive Summary

**CalcMaster Pro** is a modern SaaS calculation platform uniting over 40+ specialized mathematical, financial, scientific, and business tools under an ad-free interface.

- **No payment gateway middlemen**: Uses dynamic fixed-amount UPI QR generation powered by Python's `qrcode` library with manual Superadmin bank verification.
- **Lifetime Owner Privilege**: Superadmin account has non-expiring, unrestricted lifetime access to all current and future calculators.
- **Enterprise Database**: Connected to **Neon Cloud PostgreSQL** with connection pooling and SSL encryption (`sslmode=require`).
- **AI Explanation Assistant**: Deterministic mathematical engine evaluates formulas without hallucination, while an AI assistant provides contextual breakdowns.

---

## 🗂️ Platform Structure

```
Calculator/
├── backend/
│   ├── apps/
│   │   ├── accounts/         # Custom User, Owner permissions, JWT auth, user profiles
│   │   ├── calculators/      # History, Saved folders, Favorites, CSV/PDF export
│   │   ├── subscriptions/    # Starter (₹9), Monthly (₹29), Half-Yearly (₹59), Yearly (₹99)
│   │   ├── payments/         # Dynamic UPI QR generation, UTR normalization, manual verification
│   │   ├── analytics/        # Verified revenue, user metrics, popular calculators
│   │   ├── audit_logs/       # Chronological audit logs for all administrative decisions
│   │   └── ai_assistant/     # Formula breakdowns and rate-limited explanations
│   ├── config/               # Settings (dj-database-url, Neon SSL, CORS), WSGI, ASGI, URLs
│   ├── media/
│   │   ├── qr/               # Saved PhonePe scanner card & dynamic QR codes
│   │   └── screenshots/      # Secure payment verification receipts
│   ├── .env                  # Environment secrets (ignored in Git)
│   ├── .env.example          # Sample environment variables
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Production Docker container
│   ├── manage.py
│   └── test_suite.py         # 17-point automated integration test suite
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # PhonePe scanner asset (phonepe_scanner.jpg)
│   │   ├── calculators/      # Registry & Engine for all 8 categories (40+ tools)
│   │   ├── components/       # Navbar, Footer, PaymentModal, SearchModal, AIExplanationModal
│   │   ├── context/          # AuthContext (JWT tokens, role status), ThemeContext (Dark/Light)
│   │   ├── pages/            # Home (10 sections), Directory, CalculatorView, Pricing, Dashboard, Superadmin
│   │   ├── services/         # Axios API client with automatic token refresh
│   │   ├── App.jsx           # Client-side router & protected routes
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js        # Vite config with /api and /media proxy
│   ├── tailwind.config.js
│   ├── vercel.json           # Frontend Vercel SPA rewrites
│   └── Dockerfile
│
├── .gitignore                # Protects .env, media uploads, and node_modules
├── docker-compose.yml        # Multi-container orchestration
└── README.md
```

---

## 💳 Fixed-Amount Subscription Plans & Manual UPI

| Plan Name | Fixed Price | Validity | Target Use Case |
| :--- | :--- | :--- | :--- |
| **Starter Trial** | **₹9** | 7 Days | Immediate school/college assignments or trial |
| **Monthly Pass** | **₹29** | 30 Days | Active students and daily professionals |
| **Half-Yearly** | **₹59** | 180 Days | Long-term academic semester or project tracking |
| **Yearly Annual** | **₹99** | 365 Days | Complete annual pass (< ₹0.27/day) |

### Manual Verification Workflow
1. User selects a plan on the frontend.
2. Django backend looks up the plan price directly from the database and uses Python's `qrcode` library to generate a dynamic UPI URI:
   `upi://pay?pa=6205433088-2@ybl&pn=ASHUTOSH%20KUMAR&am=[PLAN_PRICE]&cu=INR&tn=[REF]`
3. User scans with PhonePe, Google Pay, Paytm, or BHIM.
4. User uploads the transaction screenshot and enters the 12-digit UTR reference number.
5. Status becomes `PENDING`.
6. Superadmin Owner compares the UTR and amount against actual bank credits in the Admin Dashboard:
   - **Accept**: Checks duplicate UTRs, verifies amount match, sets subscription start/end timestamps, updates role to `PREMIUM`, and creates a ledger record inside a database transaction (`transaction.atomic()`).
   - **Reject**: Requires a written rejection reason, keeps subscription inactive, and allows the user to resubmit with corrected details.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- Active Neon PostgreSQL Database

### 2. Backend Configuration
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure .env file
# Ensure DATABASE_URL contains your Neon connection string:
# DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# Apply database migrations on Neon
python manage.py migrate

# Bootstrap the Superadmin Owner account
python manage.py bootstrap_superadmin

# Seed standard subscription plans & UPI settings
python manage.py seed_plans

# Run automated integration tests (17/17 checks)
python test_suite.py

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Configuration
```bash
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Initial Superadmin Owner Credentials

Bootstrapped securely via environment variables:
- **Username**: `admin`
- **Default Password**: `Admin@CalcMaster2026`
- **Role**: `SUPERADMIN` (Lifetime free premium access)

*(Change this password immediately after first login via Dashboard -> Account Settings).*

---

## 🧪 Automated Testing Verification

The included `backend/test_suite.py` executes against Neon PostgreSQL:
- `PASS [1/17]`: User registration / account model verified.
- `PASS [2-3/17]`: Free user restrictions verified (no premium access).
- `PASS [4/17]`: Premium user entitlement access verified.
- `PASS [5/17]`: Superadmin lifetime free access verified (no expiry).
- `PASS [6/17]`: Automatic subscription expiry check verified.
- `PASS [7/17]`: Dynamic fixed-amount QR generation verified (₹29.00 for ASHUTOSH KUMAR).
- `PASS [8/17]`: Amount mismatch rejection verified (Select ₹29, Pay ₹9 -> REJECTED).
- `PASS [9/17]`: Valid payment submission keeps status PENDING.
- `PASS [10/17]`: Amount mismatch rejection verified (Select ₹99, Pay ₹29 -> REJECTED).
- `PASS [11/17]`: Duplicate UTR prevention verified.
- `PASS [12/17]`: Payment approval and atomic subscription activation verified.
- `PASS [13/17]`: Payment rejection with required reason verified.
- `PASS [14/17]`: Subscription start/end date calculation verified.
- `PASS [15/17]`: Unauthorized admin access prevention verified.
- `PASS [16/17]`: Screenshot upload size and image type validation verified.
- `PASS [17/17]`: Neon PostgreSQL SSL database connectivity verified.

---

## 🌐 Production Deployment

### Option A: Frontend on Vercel
1. Connect your repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-domain.com`
5. Deploy. The included `frontend/vercel.json` ensures all client-side routes redirect to `index.html`.

### Option B: Backend on Render / Railway / VPS / Docker
1. Create a Python Web Service on Render or Railway.
2. Root Directory: `backend`.
3. Build Command: `pip install -r requirements.txt && python manage.py migrate`
4. Start Command: `gunicorn --bind 0.0.0.0:$PORT config.wsgi:application`
5. Set Environment Variables:
   - `DATABASE_URL` = Your Neon PostgreSQL pooled connection string
   - `SECRET_KEY` = Strong production secret key
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `.onrender.com,your-frontend.vercel.app,localhost`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
   - `DEFAULT_UPI_ID` = `6205433088-2@ybl`
   - `DEFAULT_PAYEE_NAME` = `ASHUTOSH KUMAR`

---

## 💾 Database Backups (Neon PostgreSQL)

Neon automatically handles point-in-time restores (PITR) and branching. To take a manual backup dump:
```bash
pg_dump "postgresql://neondb_owner:PASSWORD@ep-xxx-pooler.aws.neon.tech/neondb?sslmode=require" > calcmaster_backup.sql
```
To restore:
```bash
psql "postgresql://neondb_owner:PASSWORD@ep-xxx-pooler.aws.neon.tech/neondb?sslmode=require" < calcmaster_backup.sql
```

---

## ⚖️ License & Rights
© 2026 CalcMaster Pro. All rights reserved.
One Platform. Every Calculation.
