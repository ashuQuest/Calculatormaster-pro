import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, TrendingUp, Sparkles, ShieldCheck, ArrowRight, 
  Search, Check, Zap, Lock, QrCode, HelpCircle, ChevronDown,
  Atom, Sigma, Briefcase, RefreshCw, Calendar, HeartPulse, Star,
  Clock, ArrowUpRight, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CATEGORIES, CALCULATORS_CATALOG } from '../calculators/registry';
import { useAuth } from '../context/AuthContext';

export default function Home({ onOpenPayment, onOpenSearch }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isSuperadmin, hasPremium } = useAuth();
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

  const quickChips = [
    { label: 'Loan EMI', id: 'emi' },
    { label: 'SIP Return', id: 'sip' },
    { label: 'Quadratic Solver', id: 'quadratic-equation' },
    { label: 'Percentage', id: 'percentage' },
    { label: 'GST Tax', id: 'gst' },
    { label: 'BMI Health', id: 'bmi' },
  ];

  const faqs = [
    {
      q: "What makes CalcMaster Pro different from free online calculators?",
      a: "CalcMaster Pro unifies over 40+ mathematical, scientific, financial, and business calculators under one refined, completely ad-free platform. You receive exact double-precision arithmetic, step-by-step logic breakdowns, comprehensive loan amortizations, unlimited cloud history, PDF/CSV reports, and AI explanations."
    },
    {
      q: "How does the manual UPI QR payment system work?",
      a: "When you upgrade, our system dynamically generates a fixed-amount UPI QR for your chosen plan (₹9, ₹29, ₹59, or ₹99). You scan with any UPI app (PhonePe, Google Pay, Paytm, BHIM), complete payment, and submit your UTR reference and receipt. The Superadmin manually checks the transaction against actual bank records before granting instant premium activation."
    },
    {
      q: "Are subscriptions recurring or auto-debited?",
      a: "No! All plans are strictly one-time payments for a fixed duration. We never store bank cards, and there are zero automatic bank deductions."
    },
    {
      q: "Can I use standard calculators for free without registering?",
      a: "Yes. All basic mathematical, percentage, discount, fraction, and standard calculators are freely accessible without requiring an account."
    },
    {
      q: "What does the AI Calculation Assistant do?",
      a: "The AI assistant explains underlying equations, intermediate steps, and practical financial takeaways. The actual calculations are strictly evaluated by our deterministic mathematical engine to ensure 100% accuracy."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-16">
      
      {/* 1. WELCOME & SEARCH HEADER (Noventra CRM Style) */}
      <section className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-cream-400 dark:border-charcoal-600 shadow-soft">
        <div className="max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>One Platform. Every Calculation.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 dark:text-white tracking-tight">
            {isAuthenticated 
              ? `Good day, ${user?.first_name || user?.username} 👋`
              : "Every Calculation. One Powerful Platform."}
          </h1>

          <p className="text-sm font-medium text-charcoal-600 dark:text-charcoal-200 leading-relaxed max-w-2xl">
            From everyday math to advanced scientific and financial calculations, get accurate results in seconds with clean step-by-step transparency.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-charcoal-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators by name, discipline, or formula (e.g. EMI, Compound, Matrix)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 focus:border-orange-600 text-charcoal-900 dark:text-white font-semibold text-xs sm:text-sm placeholder:text-charcoal-500 dark:placeholder:text-charcoal-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-soft"
              >
                Search
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
              <span className="text-charcoal-600 dark:text-charcoal-300 font-bold mr-1 text-[11px]">Popular:</span>
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => navigate(`/calculator/${chip.id}`)}
                  className="px-2.5 py-1 rounded-lg bg-cream-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-100 text-[11px] font-bold hover:bg-orange-100 dark:hover:bg-orange-950/60 hover:text-orange-600 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>

        </div>
      </section>

      {/* 2. DASHBOARD KPI & SUBSCRIPTION ROW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Status Card */}
        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-charcoal-600 dark:text-charcoal-300 uppercase tracking-wider">Account Status</span>
              {isSuperadmin ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  LIFETIME OWNER
                </span>
              ) : hasPremium ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  PRO ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cream-300 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-200">
                  FREE TIER
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white">
              {isSuperadmin 
                ? 'Unrestricted Access' 
                : hasPremium 
                  ? 'All 40+ Calculators Unlocked' 
                  : 'Basic Math Access'}
            </h3>
            <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mt-1.5 leading-relaxed">
              {hasPremium 
                ? 'Full loan amortization, equation solvers, unlimited history & AI insights enabled.' 
                : 'Upgrade to access advanced mathematical models, PDF exports and AI assistant.'}
            </p>
          </div>

          <div className="pt-5 border-t border-cream-300 dark:border-charcoal-700 mt-5 flex items-center justify-between">
            {hasPremium ? (
              <Link 
                to="/dashboard"
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={() => onOpenPayment?.('starter')}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro (from ₹9)</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Overview Card 1 */}
        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">40+ Verified Tools</h3>
            <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mt-1.5 leading-relaxed">
              Complete catalog spanning basic arithmetic, calculus, trigonometry, financial mortgages, and business margins.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-cream-300 dark:border-charcoal-700">
            <Link 
              to="/calculators"
              className="text-xs font-bold text-charcoal-800 dark:text-cream-100 hover:text-orange-600 flex items-center gap-1 transition-colors"
            >
              <span>Explore All Calculators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Overview Card 2 */}
        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950/80 text-green-600 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">Manual UPI Payments</h3>
            <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mt-1.5 leading-relaxed">
              Pay ₹9, ₹29, ₹59, or ₹99 directly via PhonePe QR. Verified manually by the owner with zero recurring auto-debit risk.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-cream-300 dark:border-charcoal-700">
            <Link 
              to="/pricing"
              className="text-xs font-bold text-charcoal-800 dark:text-cream-100 hover:text-orange-600 flex items-center gap-1 transition-colors"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </section>

      {/* 3. POPULAR CALCULATORS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-charcoal-900 dark:text-white tracking-tight">
              Popular Calculators
            </h2>
            <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mt-0.5">
              Frequently calculated tools for students, engineers and financial analysts
            </p>
          </div>
          <Link 
            to="/calculators"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCalculators.map((calc) => (
            <Link
              key={calc.id}
              to={`/calculator/${calc.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 hover:border-orange-500/80 shadow-soft hover:shadow-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200">
                    {calc.category}
                  </span>
                  {calc.is_premium && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                      PRO
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-300 dark:border-charcoal-700 flex items-center justify-between text-xs text-charcoal-500 group-hover:text-orange-600">
                <span className="font-semibold text-[11px]">Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CALCULATOR CATEGORIES DIRECTORY */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-charcoal-900 dark:text-white tracking-tight">
            Calculator Suites
          </h2>
          <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mt-0.5">
            Organized directories built for specific mathematical and commercial applications
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = CALCULATORS_CATALOG.filter(c => c.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/calculators?category=${cat.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 hover:border-orange-500 shadow-soft hover:shadow-card transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {count} Tools
                  </span>
                </div>
                <h3 className="font-bold text-sm text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. PRICING PREVIEW BANNER */}
      <section className="p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
            <QrCode className="w-4 h-4" />
            <span>Fixed Duration Passes • No Recurring Billing</span>
          </div>
          <h3 className="text-2xl font-black text-charcoal-900 dark:text-white tracking-tight">
            Plans Starting at Just ₹9
          </h3>
          <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-200 leading-relaxed">
            Choose from 7-day, 30-day, 180-day, or 365-day passes. Pay instantly via PhonePe, Google Pay, or Paytm.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/pricing"
            className="px-5 py-3 rounded-xl bg-cream-100 dark:bg-charcoal-700 hover:bg-cream-200 dark:hover:bg-charcoal-600 text-charcoal-900 dark:text-white font-bold text-xs border border-cream-400 dark:border-charcoal-600 transition-colors"
          >
            Compare All Plans
          </Link>
          <button
            onClick={() => onOpenPayment?.('monthly')}
            className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
          >
            Upgrade via UPI QR
          </button>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-charcoal-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300">
            Everything you need to know about CalcMaster Pro and our UPI payment verification.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-charcoal-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs font-medium text-charcoal-600 dark:text-charcoal-200 leading-relaxed border-t border-cream-300 dark:border-charcoal-700 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
