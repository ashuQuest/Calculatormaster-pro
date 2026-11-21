import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calculator, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { CALCULATORS_CATALOG } from '../../calculators/registry';
import { FORMULAS_CATALOG } from '../../formulas/catalog';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCalculators = CALCULATORS_CATALOG.filter(c => {
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
    );
  }).slice(0, 5);

  const filteredFormulas = FORMULAS_CATALOG.filter(f => {
    if (!q) return false;
    return (
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.categoryName.toLowerCase().includes(q) ||
      f.latex.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  const handleSelectCalculator = (calcId) => {
    navigate(`/calculator/${calcId}`);
    onClose();
  };

  const handleSelectFormula = (slug) => {
    navigate(`/formula/${slug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-cream-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-850">
          <Search className="w-5 h-5 text-orange-600 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 40+ calculators and formulas (e.g. EMI, Ohm, Quadratic, SIP, Integral)..."
            className="w-full bg-transparent text-charcoal-900 dark:text-white text-xs sm:text-sm placeholder:text-charcoal-500 focus:outline-none font-medium"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          
          {/* Calculators Section */}
          {filteredCalculators.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 pb-1">
                Calculators ({filteredCalculators.length})
              </p>
              <div className="space-y-1">
                {filteredCalculators.map((calc) => (
                  <div
                    key={calc.id}
                    onClick={() => handleSelectCalculator(calc.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-750 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                            {calc.name}
                          </h4>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300">
                            {calc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 line-clamp-1">
                          {calc.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas Section */}
          {filteredFormulas.length > 0 && (
            <div className="pt-2 border-t border-cream-200 dark:border-charcoal-700">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 pb-1">
                Formulas & Engineering Theory ({filteredFormulas.length})
              </p>
              <div className="space-y-1">
                {filteredFormulas.map((formula) => (
                  <div
                    key={formula.slug}
                    onClick={() => handleSelectFormula(formula.slug)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-750 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                            {formula.title}
                          </h4>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300">
                            {formula.categoryName}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-mono line-clamp-1">
                          {formula.latex}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCalculators.length === 0 && filteredFormulas.length === 0 && (
            <div className="p-8 text-center text-xs text-charcoal-400">
              No calculators or formulas matching "{query}".
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
