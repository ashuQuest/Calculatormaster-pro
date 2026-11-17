import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import { CALCULATORS_CATALOG } from '../../calculators/registry';

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

  const filtered = CALCULATORS_CATALOG.filter(c => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const handleSelect = (calcId) => {
    navigate(`/calculator/${calcId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cream-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-850">
          <Search className="w-5 h-5 text-orange-600 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 40+ calculators (e.g. EMI, Percentage, Quadratic, SIP, BMI)..."
            className="w-full bg-transparent text-charcoal-700 dark:text-cream-100 text-xs sm:text-sm placeholder:text-charcoal-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-cream-100 dark:divide-charcoal-700">
          {filtered.map((calc) => (
            <div
              key={calc.id}
              onClick={() => handleSelect(calc.id)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-750 cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal-700 dark:text-cream-100 group-hover:text-orange-600 transition-colors">
                      {calc.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-300">
                      {calc.category}
                    </span>
                    {calc.is_premium && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-400 dark:text-charcoal-300 line-clamp-1 mt-0.5">
                    {calc.description}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-charcoal-400">
              No calculators matching "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-cream-100/70 dark:bg-charcoal-900 border-t border-cream-300 dark:border-charcoal-700 flex items-center justify-between text-[11px] text-charcoal-400">
          <span>Navigate with mouse or click</span>
          <kbd className="px-1.5 py-0.5 rounded bg-cream-200 dark:bg-charcoal-700 font-mono text-[10px]">ESC to close</kbd>
        </div>

      </div>
    </div>
  );
}
