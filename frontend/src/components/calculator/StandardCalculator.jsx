import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  History, RotateCcw, Copy, Check, Delete, CornerDownLeft, 
  Trash2, ArrowLeft, Plus, Minus, X, Divide, Percent, Equal 
} from 'lucide-react';

// Safe mathematical expression evaluator avoiding unsafe eval()
export function safeEvaluate(expr) {
  if (!expr || expr === 'Error' || expr.trim() === '') return { result: '0', error: null };
  
  try {
    // Normalize display symbols
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/,/g, '')
      .replace(/\s+/g, '');

    // Trim any trailing operators before calculating
    while (/[+\-*/.]$/.test(sanitized)) {
      sanitized = sanitized.slice(0, -1);
    }
    if (!sanitized) return { result: '0', error: null };

    // Check for division by zero before evaluation
    if (/\/0(?![.0-9])/.test(sanitized)) {
      return { result: 'Cannot divide by zero', error: 'Cannot divide by zero' };
    }

    // Handle percentages: e.g. X% -> (X/100)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Only allow safe mathematical characters
    if (!/^[0-9+\-*/(). ]+$/.test(sanitized)) {
      return { result: 'Error', error: 'Invalid characters in expression' };
    }

    // Tokenize and evaluate using Shunting-yard algorithm
    const tokens = tokenize(sanitized);
    const rpn = toRPN(tokens);
    const val = evaluateRPN(rpn);

    if (isNaN(val) || !isFinite(val)) {
      if (val === Infinity || val === -Infinity) {
        return { result: 'Cannot divide by zero', error: 'Division by zero' };
      }
      return { result: 'Error', error: 'Invalid calculation' };
    }

    // Precision formatting to avoid 0.1 + 0.2 = 0.30000000000000004
    const rounded = parseFloat(val.toPrecision(12));
    const finalResult = Number.isInteger(rounded) 
      ? rounded.toString() 
      : rounded.toString().replace(/(\.\d*?[1-9])0+$/, '$1');

    return { result: finalResult, error: null };
  } catch (err) {
    return { result: 'Error', error: err.message || 'Syntax error' };
  }
}

// Tokenizer for standard calculator
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'num', value: parseFloat(num) });
      continue;
    }
    if (ch === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'op' || tokens[tokens.length - 1].value === '(')) {
      // Unary negative
      i++;
      let num = '-';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      if (num === '-') {
        tokens.push({ type: 'num', value: -1 });
        tokens.push({ type: 'op', value: '*' });
      } else {
        tokens.push({ type: 'num', value: parseFloat(num) });
      }
      continue;
    }
    if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

// Shunting Yard Algorithm
function toRPN(tokens) {
  const output = [];
  const ops = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  for (const t of tokens) {
    if (t.type === 'num') {
      output.push(t);
    } else if (t.type === 'op') {
      while (
        ops.length &&
        ops[ops.length - 1].type === 'op' &&
        precedence[ops[ops.length - 1].value] >= precedence[t.value]
      ) {
        output.push(ops.pop());
      }
      ops.push(t);
    } else if (t.value === '(') {
      ops.push(t);
    } else if (t.value === ')') {
      while (ops.length && ops[ops.length - 1].value !== '(') {
        output.push(ops.pop());
      }
      if (ops.length && ops[ops.length - 1].value === '(') {
        ops.pop();
      }
    }
  }

  while (ops.length) {
    output.push(ops.pop());
  }
  return output;
}

// Evaluate Reverse Polish Notation
function evaluateRPN(rpn) {
  const stack = [];
  for (const t of rpn) {
    if (t.type === 'num') {
      stack.push(t.value);
    } else if (t.type === 'op') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return NaN;
      switch (t.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) return Infinity;
          stack.push(a / b);
          break;
        default: return NaN;
      }
    }
  }
  return stack.length === 1 ? stack[0] : NaN;
}

