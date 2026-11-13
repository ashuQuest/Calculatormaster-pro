import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck, Heart, QrCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CalcMaster <span className="text-sky-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              One Platform. Every Calculation. From everyday math to high-level scientific and financial modeling.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Direct UPI Enabled</span>
            </div>
          </div>

          {/* Calculators Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/calculators?category=basic" className="hover:text-sky-400 transition-colors">Basic Math & Percentages</Link></li>
              <li><Link to="/calculators?category=scientific" className="hover:text-sky-400 transition-colors">Scientific & Trigonometry</Link></li>
              <li><Link to="/calculators?category=mathematical" className="hover:text-sky-400 transition-colors">Equation Solvers & Matrices</Link></li>
              <li><Link to="/calculators?category=financial" className="hover:text-sky-400 transition-colors">Financial, EMI & SIP</Link></li>
              <li><Link to="/calculators?category=business" className="hover:text-sky-400 transition-colors">Business, Margin & Break-even</Link></li>
              <li><Link to="/calculators?category=converters" className="hover:text-sky-400 transition-colors">Universal Unit Converters</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/calculators" className="hover:text-sky-400 transition-colors">All 40+ Calculators</Link></li>
              <li><Link to="/pricing" className="hover:text-sky-400 transition-colors">Pricing & Upgrades</Link></li>
              <li><a href="/#features" className="hover:text-sky-400 transition-colors">Features & Benefits</a></li>
              <li><a href="/#faq" className="hover:text-sky-400 transition-colors">Frequently Asked Questions</a></li>
              <li><Link to="/dashboard" className="hover:text-sky-400 transition-colors">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">About CalcMaster Pro</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="hover:text-sky-400 transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-sky-400 transition-colors">Mathematical & Financial Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CalcMaster Pro. All rights reserved. Created for precision calculations.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted & Verified Cloud Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
