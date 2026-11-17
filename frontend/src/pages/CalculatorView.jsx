import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calculator, Copy, Check, Sparkles, Star, Bookmark, 
  ArrowLeft, Lock, AlertCircle, Info, RefreshCw 
} from 'lucide-react';
import { CALCULATORS_CATALOG } from '../calculators/registry';
import { calculateResult } from '../calculators/engine';
import { useAuth } from '../context/AuthContext';
import { calculatorApi } from '../services/api';
import AIExplanationModal from '../components/common/AIExplanationModal';

export default function CalculatorView({ onOpenPayment }) {
  const { id } = useParams();
  const { user, isAuthenticated, hasPremium } = useAuth();

  const calcConfig = CALCULATORS_CATALOG.find(c => c.id === id) || CALCULATORS_CATALOG[0];

  // Calculator Form State
  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Standard calculator specific keypad tape
  const [standardTape, setStandardTape] = useState('0');

  // Initialize default inputs based on calculator ID
  useEffect(() => {
    let defaults = {};
    if (id === 'percentage') defaults = { type: 'of', val1: '15', val2: '250' };
    else if (id === 'discount') defaults = { originalPrice: '1999', discountPct: '20', taxPct: '18' };
    else if (id === 'fraction') defaults = { n1: '3', d1: '4', op: '+', n2: '2', d2: '5' };
    else if (id === 'ratio') defaults = { a: '1920', b: '1080', c: '1280', d: '' };
    else if (id === 'square-root') defaults = { x: '144' };
    else if (id === 'cube-root') defaults = { x: '729' };
    else if (id === 'average') defaults = { numbers: '45, 82, 91, 63, 77, 88' };
    else if (id === 'lcm-hcf') defaults = { a: '24', b: '36' };
    else if (id === 'trigonometry') defaults = { angle: '45', unit: 'DEG' };
    else if (id === 'logarithm') defaults = { val: '1000', base: '10' };
    else if (id === 'factorial') defaults = { n: '8', r: '3' };
    else if (id === 'linear-equation') defaults = { a: '4', b: '12', c: '36' };
    else if (id === 'quadratic-equation') defaults = { a: '1', b: '-5', c: '6' };
    else if (id === 'matrix') defaults = { m00: '4', m01: '7', m10: '2', m11: '6' };
    else if (id === 'statistics') defaults = { dataset: '12, 18, 24, 30, 36, 42, 48' };
    else if (id === 'emi') defaults = { principal: '2500000', rate: '8.5', tenure: '20' };
    else if (id === 'sip') defaults = { monthlyInvestment: '5000', annualReturn: '12', tenureYears: '15' };
    else if (id === 'compound-interest') defaults = { principal: '100000', rate: '7.5', time: '5', frequency: '4' };
    else if (id === 'simple-interest') defaults = { principal: '50000', rate: '6', time: '3' };
    else if (id === 'gst') defaults = { amount: '10000', rate: '18', type: 'exclusive' };
    else if (id === 'cagr') defaults = { beginVal: '50000', endVal: '185000', years: '5' };
    else if (id === 'bmi') defaults = { weight: '68', height: '175' };
    else if (id === 'electricity-bill') defaults = { watts: '1500', hours: '6', rate: '8' };
    else if (id === 'age') defaults = { birthDate: '2000-01-15' };

    setInputs(defaults);
    const computed = calculateResult(id, defaults);
    setOutput(computed);
  }, [id]);

  const handleInputChange = (field, val) => {
    const updated = { ...inputs, [field]: val };
    setInputs(updated);
    const res = calculateResult(id, updated);
    setOutput(res);
  };

  const handleCopyResult = () => {
    if (output?.results) {
      const summary = Object.entries(output.results).map(([k, v]) => `${k}: ${v}`).join('\n');
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToCloud = async () => {
    if (!isAuthenticated) return;
    try {
      await calculatorApi.saveHistory({
        calculator_id: calcConfig.id,
        calculator_name: calcConfig.name,
        category: calcConfig.category,
        inputs,
        results: output?.results || {},
        formula_used: output?.formula || calcConfig.formula
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save to cloud:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await calculatorApi.toggleFavorite({
        calculator_id: calcConfig.id,
        calculator_name: calcConfig.name,
        category: calcConfig.category
      });
      if (res.data.success) {
        setIsFavorite(res.data.is_favorite);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const isLocked = calcConfig.isPremium && !hasPremium;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border transition-colors ${isFavorite ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' : 'bg-white dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-600 text-charcoal-400 hover:text-charcoal-700'}`}
              title="Add to Favorites"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          <button
            onClick={handleCopyResult}
            disabled={!output?.results}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold text-charcoal-600 dark:text-cream-200 hover:text-charcoal-900 transition-colors shadow-soft"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          {hasPremium && (
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-soft transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Explanation</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Info Card */}
      <div className="bg-white dark:bg-charcoal-800 p-6 sm:p-7 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 dark:text-white tracking-tight">
              {calcConfig.name}
            </h1>
            {calcConfig.isPremium ? (
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase">
                PRO PREMIUM
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 uppercase font-bold">
                FREE BASIC
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-charcoal-600 dark:text-charcoal-200 max-w-2xl leading-relaxed">
            {calcConfig.description}
          </p>
        </div>

        <div className="text-xs text-charcoal-700 dark:text-cream-100 font-mono bg-cream-100 dark:bg-charcoal-900 px-3 py-2 rounded-xl border border-cream-300 dark:border-charcoal-700 self-start md:self-auto font-semibold">
          Formula: <span className="text-orange-600 dark:text-orange-400 font-bold">{calcConfig.formula}</span>
        </div>
      </div>

      {/* LOCKED PREMIUM GATE BANNER */}
      {isLocked ? (
        <div className="bg-white dark:bg-charcoal-800 p-10 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal-700 dark:text-cream-100">
              CalcMaster Pro Feature
            </h3>
            <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-1 max-w-md mx-auto leading-relaxed">
              Unlock all 40+ advanced mathematical equations, complete loan amortization, unlimited cloud history, and step-by-step AI insights.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onOpenPayment?.('starter')}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
            >
              Unlock All Premium Tools (from ₹9)
            </button>
          </div>
        </div>
      ) : (
        /* WORKSPACE INTERACTION GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-3">
                Input Parameters
              </h2>

              {/* Dynamic Inputs */}
              {id === 'percentage' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Calculation Type</label>
                    <select
                      value={inputs.type || 'of'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    >
                      <option value="of">What is X% of Y?</option>
                      <option value="is_what">X is what percentage of Y?</option>
                      <option value="change">Percentage change from X to Y</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">
                        {inputs.type === 'change' ? 'Old Value (X)' : 'Value X'}
                      </label>
                      <input
                        type="number"
                        value={inputs.val1 || ''}
                        onChange={(e) => handleInputChange('val1', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">
                        {inputs.type === 'change' ? 'New Value (Y)' : 'Value Y'}
                      </label>
                      <input
                        type="number"
                        value={inputs.val2 || ''}
                        onChange={(e) => handleInputChange('val2', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {id === 'discount' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={inputs.originalPrice || ''}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={inputs.discountPct || ''}
                        onChange={(e) => handleInputChange('discountPct', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tax / GST % (Optional)</label>
                      <input
                        type="number"
                        value={inputs.taxPct || ''}
                        onChange={(e) => handleInputChange('taxPct', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {id === 'emi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Principal Loan Amount (₹)</label>
                    <input
                      type="number"
                      value={inputs.principal || ''}
                      onChange={(e) => handleInputChange('principal', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-sm font-bold focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={inputs.rate || ''}
                        onChange={(e) => handleInputChange('rate', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tenure (Years)</label>
                      <input
                        type="number"
                        value={inputs.tenure || ''}
                        onChange={(e) => handleInputChange('tenure', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {id === 'sip' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Monthly Deposit Amount (₹)</label>
                    <input
                      type="number"
                      value={inputs.monthlyInvestment || ''}
                      onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-sm font-bold focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Expected Annual Return (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={inputs.annualReturn || ''}
                        onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Investment Period (Years)</label>
                      <input
                        type="number"
                        value={inputs.tenureYears || ''}
                        onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {id === 'quadratic-equation' && (
                <div className="space-y-4">
                  <p className="text-xs text-charcoal-400">Standard quadratic form: <span className="font-mono text-charcoal-700 dark:text-cream-100 font-bold">ax² + bx + c = 0</span></p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Coefficient a</label>
                      <input
                        type="number"
                        value={inputs.a || ''}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Coefficient b</label>
                      <input
                        type="number"
                        value={inputs.b || ''}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Constant c</label>
                      <input
                        type="number"
                        value={inputs.c || ''}
                        onChange={(e) => handleInputChange('c', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {id === 'bmi' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={inputs.weight || ''}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={inputs.height || ''}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {id === 'gst' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Invoice Amount (₹)</label>
                    <input
                      type="number"
                      value={inputs.amount || ''}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-sm font-bold focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Standard GST Slab</label>
                      <select
                        value={inputs.rate || '18'}
                        onChange={(e) => handleInputChange('rate', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      >
                        <option value="5">5% (Essential Goods)</option>
                        <option value="12">12% (Standard I)</option>
                        <option value="18">18% (Standard II - Services)</option>
                        <option value="28">28% (Luxury & Vehicles)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tax Calculation</label>
                      <select
                        value={inputs.type || 'exclusive'}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                      >
                        <option value="exclusive">Exclusive (Add GST)</option>
                        <option value="inclusive">Inclusive (Remove GST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {id === 'age' && (
                <div>
                  <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={inputs.birthDate || ''}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Standard Calculator Keypad */}
              {id === 'standard' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 font-mono text-right text-2xl text-charcoal-700 dark:text-cream-100 overflow-x-auto">
                    {standardTape}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
                      <button
                        key={btn}
                        onClick={() => {
                          if (btn === 'C') setStandardTape('0');
                          else if (btn === '=') {
                            try {
                              const safeExpr = standardTape.replace(/×/g, '*').replace(/÷/g, '/');
                              const res = Function(`"use strict"; return (${safeExpr})`)();
                              setStandardTape(String(res));
                            } catch {
                              setStandardTape('Error');
                            }
                          } else {
                            setStandardTape(prev => prev === '0' ? btn : prev + btn);
                          }
                        }}
                        className={`p-3.5 rounded-xl text-sm font-bold transition-all shadow-soft ${
                          btn === '=' 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white col-span-2' 
                            : ['÷', '×', '-', '+'].includes(btn)
                              ? 'bg-cream-200 dark:bg-charcoal-700 text-orange-600 hover:bg-cream-300' 
                              : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-cream-100 border border-cream-300 dark:border-charcoal-600 hover:bg-cream-100'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cloud Save Action */}
              {isAuthenticated && (
                <div className="pt-2">
                  <button
                    onClick={handleSaveToCloud}
                    className="w-full py-2.5 rounded-xl bg-cream-200 dark:bg-charcoal-700 hover:bg-cream-300 dark:hover:bg-charcoal-600 text-xs font-semibold text-charcoal-700 dark:text-cream-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-orange-600" />
                    <span>{savedSuccess ? 'Saved to Your Cloud History!' : 'Save Calculation to History'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-3">
                Calculated Outcome
              </h2>

              {output?.error ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{output.error}</span>
                </div>
              ) : output?.results ? (
                <div className="space-y-4">
                  {/* Results Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(output.results).map(([key, val], idx) => (
                      <div 
                        key={key} 
                        className={`p-4 rounded-2xl border ${
                          idx === 0 
                            ? 'bg-orange-50/70 dark:bg-charcoal-900 border-orange-500/40 sm:col-span-2 shadow-soft' 
                            : 'bg-cream-100/80 dark:bg-charcoal-850 border-cream-300 dark:border-charcoal-700'
                        }`}
                      >
                        <span className="text-[11px] text-charcoal-400 font-semibold uppercase tracking-wider">{key}</span>
                        <p className={`text-xl font-black mt-1 ${idx === 0 ? 'text-orange-600 dark:text-orange-400 text-2xl' : 'text-charcoal-700 dark:text-cream-100'}`}>
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Formula and Step Details */}
                  {output.steps && output.steps.length > 0 && (
                    <div className="p-4 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 space-y-2">
                      <span className="text-[11px] font-bold text-charcoal-500 dark:text-charcoal-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-orange-600" />
                        Step-by-Step Logic
                      </span>
                      <ul className="space-y-1.5 text-xs text-charcoal-600 dark:text-charcoal-300 pl-4 list-disc">
                        {output.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer for Financial & Health */}
                  {(['emi', 'sip', 'gst', 'income-tax', 'bmi'].includes(id)) && (
                    <div className="p-3 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-[11px] text-charcoal-400 leading-relaxed">
                      <strong>Disclaimer:</strong> Outputs are mathematical estimations based on inputs provided. Taxes, compounding conventions, and individual health parameters may vary.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-charcoal-400">
                  Enter parameters above to generate live results.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* AI Explanation Modal */}
      <AIExplanationModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        calculatorName={calcConfig.name}
        inputs={inputs}
        results={output?.results || {}}
        formula={output?.formula || calcConfig.formula}
      />

    </div>
  );
}