export default function StandardCalculator({ onSaveToCloud, isAuthenticated }) {
  const [tape, setTape] = useState('0');
  const [prevCalculation, setPrevCalculation] = useState('');
  const [history, setHistory] = useState([
    { expr: '120 × 25', res: '3000', timestamp: 'Example' }
  ]);
  const [memory, setMemory] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const containerRef = useRef(null);

  // Check if string ends with an operator (+, -, ×, ÷)
  const endsWithOperator = (str) => /[+\-×÷*/]\s*$/.test(str);

  // Input Digit
  const inputDigit = useCallback((digit) => {
    setTape(prev => {
      // If calculation was just evaluated and user types a digit, start a clean calculation
      if (justEvaluated || prev === '0' || prev === 'Error' || prev === 'Cannot divide by zero') {
        setJustEvaluated(false);
        return digit;
      }
      return prev + digit;
    });
  }, [justEvaluated]);

  // Input Operator - CRITICAL RULE: TWO OPERATORS CAN NEVER BE CONSECUTIVE!
  // If the previous character is already an operator, REPLACE IT!
  const inputOperator = useCallback((op) => {
    setJustEvaluated(false);
    setTape(prev => {
      if (prev === 'Error' || prev === 'Cannot divide by zero') {
        return '0 ' + op + ' ';
      }
      const trimmed = prev.trim();
      
      // If expression already ends with an operator, replace it immediately
      if (/[+\-×÷*/]$/.test(trimmed)) {
        return trimmed.slice(0, -1).trim() + ' ' + op + ' ';
      }
      
      return trimmed + ' ' + op + ' ';
    });
  }, []);

  // Input Decimal Point
  const inputDecimal = useCallback(() => {
    setTape(prev => {
      if (justEvaluated || prev === 'Error' || prev === 'Cannot divide by zero') {
        setJustEvaluated(false);
        return '0.';
      }
      // Find current active number token
      const tokens = prev.split(/[+\-×÷*/\s]+/);
      const currentToken = tokens[tokens.length - 1] || '';
      if (currentToken.includes('.')) {
        // Prevent multiple decimals in the same number token
        return prev;
      }
      if (endsWithOperator(prev) || prev === '') {
        return prev + '0.';
      }
      return prev + '.';
    });
  }, [justEvaluated]);

  // Toggle +/- Sign
  const toggleSign = useCallback(() => {
    setTape(prev => {
      if (prev === '0' || prev === 'Error' || prev === 'Cannot divide by zero') return prev;
      const match = prev.match(/([+\-×÷*/]\s*)?(-?\d+(\.\d+)?)$/);
      if (!match) return prev;
      const fullMatch = match[0];
      const numPart = match[2];
      const prefix = match[1] || '';
      
      let toggled;
      if (numPart.startsWith('-')) {
        toggled = numPart.slice(1);
      } else {
        toggled = `(-${numPart})`;
      }
      return prev.slice(0, prev.length - fullMatch.length) + prefix + toggled;
    });
  }, []);

  // Percent %
  const inputPercent = useCallback(() => {
    setTape(prev => {
      if (prev === '0' || prev === 'Error' || prev === 'Cannot divide by zero') return prev;
      if (endsWithOperator(prev)) return prev;
      return prev + '%';
    });
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    setTape(prev => {
      if (prev.length <= 1 || prev === 'Error' || prev === 'Cannot divide by zero') {
        return '0';
      }
      // If ends with space-operator-space, delete the whole operator group
      if (/\s[+\-×÷*/]\s$/.test(prev)) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1).trimEnd() || '0';
    });
  }, []);

  // Clear All (AC)
  const handleClear = useCallback(() => {
    setTape('0');
    setPrevCalculation('');
    setJustEvaluated(false);
  }, []);

  // Clear Entry (CE) - Clears only the current number being typed
  const handleClearEntry = useCallback(() => {
    setTape(prev => {
      if (prev === 'Error' || prev === 'Cannot divide by zero' || prev.length <= 1) {
        return '0';
      }
      const trimmed = prev.trim();
      if (/[+\-×÷*/]$/.test(trimmed)) {
        return trimmed.slice(0, -1).trim() || '0';
      }
      const stripped = trimmed.replace(/\d+(\.\d+)?%?$/, '').trim();
      return stripped ? stripped + ' ' : '0';
    });
  }, []);

  // Calculate Result
  const handleCalculate = useCallback(() => {
    if (tape === '0' || tape === 'Error' || tape === 'Cannot divide by zero') return;
    
    const { result, error } = safeEvaluate(tape);
    setPrevCalculation(`${tape} =`);
    
    if (!error && result !== 'Cannot divide by zero' && result !== 'Error') {
      setHistory(prev => [
        { expr: tape, res: result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 19)
      ]);
    }
    setTape(result);
    setJustEvaluated(true);
  }, [tape]);

  // Memory Actions
  const handleMemory = useCallback((action) => {
    const { result } = safeEvaluate(tape);
    const num = parseFloat(result) || 0;
    switch (action) {
      case 'MC': setMemory(0); break;
      case 'MR': 
        setTape(String(memory)); 
        setJustEvaluated(true);
        break;
      case 'M+': setMemory(prev => prev + num); break;
      case 'M-': setMemory(prev => prev - num); break;
      default: break;
    }
  }, [tape, memory]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Guard against typing in forms, text inputs, search modals
      const target = e.target;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key;

      // Visual button pulse
      setActiveKey(key);
      setTimeout(() => setActiveKey(null), 150);

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        inputDigit(key);
      } else if (key === '+') {
        e.preventDefault();
        inputOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        inputOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        inputOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        inputOperator('÷');
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (key === 'Delete') {
        e.preventDefault();
        handleClearEntry();
      } else if (key === '%') {
        e.preventDefault();
        inputPercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inputDigit, inputOperator, inputDecimal, handleCalculate, 
    handleBackspace, handleClear, handleClearEntry, inputPercent
  ]);

  const copyDisplay = () => {
    navigator.clipboard.writeText(tape);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recallHistory = (entry) => {
    setTape(entry.res);
    setPrevCalculation(`${entry.expr} =`);
    setJustEvaluated(true);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Calculator Main Box */}
      <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-4">
        
        {/* Memory Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 pb-2 border-b border-cream-300 dark:border-charcoal-700">
          <div className="flex items-center gap-1.5">
            {['MC', 'MR', 'M+', 'M-'].map(m => (
              <button
                key={m}
                onClick={() => handleMemory(m)}
                className="px-2.5 py-1 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 font-bold transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700">
            Memory: {memory}
          </span>
        </div>

        {/* Display Screen */}
        <div className="relative p-5 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 space-y-1">
          <div className="h-5 text-right font-mono text-xs font-medium text-charcoal-500 dark:text-charcoal-400 truncate">
            {prevCalculation}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={copyDisplay}
                title="Copy to clipboard"
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleBackspace}
                title="Backspace (delete last)"
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
            <div className="font-mono text-right text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-white overflow-x-auto scrollbar-none tracking-tight">
              {tape}
            </div>
          </div>
        </div>

        {/* Desktop Keyboard Helper Notice */}
        <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 flex items-center justify-between px-1">
          <span>Physical keyboard active: (0-9, +, -, *, /, Enter, Backspace)</span>
          <span className="font-mono text-[10px] bg-cream-200 dark:bg-charcoal-700 px-1.5 py-0.5 rounded">
            Esc = AC | Del = CE
          </span>
        </div>

        {/* Keypad Grid (Standard 4x5 Layout) */}
        <div className="grid grid-cols-4 gap-2.5 pt-2">
          
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className={`p-3.5 rounded-2xl text-sm font-bold bg-cream-200 dark:bg-charcoal-700 text-rose-600 dark:text-rose-400 hover:bg-cream-300 transition-all shadow-soft active:scale-95 ${activeKey === 'Escape' ? 'ring-2 ring-rose-500 scale-95' : ''}`}
            title="All Clear (Escape)"
          >
            AC
          </button>
          <button
            onClick={handleClearEntry}
            className={`p-3.5 rounded-2xl text-sm font-bold bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 hover:bg-cream-300 transition-all shadow-soft active:scale-95 ${activeKey === 'Delete' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
            title="Clear Entry (Delete)"
          >
            CE
          </button>
          <button
            onClick={inputPercent}
            className={`p-3.5 rounded-2xl text-sm font-bold bg-cream-200 dark:bg-charcoal-700 text-orange-600 dark:text-orange-400 hover:bg-cream-300 transition-all shadow-soft active:scale-95 ${activeKey === '%' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            %
          </button>
          <button
            onClick={() => inputOperator('÷')}
            className={`p-3.5 rounded-2xl text-base font-black bg-cream-200 dark:bg-charcoal-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-charcoal-600 transition-all shadow-soft active:scale-95 ${activeKey === '/' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => inputDigit('7')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '7' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '8' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '9' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            9
          </button>
          <button
            onClick={() => inputOperator('×')}
            className={`p-3.5 rounded-2xl text-base font-black bg-cream-200 dark:bg-charcoal-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-charcoal-600 transition-all shadow-soft active:scale-95 ${activeKey === '*' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => inputDigit('4')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '4' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '5' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '6' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            6
          </button>
          <button
            onClick={() => inputOperator('-')}
            className={`p-3.5 rounded-2xl text-base font-black bg-cream-200 dark:bg-charcoal-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-charcoal-600 transition-all shadow-soft active:scale-95 ${activeKey === '-' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => inputDigit('1')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '1' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '2' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '3' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            3
          </button>
          <button
            onClick={() => inputOperator('+')}
            className={`p-3.5 rounded-2xl text-base font-black bg-cream-200 dark:bg-charcoal-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-charcoal-600 transition-all shadow-soft active:scale-95 ${activeKey === '+' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={toggleSign}
            className="p-3.5 rounded-2xl text-sm font-bold bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 hover:bg-cream-300 transition-all shadow-soft active:scale-95"
            title="Toggle Sign (±)"
          >
            ±
          </button>
          <button
            onClick={() => inputDigit('0')}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '0' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className={`p-3.5 rounded-2xl text-base font-bold bg-white dark:bg-charcoal-850 text-charcoal-800 dark:text-white border border-cream-400 dark:border-charcoal-600 hover:bg-cream-100 transition-all shadow-soft active:scale-95 ${activeKey === '.' ? 'ring-2 ring-orange-500 scale-95' : ''}`}
          >
            .
          </button>
          <button
            onClick={handleCalculate}
            className={`p-3.5 rounded-2xl text-lg font-black bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-soft active:scale-95 ${activeKey === 'Enter' || activeKey === '=' ? 'ring-2 ring-orange-400 scale-95' : ''}`}
          >
            =
          </button>

        </div>
      </div>

      {/* Tape Calculation History */}
      <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-cream-300 dark:border-charcoal-700 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
              Calculation Tape History
            </h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-charcoal-400 text-center py-4">No recent calculations on tape.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => recallHistory(item)}
                className="p-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 hover:border-orange-500 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="text-left font-mono text-xs">
                  <span className="text-charcoal-500 dark:text-charcoal-400">{item.expr} =</span>{' '}
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">{item.res}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-charcoal-400">{item.timestamp}</span>
                  <RotateCcw className="w-3 h-3 text-charcoal-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
