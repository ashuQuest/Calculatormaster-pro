with open('frontend/src/calculators/engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_cases = """
      // -------------------------------------------------------------
      // STANDARD CALCULATOR ENGINE FALLBACK
      // -------------------------------------------------------------
      case 'standard': {
        const expr = inputs.expression || inputs.tape || '0';
        const a = parseFloat(inputs.a) || 0;
        const b = parseFloat(inputs.b) || 0;
        const op = inputs.op || '+';
        let res = 0;
        if (inputs.expression || inputs.tape) {
          try {
            const clean = String(expr).replace(/×/g, '*').replace(/÷/g, '/');
            if (/\/0(?![.0-9])/.test(clean)) return { error: 'Cannot divide by zero.' };
            res = Function(`"use strict"; return (${clean})`)();
          } catch {
            return { error: 'Invalid arithmetic expression.' };
          }
        } else {
          switch (op) {
            case '+': res = a + b; break;
            case '-': res = a - b; break;
            case '×': case '*': res = a * b; break;
            case '÷': case '/':
              if (b === 0) return { error: 'Cannot divide by zero.' };
              res = a / b;
              break;
            default: res = a + b;
          }
        }
        const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toPrecision(10)).toString();
        return {
          results: { 'Result': formatted, 'Expression': expr || `${a} ${op} ${b}` },
          formula: 'Standard Arithmetic (a + b, a - b, a × b, a ÷ b)',
          steps: [`Calculated ${expr || `${a} ${op} ${b}`} = ${formatted}`]
        };
      }

      // -------------------------------------------------------------
      // SCIENTIFIC & ADVANCED MATH
      // -------------------------------------------------------------
      case 'scientific': {
        const val = parseFloat(inputs.val) || 0;
        const func = inputs.func || 'sin';
        const mode = inputs.mode || 'deg';
        let rad = mode === 'deg' ? (val * Math.PI) / 180 : val;
        let res = 0;

        switch (func) {
          case 'sin': res = Math.sin(rad); break;
          case 'cos': res = Math.cos(rad); break;
          case 'tan':
            if (mode === 'deg' && Math.abs(val % 180) === 90) return { error: 'Tangent is undefined at 90°.' };
            res = Math.tan(rad);
            break;
          case 'asin':
            if (val < -1 || val > 1) return { error: 'Arcsin domain is [-1, 1].' };
            res = mode === 'deg' ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
            break;
          case 'acos':
            if (val < -1 || val > 1) return { error: 'Arccos domain is [-1, 1].' };
            res = mode === 'deg' ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
            break;
          case 'atan':
            res = mode === 'deg' ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
            break;
          case 'log':
            if (val <= 0) return { error: 'Logarithm argument must be positive.' };
            res = Math.log10(val);
            break;
          case 'ln':
            if (val <= 0) return { error: 'Natural logarithm argument must be positive.' };
            res = Math.log(val);
            break;
          case 'sqrt':
            if (val < 0) return { error: 'Square root of negative number is complex.' };
            res = Math.sqrt(val);
            break;
          case 'sqr': res = val * val; break;
          case 'inv':
            if (val === 0) return { error: 'Division by zero.' };
            res = 1 / val;
            break;
          default: res = Math.sin(rad);
        }

        const formatted = parseFloat(res.toPrecision(10)).toString();
        return {
          results: {
            'Result': formatted,
            'Function': `${func}(${val}${['sin','cos','tan'].includes(func) ? (mode === 'deg' ? '°' : ' rad') : ''})`,
            'Angular Mode': mode.toUpperCase()
          },
          formula: `Scientific function evaluation in ${mode.toUpperCase()} mode`,
          steps: [
            ['sin','cos','tan'].includes(func) && mode === 'deg' ? `Converted ${val}° to ${(rad).toFixed(6)} radians` : null,
            `Computed ${func}(${val}) = ${formatted}`
          ].filter(Boolean)
        };
      }

      case 'exponent-power': {
        const base = parseFloat(inputs.base) || 0;
        const exponent = parseFloat(inputs.exponent) || 0;
        
        let powerRes = Math.pow(base, exponent);
        let rootRes = (base >= 0 && exponent !== 0) ? Math.pow(base, 1 / exponent) : (base < 0 && Math.abs(exponent % 2) === 1 ? -Math.pow(-base, 1 / exponent) : NaN);
        let reciprocal = base !== 0 ? 1 / base : NaN;

        return {
          results: {
            [`${base}^${exponent} (Power)`]: isNaN(powerRes) ? 'Undefined' : parseFloat(powerRes.toPrecision(10)).toString(),
            [`${exponent}√${base} (${exponent}th Root)`]: isNaN(rootRes) ? 'Undefined / Complex' : parseFloat(rootRes.toPrecision(10)).toString(),
            'Base Squared (x²)': (base * base).toString(),
            'Base Cubed (x³)': (base * base * base).toString(),
            'Reciprocal (1/x)': isNaN(reciprocal) ? 'Undefined' : parseFloat(reciprocal.toPrecision(8)).toString()
          },
          formula: 'Power: xʸ = exp(y · ln(x)), Root: ʸ√x = x^(1/y)',
          steps: [
            `Evaluated ${base} raised to exponent ${exponent} = ${powerRes.toFixed(6).replace(/\\.?0+$/, '')}`,
            exponent !== 0 ? `Calculated ${exponent}th root of ${base} = ${isNaN(rootRes) ? 'N/A' : rootRes.toFixed(6).replace(/\\.?0+$/, '')}` : 'Root with exponent 0 is undefined.'
          ]
        };
      }

      case 'degree-radian': {
        const val = parseFloat(inputs.value) || 0;
        const fromUnit = inputs.fromUnit || 'deg';

        let deg = 0;
        if (fromUnit === 'deg') deg = val;
        else if (fromUnit === 'rad') deg = (val * 180) / Math.PI;
        else if (fromUnit === 'grad') deg = (val * 9) / 10;

        const rad = (deg * Math.PI) / 180;
        const grad = (deg * 10) / 9;
        const piFraction = rad / Math.PI;

        return {
          results: {
            'Degrees': `${deg.toFixed(4).replace(/\\.?0+$/, '')}°`,
            'Radians': `${rad.toFixed(6).replace(/\\.?0+$/, '')} rad`,
            'Radians (π multiple)': `${piFraction.toFixed(4).replace(/\\.?0+$/, '')} π`,
            'Gradians': `${grad.toFixed(4).replace(/\\.?0+$/, '')} grad`,
            'sin(θ)': Math.sin(rad).toFixed(4),
            'cos(θ)': Math.cos(rad).toFixed(4),
            'tan(θ)': Math.abs(deg % 180) === 90 ? 'Undefined' : Math.tan(rad).toFixed(4)
          },
          formula: 'rad = deg × (π / 180), deg = rad × (180 / π), grad = deg × (10 / 9)',
          steps: [
            `Normalized input to degrees: ${deg.toFixed(4)}°`,
            `Computed Radians: ${deg.toFixed(4)} × (π / 180) = ${rad.toFixed(6)} rad`,
            `Computed Gradians: ${deg.toFixed(4)} × (200 / 180) = ${grad.toFixed(4)} grad`
          ]
        };
      }

      case 'scientific-evaluator': {
        const expr = inputs.expression || '2 * sin(pi / 4) + sqrt(16)';
        try {
          let sanitized = expr
            .replace(/\\bpi\\b/gi, `${Math.PI}`)
            .replace(/\\be\\b/gi, `${Math.E}`)
            .replace(/\\bsin\\b/gi, 'Math.sin')
            .replace(/\\bcos\\b/gi, 'Math.cos')
            .replace(/\\btan\\b/gi, 'Math.tan')
            .replace(/\\bsqrt\\b/gi, 'Math.sqrt')
            .replace(/\\blog\\b/gi, 'Math.log10')
            .replace(/\\bln\\b/gi, 'Math.log')
            .replace(/\\bexp\\b/gi, 'Math.exp')
            .replace(/\\babs\\b/gi, 'Math.abs')
            .replace(/\\^/g, '**');

          if (!/^[0-9+\\-*/(). ,MathPIEexpabslgsqrtsincto]+$/.test(sanitized)) {
            return { error: 'Expression contains disallowed tokens.' };
          }
          const val = Function(`"use strict"; return (${sanitized})`)();
          if (isNaN(val) || !isFinite(val)) return { error: 'Result is undefined or division by zero occurred.' };

          const rounded = parseFloat(val.toPrecision(10));
          return {
            results: {
              'Evaluated Result': rounded.toString(),
              'Input Expression': expr,
              'Scientific Notation': rounded.toExponential(4)
            },
            formula: 'Parser evaluation using standard mathematical precedence & transcendentals',
            steps: [
              `Tokenized expression: ${expr}`,
              `Substituted constants: π ≈ 3.14159, e ≈ 2.71828`,
              `Computed final value: ${rounded}`
            ]
          };
        } catch (err) {
          return { error: `Syntax error in mathematical expression: ${err.message}` };
        }
      }

      case 'calculus-helper': {
        const funcStr = inputs.func || 'x^2 + 3*x - 5';
        const x0 = parseFloat(inputs.x0) || 2;
        const a = parseFloat(inputs.a) || 0;
        const b = parseFloat(inputs.b) || 4;

        const f = (xVal) => {
          const replaced = funcStr
            .replace(/\\bx\\b/gi, `(${xVal})`)
            .replace(/\\bpi\\b/gi, `${Math.PI}`)
            .replace(/\\be\\b/gi, `${Math.E}`)
            .replace(/\\bsin\\b/gi, 'Math.sin')
            .replace(/\\bcos\\b/gi, 'Math.cos')
            .replace(/\\btan\\b/gi, 'Math.tan')
            .replace(/\\bsqrt\\b/gi, 'Math.sqrt')
            .replace(/\\blog\\b/gi, 'Math.log10')
            .replace(/\\bln\\b/gi, 'Math.log')
            .replace(/\\^/g, '**');
          return Function(`"use strict"; return (${replaced})`)();
        };

        const h = 1e-6;
        let deriv;
        try {
          deriv = (f(x0 + h) - f(x0 - h)) / (2 * h);
        } catch {
          return { error: 'Failed to evaluate function for derivative.' };
        }

        let integral = 0;
        const nSteps = 1000;
        const step = (b - a) / nSteps;
        try {
          let sum = f(a) + f(b);
          for (let i = 1; i < nSteps; i++) {
            const xi = a + i * step;
            sum += (i % 2 === 0 ? 2 : 4) * f(xi);
          }
          integral = (step / 3) * sum;
        } catch {
          return { error: 'Failed to evaluate function for definite integral.' };
        }

        return {
          results: {
            [`f'(${x0}) (Numerical Derivative)`]: parseFloat(deriv.toPrecision(7)).toString(),
            [`∫ f(x) dx from ${a} to ${b}`]: parseFloat(integral.toPrecision(7)).toString(),
            'f(x0) Value': parseFloat(f(x0).toPrecision(7)).toString(),
            'Function Evaluated': funcStr
          },
          formula: "Derivative: f'(x) ≈ [f(x+h) - f(x-h)] / 2h, Integral: Simpson's 1/3 rule",
          steps: [
            `Evaluated central difference quotient at x = ${x0} with step h = 10⁻⁶`,
            `Applied composite Simpson's 1/3 numerical quadrature across [${a}, ${b}] with 1,000 subintervals`,
            `Result: Derivative = ${deriv.toFixed(4)}, Definite Integral = ${integral.toFixed(4)}`
          ]
        };
      }

      // -------------------------------------------------------------
      // FINANCIAL & INVESTMENTS
      // -------------------------------------------------------------
      case 'fd': {
        const p = parseFloat(inputs.principal) || 100000;
        const r = parseFloat(inputs.rate) || 7.0;
        const t = parseFloat(inputs.tenure) || 5;
        const freq = parseInt(inputs.frequency) || 4;

        if (p <= 0 || r <= 0 || t <= 0) return { error: 'Principal, rate, and tenure must be greater than zero.' };

        const rateDec = r / 100;
        const maturity = p * Math.pow(1 + rateDec / freq, freq * t);
        const interest = maturity - p;
        const apy = (Math.pow(1 + rateDec / freq, freq) - 1) * 100;

        return {
          results: {
            'Maturity Value': `₹${maturity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Total Interest Earned': `₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Principal Deposited': `₹${p.toLocaleString('en-IN')}`,
            'Effective Annual Yield (APY)': `${apy.toFixed(2)}%`,
            'Compounding Frequency': freq === 4 ? 'Quarterly' : freq === 12 ? 'Monthly' : freq === 2 ? 'Half-Yearly' : 'Annually'
          },
          formula: 'A = P · (1 + r/n)^(n·t)',
          steps: [
            `Periodic rate: ${r}% / ${freq} = ${(r / freq).toFixed(4)}% per period`,
            `Total compounding intervals: ${freq} × ${t} = ${freq * t} periods`,
            `Maturity = ₹${p} × (1 + ${(rateDec / freq).toFixed(6)})^${freq * t} = ₹${maturity.toFixed(2)}`,
            `Net Profit: ₹${maturity.toFixed(2)} - ₹${p} = ₹${interest.toFixed(2)}`
          ]
        };
      }

      case 'rd': {
        const p = parseFloat(inputs.monthlyDeposit) || 5000;
        const r = parseFloat(inputs.rate) || 7.1;
        const nMonths = parseInt(inputs.tenureMonths) || 36;

        if (p <= 0 || r <= 0 || nMonths <= 0) return { error: 'Monthly deposit, rate, and tenure must be positive.' };

        let maturity = 0;
        for (let k = 1; k <= nMonths; k++) {
          const monthsRemaining = nMonths - k + 1;
          maturity += p * Math.pow(1 + (r / 400), (4 * monthsRemaining) / 12);
        }
        const totalInvested = p * nMonths;
        const totalInterest = maturity - totalInvested;

        return {
          results: {
            'Maturity Amount': `₹${maturity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Total Amount Deposited': `₹${totalInvested.toLocaleString('en-IN')}`,
            'Total Interest Earned': `₹${totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Monthly Installment': `₹${p.toLocaleString('en-IN')}`,
            'Total Installments': `${nMonths} Months (${(nMonths / 12).toFixed(1)} Yrs)`
          },
          formula: 'M = Σ P · (1 + r/400)^(4 · (n - k + 1)/12) [Indian Banking Standard]',
          steps: [
            `Total principal invested: ₹${p} × ${nMonths} months = ₹${totalInvested.toLocaleString('en-IN')}`,
            `Quarterly compounding formula applied over ${nMonths} staggered monthly tranches`,
            `Net Interest = Maturity (₹${maturity.toFixed(2)}) - Deposited (₹${totalInvested}) = ₹${totalInterest.toFixed(2)}`
          ]
        };
      }

      case 'loan-amortization': {
        const principal = parseFloat(inputs.loanAmount) || 2000000;
        const annualRate = parseFloat(inputs.rate) || 8.5;
        const tenureYears = parseFloat(inputs.tenureYears) || 15;
        const extraMonthly = parseFloat(inputs.extraMonthly) || 0;

        if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
          return { error: 'Loan amount, rate, and tenure must be positive numbers.' };
        }

        const rMonthly = annualRate / 12 / 100;
        const totalMonths = tenureYears * 12;
        const baseEmi = (principal * rMonthly * Math.pow(1 + rMonthly, totalMonths)) / (Math.pow(1 + rMonthly, totalMonths) - 1);

        let normalInterest = (baseEmi * totalMonths) - principal;

        let balance = principal;
        let prepaidInterest = 0;
        let monthsWithPrepay = 0;
        while (balance > 0 && monthsWithPrepay < totalMonths * 2) {
          monthsWithPrepay++;
          const interestPortion = balance * rMonthly;
          const principalPortion = baseEmi - interestPortion + extraMonthly;
          prepaidInterest += interestPortion;
          balance -= principalPortion;
          if (balance <= 0) break;
        }

        const interestSaved = extraMonthly > 0 ? Math.max(0, normalInterest - prepaidInterest) : 0;
        const tenureSavedMonths = extraMonthly > 0 ? Math.max(0, totalMonths - monthsWithPrepay) : 0;

        return {
          results: {
            'Monthly Standard EMI': `₹${baseEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Total Interest (Standard)': `₹${normalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Total Payable': `₹${(principal + normalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Interest Saved with Prepayment': extraMonthly > 0 ? `₹${interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '₹0',
            'Loan Tenure Reduction': extraMonthly > 0 ? `${(tenureSavedMonths / 12).toFixed(1)} Years (${tenureSavedMonths} months)` : '0'
          },
          formula: 'EMI = [P · r · (1+r)ⁿ] / [(1+r)ⁿ - 1]',
          steps: [
            `Calculated base monthly EMI: ₹${baseEmi.toFixed(2)}`,
            `Total scheduled repayments over ${totalMonths} months = ₹${(baseEmi * totalMonths).toFixed(2)}`,
            extraMonthly > 0 ? `Extra monthly prepayment of ₹${extraMonthly} clears loan in ${monthsWithPrepay} months instead of ${totalMonths}` : 'No prepayment added.'
          ]
        };
      }

      case 'income-tax': {
        const grossIncome = parseFloat(inputs.grossIncome) || 1200000;
        const regime = inputs.regime || 'new';
        const deductions80c = parseFloat(inputs.deductions80c) || 150000;
        const hra = parseFloat(inputs.hra) || 0;
        const otherDeductions = parseFloat(inputs.otherDeductions) || 50000;

        let taxableIncome = 0;
        let standardDeduction = regime === 'new' ? 75000 : 50000;
        let totalDeductions = standardDeduction;

        if (regime === 'old') {
          totalDeductions += Math.min(150000, deductions80c) + hra + otherDeductions;
        }
        taxableIncome = Math.max(0, grossIncome - totalDeductions);

        let tax = 0;
        if (regime === 'new') {
          if (taxableIncome <= 700000) {
            tax = 0;
          } else {
            if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
            if (taxableIncome > 700000) tax += Math.min(taxableIncome - 700000, 300000) * 0.10;
            if (taxableIncome > 1000000) tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
            if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
            if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
          }
        } else {
          if (taxableIncome <= 500000) {
            tax = 0;
          } else {
            if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
            if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
            if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
          }
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

        return {
          results: {
            'Total Tax Payable': `₹${totalTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Income Tax before Cess': `₹${tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Health & Education Cess (4%)': `₹${cess.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Taxable Income': `₹${taxableIncome.toLocaleString('en-IN')}`,
            'Total Deductions Allowed': `₹${totalDeductions.toLocaleString('en-IN')}`,
            'Effective Tax Rate': `${effectiveRate.toFixed(2)}%`,
            'Selected Regime': regime === 'new' ? 'New Tax Regime (Sec 115BAC)' : 'Old Tax Regime'
          },
          formula: 'Tax = Slab Rates on Taxable Income + 4% Cess',
          steps: [
            `Standard deduction applied: ₹${standardDeduction.toLocaleString('en-IN')}`,
            `Net taxable income: ₹${grossIncome.toLocaleString('en-IN')} - ₹${totalDeductions.toLocaleString('en-IN')} = ₹${taxableIncome.toLocaleString('en-IN')}`,
            `Computed base tax according to ${regime.toUpperCase()} regime slabs = ₹${tax.toFixed(0)}`,
            `Added 4% cess (₹${cess.toFixed(0)}) = ₹${totalTax.toFixed(0)}`
          ]
        };
      }

      case 'inflation': {
        const currentAmount = parseFloat(inputs.amount) || 100000;
        const rate = parseFloat(inputs.rate) || 6.0;
        const years = parseFloat(inputs.years) || 10;

        if (currentAmount <= 0 || years <= 0) return { error: 'Amount and years must be positive.' };

        const futureCost = currentAmount * Math.pow(1 + rate / 100, years);
        const purchasingPower = currentAmount / Math.pow(1 + rate / 100, years);
        const erosionPct = ((currentAmount - purchasingPower) / currentAmount) * 100;

        return {
          results: {
            'Future Equivalent Cost': `₹${futureCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Future Value of Current Money': `₹${purchasingPower.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Purchasing Power Loss': `${erosionPct.toFixed(1)}%`,
            'Annual Inflation Rate': `${rate}% over ${years} years`
          },
          formula: 'FV = PV · (1 + r)ᵗ, Real Value = PV / (1 + r)ᵗ',
          steps: [
            `Calculated future price: ₹${currentAmount} × (1 + ${(rate / 100).toFixed(4)})^${years} = ₹${futureCost.toFixed(2)}`,
            `Today's ₹${currentAmount} will only buy worth ₹${purchasingPower.toFixed(2)} in ${years} years.`,
            `Overall loss in real value: ${erosionPct.toFixed(1)}%`
          ]
        };
      }

      // -------------------------------------------------------------
      // BUSINESS & COMMERCE
      // -------------------------------------------------------------
      case 'profit-loss': {
        const cp = parseFloat(inputs.costPrice) || 500;
        const sp = parseFloat(inputs.sellingPrice) || 650;
        const qty = parseFloat(inputs.quantity) || 1;

        if (cp < 0 || sp < 0 || qty <= 0) return { error: 'Cost, selling price, and quantity must be non-negative.' };

        const totalCost = cp * qty;
        const totalRevenue = sp * qty;
        const diff = totalRevenue - totalCost;
        const pct = totalCost > 0 ? (diff / totalCost) * 100 : 0;
        const isProfit = diff >= 0;

        return {
          results: {
            'Net Outcome': isProfit ? `Profit of ₹${diff.toFixed(2)}` : `Loss of ₹${Math.abs(diff).toFixed(2)}`,
            'Percentage': `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
            'Total Revenue': `₹${totalRevenue.toFixed(2)}`,
            'Total Cost Price': `₹${totalCost.toFixed(2)}`,
            'Unit Difference': `₹${(sp - cp).toFixed(2)} per unit`
          },
          formula: 'Profit/Loss = Total SP - Total CP, % = (Difference / Total CP) × 100',
          steps: [
            `Total Cost = ₹${cp} × ${qty} = ₹${totalCost.toFixed(2)}`,
            `Total Revenue = ₹${sp} × ${qty} = ₹${totalRevenue.toFixed(2)}`,
            `Net = ₹${totalRevenue.toFixed(2)} - ₹${totalCost.toFixed(2)} = ₹${diff.toFixed(2)} (${pct.toFixed(2)}%)`
          ]
        };
      }

      case 'profit-margin': {
        const cost = parseFloat(inputs.cost) || 400;
        const revenue = parseFloat(inputs.revenue) || 600;

        if (revenue <= 0 || cost < 0) return { error: 'Revenue must be positive and cost non-negative.' };

        const grossProfit = revenue - cost;
        const marginPct = (grossProfit / revenue) * 100;
        const markupPct = cost > 0 ? (grossProfit / cost) * 100 : 0;

        return {
          results: {
            'Gross Profit Margin': `${marginPct.toFixed(2)}%`,
            'Gross Profit Amount': `₹${grossProfit.toFixed(2)}`,
            'Markup on Cost': `${markupPct.toFixed(2)}%`,
            'Cost Ratio': `${((cost / revenue) * 100).toFixed(2)}%`
          },
          formula: 'Margin = [(Revenue - Cost) / Revenue] × 100, Markup = [(Revenue - Cost) / Cost] × 100',
          steps: [
            `Gross Profit = ₹${revenue} - ₹${cost} = ₹${grossProfit.toFixed(2)}`,
            `Margin % = (₹${grossProfit.toFixed(2)} / ₹${revenue}) × 100 = ${marginPct.toFixed(2)}%`,
            `Markup % = (₹${grossProfit.toFixed(2)} / ₹${cost}) × 100 = ${markupPct.toFixed(2)}%`
          ]
        };
      }

      case 'break-even': {
        const fc = parseFloat(inputs.fixedCosts) || 50000;
        const vc = parseFloat(inputs.variableCostPerUnit) || 120;
        const sp = parseFloat(inputs.sellingPricePerUnit) || 200;

        if (sp <= vc) return { error: 'Selling price per unit must be greater than variable cost per unit.' };
        if (fc < 0) return { error: 'Fixed costs cannot be negative.' };

        const cm = sp - vc;
        const cmRatio = (cm / sp) * 100;
        const breakEvenUnits = Math.ceil(fc / cm);
        const breakEvenRevenue = breakEvenUnits * sp;

        return {
          results: {
            'Break-Even Units': `${breakEvenUnits.toLocaleString()} units`,
            'Break-Even Revenue': `₹${breakEvenRevenue.toLocaleString('en-IN')}`,
            'Contribution Margin (Unit)': `₹${cm.toFixed(2)}`,
            'Contribution Margin Ratio': `${cmRatio.toFixed(2)}%`
          },
          formula: 'Break-Even Units = Fixed Costs / (SP - VC), Revenue = Units × SP',
          steps: [
            `Unit Contribution Margin = ₹${sp} - ₹${vc} = ₹${cm.toFixed(2)}`,
            `Contribution Margin Ratio = (₹${cm} / ₹${sp}) × 100 = ${cmRatio.toFixed(2)}%`,
            `Break-even point = ₹${fc} / ₹${cm.toFixed(2)} = ${breakEvenUnits} units (₹${breakEvenRevenue.toLocaleString('en-IN')})`
          ]
        };
      }

      case 'sales-commission': {
        const sales = parseFloat(inputs.salesAmount) || 250000;
        const base = parseFloat(inputs.baseSalary) || 25000;
        const rate = parseFloat(inputs.commissionRate) || 5.0;
        const target = parseFloat(inputs.targetQuota) || 200000;
        const bonusRate = parseFloat(inputs.bonusRate) || 2.5;

        let baseCommission = (sales * rate) / 100;
        let bonusCommission = 0;
        if (sales > target && target > 0) {
          bonusCommission = ((sales - target) * bonusRate) / 100;
        }
        const totalCommission = baseCommission + bonusCommission;
        const totalPayout = base + totalCommission;
        const effectiveRate = sales > 0 ? (totalCommission / sales) * 100 : 0;

        return {
          results: {
            'Total Compensation': `₹${totalPayout.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Total Commission': `₹${totalCommission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Base Commission': `₹${baseCommission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Tier Overachievement Bonus': `₹${bonusCommission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            'Fixed Base Salary': `₹${base.toLocaleString('en-IN')}`,
            'Effective Commission %': `${effectiveRate.toFixed(2)}%`
          },
          formula: 'Total Payout = Base Salary + (Sales × Rate) + (Overachievement × Bonus Rate)',
          steps: [
            `Standard commission: ₹${sales} × ${rate}% = ₹${baseCommission.toFixed(2)}`,
            sales > target ? `Exceeded target by ₹${sales - target} at ${bonusRate}% bonus = ₹${bonusCommission.toFixed(2)}` : 'Target quota not exceeded.',
            `Gross earnings = ₹${base} base + ₹${totalCommission.toFixed(2)} commission = ₹${totalPayout.toFixed(2)}`
          ]
        };
      }

      // -------------------------------------------------------------
      // UNIT CONVERTERS
      // -------------------------------------------------------------
      case 'unit-length': {
        const val = parseFloat(inputs.value) || 1;
        const fromUnit = inputs.fromUnit || 'm';
        const toUnit = inputs.toUnit || 'km';

        const toMeters = {
          m: 1,
          km: 1000,
          cm: 0.01,
          mm: 0.001,
          inch: 0.0254,
          foot: 0.3048,
          yard: 0.9144,
          mile: 1609.344,
          nautical_mile: 1852
        };

        const meters = val * (toMeters[fromUnit] || 1);
        const converted = meters / (toMeters[toUnit] || 1);

        return {
          results: {
            'Converted Value': `${converted.toFixed(6).replace(/\\.?0+$/, '')} ${toUnit}`,
            'Meters (SI)': `${meters.toFixed(4).replace(/\\.?0+$/, '')} m`,
            'Kilometers': `${(meters / 1000).toFixed(4).replace(/\\.?0+$/, '')} km`,
            'Feet': `${(meters / 0.3048).toFixed(4).replace(/\\.?0+$/, '')} ft`,
            'Inches': `${(meters / 0.0254).toFixed(4).replace(/\\.?0+$/, '')} in`,
            'Miles': `${(meters / 1609.344).toFixed(6).replace(/\\.?0+$/, '')} mi`
          },
          formula: 'Target = Value × (BaseFactor_from / BaseFactor_to)',
          steps: [
            `Normalized ${val} ${fromUnit} to ${meters.toFixed(6)} meters`,
            `Converted to ${toUnit}: ${meters.toFixed(6)} / ${toMeters[toUnit]} = ${converted.toFixed(6)} ${toUnit}`
          ]
        };
      }

      case 'unit-weight': {
        const val = parseFloat(inputs.value) || 1;
        const fromUnit = inputs.fromUnit || 'kg';
        const toUnit = inputs.toUnit || 'lb';

        const toKg = {
          kg: 1,
          g: 0.001,
          mg: 0.000001,
          ton: 1000,
          lb: 0.45359237,
          oz: 0.028349523,
          stone: 6.350293
        };

        const kg = val * (toKg[fromUnit] || 1);
        const converted = kg / (toKg[toUnit] || 1);

        return {
          results: {
            'Converted Value': `${converted.toFixed(6).replace(/\\.?0+$/, '')} ${toUnit}`,
            'Kilograms (SI)': `${kg.toFixed(4).replace(/\\.?0+$/, '')} kg`,
            'Grams': `${(kg * 1000).toFixed(2).replace(/\\.?0+$/, '')} g`,
            'Pounds (lbs)': `${(kg / 0.45359237).toFixed(4).replace(/\\.?0+$/, '')} lb`,
            'Ounces (oz)': `${(kg / 0.028349523).toFixed(2).replace(/\\.?0+$/, '')} oz`
          },
          formula: 'Target = Value × (BaseFactor_from / BaseFactor_to)',
          steps: [
            `Normalized ${val} ${fromUnit} to ${kg.toFixed(6)} kg`,
            `Converted to ${toUnit}: ${kg.toFixed(6)} / ${toKg[toUnit]} = ${converted.toFixed(6)} ${toUnit}`
          ]
        };
      }

      case 'unit-temperature': {
        const val = parseFloat(inputs.value) || 0;
        const fromUnit = inputs.fromUnit || 'celsius';
        const toUnit = inputs.toUnit || 'fahrenheit';

        let c = 0;
        if (fromUnit === 'celsius') c = val;
        else if (fromUnit === 'fahrenheit') c = ((val - 32) * 5) / 9;
        else if (fromUnit === 'kelvin') c = val - 273.15;
        else if (fromUnit === 'rankine') c = ((val - 491.67) * 5) / 9;

        const f = (c * 9) / 5 + 32;
        const k = c + 273.15;
        const r = (c + 273.15) * 1.8;

        let converted = f;
        if (toUnit === 'celsius') converted = c;
        else if (toUnit === 'fahrenheit') converted = f;
        else if (toUnit === 'kelvin') converted = k;
        else if (toUnit === 'rankine') converted = r;

        return {
          results: {
            'Converted Value': `${converted.toFixed(2)}° ${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`,
            'Celsius': `${c.toFixed(2)} °C`,
            'Fahrenheit': `${f.toFixed(2)} °F`,
            'Kelvin': `${k.toFixed(2)} K`,
            'Rankine': `${r.toFixed(2)} °R`
          },
          formula: '°F = (°C × 9/5) + 32, K = °C + 273.15',
          steps: [
            `Normalized input to Celsius: ${c.toFixed(2)} °C`,
            `Calculated converted target (${toUnit}): ${converted.toFixed(2)}`
          ]
        };
      }

      case 'unit-area': {
        const val = parseFloat(inputs.value) || 1;
        const fromUnit = inputs.fromUnit || 'sqm';
        const toUnit = inputs.toUnit || 'sqft';

        const toSqM = {
          sqm: 1,
          sqkm: 1000000,
          sqft: 0.092903,
          sqyd: 0.836127,
          acre: 4046.86,
          hectare: 10000,
          sqmi: 2589988.11
        };

        const sqM = val * (toSqM[fromUnit] || 1);
        const converted = sqM / (toSqM[toUnit] || 1);

        return {
          results: {
            'Converted Value': `${converted.toFixed(6).replace(/\\.?0+$/, '')} ${toUnit}`,
            'Square Meters (m²)': `${sqM.toFixed(4).replace(/\\.?0+$/, '')} m²`,
            'Square Feet (ft²)': `${(sqM / 0.092903).toFixed(2).replace(/\\.?0+$/, '')} sq ft`,
            'Acres': `${(sqM / 4046.86).toFixed(4).replace(/\\.?0+$/, '')} acres`,
            'Hectares': `${(sqM / 10000).toFixed(4).replace(/\\.?0+$/, '')} ha`
          },
          formula: 'Target = Value × (BaseFactor_from / BaseFactor_to)',
          steps: [
            `Normalized ${val} ${fromUnit} to ${sqM.toFixed(4)} sq meters`,
            `Converted to ${toUnit}: ${converted.toFixed(4)} ${toUnit}`
          ]
        };
      }

      case 'unit-storage': {
        const val = parseFloat(inputs.value) || 1;
        const fromUnit = inputs.fromUnit || 'GB';
        const toUnit = inputs.toUnit || 'MB';

        const powers = { B: 0, KB: 1, MB: 2, GB: 3, TB: 4, PB: 5 };
        const pFrom = powers[fromUnit] !== undefined ? powers[fromUnit] : 3;
        const pTo = powers[toUnit] !== undefined ? powers[toUnit] : 2;

        const bytes = val * Math.pow(1024, pFrom);
        const convertedBinary = bytes / Math.pow(1024, pTo);
        const convertedDecimal = (val * Math.pow(1000, pFrom)) / Math.pow(1000, pTo);

        return {
          results: {
            'Binary (1024-based)': `${convertedBinary.toLocaleString('en-IN', { maximumFractionDigits: 4 })} ${toUnit}`,
            'Decimal (1000-based)': `${convertedDecimal.toLocaleString('en-IN', { maximumFractionDigits: 4 })} ${toUnit}`,
            'Total Bytes': `${bytes.toLocaleString()} Bytes`,
            'Total Megabytes (MB)': `${(bytes / (1024 * 1024)).toFixed(2)} MB`,
            'Total Gigabytes (GB)': `${(bytes / (1024 * 1024 * 1024)).toFixed(4)} GB`
          },
          formula: 'Binary: Bytes = Val × 1024^p, Decimal: Bytes = Val × 1000^p',
          steps: [
            `Computed total raw storage: ${bytes.toLocaleString()} bytes`,
            `Binary 1024-based equivalent: ${convertedBinary.toFixed(4)} ${toUnit}`
          ]
        };
      }

      // -------------------------------------------------------------
      // DATE & TIME
      // -------------------------------------------------------------
      case 'date-difference': {
        const sStr = inputs.startDate;
        const eStr = inputs.endDate;
        if (!sStr || !eStr) return { error: 'Please choose both start and end dates.' };

        const d1 = new Date(sStr);
        const d2 = new Date(eStr);
        const includeEnd = inputs.includeEndDay === true || inputs.includeEndDay === 'true';

        const diffTime = d2.getTime() - d1.getTime();
        let totalDays = Math.floor(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) + (includeEnd ? 1 : 0);

        const start = diffTime >= 0 ? d1 : d2;
        const end = diffTime >= 0 ? d2 : d1;

        let y = end.getFullYear() - start.getFullYear();
        let m = end.getMonth() - start.getMonth();
        let d = end.getDate() - start.getDate();

        if (d < 0) {
          m -= 1;
          const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
          d += prevMonth;
        }
        if (m < 0) {
          y -= 1;
          m += 12;
        }

        const weeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;

        return {
          results: {
            'Calendar Duration': `${y} Years, ${m} Months, ${d} Days`,
            'Total Days': `${totalDays.toLocaleString()} Days`,
            'Weeks & Days': `${weeks} Weeks and ${remDays} Days`,
            'Total Hours': `${(totalDays * 24).toLocaleString()} Hours`,
            'Total Minutes': `${(totalDays * 1440).toLocaleString()} Minutes`
          },
          formula: 'Date span calculated with dynamic calendar months and leap years',
          steps: [
            `Span between ${sStr} and ${eStr}: ${totalDays} total calendar days`,
            `Exact breakdown: ${y} years, ${m} months, and ${d} days`
          ]
        };
      }

      case 'working-days': {
        const sStr = inputs.startDate;
        const eStr = inputs.endDate;
        if (!sStr || !eStr) return { error: 'Please select start and end dates.' };

        const d1 = new Date(sStr);
        const d2 = new Date(eStr);
        const holidays = parseInt(inputs.holidays) || 0;
        const weekendMode = inputs.weekendMode || 'sat_sun';

        let cur = new Date(Math.min(d1.getTime(), d2.getTime()));
        const end = new Date(Math.max(d1.getTime(), d2.getTime()));

        let totalCalendarDays = 0;
        let workingDays = 0;
        let weekendDays = 0;

        while (cur <= end) {
          totalCalendarDays++;
          const day = cur.getDay();
          const isWeekend = weekendMode === 'sat_sun' ? (day === 0 || day === 6) : (day === 0);
          if (isWeekend) {
            weekendDays++;
          } else {
            workingDays++;
          }
          cur.setDate(cur.getDate() + 1);
        }

        const netWorkingDays = Math.max(0, workingDays - holidays);

        return {
          results: {
            'Net Working Days': `${netWorkingDays} Days`,
            'Total Calendar Days': `${totalCalendarDays} Days`,
            'Weekend Days': `${weekendDays} Days`,
            'Public Holidays Excluded': `${holidays} Days`,
            'Work Ratio': `${((netWorkingDays / totalCalendarDays) * 100).toFixed(1)}%`
          },
          formula: 'Working Days = Total Days - Weekends - Public Holidays',
          steps: [
            `Total span: ${totalCalendarDays} calendar days`,
            `Identified ${weekendDays} weekend days based on (${weekendMode.replace('_', ' ').toUpperCase()})`,
            `Deducted ${holidays} public holidays = ${netWorkingDays} productive working days`
          ]
        };
      }

      // -------------------------------------------------------------
      // DAILY LIFE & HEALTH
      // -------------------------------------------------------------
      case 'bmr-calories': {
        const age = parseFloat(inputs.age) || 28;
        const gender = inputs.gender || 'male';
        const weight = parseFloat(inputs.weight) || 72;
        const height = parseFloat(inputs.height) || 175;
        const activity = inputs.activity || 'moderate';
        const goal = inputs.goal || 'maintain';

        if (age <= 0 || weight <= 0 || height <= 0) return { error: 'Age, weight, and height must be positive.' };

        let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);

        const multipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          very_active: 1.9
        };
        const tdee = bmr * (multipliers[activity] || 1.55);

        let targetCalories = tdee;
        if (goal === 'mild_loss') targetCalories = tdee - 250;
        else if (goal === 'loss') targetCalories = tdee - 500;
        else if (goal === 'gain') targetCalories = tdee + 400;

        const proteinGrams = Math.round((targetCalories * 0.30) / 4);
        const carbsGrams = Math.round((targetCalories * 0.40) / 4);
        const fatGrams = Math.round((targetCalories * 0.30) / 9);

        return {
          results: {
            'Daily Target Calories': `${Math.round(targetCalories)} kcal / day`,
            'Basal Metabolic Rate (BMR)': `${Math.round(bmr)} kcal / day`,
            'Maintenance TDEE': `${Math.round(tdee)} kcal / day`,
            'Protein Target': `${proteinGrams} g (30%)`,
            'Carbohydrates Target': `${carbsGrams} g (40%)`,
            'Fats Target': `${fatGrams} g (30%)`
          },
          formula: 'Mifflin-St Jeor: BMR = 10W + 6.25H - 5A + s, TDEE = BMR × Activity',
          steps: [
            `Computed base BMR for ${gender}: ${bmr.toFixed(0)} kcal`,
            `Factored in ${activity} activity multiplier: ${tdee.toFixed(0)} kcal/day`,
            `Adjusted for goal (${goal.replace('_', ' ')}): ${Math.round(targetCalories)} kcal/day`
          ]
        };
      }

      case 'fuel-mileage': {
        const distance = parseFloat(inputs.distance) || 450;
        const fuelUsed = parseFloat(inputs.fuelUsed) || 30;
        const fuelPrice = parseFloat(inputs.fuelPrice) || 96.5;

        if (distance <= 0 || fuelUsed <= 0) return { error: 'Distance and fuel quantity must be positive.' };

        const kmPerLiter = distance / fuelUsed;
        const litersPer100Km = (fuelUsed / distance) * 100;
        const mpgUS = kmPerLiter * 2.35215;
        const totalTripCost = fuelPrice > 0 ? fuelUsed * fuelPrice : 0;
        const costPerKm = fuelPrice > 0 ? totalTripCost / distance : 0;

        return {
          results: {
            'Fuel Economy / Mileage': `${kmPerLiter.toFixed(2)} km/L`,
            'Efficiency (L/100km)': `${litersPer100Km.toFixed(2)} L/100 km`,
            'US Mileage (MPG)': `${mpgUS.toFixed(1)} MPG`,
            'Total Trip Fuel Cost': `₹${totalTripCost.toFixed(2)}`,
            'Running Cost per km': `₹${costPerKm.toFixed(2)} / km`
          },
          formula: 'Mileage = Distance / Fuel, Cost = Fuel × Price, Cost/km = Total Cost / Distance',
          steps: [
            `Fuel economy: ${distance} km / ${fuelUsed} L = ${kmPerLiter.toFixed(2)} km/L`,
            `Total fuel expense: ${fuelUsed} L × ₹${fuelPrice}/L = ₹${totalTripCost.toFixed(2)}`,
            `Cost per kilometer: ₹${costPerKm.toFixed(2)}/km`
          ]
        };
      }

      case 'salary-take-home': {
        const grossSalary = parseFloat(inputs.grossSalary) || 85000;
        const basicPct = parseFloat(inputs.basicSalaryPct) || 50;
        const pfPct = parseFloat(inputs.pfPct) || 12;
        const profTax = parseFloat(inputs.profTax) || 200;
        const annualIncomeTax = parseFloat(inputs.estimatedAnnualTax) || 45000;

        if (grossSalary <= 0) return { error: 'Gross salary must be positive.' };

        const basicSalary = (grossSalary * basicPct) / 100;
        const pfEmployee = (basicSalary * pfPct) / 100;
        const monthlyTax = annualIncomeTax / 12;
        const totalDeductions = pfEmployee + profTax + monthlyTax;
        const netTakeHome = Math.max(0, grossSalary - totalDeductions);

        return {
          results: {
            'Net In-Hand Salary': `₹${netTakeHome.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / month`,
            'Total Monthly Deductions': `₹${totalDeductions.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Provident Fund (EPF 12%)': `₹${pfEmployee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Estimated Monthly TDS': `₹${monthlyTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            'Professional Tax': `₹${profTax.toLocaleString('en-IN')}`,
            'Annual In-Hand Pay': `₹${(netTakeHome * 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
          },
          formula: 'Take-Home = Gross Salary - (EPF 12% of Basic + Professional Tax + Monthly TDS)',
          steps: [
            `Basic salary calculated at ${basicPct}% of gross: ₹${basicSalary.toLocaleString('en-IN')}`,
            `Employee PF deduction: ${pfPct}% of basic = ₹${pfEmployee.toFixed(0)}`,
            `Net salary: ₹${grossSalary} - (₹${pfEmployee.toFixed(0)} + ₹${profTax} + ₹${monthlyTax.toFixed(0)}) = ₹${netTakeHome.toFixed(0)}`
          ]
        };
      }
"""

target = "      default:"
if target in text:
    updated = text.replace(target, new_cases + "\n" + target)
    with open('frontend/src/calculators/engine.js', 'w', encoding='utf-8') as f:
        f.write(updated)
    print('Successfully inserted new cases into engine.js!')
else:
    print('Could not find target in engine.js')
