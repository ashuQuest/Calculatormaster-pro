import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calculator, BookOpen, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-soft">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-charcoal-900 dark:text-white tracking-tight">
            404
          </span>
          <h2 className="text-lg font-bold text-charcoal-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
            The page or calculator formula you are looking for does not exist or may have moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/calculators"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 hover:bg-cream-200 text-charcoal-800 dark:text-cream-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-orange-600" />
            <span>All Calculators</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-cream-300 dark:border-charcoal-700">
          <Link
            to="/formulas"
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse Formula Library</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
