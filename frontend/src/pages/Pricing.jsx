import React from 'react';
import { Check, Sparkles, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Pricing({ onOpenPayment }) {
  const plans = [
    {
      code: 'starter',
      name: 'Starter Trial',
      price: '₹9',
      duration: '7 Days',
      badge: 'Quick Trial',
      popular: false,
      desc: 'Ideal for quick assignments and immediate project calculations.',
      features: [
        '7 Days Full Premium Access',
        'All 40+ Advanced Calculators',
        'Unlimited Cloud History',
        'Save Formulas & Favorites',
        'Export Calculations to PDF & CSV',
        'AI Step-by-Step Explanations',
      ]
    },
    {
      code: 'monthly',
      name: 'Monthly Pass',
      price: '₹29',
      duration: '30 Days',
      badge: 'Most Popular',
      popular: true,
      desc: 'Perfect for active students, professionals, and daily users.',
      features: [
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
      code: 'half_yearly',
      name: 'Half-Yearly Pass',
      price: '₹59',
      duration: '180 Days',
      badge: 'Super Saver',
      popular: false,
      desc: 'Unmatched value for 6 months of continuous productivity.',
      features: [
        '180 Days Full Premium Access',
        'Save over 65% compared to monthly',
        'Advanced Financial Modeling & Scenario Comparisons',
        'Unlimited Formula Storage',
        'Unlimited PDF/CSV Report Generation',
        'Full AI Assistant Quota',
      ]
    },
    {
      code: 'yearly',
      name: 'Yearly Annual Pass',
      price: '₹99',
      duration: '365 Days',
      badge: 'Best Value',
      popular: false,
      desc: 'Complete annual pass for students, engineers, and financial analysts.',
      features: [
        '365 Days Full Premium Access',
        'Less than ₹0.27 per day',
        'All current and upcoming calculators included',
        'Unlimited Calculation Exports',
        'Dedicated Priority Customer Support',
        'VIP Early Access to New Features',
      ]
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <QrCode className="w-3.5 h-3.5" />
          <span>Manual UPI Payments • No Auto-Debit Traps</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Transparent, Fixed Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Choose a plan that fits your workflow. Every payment is verified directly by the platform owner.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div
            key={p.code}
            className={`p-6 rounded-3xl bg-slate-900 border flex flex-col justify-between transition-all relative ${p.popular ? 'border-2 border-sky-500 shadow-2xl shadow-sky-500/15' : 'border-slate-800 hover:border-slate-700'}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-[10px] tracking-wider uppercase">
                {p.badge}
              </span>
            )}
            
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.badge}</span>
              <h3 className="text-xl font-bold text-white mt-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className={`text-4xl font-extrabold ${p.popular ? 'text-sky-400' : 'text-white'}`}>{p.price}</span>
                <span className="text-xs text-slate-400">/ {p.duration}</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">{p.desc}</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 shrink-0 ${p.popular ? 'text-sky-400' : 'text-emerald-400'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onOpenPayment?.(p.code)}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${p.popular ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
            >
              <span>Subscribe for {p.price}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Trust Callout */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Manual Verification Assurance</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              All UPI transactions are checked directly against bank records before premium activation. 
              No credit card required. No recurring subscriptions. Complete peace of mind.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenPayment?.('monthly')}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0"
        >
          Pay with UPI QR
        </button>
      </div>

    </div>
  );
}
