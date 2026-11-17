import React, { useState } from 'react';
import { X, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { aiApi } from '../../services/api';

export default function AIExplanationModal({ isOpen, onClose, calculatorName, inputs, results, formula }) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [quotaInfo, setQuotaInfo] = useState('');

  const handleFetchExplanation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await aiApi.explainCalculation({
        calculator_name: calculatorName,
        inputs,
        results,
        formula
      });
      if (res.data.success) {
        setExplanation(res.data.explanation);
        setQuotaInfo(`Remaining daily quota: ${res.data.remaining_today}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setExplanation('');
      setError('');
      setQuotaInfo('');
      handleFetchExplanation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl text-charcoal-700 dark:text-cream-100 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 dark:border-charcoal-700 bg-cream-100/70 dark:bg-charcoal-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-soft">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-700 dark:text-cream-100 flex items-center gap-2">
                <span>AI Calculation Insight</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-800 uppercase tracking-wider">
                  ASSISTANT
                </span>
              </h3>
              <p className="text-xs text-charcoal-400 dark:text-charcoal-300">Step-by-step logic for {calculatorName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-charcoal-600 dark:text-cream-200">
                Analyzing computation variables and generating step-by-step explanation...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Unable to generate explanation</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!loading && explanation && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-xs leading-relaxed text-charcoal-700 dark:text-cream-100 whitespace-pre-wrap font-sans">
                {explanation}
              </div>

              {quotaInfo && (
                <div className="flex items-center justify-between text-[11px] text-charcoal-400 pt-2 border-t border-cream-200 dark:border-charcoal-700">
                  <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calculation verified</span>
                  </span>
                  <span>{quotaInfo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-cream-50 dark:bg-charcoal-900 border-t border-cream-300 dark:border-charcoal-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
