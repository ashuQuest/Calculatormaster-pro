import React from 'react';
import { Shield, Mail, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LegalLayout({ title, subtitle, children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <LegalLayout title="About CalcMaster Pro" subtitle="Precision numerical engine and productivity platform">
      <p>
        <strong>CalcMaster Pro</strong> is a complete SaaS calculator platform built to deliver instantaneous, accurate, and transparent calculations across everyday mathematics, scientific engineering, financial forecasting, and business commerce.
      </p>
      <h3 className="text-base font-bold text-white">Our Philosophy</h3>
      <p>
        Calculators should be ad-free, deterministic, and reliable. We reject slow, bloated ad-supported calculation sites that clutter answers with banners and trackers. CalcMaster Pro provides double-precision formulas, step-by-step logic breakdowns, and optional AI explanations without distracting noise.
      </p>
      <h3 className="text-base font-bold text-white">Technology Stack</h3>
      <p>
        Built on modern enterprise architecture with React, Tailwind CSS, Django, Django REST Framework, and Neon Cloud PostgreSQL over SSL.
      </p>
    </LegalLayout>
  );
}

export function ContactPage() {
  return (
    <LegalLayout title="Contact & Support" subtitle="Get in touch with the CalcMaster Pro team">
      <p>
        Have questions regarding subscription plans, payment verification, or feature suggestions? Our team is here to assist you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
          <Mail className="w-6 h-6 text-sky-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Email Support</h4>
          <p className="text-xs text-slate-400 mt-1">support@calcmasterpro.com</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Response within 24 hours</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
          <Shield className="w-6 h-6 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm">UPI Verification Help</h4>
          <p className="text-xs text-slate-400 mt-1">+91 6205433088</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct Owner Support</p>
        </div>
      </div>
    </LegalLayout>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="Last updated: November 2026">
      <p>
        At CalcMaster Pro, your privacy is a foundational priority. We collect only the minimum personal information required to authenticate your account and securely verify your subscription payments.
      </p>
      <h3 className="text-base font-bold text-white">Information We Collect</h3>
      <ul className="list-disc pl-5 space-y-2 text-xs">
        <li>Account Information: Username, email address, and optional phone number.</li>
        <li>Payment Information: Transaction UTR references and receipt screenshots for manual verification. We never store bank account credentials or UPI PINs.</li>
        <li>Calculation History: Stored privately in encrypted cloud storage accessible only by you.</li>
      </ul>
      <h3 className="text-base font-bold text-white">Zero Third-Party Advertising</h3>
      <p>
        We do not sell, rent, or trade your personal data with third-party advertisers or data brokers.
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" subtitle="Usage terms for CalcMaster Pro SaaS">
      <p>
        By creating an account or subscribing to CalcMaster Pro, you agree to these Terms and Conditions.
      </p>
      <h3 className="text-base font-bold text-white">1. Use of Service</h3>
      <p>
        CalcMaster Pro grants you a non-exclusive license to use the calculators for personal, educational, and professional purposes. You agree not to attempt to breach backend permissions or reverse-engineer the platform.
      </p>
      <h3 className="text-base font-bold text-white">2. Manual UPI Payments</h3>
      <p>
        All subscription activations require accurate payment submission with a valid UTR number matching actual bank credits. Any fraudulent or duplicate submission will result in immediate suspension.
      </p>
    </LegalLayout>
  );
}

export function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" subtitle="Clear guidelines on subscriptions">
      <p>
        CalcMaster Pro operates on fixed, one-time payment durations (₹9 for 7 days, ₹29 for 30 days, ₹59 for 180 days, and ₹99 for 365 days).
      </p>
      <h3 className="text-base font-bold text-white">Manual Verification & Refunds</h3>
      <p>
        If your payment was rejected due to an amount mismatch or if you were charged multiple times for the same transaction in error, please contact our support team at <strong>support@calcmasterpro.com</strong> with your UTR reference for manual verification and resolution.
      </p>
      <p>
        Since subscriptions are activated manually following verification, activated plans are generally non-refundable once the service period has commenced.
      </p>
    </LegalLayout>
  );
}

export function DisclaimerPage() {
  return (
    <LegalLayout title="Mathematical & Financial Disclaimer" subtitle="Important operational notices">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p>
          Calculations provided on this platform are for informational, computational, and educational purposes only.
        </p>
      </div>
      <h3 className="text-base font-bold text-white">Financial & Tax Estimates</h3>
      <p>
        EMI, SIP, compounding, GST, and Income Tax calculators utilize standard mathematical algorithms and current government tax slabs. Actual bank amortization schedules, loan processing fees, mutual fund NAV market fluctuations, and statutory tax assessments may differ based on lender policies or tax changes.
      </p>
      <h3 className="text-base font-bold text-white">Health & Fitness Metrics</h3>
      <p>
        BMI and BMR metrics are general population indicators and do not replace personalized medical advice from certified healthcare professionals.
      </p>
    </LegalLayout>
  );
}
