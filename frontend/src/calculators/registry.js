export const CATEGORIES = [
  { id: 'basic', name: 'Basic Calculators', icon: 'Calculator', description: 'Everyday math, percentages, discounts, fractions & ratios.' },
  { id: 'scientific', name: 'Scientific Calculators', icon: 'Atom', description: 'Trigonometry, logarithms, powers, factorials & expressions.' },
  { id: 'mathematical', name: 'Mathematical Tools', icon: 'Sigma', description: 'Equation solvers, matrices, statistics & calculus helpers.' },
  { id: 'financial', name: 'Financial & Investment', icon: 'TrendingUp', description: 'EMI, SIP, compound interest, GST, taxes & loan schedules.' },
  { id: 'business', name: 'Business & Commerce', icon: 'Briefcase', description: 'Profit margins, markups, break-even points & commissions.' },
  { id: 'converters', name: 'Unit Converters', icon: 'RefreshCw', description: 'Instant conversion for length, weight, area, temperature & data.' },
  { id: 'datetime', name: 'Date & Time', icon: 'Calendar', description: 'Exact age, date difference, working days & durations.' },
  { id: 'dailylife', name: 'Daily Life & Health', icon: 'HeartPulse', description: 'BMI, BMR calories, electricity costs, fuel & salary.' },
];

