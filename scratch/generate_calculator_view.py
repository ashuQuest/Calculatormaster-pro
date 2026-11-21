# Script to generate frontend/src/pages/CalculatorView.jsx
import os

calculator_view_code = '''import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Calculator, Copy, Check, Sparkles, Star, Bookmark, 
  ArrowLeft, Lock, AlertCircle, Info, RefreshCw, BookOpen, ExternalLink 
} from 'lucide-react';
import { CALCULATORS_CATALOG } from '../calculators/registry';
import { calculateResult } from '../calculators/engine';
import { useAuth } from '../context/AuthContext';
import { calculatorApi } from '../services/api';
import AIExplanationModal from '../components/common/AIExplanationModal';
import StandardCalculator from '../components/calculator/StandardCalculator';

const CALCULATOR_TO_FORMULA_MAP = {
  'percentage': 'percentage-change',
  'average': 'arithmetic-mean',
  'quadratic-equation': 'quadratic-formula',
  'compound-interest': 'compound-interest-formula',
  'trigonometry': 'law-of-cosines',
  'calculus-helper': 'simpsons-one-third-rule',
  'statistics': 'bayes-theorem',
  'matrix': 'determinant-2x2',
  'electricity-bill': 'ohms-law',
  'unit-temperature': 'ideal-gas-law',
  'logarithm': 'shannon-entropy',
  'degree-radian': 'fourier-transform',
  'standard': 'newtons-second-law',
  'square-root': 'pythagorean-theorem',
  'exponent-power': 'kinetic-energy'
};

export default function CalculatorView({ onOpenPayment }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, hasPremium } = useAuth();

  const calcConfig = CALCULATORS_CATALOG.find(c => c.id === id) || CALCULATORS_CATALOG[0];
  const linkedFormulaSlug = CALCULATOR_TO_FORMULA_MAP[id];

  // Calculator Form State
  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Initialize default inputs based on calculator ID & URL query parameters
  useEffect(() => {
    let defaults = {};
    
    // 1. Basic
    if (id === 'percentage') defaults = { type: 'of', val1: '15', val2: '250' };
    else if (id === 'discount') defaults = { originalPrice: '1999', discountPct: '20', taxPct: '18' };
    else if (id === 'fraction') defaults = { n1: '3', d1: '4', op: '+', n2: '2', d2: '5' };
    else if (id === 'ratio') defaults = { a: '1920', b: '1080', c: '1280', d: '' };
    else if (id === 'square-root') defaults = { x: '144' };
    else if (id === 'cube-root') defaults = { x: '729' };
    else if (id === 'average') defaults = { numbers: '45, 82, 91, 63, 77, 88' };
    else if (id === 'lcm-hcf') defaults = { a: '24', b: '36' };
    
    // 2. Scientific
    else if (id === 'scientific') defaults = { val: '45', func: 'sin', mode: 'deg' };
    else if (id === 'trigonometry') defaults = { angle: '45', unit: 'DEG' };
    else if (id === 'logarithm') defaults = { val: '1000', base: '10' };
    else if (id === 'factorial') defaults = { n: '8', r: '3' };
    else if (id === 'exponent-power') defaults = { base: '2', exponent: '8' };
    else if (id === 'degree-radian') defaults = { value: '45', fromUnit: 'deg' };
    else if (id === 'scientific-evaluator') defaults = { expression: '2 * sin(pi / 4) + sqrt(16)' };
    
    // 3. Mathematical
    else if (id === 'linear-equation') defaults = { a: '4', b: '12', c: '36' };
    else if (id === 'quadratic-equation') defaults = { a: '1', b: '-5', c: '6' };
    else if (id === 'matrix') defaults = { m00: '4', m01: '7', m10: '2', m11: '6' };
    else if (id === 'statistics') defaults = { dataset: '12, 18, 24, 30, 36, 42, 48' };
    else if (id === 'calculus-helper') defaults = { func: 'x^2 + 3*x - 5', x0: '2', a: '0', b: '4' };
    
    // 4. Financial
    else if (id === 'emi') defaults = { principal: '2500000', rate: '8.5', tenure: '20' };
    else if (id === 'sip') defaults = { monthlyInvestment: '5000', annualReturn: '12', tenureYears: '15' };
    else if (id === 'compound-interest') defaults = { principal: '100000', rate: '7.5', time: '5', frequency: '4' };
    else if (id === 'simple-interest') defaults = { principal: '50000', rate: '6', time: '3' };
    else if (id === 'gst') defaults = { amount: '10000', rate: '18', type: 'exclusive' };
    else if (id === 'cagr') defaults = { beginVal: '50000', endVal: '185000', years: '5' };
    else if (id === 'fd') defaults = { principal: '100000', rate: '7.0', tenure: '5', frequency: '4' };
    else if (id === 'rd') defaults = { monthlyDeposit: '5000', rate: '7.1', tenureMonths: '36' };
    else if (id === 'loan-amortization') defaults = { loanAmount: '2000000', rate: '8.5', tenureYears: '15', extraMonthly: '5000' };
    else if (id === 'income-tax') defaults = { grossIncome: '1200000', regime: 'new', deductions80c: '150000', hra: '0', otherDeductions: '50000' };
    else if (id === 'inflation') defaults = { amount: '100000', rate: '6.0', years: '10' };
    
    // 5. Business
    else if (id === 'profit-loss') defaults = { costPrice: '500', sellingPrice: '650', quantity: '10' };
    else if (id === 'profit-margin') defaults = { cost: '400', revenue: '600' };
    else if (id === 'break-even') defaults = { fixedCosts: '50000', variableCostPerUnit: '120', sellingPricePerUnit: '200' };
    else if (id === 'sales-commission') defaults = { salesAmount: '250000', baseSalary: '25000', commissionRate: '5.0', targetQuota: '200000', bonusRate: '2.5' };
    
    // 6. Converters
    else if (id === 'unit-length') defaults = { value: '100', fromUnit: 'm', toUnit: 'km' };
    else if (id === 'unit-weight') defaults = { value: '75', fromUnit: 'kg', toUnit: 'lb' };
    else if (id === 'unit-temperature') defaults = { value: '25', fromUnit: 'celsius', toUnit: 'fahrenheit' };
    else if (id === 'unit-area') defaults = { value: '1000', fromUnit: 'sqm', toUnit: 'sqft' };
    else if (id === 'unit-storage') defaults = { value: '500', fromUnit: 'GB', toUnit: 'MB' };
    
    // 7. Date & Time
    else if (id === 'age') defaults = { birthDate: '2000-01-15' };
    else if (id === 'date-difference') defaults = { startDate: '2024-01-01', endDate: '2024-12-31', includeEndDay: false };
    else if (id === 'working-days') defaults = { startDate: '2024-01-01', endDate: '2024-03-31', weekendMode: 'sat_sun', holidays: '3' };
    
    // 8. Daily Life
    else if (id === 'bmi') defaults = { weight: '68', height: '175' };
    else if (id === 'bmr-calories') defaults = { age: '28', gender: 'male', weight: '72', height: '175', activity: 'moderate', goal: 'maintain' };
    else if (id === 'electricity-bill') defaults = { watts: '1500', hours: '6', rate: '8' };
    else if (id === 'fuel-mileage') defaults = { distance: '450', fuelUsed: '30', fuelPrice: '96.5' };
    else if (id === 'salary-take-home') defaults = { grossSalary: '85000', basicSalaryPct: '50', pfPct: '12', profTax: '200', estimatedAnnualTax: '45000' };

    // Override with URL query params if provided (e.g. from Formula page)
    searchParams.forEach((val, key) => {
      if (key !== 'fromFormula') {
        defaults[key] = val;
      }
    });

    setInputs(defaults);
    const computed = calculateResult(id, defaults);
    setOutput(computed);
  }, [id, searchParams]);

  const handleInputChange = (field, val) => {
    const updated = { ...inputs, [field]: val };
    setInputs(updated);
    const res = calculateResult(id, updated);
    setOutput(res);
  };

  const handleCopyResult = () => {
    if (output?.results) {
      const summary = Object.entries(output.results).map(([k, v]) => `${k}: ${v}`).join('\\n');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/calculators/${calcConfig.category}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {calcConfig.category.toUpperCase()}</span>
        </Link>

        <div className="flex items-center gap-2">
          {linkedFormulaSlug && (
            <Link
              to={`/formula/${linkedFormulaSlug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-charcoal-800 border border-orange-200 dark:border-charcoal-600 text-xs font-bold text-orange-700 dark:text-orange-400 hover:bg-orange-100 transition-colors shadow-soft"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Formula & Theory</span>
            </Link>
          )}

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
            
            {/* Standard Desktop Calculator Render */}
            {id === 'standard' ? (
              <StandardCalculator
                onSaveToCloud={handleSaveToCloud}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-300 dark:border-charcoal-700 pb-3">
                  Input Parameters
                </h2>

                {/* 1. BASIC CALCULATORS */}
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

                {id === 'fraction' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2 items-center text-center">
                      <div className="col-span-2 space-y-2">
                        <input
                          type="number"
                          placeholder="Num 1"
                          value={inputs.n1 || ''}
                          onChange={(e) => handleInputChange('n1', e.target.value)}
                          className="w-full text-center px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                        <div className="h-0.5 bg-charcoal-300 dark:bg-charcoal-600 w-full" />
                        <input
                          type="number"
                          placeholder="Den 1"
                          value={inputs.d1 || ''}
                          onChange={(e) => handleInputChange('d1', e.target.value)}
                          className="w-full text-center px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div className="col-span-1">
                        <select
                          value={inputs.op || '+'}
                          onChange={(e) => handleInputChange('op', e.target.value)}
                          className="w-full p-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-bold text-center"
                        >
                          <option value="+">+</option>
                          <option value="-">-</option>
                          <option value="×">×</option>
                          <option value="÷">÷</option>
                        </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <input
                          type="number"
                          placeholder="Num 2"
                          value={inputs.n2 || ''}
                          onChange={(e) => handleInputChange('n2', e.target.value)}
                          className="w-full text-center px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                        <div className="h-0.5 bg-charcoal-300 dark:bg-charcoal-600 w-full" />
                        <input
                          type="number"
                          placeholder="Den 2"
                          value={inputs.d2 || ''}
                          onChange={(e) => handleInputChange('d2', e.target.value)}
                          className="w-full text-center px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'ratio' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-charcoal-500">Solve proportion A : B = C : D (leave one blank to solve):</p>
                    <div className="grid grid-cols-4 gap-2 items-center text-center font-bold">
                      <input
                        type="number"
                        placeholder="A"
                        value={inputs.a || ''}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="B"
                        value={inputs.b || ''}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="C"
                        value={inputs.c || ''}
                        onChange={(e) => handleInputChange('c', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="D"
                        value={inputs.d || ''}
                        onChange={(e) => handleInputChange('d', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                    </div>
                  </div>
                )}

                {(id === 'square-root' || id === 'cube-root') && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200">
                      Enter Number (x)
                    </label>
                    <input
                      type="number"
                      value={inputs.x || ''}
                      onChange={(e) => handleInputChange('x', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                )}

                {id === 'average' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200">
                      Enter Numbers (comma or space separated)
                    </label>
                    <textarea
                      rows={3}
                      value={inputs.numbers || ''}
                      onChange={(e) => handleInputChange('numbers', e.target.value)}
                      placeholder="e.g. 10, 25, 30, 45, 60"
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                )}

                {id === 'lcm-hcf' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Number A</label>
                      <input
                        type="number"
                        value={inputs.a || ''}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Number B</label>
                      <input
                        type="number"
                        value={inputs.b || ''}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 2. SCIENTIFIC */}
                {id === 'scientific' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Function</label>
                        <select
                          value={inputs.func || 'sin'}
                          onChange={(e) => handleInputChange('func', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="sin">sin(x)</option>
                          <option value="cos">cos(x)</option>
                          <option value="tan">tan(x)</option>
                          <option value="asin">asin(x)</option>
                          <option value="acos">acos(x)</option>
                          <option value="atan">atan(x)</option>
                          <option value="log">log10(x)</option>
                          <option value="ln">ln(x)</option>
                          <option value="sqrt">sqrt(x)</option>
                          <option value="sqr">x²</option>
                          <option value="inv">1/x</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Angular Mode</label>
                        <select
                          value={inputs.mode || 'deg'}
                          onChange={(e) => handleInputChange('mode', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="deg">Degrees (°)</option>
                          <option value="rad">Radians</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Input Value (x)</label>
                      <input
                        type="number"
                        value={inputs.val || ''}
                        onChange={(e) => handleInputChange('val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'trigonometry' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Angle Value</label>
                      <input
                        type="number"
                        value={inputs.angle || ''}
                        onChange={(e) => handleInputChange('angle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Unit</label>
                      <select
                        value={inputs.unit || 'DEG'}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      >
                        <option value="DEG">Degrees (°)</option>
                        <option value="RAD">Radians</option>
                      </select>
                    </div>
                  </div>
                )}

                {id === 'logarithm' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Argument (x &gt; 0)</label>
                      <input
                        type="number"
                        value={inputs.val || ''}
                        onChange={(e) => handleInputChange('val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Log Base (b)</label>
                      <input
                        type="number"
                        value={inputs.base || ''}
                        onChange={(e) => handleInputChange('base', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'factorial' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Items (n)</label>
                      <input
                        type="number"
                        value={inputs.n || ''}
                        onChange={(e) => handleInputChange('n', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Selected Items (r)</label>
                      <input
                        type="number"
                        value={inputs.r || ''}
                        onChange={(e) => handleInputChange('r', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'exponent-power' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Base (x)</label>
                      <input
                        type="number"
                        value={inputs.base || ''}
                        onChange={(e) => handleInputChange('base', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Exponent (y)</label>
                      <input
                        type="number"
                        value={inputs.exponent || ''}
                        onChange={(e) => handleInputChange('exponent', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'degree-radian' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Angle Value</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Input Unit</label>
                      <select
                        value={inputs.fromUnit || 'deg'}
                        onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      >
                        <option value="deg">Degrees (°)</option>
                        <option value="rad">Radians (rad)</option>
                        <option value="grad">Gradians (grad)</option>
                      </select>
                    </div>
                  </div>
                )}

                {id === 'scientific-evaluator' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200">
                      Expression (e.g. 2 * sin(pi / 4) + sqrt(16))
                    </label>
                    <input
                      type="text"
                      value={inputs.expression || ''}
                      onChange={(e) => handleInputChange('expression', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-mono"
                    />
                  </div>
                )}

                {/* 3. MATHEMATICAL */}
                {id === 'linear-equation' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-charcoal-500 font-mono">Solve: ax + b = c</p>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="a"
                        value={inputs.a || ''}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="b"
                        value={inputs.b || ''}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="c"
                        value={inputs.c || ''}
                        onChange={(e) => handleInputChange('c', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                    </div>
                  </div>
                )}

                {id === 'quadratic-equation' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-charcoal-500 font-mono">Solve: ax² + bx + c = 0</p>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="a"
                        value={inputs.a || ''}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="b"
                        value={inputs.b || ''}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="c"
                        value={inputs.c || ''}
                        onChange={(e) => handleInputChange('c', e.target.value)}
                        className="px-2 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                    </div>
                  </div>
                )}

                {id === 'matrix' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-charcoal-500">2×2 Matrix Coordinates:</p>
                    <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto text-center font-bold">
                      <input
                        type="number"
                        placeholder="a11"
                        value={inputs.m00 || ''}
                        onChange={(e) => handleInputChange('m00', e.target.value)}
                        className="p-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="a12"
                        value={inputs.m01 || ''}
                        onChange={(e) => handleInputChange('m01', e.target.value)}
                        className="p-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="a21"
                        value={inputs.m10 || ''}
                        onChange={(e) => handleInputChange('m10', e.target.value)}
                        className="p-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="a22"
                        value={inputs.m11 || ''}
                        onChange={(e) => handleInputChange('m11', e.target.value)}
                        className="p-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs text-center"
                      />
                    </div>
                  </div>
                )}

                {id === 'statistics' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200">
                      Dataset Observations (comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={inputs.dataset || ''}
                      onChange={(e) => handleInputChange('dataset', e.target.value)}
                      placeholder="e.g. 12, 18, 24, 30, 36, 42, 48"
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-mono"
                    />
                  </div>
                )}

                {id === 'calculus-helper' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">
                        Function f(x)
                      </label>
                      <input
                        type="text"
                        value={inputs.func || ''}
                        onChange={(e) => handleInputChange('func', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Derivative point (x0)</label>
                        <input
                          type="number"
                          value={inputs.x0 || ''}
                          onChange={(e) => handleInputChange('x0', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Integral lower (a)</label>
                        <input
                          type="number"
                          value={inputs.a || ''}
                          onChange={(e) => handleInputChange('a', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Integral upper (b)</label>
                        <input
                          type="number"
                          value={inputs.b || ''}
                          onChange={(e) => handleInputChange('b', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FINANCIAL */}
                {id === 'emi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Principal Loan Amount (₹)</label>
                      <input
                        type="number"
                        value={inputs.principal || ''}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Interest Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tenure (Years)</label>
                        <input
                          type="number"
                          value={inputs.tenure || ''}
                          onChange={(e) => handleInputChange('tenure', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'sip' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Monthly Investment (₹)</label>
                      <input
                        type="number"
                        value={inputs.monthlyInvestment || ''}
                        onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Expected Return (% p.a.)</label>
                        <input
                          type="number"
                          value={inputs.annualReturn || ''}
                          onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tenure (Years)</label>
                        <input
                          type="number"
                          value={inputs.tenureYears || ''}
                          onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'compound-interest' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Principal Capital (₹)</label>
                      <input
                        type="number"
                        value={inputs.principal || ''}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Rate (%)</label>
                        <input
                          type="number"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Time (Yrs)</label>
                        <input
                          type="number"
                          value={inputs.time || ''}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Frequency</label>
                        <select
                          value={inputs.frequency || '4'}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="1">Annual (1/yr)</option>
                          <option value="2">Half-Yr (2/yr)</option>
                          <option value="4">Quarterly (4/yr)</option>
                          <option value="12">Monthly (12/yr)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'simple-interest' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Principal (₹)</label>
                      <input
                        type="number"
                        value={inputs.principal || ''}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Rate (%)</label>
                        <input
                          type="number"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Time (Years)</label>
                        <input
                          type="number"
                          value={inputs.time || ''}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'gst' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Base Amount (₹)</label>
                        <input
                          type="number"
                          value={inputs.amount || ''}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">GST Slab Rate (%)</label>
                        <select
                          value={inputs.rate || '18'}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="5">5% (Essential)</option>
                          <option value="12">12% (Standard I)</option>
                          <option value="18">18% (Standard II)</option>
                          <option value="28">28% (Luxury)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Pricing Mode</label>
                      <select
                        value={inputs.type || 'exclusive'}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      >
                        <option value="exclusive">GST Exclusive (Add tax to base price)</option>
                        <option value="inclusive">GST Inclusive (Extract tax from total price)</option>
                      </select>
                    </div>
                  </div>
                )}

                {id === 'cagr' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-charcoal-500 mb-1">Start Value (₹)</label>
                      <input
                        type="number"
                        value={inputs.beginVal || ''}
                        onChange={(e) => handleInputChange('beginVal', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-charcoal-500 mb-1">End Value (₹)</label>
                      <input
                        type="number"
                        value={inputs.endVal || ''}
                        onChange={(e) => handleInputChange('endVal', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-charcoal-500 mb-1">Period (Years)</label>
                      <input
                        type="number"
                        value={inputs.years || ''}
                        onChange={(e) => handleInputChange('years', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'fd' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Deposit Principal (₹)</label>
                      <input
                        type="number"
                        value={inputs.principal || ''}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Interest % p.a.</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Tenure (Years)</label>
                        <input
                          type="number"
                          value={inputs.tenure || ''}
                          onChange={(e) => handleInputChange('tenure', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Compounding</label>
                        <select
                          value={inputs.frequency || '4'}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="4">Quarterly</option>
                          <option value="12">Monthly</option>
                          <option value="2">Half-Yearly</option>
                          <option value="1">Annually</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'rd' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Monthly Deposit (₹)</label>
                      <input
                        type="number"
                        value={inputs.monthlyDeposit || ''}
                        onChange={(e) => handleInputChange('monthlyDeposit', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tenure (Months)</label>
                        <input
                          type="number"
                          value={inputs.tenureMonths || ''}
                          onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'loan-amortization' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Loan Amount (₹)</label>
                      <input
                        type="number"
                        value={inputs.loanAmount || ''}
                        onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Interest Rate %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Tenure (Yrs)</label>
                        <input
                          type="number"
                          value={inputs.tenureYears || ''}
                          onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Extra Monthly ₹</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={inputs.extraMonthly || ''}
                          onChange={(e) => handleInputChange('extraMonthly', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'income-tax' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Gross Salary / Income (₹)</label>
                      <input
                        type="number"
                        value={inputs.grossIncome || ''}
                        onChange={(e) => handleInputChange('grossIncome', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Tax Regime</label>
                        <select
                          value={inputs.regime || 'new'}
                          onChange={(e) => handleInputChange('regime', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="new">New Tax Regime (Default)</option>
                          <option value="old">Old Tax Regime (With 80C/HRA)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">80C Investments (₹)</label>
                        <input
                          type="number"
                          disabled={inputs.regime === 'new'}
                          value={inputs.deductions80c || ''}
                          onChange={(e) => handleInputChange('deductions80c', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'inflation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Present Value / Target Cost (₹)</label>
                      <input
                        type="number"
                        value={inputs.amount || ''}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Inflation Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Time Period (Years)</label>
                        <input
                          type="number"
                          value={inputs.years || ''}
                          onChange={(e) => handleInputChange('years', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. BUSINESS & COMMERCE */}
                {id === 'profit-loss' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Cost Price per Unit (₹)</label>
                        <input
                          type="number"
                          value={inputs.costPrice || ''}
                          onChange={(e) => handleInputChange('costPrice', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Selling Price per Unit (₹)</label>
                        <input
                          type="number"
                          value={inputs.sellingPrice || ''}
                          onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Quantity Sold</label>
                      <input
                        type="number"
                        value={inputs.quantity || ''}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'profit-margin' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Cost (₹)</label>
                      <input
                        type="number"
                        value={inputs.cost || ''}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Revenue / SP (₹)</label>
                      <input
                        type="number"
                        value={inputs.revenue || ''}
                        onChange={(e) => handleInputChange('revenue', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'break-even' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Fixed Costs (₹)</label>
                      <input
                        type="number"
                        value={inputs.fixedCosts || ''}
                        onChange={(e) => handleInputChange('fixedCosts', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Variable Cost/Unit (₹)</label>
                        <input
                          type="number"
                          value={inputs.variableCostPerUnit || ''}
                          onChange={(e) => handleInputChange('variableCostPerUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Selling Price/Unit (₹)</label>
                        <input
                          type="number"
                          value={inputs.sellingPricePerUnit || ''}
                          onChange={(e) => handleInputChange('sellingPricePerUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'sales-commission' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Total Sales Achieved (₹)</label>
                        <input
                          type="number"
                          value={inputs.salesAmount || ''}
                          onChange={(e) => handleInputChange('salesAmount', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Base Salary (₹)</label>
                        <input
                          type="number"
                          value={inputs.baseSalary || ''}
                          onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Commission %</label>
                        <input
                          type="number"
                          value={inputs.commissionRate || ''}
                          onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Quota Target (₹)</label>
                        <input
                          type="number"
                          value={inputs.targetQuota || ''}
                          onChange={(e) => handleInputChange('targetQuota', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-charcoal-500 mb-1">Bonus Rate %</label>
                        <input
                          type="number"
                          value={inputs.bonusRate || ''}
                          onChange={(e) => handleInputChange('bonusRate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. UNIT CONVERTERS */}
                {id === 'unit-length' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Value</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">From Unit</label>
                        <select
                          value={inputs.fromUnit || 'm'}
                          onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="m">Meters (m)</option>
                          <option value="km">Kilometers (km)</option>
                          <option value="cm">Centimeters (cm)</option>
                          <option value="mm">Millimeters (mm)</option>
                          <option value="foot">Feet (ft)</option>
                          <option value="inch">Inches (in)</option>
                          <option value="yard">Yards (yd)</option>
                          <option value="mile">Miles (mi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">To Unit</label>
                        <select
                          value={inputs.toUnit || 'km'}
                          onChange={(e) => handleInputChange('toUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="km">Kilometers (km)</option>
                          <option value="m">Meters (m)</option>
                          <option value="cm">Centimeters (cm)</option>
                          <option value="mm">Millimeters (mm)</option>
                          <option value="foot">Feet (ft)</option>
                          <option value="inch">Inches (in)</option>
                          <option value="yard">Yards (yd)</option>
                          <option value="mile">Miles (mi)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'unit-weight' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Value</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">From Unit</label>
                        <select
                          value={inputs.fromUnit || 'kg'}
                          onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="mg">Milligrams (mg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="oz">Ounces (oz)</option>
                          <option value="ton">Metric Ton</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">To Unit</label>
                        <select
                          value={inputs.toUnit || 'lb'}
                          onChange={(e) => handleInputChange('toUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="lb">Pounds (lb)</option>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="oz">Ounces (oz)</option>
                          <option value="ton">Metric Ton</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'unit-temperature' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Value</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">From</label>
                        <select
                          value={inputs.fromUnit || 'celsius'}
                          onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="celsius">Celsius (°C)</option>
                          <option value="fahrenheit">Fahrenheit (°F)</option>
                          <option value="kelvin">Kelvin (K)</option>
                          <option value="rankine">Rankine (°R)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">To</label>
                        <select
                          value={inputs.toUnit || 'fahrenheit'}
                          onChange={(e) => handleInputChange('toUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="fahrenheit">Fahrenheit (°F)</option>
                          <option value="celsius">Celsius (°C)</option>
                          <option value="kelvin">Kelvin (K)</option>
                          <option value="rankine">Rankine (°R)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'unit-area' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Area Value</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">From Unit</label>
                        <select
                          value={inputs.fromUnit || 'sqm'}
                          onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="sqm">Square Meters (m²)</option>
                          <option value="sqft">Square Feet (sq ft)</option>
                          <option value="acre">Acres</option>
                          <option value="hectare">Hectares</option>
                          <option value="sqkm">Square Kilometers</option>
                          <option value="sqyd">Square Yards</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">To Unit</label>
                        <select
                          value={inputs.toUnit || 'sqft'}
                          onChange={(e) => handleInputChange('toUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="sqft">Square Feet (sq ft)</option>
                          <option value="sqm">Square Meters (m²)</option>
                          <option value="acre">Acres</option>
                          <option value="hectare">Hectares</option>
                          <option value="sqkm">Square Kilometers</option>
                          <option value="sqyd">Square Yards</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'unit-storage' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Storage Amount</label>
                      <input
                        type="number"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">From Unit</label>
                        <select
                          value={inputs.fromUnit || 'GB'}
                          onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="B">Bytes (B)</option>
                          <option value="KB">Kilobytes (KB)</option>
                          <option value="MB">Megabytes (MB)</option>
                          <option value="GB">Gigabytes (GB)</option>
                          <option value="TB">Terabytes (TB)</option>
                          <option value="PB">Petabytes (PB)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">To Unit</label>
                        <select
                          value={inputs.toUnit || 'MB'}
                          onChange={(e) => handleInputChange('toUnit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="MB">Megabytes (MB)</option>
                          <option value="GB">Gigabytes (GB)</option>
                          <option value="TB">Terabytes (TB)</option>
                          <option value="KB">Kilobytes (KB)</option>
                          <option value="B">Bytes (B)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. DATE & TIME */}
                {id === 'age' && (
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={inputs.birthDate || ''}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                )}

                {id === 'date-difference' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={inputs.startDate || ''}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">End Date</label>
                        <input
                          type="date"
                          value={inputs.endDate || ''}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-medium text-charcoal-600 dark:text-charcoal-300">
                      <input
                        type="checkbox"
                        checked={inputs.includeEndDay || false}
                        onChange={(e) => handleInputChange('includeEndDay', e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>Include end day in calculation (+1 day)</span>
                    </label>
                  </div>
                )}

                {id === 'working-days' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={inputs.startDate || ''}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">End Date</label>
                        <input
                          type="date"
                          value={inputs.endDate || ''}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Weekend Schedule</label>
                        <select
                          value={inputs.weekendMode || 'sat_sun'}
                          onChange={(e) => handleInputChange('weekendMode', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="sat_sun">Saturday & Sunday</option>
                          <option value="sun_only">Sunday Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Public Holidays</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={inputs.holidays || ''}
                          onChange={(e) => handleInputChange('holidays', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. DAILY LIFE & HEALTH */}
                {id === 'bmi' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={inputs.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={inputs.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                {id === 'bmr-calories' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Gender</label>
                        <select
                          value={inputs.gender || 'male'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Age (Years)</label>
                        <input
                          type="number"
                          value={inputs.age || ''}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={inputs.weight || ''}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={inputs.height || ''}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Activity Level</label>
                        <select
                          value={inputs.activity || 'moderate'}
                          onChange={(e) => handleInputChange('activity', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="sedentary">Sedentary (desk job)</option>
                          <option value="light">Lightly Active (1-3 days/wk)</option>
                          <option value="moderate">Moderately Active (3-5 days/wk)</option>
                          <option value="active">Very Active (6-7 days/wk)</option>
                          <option value="very_active">Extra Active (athlete)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Dietary Goal</label>
                        <select
                          value={inputs.goal || 'maintain'}
                          onChange={(e) => handleInputChange('goal', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        >
                          <option value="maintain">Maintain Weight</option>
                          <option value="mild_loss">Mild Fat Loss (-250 kcal)</option>
                          <option value="loss">Standard Fat Loss (-500 kcal)</option>
                          <option value="gain">Muscle Gain (+400 kcal)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'electricity-bill' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Appliance Power Rating (Watts)</label>
                      <input
                        type="number"
                        value={inputs.watts || ''}
                        onChange={(e) => handleInputChange('watts', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Usage Hours / Day</label>
                        <input
                          type="number"
                          value={inputs.hours || ''}
                          onChange={(e) => handleInputChange('hours', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Cost per Unit (₹/kWh)</label>
                        <input
                          type="number"
                          value={inputs.rate || ''}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'fuel-mileage' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Trip Distance (km)</label>
                      <input
                        type="number"
                        value={inputs.distance || ''}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Fuel Consumed (Liters)</label>
                        <input
                          type="number"
                          value={inputs.fuelUsed || ''}
                          onChange={(e) => handleInputChange('fuelUsed', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Fuel Price (₹ / Liter)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputs.fuelPrice || ''}
                          onChange={(e) => handleInputChange('fuelPrice', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'salary-take-home' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Gross Monthly Salary (₹)</label>
                      <input
                        type="number"
                        value={inputs.grossSalary || ''}
                        onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Basic Salary % of CTC</label>
                        <input
                          type="number"
                          value={inputs.basicSalaryPct || ''}
                          onChange={(e) => handleInputChange('basicSalaryPct', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Provident Fund (EPF %)</label>
                        <input
                          type="number"
                          value={inputs.pfPct || ''}
                          onChange={(e) => handleInputChange('pfPct', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Professional Tax (₹/mo)</label>
                        <input
                          type="number"
                          value={inputs.profTax || ''}
                          onChange={(e) => handleInputChange('profTax', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 dark:text-charcoal-200 mb-1">Annual Estimated Tax (₹)</label>
                        <input
                          type="number"
                          value={inputs.estimatedAnnualTax || ''}
                          onChange={(e) => handleInputChange('estimatedAnnualTax', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs"
                        />
                      </div>
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
            )}
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
                        <span className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-semibold uppercase tracking-wider">{key}</span>
                        <p className={`text-xl font-black mt-1 break-words ${idx === 0 ? 'text-orange-600 dark:text-orange-400 text-2xl' : 'text-charcoal-700 dark:text-cream-100'}`}>
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

                  {/* Formula Reference Link if available */}
                  {linkedFormulaSlug && (
                    <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-charcoal-900 border border-orange-200 dark:border-orange-800 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-bold text-orange-800 dark:text-orange-300">Need academic proof & variable breakdown?</span>
                        <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400">Read theoretical assumptions and derivations.</p>
                      </div>
                      <Link
                        to={`/formula/${linkedFormulaSlug}`}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-soft hover:bg-orange-700 transition-colors whitespace-nowrap"
                      >
                        Formula Guide ↗
                      </Link>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-charcoal-400 text-xs">
                  Fill in the input parameters to calculate results.
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
        results={output?.results}
      />

    </div>
  );
}
'''

with open('frontend/src/pages/CalculatorView.jsx', 'w', encoding='utf-8') as f:
    f.write(calculator_view_code)
print('Successfully generated CalculatorView.jsx!')
