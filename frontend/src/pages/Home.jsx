import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, TrendingUp, Sparkles, ShieldCheck, ArrowRight, 
  Search, Check, Zap, Lock, QrCode, HelpCircle, ChevronDown,
  Atom, Sigma, Briefcase, RefreshCw, Calendar, HeartPulse, Star
} from 'lucide-react';
import { CATEGORIES, CALCULATORS_CATALOG } from '../calculators/registry';

export default function Home({ onOpenPayment, onOpenSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const popularIds = ['emi', 'sip', 'quadratic-equation', 'percentage', 'bmi', 'gst', 'discount', 'standard'];
  const popularCalculators = CALCULATORS_CATALOG.filter(c => popularIds.includes(c.id));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/calculators?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const faqs = [
    {
      q: "What makes CalcMaster Pro different from free online calculators?",
      a: "CalcMaster Pro combines over 40+ specialized mathematical, financial, scientific, and business calculators under one unified, ad-free SaaS platform. You get exact double-precision formulas, step-by-step breakdowns, loan amortization schedules, unlimited cloud history, PDF/CSV exports, and an AI explanation assistant."
    },
    {
      q: "How does the manual UPI QR payment system work?",
      a: "When you upgrade to Premium, our system generates a dynamic UPI QR code with the exact plan price (₹9, ₹29, ₹59, or ₹99). You pay using any UPI app (PhonePe, Google Pay, Paytm, BHIM), enter your UTR reference number, and upload a screenshot. The Superadmin manually checks and verifies your transaction against their bank statement before activating your premium access."
    },
    {
      q: "Are the subscription plans recurring or auto-debited?",
      a: "No! All subscription plans are strictly one-time payments with no hidden recurring bank debits. When your plan expires, you simply choose whether you wish to renew manually."
    },
    {
      q: "Can I use basic calculators for free without registering?",
      a: "Yes. All basic math, percentage, discount, fraction, and standard calculators are 100% free and open for guest users without any login requirements."
    },
    {
      q: "How does the AI Calculation Assistant work?",
      a: "The AI assistant does not invent or calculate numbers—the deterministic calculator engine does that. Instead, the AI assistant explains the underlying formulas, step-by-step logic, and financial implications in clear, easy-to-understand language."
    }
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Premium SaaS Calculation Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Every Calculation. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              One Powerful Platform.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            From everyday mathematics to advanced scientific and financial calculations, get accurate results in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/calculators"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Explore Calculators</span>
            </Link>
            
            <button
              onClick={() => onOpenPayment?.()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-sm transition-all hover:border-slate-600 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Get Premium (from ₹9)</span>
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="px-3">
              <p className="text-2xl font-black text-white">40+</p>
              <p className="text-xs text-slate-400">Verified Calculators</p>
            </div>
            <div className="px-3">
              <p className="text-2xl font-black text-sky-400">100%</p>
              <p className="text-xs text-slate-400">Zero Ad Interruption</p>
            </div>
            <div className="px-3">
              <p className="text-2xl font-black text-emerald-400">UPI QR</p>
              <p className="text-xs text-slate-400">Direct ₹9, ₹29, ₹59, ₹99</p>
            </div>
            <div className="px-3">
              <p className="text-2xl font-black text-indigo-400">AI Logic</p>
              <p className="text-xs text-slate-400">Formula Explanations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN SEARCH BAR */}
      <section className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-sky-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or formula (e.g. EMI, Compound, Matrix, BMI, GST)..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-900 border-2 border-slate-800 focus:border-sky-500 text-white text-sm placeholder:text-slate-500 shadow-2xl focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Try popular queries: <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/calculator/emi')}>EMI</span>, <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/calculator/sip')}>SIP</span>, <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/calculator/quadratic-equation')}>Quadratic</span>, <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/calculator/percentage')}>Percentage</span>
          </p>
        </form>
      </section>

      {/* 3. POPULAR CALCULATORS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Popular Calculators</h2>
            <p className="text-sm text-slate-400 mt-1">Most frequently used calculators for daily calculations</p>
          </div>
          <Link to="/calculators" className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCalculators.map((calc) => (
            <Link
              key={calc.id}
              to={`/calculator/${calc.id}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  {calc.isPremium ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      PRO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      FREE
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-sky-400">
                <span>Open Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CALCULATOR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">Structured by Domain</h2>
          <p className="text-sm text-slate-400 mt-2">Explore calculators grouped into 8 specialized mathematical disciplines</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/calculators?category=${cat.id}`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE CALCMASTER PRO */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">Why Choose CalcMaster Pro</h2>
            <p className="text-sm text-slate-400 mt-2">Built for engineers, students, analysts, and everyday problem solvers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-850/70 border border-slate-800">
              <Zap className="w-6 h-6 text-amber-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Instant Precision Math</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Evaluated with high-precision arithmetic algorithms, complete step-by-step logic, and zero numerical rounding drift.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-850/70 border border-slate-800">
              <Lock className="w-6 h-6 text-sky-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Ad-Free & Cloud Synced</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                No distracting pop-up advertisements or banner trackers. Save history, bookmark formulas, and export reports cleanly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-850/70 border border-slate-800">
              <QrCode className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Direct UPI & No Hidden Subscriptions</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Pay directly using PhonePe, Google Pay, or Paytm QR. One-time fee with no recurring auto-debit traps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREE VS PREMIUM COMPARISON */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Free vs Premium Feature Matrix</h2>
          <p className="text-sm text-slate-400 mt-2">Clear, honest feature breakdown. Never pay for what you don't need.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase text-slate-400">
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6">Free Guest & User</th>
                <th className="py-4 px-6 text-sky-400">CalcMaster Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Basic Math & Percentages</td>
                <td className="py-3.5 px-6 text-emerald-400">Unlimited</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Advanced Financial Tools (EMI, SIP, Amortization)</td>
                <td className="py-3.5 px-6 text-slate-500">Standard view only</td>
                <td className="py-3.5 px-6 text-sky-400 font-semibold">Full schedule & prepayments</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Equation Solvers, Matrix & Statistics</td>
                <td className="py-3.5 px-6 text-slate-500">Linear only</td>
                <td className="py-3.5 px-6 text-sky-400 font-semibold">All Higher Mathematical Solvers</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Cloud Calculation History</td>
                <td className="py-3.5 px-6 text-slate-500">Last 10 entries</td>
                <td className="py-3.5 px-6 text-sky-400 font-semibold">Unlimited Permanent Storage</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Saved Calculations & Custom Folders</td>
                <td className="py-3.5 px-6 text-slate-500">No</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold">Yes</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Export to PDF & CSV Reports</td>
                <td className="py-3.5 px-6 text-slate-500">No</td>
                <td className="py-3.5 px-6 text-emerald-400 font-semibold">One-Click Export</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">AI Step-by-Step Explanation Assistant</td>
                <td className="py-3.5 px-6 text-slate-500">No</td>
                <td className="py-3.5 px-6 text-sky-400 font-semibold">25 Explanations / Day</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. PRICING PLANS */}
      <section id="pricing" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
            <span>Manual UPI QR Payments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Fair, Transparent Pricing</h2>
          <p className="text-sm text-slate-400 mt-2">No automatic recurring charges. Pay directly via UPI for your chosen duration.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Plan 1: Starter */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Trial</span>
              <h3 className="text-xl font-bold text-white mt-1">Starter</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-white">₹9</span>
                <span className="text-xs text-slate-400">/ 7 days</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Great for quick assignments or immediate evaluation.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 7 Days Full Premium Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All 40+ Advanced Calculators</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Cloud History</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> PDF & CSV Data Exports</li>
              </ul>
            </div>

            <button
              onClick={() => onOpenPayment?.('starter')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Get Starter Pass
            </button>
          </div>

          {/* Plan 2: Monthly (Popular) */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-sky-500 shadow-2xl shadow-sky-500/10 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-[10px] tracking-wider uppercase">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">30-Day Pass</span>
              <h3 className="text-xl font-bold text-white mt-1">Monthly</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-sky-400">₹29</span>
                <span className="text-xs text-slate-400">/ 30 days</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Standard choice for active students and daily professionals.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> 30 Days Unlimited Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Loan Amortization Schedules</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> AI Step-by-Step Logic Assistant</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Saved Folders & Formulas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Priority Support</li>
              </ul>
            </div>

            <button
              onClick={() => onOpenPayment?.('monthly')}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
            >
              Choose Monthly Plan
            </button>
          </div>

          {/* Plan 3: Half-Yearly */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Super Saver</span>
              <h3 className="text-xl font-bold text-white mt-1">Half-Yearly</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-white">₹59</span>
                <span className="text-xs text-slate-400">/ 180 days</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Save over 65% compared to paying monthly.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 180 Days Full Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All Current & Upcoming Tools</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited PDF / CSV Reports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full AI Assistant Quota</li>
              </ul>
            </div>

            <button
              onClick={() => onOpenPayment?.('half_yearly')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Get Half-Yearly Pass
            </button>
          </div>

          {/* Plan 4: Yearly */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Best Annual Value</span>
              <h3 className="text-xl font-bold text-white mt-1">Yearly</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-white">₹99</span>
                <span className="text-xs text-slate-400">/ 365 days</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Complete annual access for less than ₹0.27 per day.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 365 Days Unrestricted Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> VIP Feature Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Formula Cloud Storage</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Priority Assistance</li>
              </ul>
            </div>

            <button
              onClick={() => onOpenPayment?.('yearly')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Get Yearly Annual Pass
            </button>
          </div>
        </div>
      </section>

      {/* 8. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">Enterprise-Grade Architecture</h2>
          <p className="text-sm text-slate-400 mt-2">Precision calculation technology backed by secure cloud infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-8 h-8 text-sky-400 mb-4" />
            <h4 className="text-base font-bold text-white">Neon PostgreSQL Database</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your calculations, saved folders, and subscription history are protected by modern enterprise SSL cloud PostgreSQL with automated replication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <QrCode className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="text-base font-bold text-white">Safe Manual Verification</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every UPI transaction is cross-checked against actual bank credits to prevent fraudulent activations and protect honest subscribers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-4" />
            <h4 className="text-base font-bold text-white">AI Explanations On-Demand</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Never get confused by complex algebraic formulas or financial terms. One-click AI explanations break down equations in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to know about CalcMaster Pro and UPI activations</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-sky-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