export const CALCULATORS_CATALOG = [
  // --- A. BASIC CALCULATORS ---
  {
    id: 'standard',
    name: 'Standard Calculator',
    category: 'basic',
    description: 'Quick arithmetic calculator with tape history and memory recall.',
    icon: 'Calculator',
    isPremium: false,
    formula: 'a + b, a - b, a × b, a ÷ b',
    tags: ['basic', 'math', 'simple', 'arithmetic']
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    category: 'basic',
    description: 'Calculate what percentage X is of Y, percentage increases, and discounts.',
    icon: 'Percent',
    isPremium: false,
    formula: 'P = (Part / Whole) × 100',
    tags: ['percentage', 'ratio', 'fraction', 'discount']
  },
  {
    id: 'discount',
    name: 'Discount & Sale Calculator',
    category: 'basic',
    description: 'Find final sale price, total savings, and post-tax prices in seconds.',
    icon: 'Tag',
    isPremium: false,
    formula: 'Final Price = Original Price - (Original Price × Discount %)',
    tags: ['discount', 'shopping', 'sale', 'savings']
  },
  {
    id: 'fraction',
    name: 'Fraction Calculator',
    category: 'basic',
    description: 'Add, subtract, multiply, divide, and simplify fractions with step-by-step reduction.',
    icon: 'Divide',
    isPremium: false,
    formula: 'a/b ± c/d = (ad ± bc)/bd',
    tags: ['fraction', 'math', 'simplify', 'numerator', 'denominator']
  },
  {
    id: 'ratio',
    name: 'Ratio & Proportion Solver',
    category: 'basic',
    description: 'Solve A:B = C:D proportions and simplify aspect ratios.',
    icon: 'Sliders',
    isPremium: false,
    formula: 'A/B = C/D => A × D = B × C',
    tags: ['ratio', 'proportion', 'scale', 'aspect']
  },
  {
    id: 'square-root',
    name: 'Square & Square Root',
    category: 'basic',
    description: 'Calculate square numbers and principal square roots with exact radical steps.',
    icon: 'Square',
    isPremium: false,
    formula: 'x², √x',
    tags: ['square', 'root', 'radicals']
  },
  {
    id: 'cube-root',
    name: 'Cube & Cube Root',
    category: 'basic',
    description: 'Compute cubic powers and cube roots with exact precision.',
    icon: 'Box',
    isPremium: false,
    formula: 'x³, ∛x',
    tags: ['cube', 'root', 'powers']
  },
  {
    id: 'average',
    name: 'Average & Mean Calculator',
    category: 'basic',
    description: 'Compute arithmetic mean, geometric mean, median, sum, and count of number sets.',
    icon: 'BarChart2',
    isPremium: false,
    formula: 'Mean = Σx / N',
    tags: ['average', 'mean', 'sum', 'count']
  },
  {
    id: 'lcm-hcf',
    name: 'LCM & HCF / GCD Calculator',
    category: 'basic',
    description: 'Least Common Multiple and Greatest Common Divisor with prime factorization steps.',
    icon: 'GitCommit',
    isPremium: false,
    formula: 'LCM(a,b) = (a × b) / GCD(a,b)',
    tags: ['lcm', 'hcf', 'gcd', 'primes', 'divisors']
  },

  // --- B. SCIENTIFIC CALCULATORS ---
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    category: 'scientific',
    description: 'Advanced keyboard with trigonometric, hyperbolic, logarithmic, and power functions.',
    icon: 'Cpu',
    isPremium: false,
    formula: 'f(x) with degrees/radians, e, π, log, ln, powers',
    tags: ['scientific', 'trig', 'log', 'advanced']
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry Calculator',
    category: 'scientific',
    description: 'Evaluate sin, cos, tan, cot, sec, csc, inverse and hyperbolic functions.',
    icon: 'Compass',
    isPremium: false,
    formula: 'sin(θ), cos(θ), tan(θ), arcsin, sinh',
    tags: ['trigonometry', 'angles', 'radians', 'degrees']
  },
  {
    id: 'logarithm',
    name: 'Logarithm Calculator',
    category: 'scientific',
    description: 'Compute natural log (ln), common log (log₁₀), and arbitrary base logarithms log_b(x).',
    icon: 'Binary',
    isPremium: false,
    formula: 'log_b(x) = ln(x) / ln(b)',
    tags: ['log', 'ln', 'exponent', 'base']
  },
  {
    id: 'factorial',
    name: 'Factorial & Permutations',
    category: 'scientific',
    description: 'Compute n!, nPr permutations, and nCr combinations with combinatorial steps.',
    icon: 'Sparkles',
    isPremium: false,
    formula: 'nPr = n! / (n-r)!, nCr = n! / (r!(n-r)!)',
    tags: ['factorial', 'permutations', 'combinations', 'nCr']
  },
  {
    id: 'exponent-power',
    name: 'Power & Root Calculator',
    category: 'scientific',
    description: 'Evaluate arbitrary powers x^y and nth roots with fractional exponents.',
    icon: 'ChevronsUp',
    isPremium: false,
    formula: 'x^y, y√x = x^(1/y)',
    tags: ['powers', 'exponent', 'nth root']
  },
  {
    id: 'degree-radian',
    name: 'Degree / Radian Converter',
    category: 'scientific',
    description: 'Instant conversion between degrees, radians, and gradians with π multiples.',
    icon: 'RotateCw',
    isPremium: false,
    formula: 'rad = deg × (π / 180)',
    tags: ['degrees', 'radians', 'gradians', 'angle']
  },
  {
    id: 'scientific-evaluator',
    name: 'Scientific Expression Evaluator',
    category: 'scientific',
    description: 'Safe mathematical expression evaluation with order of operations (PEMDAS).',
    icon: 'Code',
    isPremium: true,
    formula: 'AST-parsed numerical expression evaluation',
    tags: ['expression', 'eval', 'math', 'pemdas']
  },

  // --- C. MATHEMATICAL CALCULATORS ---
  {
    id: 'linear-equation',
    name: 'Linear Equation Solver',
    category: 'mathematical',
    description: 'Solve single variable ax + b = c and 2x2 simultaneous linear system equations.',
    icon: 'Equal',
    isPremium: false,
    formula: 'ax + b = c => x = (c - b)/a',
    tags: ['linear', 'algebra', 'equation', 'system']
  },
  {
    id: 'quadratic-equation',
    name: 'Quadratic Equation Solver',
    category: 'mathematical',
    description: 'Solve ax² + bx + c = 0 with discriminant D, real & complex roots, and parabola vertex.',
    icon: 'Activity',
    isPremium: false,
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    tags: ['quadratic', 'roots', 'parabola', 'discriminant']
  },
  {
    id: 'matrix',
    name: 'Matrix Calculator',
    category: 'mathematical',
    description: 'Compute 2×2 and 3×3 determinants, inverse matrices, transposition, and trace.',
    icon: 'Grid',
    isPremium: true,
    formula: 'det(A), A⁻¹, Aᵀ, tr(A)',
    tags: ['matrix', 'linear algebra', 'determinant', 'inverse']
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    category: 'mathematical',
    description: 'Mean, median, mode, sample & population variance, standard deviation, and quartiles.',
    icon: 'BarChart',
    isPremium: true,
    formula: 's = √(Σ(x - x̄)² / (n - 1))',
    tags: ['statistics', 'stddev', 'variance', 'median', 'mode']
  },
  {
    id: 'calculus-helper',
    name: 'Derivative & Definite Integral',
    category: 'mathematical',
    description: 'Numerical derivative approximation and definite integral via Simpson rule.',
    icon: 'GitBranch',
    isPremium: true,
    formula: 'f\'(x) ≈ (f(x+h) - f(x-h))/2h, ∫[a,b] f(x)dx',
    tags: ['calculus', 'derivative', 'integral', 'simpson']
  },

  // --- D. FINANCIAL CALCULATORS ---
  {
    id: 'emi',
    name: 'EMI Loan Calculator',
    category: 'financial',
    description: 'Calculate monthly home, car, or personal loan EMI with full amortization breakdown.',
    icon: 'CreditCard',
    isPremium: false,
    formula: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]',
    tags: ['emi', 'loan', 'home loan', 'car loan', 'amortization']
  },
  {
    id: 'sip',
    name: 'SIP Investment Calculator',
    category: 'financial',
    description: 'Forecast mutual fund wealth creation, total invested amount, and maturity value.',
    icon: 'TrendingUp',
    isPremium: false,
    formula: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
    tags: ['sip', 'mutual fund', 'investment', 'wealth']
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    category: 'financial',
    description: 'Calculate compounding growth across annual, semi-annual, quarterly, and monthly intervals.',
    icon: 'Layers',
    isPremium: false,
    formula: 'A = P × (1 + r/n)^(nt)',
    tags: ['compound interest', 'growth', 'finance', 'savings']
  },
  {
    id: 'simple-interest',
    name: 'Simple Interest Calculator',
    category: 'financial',
    description: 'Straightforward simple interest with total repayment and interest earnings.',
    icon: 'DollarSign',
    isPremium: false,
    formula: 'SI = (P × R × T) / 100',
    tags: ['simple interest', 'principal', 'rate']
  },
  {
    id: 'gst',
    name: 'GST Tax Calculator',
    category: 'financial',
    description: 'Calculate GST inclusive and exclusive prices with 5%, 12%, 18%, and 28% Indian slabs.',
    icon: 'Receipt',
    isPremium: false,
    formula: 'GST = (Amount × Rate) / 100',
    tags: ['gst', 'tax', 'cgst', 'sgst', 'igst']
  },
  {
    id: 'cagr',
    name: 'CAGR Return Calculator',
    category: 'financial',
    description: 'Compound Annual Growth Rate for stocks, real estate, and portfolio performance.',
    icon: 'PieChart',
    isPremium: true,
    formula: 'CAGR = (End Value / Begin Value)^(1/Years) - 1',
    tags: ['cagr', 'stocks', 'returns', 'portfolio']
  },
  {
    id: 'fd',
    name: 'Fixed Deposit (FD) Calculator',
    category: 'financial',
    description: 'Calculate bank FD maturity value with quarterly and cumulative compounding options.',
    icon: 'Landmark',
    isPremium: true,
    formula: 'A = P × (1 + r/n)^(nt)',
    tags: ['fd', 'fixed deposit', 'bank', 'interest']
  },
  {
    id: 'rd',
    name: 'Recurring Deposit (RD) Calculator',
    category: 'financial',
    description: 'Compute bank RD maturity value with compounding interest on monthly deposits.',
    icon: 'Repeat',
    isPremium: true,
    formula: 'Standard bank quarterly compounding formula for recurring deposits',
    tags: ['rd', 'recurring deposit', 'savings']
  },
  {
    id: 'loan-amortization',
    name: 'Loan Amortization & Prepayment',
    category: 'financial',
    description: 'In-depth yearly and monthly loan payoff schedule, extra payments, and interest savings.',
    icon: 'Table',
    isPremium: true,
    formula: 'Principal vs Interest schedule with early payoff modeling',
    tags: ['amortization', 'loan', 'prepayment', 'schedule']
  },
  {
    id: 'income-tax',
    name: 'Income Tax Calculator (FY 24-25)',
    category: 'financial',
    description: 'Compare tax liability under New Tax Regime vs Old Tax Regime with standard deductions.',
    icon: 'FileText',
    isPremium: true,
    formula: 'Indian Income Tax slabs comparison FY 2024-25 / 2025-26',
    tags: ['income tax', 'tax slabs', 'regime', 'deductions']
  },
  {
    id: 'inflation',
    name: 'Inflation Impact Calculator',
    category: 'financial',
    description: 'Discover future purchasing power and cost of living adjustments over time.',
    icon: 'TrendingDown',
    isPremium: true,
    formula: 'FV = PV × (1 + r)^n',
    tags: ['inflation', 'purchasing power', 'future value']
  },

  // --- E. BUSINESS CALCULATORS ---
  {
    id: 'profit-loss',
    name: 'Profit and Loss Calculator',
    category: 'business',
    description: 'Calculate net profit, net loss, percentage return on cost, and profit margin.',
    icon: 'TrendingUp',
    isPremium: false,
    formula: 'Profit = Selling Price - Cost Price',
    tags: ['profit', 'loss', 'business', 'sales']
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin & Markup',
    category: 'business',
    description: 'Contrast gross profit margin against markup percentage to prevent underpricing.',
    icon: 'Percent',
    isPremium: false,
    formula: 'Margin = (Profit / Revenue) × 100, Markup = (Profit / Cost) × 100',
    tags: ['margin', 'markup', 'pricing', 'commerce']
  },
  {
    id: 'break-even',
    name: 'Break-even Analysis',
    category: 'business',
    description: 'Determine the exact units and sales revenue required to cover fixed and variable costs.',
    icon: 'Target',
    isPremium: true,
    formula: 'Break-even Units = Fixed Costs / (Price per Unit - Variable Cost)',
    tags: ['break even', 'business', 'units', 'startup']
  },
  {
    id: 'sales-commission',
    name: 'Sales Commission Calculator',
    category: 'business',
    description: 'Calculate total compensation including base salary and tier-based sales commissions.',
    icon: 'Award',
    isPremium: true,
    formula: 'Earnings = Base + (Sales × Commission %)',
    tags: ['commission', 'sales', 'incentive']
  },

  // --- F. UNIT CONVERTERS ---
  {
    id: 'unit-length',
    name: 'Length & Distance Converter',
    category: 'converters',
    description: 'Meters, kilometers, centimeters, millimeters, miles, yards, feet, and inches.',
    icon: 'Ruler',
    isPremium: false,
    formula: 'Universal SI length conversion matrix',
    tags: ['length', 'distance', 'meter', 'kilometer', 'inch', 'feet']
  },
  {
    id: 'unit-weight',
    name: 'Weight & Mass Converter',
    category: 'converters',
    description: 'Kilograms, grams, milligrams, pounds (lbs), ounces, metric tons, and stones.',
    icon: 'Scale',
    isPremium: false,
    formula: 'Universal mass conversion matrix',
    tags: ['weight', 'mass', 'kg', 'lbs', 'gram', 'ton']
  },
  {
    id: 'unit-temperature',
    name: 'Temperature Converter',
    category: 'converters',
    description: 'Instant conversion between Celsius, Fahrenheit, and Kelvin scales.',
    icon: 'Thermometer',
    isPremium: false,
    formula: '°F = (°C × 9/5) + 32, K = °C + 273.15',
    tags: ['temperature', 'celsius', 'fahrenheit', 'kelvin']
  },
  {
    id: 'unit-area',
    name: 'Area Converter',
    category: 'converters',
    description: 'Square meters, square feet, square kilometers, acres, and hectares.',
    icon: 'Square',
    isPremium: false,
    formula: 'Standard geometric area factors',
    tags: ['area', 'acre', 'hectare', 'sqft', 'sqm']
  },
  {
    id: 'unit-storage',
    name: 'Data Storage Converter',
    category: 'converters',
    description: 'Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and Petabytes (PB).',
    icon: 'HardDrive',
    isPremium: false,
    formula: 'Binary 1024 vs Decimal 1000 storage scales',
    tags: ['data', 'bytes', 'mb', 'gb', 'tb']
  },

  // --- G. DATE & TIME CALCULATORS ---
  {
    id: 'age',
    name: 'Age Calculator',
    category: 'datetime',
    description: 'Exact age in years, months, days, total hours, day of birth, and next birthday countdown.',
    icon: 'Calendar',
    isPremium: false,
    formula: 'Calendar date diff with leap year compensation',
    tags: ['age', 'birthday', 'years', 'days']
  },
  {
    id: 'date-difference',
    name: 'Days Between Dates',
    category: 'datetime',
    description: 'Exact number of days, weeks, and months between two selected calendar dates.',
    icon: 'Clock',
    isPremium: false,
    formula: 'Δt = Date₂ - Date₁',
    tags: ['date difference', 'days between', 'calendar']
  },
  {
    id: 'working-days',
    name: 'Working Days Calculator',
    category: 'datetime',
    description: 'Calculate actual business and working days excluding Saturdays and Sundays.',
    icon: 'Briefcase',
    isPremium: true,
    formula: 'Count of business weekdays between start and end dates',
    tags: ['working days', 'business days', 'office', 'schedule']
  },

  // --- H. DAILY LIFE & HEALTH CALCULATORS ---
  {
    id: 'bmi',
    name: 'BMI Health Calculator',
    category: 'dailylife',
    description: 'Body Mass Index with WHO health classifications and recommended healthy weight ranges.',
    icon: 'HeartPulse',
    isPremium: false,
    formula: 'BMI = weight (kg) / [height (m)]²',
    tags: ['bmi', 'health', 'fitness', 'weight']
  },
  {
    id: 'bmr-calories',
    name: 'BMR & Calorie Need Calculator',
    category: 'dailylife',
    description: 'Basal Metabolic Rate using Mifflin-St Jeor formula with daily maintenance calorie targets.',
    icon: 'Flame',
    isPremium: true,
    formula: 'BMR = 10W + 6.25H - 5A ± S, TDEE = BMR × Activity',
    tags: ['bmr', 'calories', 'tdee', 'diet', 'nutrition']
  },
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Calculator',
    category: 'dailylife',
    description: 'Estimate monthly power cost based on appliance wattage, operating hours, and unit rate.',
    icon: 'Zap',
    isPremium: false,
    formula: 'Cost = (Watts × Hours × Days × Rate) / 1000',
    tags: ['electricity', 'power', 'energy', 'bill', 'kwh']
  },
  {
    id: 'fuel-mileage',
    name: 'Fuel Cost & Mileage',
    category: 'dailylife',
    description: 'Calculate fuel needed, cost per kilometer, and total trip expenses for your commute.',
    icon: 'Fuel',
    isPremium: false,
    formula: 'Cost = (Distance / Mileage) × Fuel Price',
    tags: ['fuel', 'mileage', 'petrol', 'diesel', 'trip']
  },
  {
    id: 'salary-take-home',
    name: 'Salary & In-Hand Pay',
    category: 'dailylife',
    description: 'Break down gross annual CTC into monthly basic pay, HRA, PF deductions, and net in-hand.',
    icon: 'Wallet',
    isPremium: true,
    formula: 'Net = Gross - PF - Professional Tax - Income Tax',
    tags: ['salary', 'in hand', 'ctc', 'take home', 'pay']
  },
];
