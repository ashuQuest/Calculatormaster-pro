import React from 'react';
import { Check, Sparkles, QrCode, ShieldCheck, ArrowRight, Zap, HelpCircle } from 'lucide-react';

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

  const comparisonRows = [
    { feature: 'Everyday Basic Math Calculators', free: 'Unlimited', pro: 'Unlimited' },
    { feature: 'Scientific & Trigonometric Keypads', free: 'Standard', pro: 'Advanced & Precision' },
    { feature: 'Equation Solvers & Matrix Algebra', free: 'Limited (2x2)', pro: 'Full (up to 4x4 & Polynomials)' },
    { feature: 'Financial, Loan EMI & SIP Models', free: 'Basic summary', pro: 'Full amortization schedule & charts' },
    { feature: 'Calculation History Cloud Storage', free: 'Last 5 items', pro: 'Unlimited Permanent Storage' },
    { feature: 'Export History to PDF & CSV Reports', free: 'No', pro: 'Yes (1-click instantaneous)' },
    { feature: 'AI Step-by-Step Logic Assistant', free: '1 query / day', pro: 'Full Daily Access' },
    { feature: 'Ad-Free High Performance Workspace', free: 'Standard', pro: 'Dedicated High Speed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 dark:bg-charcoal-800 text-orange-700 dark:text-orange-400 text-xs font-semibold border border-cream-400 dark:border-charcoal-600">
          <QrCode className="w-3.5 h-3.5 text-orange-600" />
          <span>Direct Manual UPI • No Auto-Debit Cards Required</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-700 dark:text-cream-100 tracking-tight">
          Transparent, Fixed Pricing
        </h1>
        <p className="text-sm sm:text-base text-charcoal-400 dark:text-charcoal-300">
          Choose a plan that fits your workflow. Every payment is verified directly with zero auto-renewal traps.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const isPop = p.popular;
          return (
            <div
              key={p.code}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all relative ${
                isPop
                  ? 'bg-white dark:bg-charcoal-800 border-2 border-orange-500 shadow-md ring-4 ring-orange-500/10'
                  : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 hover:border-orange-400/60 shadow-soft'
              }`}
            >
              {isPop && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full bg-orange-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
                    {p.badge}
                  </span>
                </div>
              )}

              <div>
                {!isPop && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-200 mb-3 border border-cream-300 dark:border-charcoal-600 uppercase tracking-wide">
                    {p.badge}
                  </span>
                )}
                
                <h3 className="text-xl font-bold text-charcoal-700 dark:text-cream-100 mt-1">
                  {p.name}
                </h3>
                <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-1.5 min-h-[32px]">
                  {p.desc}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 my-5 pb-5 border-b border-cream-300 dark:border-charcoal-700">
                  <span className="text-4xl font-extrabold text-charcoal-700 dark:text-cream-100 tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-xs text-charcoal-400 dark:text-charcoal-300 font-medium">
                    / {p.duration}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-charcoal-600 dark:text-cream-200">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPop ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/80 dark:text-orange-400' : 'bg-cream-200 text-charcoal-600 dark:bg-charcoal-700 dark:text-cream-200'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenPayment(p.code)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isPop
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-soft hover:shadow'
                    : 'bg-cream-100 hover:bg-cream-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-700 dark:text-cream-100 border border-cream-400 dark:border-charcoal-600'
                }`}
              >
                <span>Select Plan • {p.price}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Safe UPI Guarantee Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-charcoal-700 dark:text-cream-100">
              Zero Financial Risk • 100% Manual Verification
            </h4>
            <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-0.5">
              Pay securely via PhonePe, Google Pay, or Paytm. No recurring debit authorization, no credit card storage.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenPayment('monthly')}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-soft"
          >
            Upgrade via UPI QR
          </button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 space-y-6 shadow-soft">
        <div>
          <h3 className="text-xl font-bold text-charcoal-700 dark:text-cream-100">
            Compare Free vs Pro Tier
          </h3>
          <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-1">
            See exactly what is included in your CalcMaster Pro subscription.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cream-300 dark:border-charcoal-700">
                <th className="py-3 px-4 font-bold text-charcoal-400 dark:text-charcoal-400 uppercase tracking-wider">Feature</th>
                <th className="py-3 px-4 font-bold text-charcoal-400 dark:text-charcoal-400 uppercase tracking-wider w-36">Free Tier</th>
                <th className="py-3 px-4 font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider w-48">Pro Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-charcoal-700 dark:text-cream-100">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-400 dark:text-charcoal-300">
                    {row.free}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-700 dark:text-cream-100">
                    <span className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{row.pro}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
