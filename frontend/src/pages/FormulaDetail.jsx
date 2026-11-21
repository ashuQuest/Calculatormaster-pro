import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Copy, Check, Calculator, Star, 
  ExternalLink, Info, AlertTriangle, CheckCircle2, ChevronRight, Share2 
} from 'lucide-react';
import { FORMULAS_CATALOG } from '../formulas/catalog';
import MathView from '../components/common/MathView';
import { useAuth } from '../context/AuthContext';

export default function FormulaDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const formula = FORMULAS_CATALOG.find(f => f.slug === slug);

  if (!formula) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-charcoal-400 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">Formula Not Found</h2>
        <p className="text-xs text-charcoal-500">The requested formula slug does not exist in our catalog.</p>
        <Link
          to="/formulas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Formula Library</span>
        </Link>
      </div>
    );
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryInCalculator = () => {
    if (!formula.relatedCalculator) return;
    const query = new URLSearchParams(formula.calculatorDefaults || {}).toString();
    navigate(`/calculator/${formula.relatedCalculator}?fromFormula=${formula.slug}&${query}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-charcoal-500 dark:text-charcoal-400">
        <Link to="/formulas" className="hover:text-orange-600 transition-colors">
          Formula Library
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/formulas/${formula.category}`} className="hover:text-orange-600 transition-colors">
          {formula.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal-900 dark:text-white font-bold truncate">
          {formula.title}
        </span>
      </nav>

      {/* Main Formula Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-6">
        
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-xs font-bold text-orange-700 dark:text-orange-400">
              {formula.categoryName}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cream-200 dark:bg-charcoal-700 text-xs font-bold text-charcoal-700 dark:text-cream-200">
              {formula.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLatex}
              className="px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 hover:border-orange-500 text-xs font-semibold text-charcoal-700 dark:text-cream-200 flex items-center gap-1.5 transition-colors"
              title="Copy LaTeX"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied LaTeX' : 'Copy LaTeX'}</span>
            </button>

            <button
              onClick={() => setIsFavorite(prev => !prev)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' 
                  : 'bg-cream-100 dark:bg-charcoal-900 border-cream-400 dark:border-charcoal-600 text-charcoal-400 hover:text-amber-500'
              }`}
              title="Favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Overview */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 dark:text-white tracking-tight">
            {formula.title}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-200 mt-2 leading-relaxed">
            {formula.description}
          </p>
        </div>

        {/* Hero Math Display Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 overflow-x-auto text-center flex items-center justify-center min-h-[90px]">
          <MathView math={formula.latex} display={true} className="text-xl sm:text-2xl text-charcoal-900 dark:text-white" />
        </div>

        {/* Calculator Link CTA */}
        {formula.relatedCalculator && (
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-charcoal-900/60 border border-orange-200 dark:border-orange-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-soft shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-white">
                  Interactive Calculator Available
                </h4>
                <p className="text-[11px] text-charcoal-600 dark:text-charcoal-300">
                  Compute with custom values, variable sensitivity, and PDF reports directly.
                </p>
              </div>
            </div>

            <button
              onClick={handleTryInCalculator}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Try Formula in Calculator</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Grid: Variables & Solved Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Variables Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-300 dark:border-charcoal-700 pb-3">
            <Info className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
              Variable Definitions & SI Units
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-300 dark:border-charcoal-700 text-charcoal-500 font-semibold">
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2">Variable</th>
                  <th className="pb-2">Unit</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                {formula.variables.map((v, i) => (
                  <tr key={i} className="hover:bg-cream-50 dark:hover:bg-charcoal-750">
                    <td className="py-2.5 font-bold font-mono text-orange-600 dark:text-orange-400">
                      <MathView math={v.symbol} />
                    </td>
                    <td className="py-2.5 font-semibold text-charcoal-900 dark:text-white">{v.name}</td>
                    <td className="py-2.5 text-charcoal-600 dark:text-charcoal-300 font-mono text-[11px]">{v.unit}</td>
                    <td className="py-2.5 text-charcoal-500 dark:text-charcoal-400 text-[11px]">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Solved Example */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-300 dark:border-charcoal-700 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
              Step-by-Step Solved Example
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 font-medium text-xs text-charcoal-800 dark:text-cream-100">
            {formula.solvedExample.problem}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
              Solution Steps:
            </span>
            <ul className="space-y-1.5 pl-4 list-decimal text-xs text-charcoal-600 dark:text-charcoal-300">
              {formula.solvedExample.steps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Final Calculated Result:</span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{formula.solvedExample.result}</span>
          </div>
        </div>

      </div>

      {/* Grid: Theory & Derivation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Theory & Physical Meaning */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-2">
            Theoretical Foundation & Significance
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-200 leading-relaxed whitespace-pre-line">
            {formula.theory}
          </p>
        </div>

        {/* Mathematical Derivation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-2">
            Mathematical Derivation / Proof
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-200 leading-relaxed whitespace-pre-line font-mono text-[12px]">
            {formula.derivation}
          </p>
        </div>

      </div>

      {/* Grid: Boundary Conditions & Common Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Boundary Conditions & Assumptions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-2">
            Boundary Conditions & Key Assumptions
          </h3>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-charcoal-600 dark:text-charcoal-300">
            {formula.assumptions.map((asm, i) => (
              <li key={i}>{asm}</li>
            ))}
          </ul>
        </div>

        {/* Common Pitfalls & Mistakes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-3">
          <div className="flex items-center gap-1.5 border-b border-cream-300 dark:border-charcoal-700 pb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Common Pitfalls & Errors to Avoid
            </h3>
          </div>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-charcoal-600 dark:text-charcoal-300">
            {formula.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
