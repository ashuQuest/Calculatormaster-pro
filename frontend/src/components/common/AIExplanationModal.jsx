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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Calculation Insight</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">
                  ASSISTANT
                </span>
              </h3>
              <p className="text-xs text-slate-400">Step-by-step logic for {calculatorName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-300 font-medium">Analyzing calculation inputs and evaluating formula steps...</p>
              <p className="text-xs text-slate-500">Generating plain-language mathematical & financial insights</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to load explanation</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {explanation && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                {explanation}
              </div>

              {quotaInfo && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Mathematical Engine
                  </span>
                  <span>{quotaInfo}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
