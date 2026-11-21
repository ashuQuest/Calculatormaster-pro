// CalcMaster Pro Formula Library Catalog
// Covering 14 Main Scientific & Engineering Disciplines with KaTeX LaTeX,
// Variable metadata, Derivations, Boundary Conditions, and Reciprocal Calculator Linking.

export const FORMULA_CATEGORIES = [
  { id: 'basic-math', name: 'Basic Mathematics', icon: 'Calculator', description: 'Arithmetic, proportions, percentages, and number theory.' },
  { id: 'algebra', name: 'Algebra', icon: 'Sigma', description: 'Polynomials, quadratic equations, progressions, and series.' },
  { id: 'geometry-trig', name: 'Geometry & Trigonometry', icon: 'Compass', description: 'Angles, triangles, coordinate systems, and solid geometry.' },
  { id: 'calculus', name: 'Calculus & Differential Equations', icon: 'Infinity', description: 'Derivatives, integrals, limits, and differential forms.' },
  { id: 'statistics', name: 'Statistics & Probability', icon: 'BarChart2', description: 'Distributions, expected values, dispersion, and Bayes theorem.' },
  { id: 'linear-algebra', name: 'Linear Algebra', icon: 'Grid', description: 'Vectors, matrices, determinants, eigenvalues, and spaces.' },
  { id: 'physics', name: 'Physics', icon: 'Atom', description: 'Classical mechanics, thermodynamics, electromagnetism, and optics.' },
  { id: 'electrical', name: 'Electrical Engineering', icon: 'Zap', description: 'Circuits, Ohm’s & Kirchhoff’s laws, AC power, and impedance.' },
  { id: 'electronics', name: 'Electronics & Communication', icon: 'Cpu', description: 'Semiconductors, filters, amplifiers, and signal theory.' },
  { id: 'mechanical', name: 'Mechanical Engineering', icon: 'Settings', description: 'Fluid mechanics, heat transfer, stress-strain, and machines.' },
  { id: 'civil', name: 'Civil & Structural Engineering', icon: 'Building2', description: 'Beams, hydraulics, soil mechanics, and structural analysis.' },
  { id: 'chemical', name: 'Chemical Engineering', icon: 'FlaskConical', description: 'Kinetics, thermodynamics, mass transfer, and equilibrium.' },
  { id: 'computer-science', name: 'Computer Science & IT', icon: 'Binary', description: 'Big-O complexity, information theory, cryptography, and logic.' },
  { id: 'advanced-math', name: 'Advanced Engineering Math', icon: 'Orbit', description: 'Fourier transforms, Laplace transforms, and complex analysis.' }
];

export const FORMULAS_CATALOG = [
  // ==========================================
  // 1. BASIC MATHEMATICS
  // ==========================================
  {
    slug: 'percentage-change',
    title: 'Percentage Change & Growth Rate',
    category: 'basic-math',
    categoryName: 'Basic Mathematics',
    difficulty: 'Beginner',
    latex: '\\Delta\\% = \\left( \\frac{V_2 - V_1}{V_1} \\right) \\times 100\\%',
    description: 'Calculates the relative degree of increase or decrease between an initial value and a subsequent value expressed as a percentage.',
    theory: 'Percentage change standardizes differences relative to a benchmark starting value $V_1$. A positive result indicates growth or appreciation, while a negative result represents depreciation or contraction.',
    derivation: '1. Compute absolute delta: $\\Delta V = V_2 - V_1$.\n2. Divide by the initial benchmark $V_1$ to find relative fractional change.\n3. Multiply by 100 to convert from dimensionless ratio to percentage.',
    assumptions: ['Initial value $V_1 \\neq 0$.', 'Units of $V_1$ and $V_2$ must be identical.'],
    variables: [
      { name: 'Initial Value', symbol: 'V_1', unit: 'Dimensionless / Currency', description: 'Original benchmark amount prior to transition.' },
      { name: 'Final Value', symbol: 'V_2', unit: 'Dimensionless / Currency', description: 'Observed value after change.' },
      { name: 'Percentage Change', symbol: '\\Delta\\%', unit: '%', description: 'Relative growth or decline.' }
    ],
    solvedExample: {
      problem: 'A company revenue grew from ₹2,50,000 to ₹3,15,000. Calculate percentage growth.',
      steps: [
        'Calculate delta: ₹3,15,000 - ₹2,50,000 = ₹65,000',
        'Divide by initial: ₹65,000 / ₹2,50,000 = 0.26',
        'Multiply by 100%: 0.26 × 100% = +26.00% growth.'
      ],
      result: '+26.00%'
    },
    commonMistakes: [
      'Dividing by final value $V_2$ instead of initial value $V_1$.',
      'Forgetting that percentage decrease cannot exceed 100% for non-negative physical quantities.'
    ],
    relatedCalculator: 'percentage',
    calculatorDefaults: { type: 'change', val1: '250000', val2: '315000' }
  },
  {
    slug: 'arithmetic-mean',
    title: 'Arithmetic Mean (Average)',
    category: 'basic-math',
    categoryName: 'Basic Mathematics',
    difficulty: 'Beginner',
    latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\dots + x_n}{n}',
    description: 'The central tendency measure obtained by dividing the summation of all sample values by the count of elements.',
    theory: 'The arithmetic mean represents the balance point of a dataset where deviations sum to zero: $\\sum (x_i - \\bar{x}) = 0$. It is sensitive to extreme outliers.',
    derivation: 'Arises directly from uniform weighting of discrete observations in equal measure.',
    assumptions: ['Sample count $n \\ge 1$.', 'Data is interval or ratio scaled.'],
    variables: [
      { name: 'Sample Mean', symbol: '\\bar{x}', unit: 'Units of x', description: 'Average value of the set.' },
      { name: 'Data Observations', symbol: 'x_i', unit: 'Units of x', description: 'Individual data elements.' },
      { name: 'Count', symbol: 'n', unit: 'Integer', description: 'Total quantity of observations.' }
    ],
    solvedExample: {
      problem: 'Find the average temperature across 5 days: 28°C, 31°C, 30°C, 29°C, 32°C.',
      steps: [
        'Sum elements: 28 + 31 + 30 + 29 + 32 = 150',
        'Count elements: n = 5',
        'Mean = 150 / 5 = 30°C.'
      ],
      result: '30°C'
    },
    commonMistakes: [
      'Confusing the mean with the median in highly skewed distributions.',
      'Treating percentages of varying cohort sizes with a simple unweighted average.'
    ],
    relatedCalculator: 'average',
    calculatorDefaults: { numbers: '28, 31, 30, 29, 32' }
  },

  // ==========================================
  // 2. ALGEBRA
  // ==========================================
  {
    slug: 'quadratic-formula',
    title: 'Quadratic Equation Formula',
    category: 'algebra',
    categoryName: 'Algebra',
    difficulty: 'Intermediate',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Closed-form roots of the general second-degree polynomial equation $ax^2 + bx + c = 0$.',
    theory: 'The nature of roots is determined by the discriminant $\\Delta = b^2 - 4ac$. If $\\Delta > 0$, roots are real and distinct; if $\\Delta = 0$, roots are real and repeated; if $\\Delta < 0$, roots are complex conjugates.',
    derivation: '1. Divide $ax^2 + bx + c = 0$ by $a$: $x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$.\n2. Complete the square: $(x + \\frac{b}{2a})^2 - \\frac{b^2}{4a^2} + \\frac{c}{a} = 0$.\n3. Rearrange: $(x + \\frac{b}{2a})^2 = \\frac{b^2 - 4ac}{4a^2}$.\n4. Take square roots and solve for $x$.',
    assumptions: ['Leading coefficient $a \\neq 0$.', 'Coefficients $a, b, c \\in \\mathbb{R}$.'],
    variables: [
      { name: 'Quadratic Coefficient', symbol: 'a', unit: 'Dimensionless', description: 'Non-zero coefficient of $x^2$.' },
      { name: 'Linear Coefficient', symbol: 'b', unit: 'Dimensionless', description: 'Coefficient of $x$.' },
      { name: 'Constant Term', symbol: 'c', unit: 'Dimensionless', description: 'Independent constant.' },
      { name: 'Roots', symbol: 'x_{1,2}', unit: 'Dimensionless', description: 'Values of $x$ satisfying the equation.' }
    ],
    solvedExample: {
      problem: 'Solve $x^2 - 5x + 6 = 0$.',
      steps: [
        'Identify: a = 1, b = -5, c = 6',
        'Discriminant Δ = (-5)² - 4(1)(6) = 25 - 24 = 1',
        'Roots: x = [5 ± √1] / 2 = [5 ± 1] / 2',
        'x₁ = 6/2 = 3, x₂ = 4/2 = 2.'
      ],
      result: 'x = 3, x = 2'
    },
    commonMistakes: [
      'Sign error: neglecting the negative sign in $-b$ when $b$ is already negative.',
      'Forgetting that $2a$ is in the denominator for the entire numerator.'
    ],
    relatedCalculator: 'quadratic-equation',
    calculatorDefaults: { a: '1', b: '-5', c: '6' }
  },
  {
    slug: 'compound-interest-formula',
    title: 'Compound Interest & Future Value',
    category: 'algebra',
    categoryName: 'Algebra',
    difficulty: 'Intermediate',
    latex: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt}',
    description: 'Calculates the accrued maturity amount where interest earned generates subsequent interest over recurring compounding periods.',
    theory: 'Compounding demonstrates exponential growth. As compounding frequency $n \\to \\infty$, the formula approaches continuous compounding: $A = P e^{rt}$.',
    derivation: 'At period 1: $A_1 = P(1 + r/n)$. At period 2: $A_2 = A_1(1 + r/n) = P(1 + r/n)^2$. Induction yields $A_{nt} = P(1 + r/n)^{nt}$.',
    assumptions: ['Nominal rate $r$ remains constant.', 'No mid-term withdrawals or top-ups.'],
    variables: [
      { name: 'Principal Amount', symbol: 'P', unit: 'Currency (₹)', description: 'Initial invested capital.' },
      { name: 'Annual Interest Rate', symbol: 'r', unit: 'Decimal', description: 'Annual percentage rate (APR) in decimal.' },
      { name: 'Compounding Frequency', symbol: 'n', unit: 'Compounding per year', description: 'Times compounded annually (e.g. 4 for quarterly).' },
      { name: 'Time Horizon', symbol: 't', unit: 'Years', description: 'Total duration of investment.' },
      { name: 'Accumulated Value', symbol: 'A', unit: 'Currency (₹)', description: 'Final maturity amount including principal.' }
    ],
    solvedExample: {
      problem: 'Invest ₹1,00,000 at 8% p.a. compounded quarterly for 3 years.',
      steps: [
        'Parameters: P = 100000, r = 0.08, n = 4, t = 3',
        'Periodic rate: 0.08 / 4 = 0.02',
        'Total periods: 4 × 3 = 12',
        'A = 100000 × (1.02)¹² ≈ ₹1,26,824.18'
      ],
      result: '₹1,26,824.18'
    },
    commonMistakes: [
      'Plugging in interest rate as whole number instead of decimal ($8$ instead of $0.08$).',
      'Confusing compounding frequency $n$ with total years $t$.'
    ],
    relatedCalculator: 'compound-interest',
    calculatorDefaults: { principal: '100000', rate: '8', time: '3', frequency: '4' }
  },

  // ==========================================
  // 3. GEOMETRY & TRIGONOMETRY
  // ==========================================
  {
    slug: 'pythagorean-theorem',
    title: 'Pythagorean Theorem',
    category: 'geometry-trig',
    categoryName: 'Geometry & Trigonometry',
    difficulty: 'Beginner',
    latex: 'a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}',
    description: 'Fundamental relationship among the three sides of a Euclidean right-angled triangle.',
    theory: 'The square of the hypotenuse is equal to the sum of the squares of the adjacent and opposite orthogonal legs. Fundamental to Euclidean metric distance definitions.',
    derivation: 'Can be proven algebraically through geometric dissection of a large square $(a+b)^2 = 4(ab/2) + c^2 \\implies a^2 + 2ab + b^2 = 2ab + c^2 \\implies a^2 + b^2 = c^2$.',
    assumptions: ['Triangle must contain exactly one 90° right angle.', 'Valid strictly on flat Euclidean planes.'],
    variables: [
      { name: 'Adjacent Leg', symbol: 'a', unit: 'Meters / Length', description: 'Length of first perpendicular leg.' },
      { name: 'Opposite Leg', symbol: 'b', unit: 'Meters / Length', description: 'Length of second perpendicular leg.' },
      { name: 'Hypotenuse', symbol: 'c', unit: 'Meters / Length', description: 'Length of side opposite to the 90° angle.' }
    ],
    solvedExample: {
      problem: 'A ladder reaches a wall at height 12 m with base 5 m away. Find ladder length.',
      steps: [
        'Leg a = 5 m, Leg b = 12 m',
        'c² = 5² + 12² = 25 + 144 = 169',
        'c = √169 = 13 m.'
      ],
      result: '13 m'
    },
    commonMistakes: [
      'Applying the theorem to non-right triangles without cosine law correction.',
      'Assigning hypotenuse $c$ to one of the shorter legs.'
    ],
    relatedCalculator: 'trigonometry',
    calculatorDefaults: { angle: '45', unit: 'DEG' }
  },
  {
    slug: 'law-of-cosines',
    title: 'Law of Cosines (Cosine Rule)',
    category: 'geometry-trig',
    categoryName: 'Geometry & Trigonometry',
    difficulty: 'Intermediate',
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
    description: 'Generalizes the Pythagorean theorem to any oblique triangle by relating side lengths to the cosine of one angle.',
    theory: 'Connects all three sides with an interior angle. Essential for solving SAS (Side-Angle-Side) and SSS (Side-Side-Side) triangles in surveying and navigation.',
    derivation: 'Drop an altitude $h$ from vertex $A$ to base $c$. Using orthogonal decomposition and Pythagorean theorem on both subtriangles gives $c^2 = a^2 + b^2 - 2ab\\cos(C)$.',
    assumptions: ['Triangle must be non-degenerate ($a+b > c, a+c > b, b+c > a$).', 'Angle $C \\in (0, \\pi)$ radians.'],
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'Length', description: 'Side opposite to angle A.' },
      { name: 'Side b', symbol: 'b', unit: 'Length', description: 'Side opposite to angle B.' },
      { name: 'Side c', symbol: 'c', unit: 'Length', description: 'Side opposite to angle C.' },
      { name: 'Angle C', symbol: 'C', unit: 'Degrees / Radians', description: 'Included angle between sides a and b.' }
    ],
    solvedExample: {
      problem: 'In a triangle, a = 7, b = 10, angle C = 60°. Find length of side c.',
      steps: [
        'c² = 7² + 10² - 2(7)(10) cos(60°)',
        'cos(60°) = 0.5',
        'c² = 49 + 100 - 140(0.5) = 149 - 70 = 79',
        'c = √79 ≈ 8.888.'
      ],
      result: 'c ≈ 8.89'
    },
    commonMistakes: [
      'Evaluating in degree mode when angle was provided in radians or vice versa.',
      'Subtracting $2ab$ before multiplying by $\\cos(C)$ violating operator precedence.'
    ],
    relatedCalculator: 'trigonometry',
    calculatorDefaults: { angle: '60', unit: 'DEG' }
  },

  // ==========================================
  // 4. CALCULUS & DIFFERENTIAL EQUATIONS
  // ==========================================
  {
    slug: 'product-rule-derivative',
    title: 'Product Rule of Differentiation',
    category: 'calculus',
    categoryName: 'Calculus & Differential Equations',
    difficulty: 'Intermediate',
    latex: '\\frac{d}{dx}[u(x) \\cdot v(x)] = u(x) \\frac{dv}{dx} + v(x) \\frac{du}{dx} = u v\' + v u\'',
    description: 'Fundamental derivative rule for calculating the instantaneous rate of change of the product of two differentiable functions.',
    theory: 'Arises from the rate of change of an expanding rectangle whose side dimensions are $u(x)$ and $v(x)$. The total differential is $d(uv) = u\\,dv + v\\,du + du\\,dv$, where second-order infinitesimal $du\\,dv \\to 0$.',
    derivation: '$\\lim_{h \\to 0} \\frac{u(x+h)v(x+h) - u(x)v(x)}{h}$. Add and subtract $u(x+h)v(x)$ in numerator to factor out difference quotients.',
    assumptions: ['Both $u(x)$ and $v(x)$ must be differentiable at evaluation point $x$.'],
    variables: [
      { name: 'Function u', symbol: 'u(x)', unit: 'Dimensionless / Scaled', description: 'First differentiable function.' },
      { name: 'Function v', symbol: 'v(x)', unit: 'Dimensionless / Scaled', description: 'Second differentiable function.' },
      { name: 'Derivative of u', symbol: "u'(x)", unit: '1 / x', description: 'Rate of change of u with respect to x.' },
      { name: 'Derivative of v', symbol: "v'(x)", unit: '1 / x', description: 'Rate of change of v with respect to x.' }
    ],
    solvedExample: {
      problem: 'Differentiate f(x) = x² sin(x) with respect to x.',
      steps: [
        'Let u = x² => u\' = 2x',
        'Let v = sin(x) => v\' = cos(x)',
        'Apply rule: f\'(x) = x² cos(x) + sin(x) · (2x) = x² cos(x) + 2x sin(x).'
      ],
      result: "f'(x) = x² cos(x) + 2x sin(x)"
    },
    commonMistakes: [
      'Incorrectly differentiating as $(u \\cdot v)\' = u\' \\cdot v\'$.',
      'Forgetting the chain rule when either $u$ or $v$ is a composite function.'
    ],
    relatedCalculator: 'calculus-helper',
    calculatorDefaults: { func: 'x^2 * sin(x)', x0: '2', a: '0', b: '3' }
  },
  {
    slug: 'simpsons-one-third-rule',
    title: "Simpson's 1/3 Rule for Numerical Integration",
    category: 'calculus',
    categoryName: 'Calculus & Differential Equations',
    difficulty: 'Engineering',
    latex: '\\int_{a}^{b} f(x) dx \\approx \\frac{h}{3} \\left[ f(x_0) + 4 \\sum_{i=1,3,5}^{n-1} f(x_i) + 2 \\sum_{j=2,4,6}^{n-2} f(x_j) + f(x_n) \\right]',
    description: 'Quadrature technique approximating definite integrals by fitting second-order parabolic polynomials across successive subintervals.',
    theory: 'Delivers 3rd-order polynomial precision (exact for quadratics and cubics) with $O(h^4)$ truncation error by sampling parabolic arcs through triplets of equally spaced coordinates.',
    derivation: 'Fit a quadratic Lagrange interpolating polynomial $P_2(x)$ through points $(x_0, y_0), (x_1, y_1), (x_2, y_2)$ and integrate analytically from $-h$ to $h$.',
    assumptions: ['Total subintervals $n$ must be an even integer.', 'Uniform step spacing $h = (b - a)/n$.', 'Integrand $f(x)$ is continuous on $[a, b]$.'],
    variables: [
      { name: 'Step Size', symbol: 'h', unit: 'Domain Units', description: 'Subinterval width: $(b-a)/n$.' },
      { name: 'Lower Bound', symbol: 'a', unit: 'Domain Units', description: 'Start of integration interval.' },
      { name: 'Upper Bound', symbol: 'b', unit: 'Domain Units', description: 'End of integration interval.' },
      { name: 'Subintervals', symbol: 'n', unit: 'Even integer', description: 'Number of partitions.' }
    ],
    solvedExample: {
      problem: 'Evaluate ∫ (x²) dx from 0 to 2 with n = 2 subintervals.',
      steps: [
        'h = (2 - 0) / 2 = 1.0',
        'x₀ = 0, x₁ = 1, x₂ = 2',
        'f(0) = 0, f(1) = 1, f(2) = 4',
        'Integral ≈ (1/3) [f(0) + 4 f(1) + f(2)] = (1/3) [0 + 4(1) + 4] = 8/3 ≈ 2.6667 (Exact value is 2³/3 = 8/3).'
      ],
      result: '2.6667'
    },
    commonMistakes: [
      'Using an odd number of subintervals $n$.',
      'Swapping weights of odd-indexed points (factor 4) with even-indexed points (factor 2).'
    ],
    relatedCalculator: 'calculus-helper',
    calculatorDefaults: { func: 'x^2', x0: '1', a: '0', b: '2' }
  },

  // ==========================================
  // 5. STATISTICS & PROBABILITY
  // ==========================================
  {
    slug: 'bayes-theorem',
    title: "Bayes' Theorem",
    category: 'statistics',
    categoryName: 'Statistics & Probability',
    difficulty: 'Intermediate',
    latex: 'P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{P(B \\mid A) \\cdot P(A)}{P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)}',
    description: 'Fundamental theorem determining the posterior probability of hypothesis A given observation B by updating prior knowledge with likelihood evidence.',
    theory: 'The foundation of Bayesian statistical inference, machine learning classification, medical diagnostic testing, and decision theory.',
    derivation: 'From conditional probability definitions: $P(A \\cap B) = P(A \\mid B)P(B) = P(B \\mid A)P(A)$. Equating joint terms and dividing by $P(B)$ gives the result.',
    assumptions: ['Marginal evidence probability $P(B) > 0$.', 'Hypotheses must partition the sample space.'],
    variables: [
      { name: 'Posterior Probability', symbol: 'P(A \\mid B)', unit: 'Probability [0, 1]', description: 'Probability of hypothesis A given observed evidence B.' },
      { name: 'Likelihood', symbol: 'P(B \\mid A)', unit: 'Probability [0, 1]', description: 'Probability of observing evidence B if hypothesis A is true.' },
      { name: 'Prior Probability', symbol: 'P(A)', unit: 'Probability [0, 1]', description: 'Initial belief probability of hypothesis A before observing evidence.' },
      { name: 'Marginal Evidence', symbol: 'P(B)', unit: 'Probability [0, 1]', description: 'Total probability of observing evidence B across all outcomes.' }
    ],
    solvedExample: {
      problem: 'A disease affects 1% of population (P(D)=0.01). Test has 95% sensitivity (P(T|D)=0.95) and 5% false positive rate (P(T|Dᶜ)=0.05). If positive, find P(D|T).',
      steps: [
        'P(D) = 0.01, P(Dᶜ) = 0.99',
        'P(T) = (0.95)(0.01) + (0.05)(0.99) = 0.0095 + 0.0495 = 0.059',
        'P(D|T) = (0.95 × 0.01) / 0.059 = 0.0095 / 0.059 ≈ 0.161 (16.1%).'
      ],
      result: '16.10%'
    },
    commonMistakes: [
      'Base rate fallacy: ignoring the low prior probability $P(A)$ and equating $P(A|B)$ to $P(B|A)$.',
      'Failing to sum all partition terms when computing total evidence $P(B)$.'
    ],
    relatedCalculator: 'statistics',
    calculatorDefaults: { dataset: '12, 18, 24, 30, 36, 42, 48' }
  },

  // ==========================================
  // 6. LINEAR ALGEBRA
  // ==========================================
  {
    slug: 'determinant-2x2',
    title: 'Matrix Determinant (2×2)',
    category: 'linear-algebra',
    categoryName: 'Linear Algebra',
    difficulty: 'Beginner',
    latex: '\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
    description: 'Scalar attribute representing the geometric scaling factor of the linear transformation described by a 2×2 matrix.',
    theory: 'The determinant represents the oriented area of the parallelogram spanned by the column vectors. If $\\det(A) = 0$, the matrix is singular and non-invertible.',
    derivation: 'Arises directly from solving the linear system $ax + by = e$ and $cx + dy = f$ via Cramer’s rule.',
    assumptions: ['Matrix must be square ($n \\times n$).'],
    variables: [
      { name: 'Matrix Elements', symbol: 'a, b, c, d', unit: 'Dimensionless', description: 'Scalars in matrix positions.' },
      { name: 'Determinant', symbol: '\\det(A)', unit: 'Area scale factor', description: 'Signed area factor of transformation.' }
    ],
    solvedExample: {
      problem: 'Compute determinant for matrix with rows [4, 7] and [2, 6].',
      steps: [
        'a = 4, b = 7, c = 2, d = 6',
        'det(A) = (4)(6) - (7)(2) = 24 - 14 = 10.'
      ],
      result: '10'
    },
    commonMistakes: [
      'Subtracting in reverse order ($bc - ad$ instead of $ad - bc$).',
      'Forgetting that a zero determinant means the linear system has no unique solution.'
    ],
    relatedCalculator: 'matrix',
    calculatorDefaults: { m00: '4', m01: '7', m10: '2', m11: '6' }
  },

  // ==========================================
  // 7. PHYSICS
  // ==========================================
  {
    slug: 'newtons-second-law',
    title: "Newton's Second Law of Motion",
    category: 'physics',
    categoryName: 'Physics',
    difficulty: 'Beginner',
    latex: '\\mathbf{F}_{net} = m \\mathbf{a} = \\frac{d\\mathbf{p}}{dt}',
    description: 'Fundamental law of classical mechanics stating that net force equals the time derivative of momentum, or mass times acceleration for constant mass.',
    theory: 'Links kinematics to dynamics. Establishes inertial mass as the constant of proportionality between impressed net force and resulting acceleration.',
    derivation: 'From momentum $\\mathbf{p} = m\\mathbf{v}$: $\\mathbf{F} = \\frac{d(m\\mathbf{v})}{dt} = m \\frac{d\\mathbf{v}}{dt} + \\mathbf{v} \\frac{dm}{dt}$. For invariant mass ($dm/dt = 0$), $\\mathbf{F} = m\\mathbf{a}$.',
    assumptions: ['Inertial reference frame.', 'Sub-relativistic velocities ($v \\ll c$).', 'Constant invariant mass.'],
    variables: [
      { name: 'Net Force', symbol: '\\mathbf{F}_{net}', unit: 'Newtons (N = kg·m/s²)', description: 'Vector summation of all applied external forces.' },
      { name: 'Inertial Mass', symbol: 'm', unit: 'Kilograms (kg)', description: 'Scalar measure of quantitative inertia.' },
      { name: 'Acceleration', symbol: '\\mathbf{a}', unit: 'Meters per second squared (m/s²)', description: 'Instantaneous rate of velocity change.' }
    ],
    solvedExample: {
      problem: 'Calculate the force required to accelerate a 1,200 kg vehicle from rest at 3.5 m/s².',
      steps: [
        'm = 1200 kg, a = 3.5 m/s²',
        'F = m × a = 1200 × 3.5 = 4,200 N (4.2 kN).'
      ],
      result: '4,200 N'
    },
    commonMistakes: [
      'Neglecting friction or drag when evaluating net external force.',
      'Using weight in place of mass without dividing by gravitational acceleration $g$.'
    ],
    relatedCalculator: 'standard',
    calculatorDefaults: { a: '1200', b: '3.5', op: '*' }
  },
  {
    slug: 'kinetic-energy',
    title: 'Kinetic Energy (Translational)',
    category: 'physics',
    categoryName: 'Physics',
    difficulty: 'Beginner',
    latex: 'E_k = \\frac{1}{2} m v^2',
    description: 'Energy possessed by a body due to its translational velocity.',
    theory: 'Derived from the work-energy theorem: the work done by a net force accelerating a body from rest through displacement $s$ is equal to its final kinetic energy.',
    derivation: '$W = \\int F\\,ds = \\int m\\frac{dv}{dt} ds = \\int m v\\,dv = \\left[ \\frac{1}{2} m v^2 \\right]_0^v = \\frac{1}{2} m v^2$.',
    assumptions: ['Sub-relativistic velocities ($v \\ll c$).', 'Rigid body with purely translational motion.'],
    variables: [
      { name: 'Kinetic Energy', symbol: 'E_k', unit: 'Joules (J = kg·m²/s²)', description: 'Translational kinetic energy.' },
      { name: 'Mass', symbol: 'm', unit: 'Kilograms (kg)', description: 'Body mass.' },
      { name: 'Velocity', symbol: 'v', unit: 'Meters per second (m/s)', description: 'Scalar speed.' }
    ],
    solvedExample: {
      problem: 'Find the kinetic energy of an 800 kg car travelling at 20 m/s (72 km/h).',
      steps: [
        'm = 800 kg, v = 20 m/s',
        'v² = 400 m²/s²',
        'E_k = 0.5 × 800 × 400 = 160,000 J (160 kJ).'
      ],
      result: '160 kJ'
    },
    commonMistakes: [
      'Plugging velocity in km/h directly into the equation instead of converting to m/s.',
      'Forgetting to square the velocity term.'
    ],
    relatedCalculator: 'exponent-power',
    calculatorDefaults: { base: '20', exponent: '2' }
  },

  // ==========================================
  // 8. ELECTRICAL ENGINEERING
  // ==========================================
  {
    slug: 'ohms-law',
    title: "Ohm's Law & Electric Power",
    category: 'electrical',
    categoryName: 'Electrical Engineering',
    difficulty: 'Beginner',
    latex: 'V = I \\cdot R \\quad \\Longleftrightarrow \\quad P = V \\cdot I = I^2 R = \\frac{V^2}{R}',
    description: 'Fundamental relationship governing voltage, current, resistance, and dissipated electrical power in linear DC conductors.',
    theory: 'In ohmic materials, current density $\\mathbf{J} = \\sigma \\mathbf{E}$ is linearly proportional to the electric field. Macroscopically, potential drop $V$ equals the product of current $I$ and resistance $R$.',
    derivation: 'Power represents rate of energy dissipation: $P = \\frac{dW}{dt} = \\frac{dq}{dt} V = I V$. Substituting $V = IR$ produces $P = I^2 R$ and $P = V^2 / R$.',
    assumptions: ['Linear ohmic conductor with constant resistance.', 'Steady-state DC condition or purely resistive AC circuits (power factor = 1).'],
    variables: [
      { name: 'Voltage Potential', symbol: 'V', unit: 'Volts (V)', description: 'Electrical potential difference across the load.' },
      { name: 'Electric Current', symbol: 'I', unit: 'Amperes (A)', description: 'Rate of electric charge flow ($dq/dt$).' },
      { name: 'Resistance', symbol: 'R', unit: 'Ohms (Ω)', description: 'Opposition to current flow.' },
      { name: 'Electrical Power', symbol: 'P', unit: 'Watts (W = J/s)', description: 'Rate of electrical energy conversion.' }
    ],
    solvedExample: {
      problem: 'An electric heater operating on 230 V draws 10 A of current. Calculate its resistance and power rating.',
      steps: [
        'Resistance: R = V / I = 230 V / 10 A = 23 Ω',
        'Power: P = V × I = 230 V × 10 A = 2,300 W (2.3 kW).'
      ],
      result: 'R = 23 Ω, P = 2.3 kW'
    },
    commonMistakes: [
      'Applying directly to AC inductive/capacitive circuits without accounting for reactive impedance and phase angle.',
      'Ignoring thermal temperature coefficients of resistance in real resistive elements.'
    ],
    relatedCalculator: 'electricity-bill',
    calculatorDefaults: { watts: '2300', hours: '4', rate: '8' }
  },
  {
    slug: 'ac-impedance-rlc',
    title: 'AC Complex Impedance (Series RLC)',
    category: 'electrical',
    categoryName: 'Electrical Engineering',
    difficulty: 'Engineering',
    latex: 'Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{R^2 + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^2}',
    description: 'Total opposition to alternating current flow in a series resistive-inductive-capacitive network considering both resistance and net reactance.',
    theory: 'In alternating current circuits, inductors cause voltage to lead current by 90° ($X_L = \\omega L$), while capacitors cause voltage to lag current by 90° ($X_C = 1/\\omega C$). At resonance, $X_L = X_C$ and impedance reaches its minimum $Z = R$.',
    derivation: 'Express in phasor form: $\\mathbf{Z} = R + j(\\omega L - \\frac{1}{\\omega C})$. Magnitude is $|\\mathbf{Z}| = \\sqrt{\\text{Re}^2 + \\text{Im}^2}$.',
    assumptions: ['Linear time-invariant (LTI) reactive components.', 'Pure sinusoidal AC excitation with angular frequency $\\omega = 2\\pi f$.'],
    variables: [
      { name: 'Impedance Magnitude', symbol: 'Z', unit: 'Ohms (Ω)', description: 'Effective opposition to AC current.' },
      { name: 'Resistance', symbol: 'R', unit: 'Ohms (Ω)', description: 'Ohmic dissipative resistance.' },
      { name: 'Inductive Reactance', symbol: 'X_L = \\omega L', unit: 'Ohms (Ω)', description: 'Inductive opposition to AC.' },
      { name: 'Capacitive Reactance', symbol: 'X_C = 1/\\omega C', unit: 'Ohms (Ω)', description: 'Capacitive opposition to AC.' }
    ],
    solvedExample: {
      problem: 'A series RLC circuit has R = 30 Ω, XL = 80 Ω, and XC = 40 Ω. Find total impedance Z.',
      steps: [
        'Net reactance: X = X_L - X_C = 80 - 40 = 40 Ω',
        'Z² = R² + X² = 30² + 40² = 900 + 1600 = 2500',
        'Z = √2500 = 50 Ω.'
      ],
      result: '50 Ω'
    },
    commonMistakes: [
      'Adding reactances algebraically to resistance ($R + X_L - X_C$) without Pythagorean vector addition.',
      'Using cyclical frequency $f$ in Hz instead of angular frequency $\\omega = 2\\pi f$.'
    ],
    relatedCalculator: 'square-root',
    calculatorDefaults: { x: '2500' }
  },

  // ==========================================
  // 9. ELECTRONICS & COMMUNICATION
  // ==========================================
  {
    slug: 'rc-cutoff-frequency',
    title: 'RC Low-Pass Filter Cutoff Frequency',
    category: 'electronics',
    categoryName: 'Electronics & Communication',
    difficulty: 'Intermediate',
    latex: 'f_c = \\frac{1}{2\\pi R C} \\quad \\Longleftrightarrow \\quad \\omega_c = \\frac{1}{RC}',
    description: 'Determines the -3 dB corner frequency at which output signal power drops to 50% (voltage drops to 70.7%) of maximum passband value.',
    theory: 'The voltage divider transfer function is $H(j\\omega) = \\frac{1}{1 + j\\omega RC}$. When $\\omega RC = 1$, $|H| = 1/\\sqrt{2} \\approx 0.707$, yielding the half-power cutoff frequency.',
    derivation: 'Set $|H(j\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega RC)^2}} = \\frac{1}{\\sqrt{2}} \\implies \\omega RC = 1 \\implies f_c = \\frac{1}{2\\pi RC}$.',
    assumptions: ['Ideal lumped passive components.', 'Zero source impedance and infinite load impedance.'],
    variables: [
      { name: 'Corner Frequency', symbol: 'f_c', unit: 'Hertz (Hz)', description: 'Cutoff frequency at -3 dB attenuation.' },
      { name: 'Resistance', symbol: 'R', unit: 'Ohms (Ω)', description: 'Filter series resistance.' },
      { name: 'Capacitance', symbol: 'C', unit: 'Farads (F)', description: 'Filter shunt capacitance.' }
    ],
    solvedExample: {
      problem: 'Find cutoff frequency for a low-pass filter with R = 10 kΩ (10⁴ Ω) and C = 100 nF (10⁻⁷ F).',
      steps: [
        'RC = 10,000 × 100 × 10⁻⁹ = 0.001 s (1 ms)',
        'f_c = 1 / (2 × π × 0.001) ≈ 1 / 0.006283 = 159.15 Hz.'
      ],
      result: '159.15 Hz'
    },
    commonMistakes: [
      'Neglecting metric unit prefixes (e.g. evaluating nF as whole farads).',
      'Forgetting the $2\\pi$ factor converting radians/sec to Hertz.'
    ],
    relatedCalculator: 'scientific-evaluator',
    calculatorDefaults: { expression: '1 / (2 * pi * 10000 * 100e-9)' }
  },

  // ==========================================
  // 10. MECHANICAL ENGINEERING
  // ==========================================
  {
    slug: 'bernoullis-equation',
    title: "Bernoulli's Energy Equation (Fluid Dynamics)",
    category: 'mechanical',
    categoryName: 'Mechanical Engineering',
    difficulty: 'Engineering',
    latex: 'P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2 = \\text{constant}',
    description: 'Statement of conservation of mechanical energy along a streamline for steady, incompressible, inviscid fluid flow.',
    theory: 'Relates static pressure, dynamic pressure (kinetic energy per unit volume), and hydrostatic pressure (potential energy per unit volume). Explains lift on airfoils and venturi tube pressure drops.',
    derivation: 'Obtained by integrating Euler’s equation of motion $\\frac{dP}{\\rho} + v\\,dv + g\\,dh = 0$ along a streamline for constant density $\\rho$.',
    assumptions: ['Inviscid flow (zero shear viscosity).', 'Steady laminar flow along streamlines.', 'Incompressible fluid (constant density $\\rho$).'],
    variables: [
      { name: 'Static Pressure', symbol: 'P', unit: 'Pascals (Pa = N/m²)', description: 'Thermodynamic fluid pressure.' },
      { name: 'Fluid Density', symbol: '\\rho', unit: 'kg/m³', description: 'Mass density of flowing fluid.' },
      { name: 'Flow Velocity', symbol: 'v', unit: 'm/s', description: 'Fluid streamline velocity.' },
      { name: 'Elevation Head', symbol: 'h', unit: 'Meters (m)', description: 'Geometric height above arbitrary datum.' },
      { name: 'Gravity', symbol: 'g', unit: 'm/s²', description: 'Gravitational acceleration (9.81 m/s²).' }
    ],
    solvedExample: {
      problem: 'Water (ρ = 1000 kg/m³) flows horizontally (h1=h2) from a pipe at 2 m/s under 200 kPa into a constricted section at 4 m/s. Find pressure P2.',
      steps: [
        'Dynamic pressure 1: 0.5 × 1000 × (2)² = 2,000 Pa',
        'Dynamic pressure 2: 0.5 × 1000 × (4)² = 8,000 Pa',
        'P₂ = P₁ + 0.5ρ(v₁² - v₂²) = 200,000 + (2,000 - 8,000) = 194,000 Pa (194 kPa).'
      ],
      result: '194 kPa'
    },
    commonMistakes: [
      'Applying across turbulent viscous boundary layers or through pumps/turbines without adding head loss and shaft work terms.',
      'Assuming higher velocity means higher pressure (it actually produces lower static pressure).'
    ],
    relatedCalculator: 'standard',
    calculatorDefaults: { a: '200000', b: '6000', op: '-' }
  },

  // ==========================================
  // 11. CIVIL & STRUCTURAL ENGINEERING
  // ==========================================
  {
    slug: 'bending-stress-euler-bernoulli',
    title: 'Flexural Bending Stress (Beam Theory)',
    category: 'civil',
    categoryName: 'Civil & Structural Engineering',
    difficulty: 'Engineering',
    latex: '\\sigma = \\frac{M \\cdot y}{I} = \\frac{M}{Z}',
    description: 'Calculates the longitudinal normal stress induced within a structural beam section under pure flexural bending moment.',
    theory: 'Based on Euler-Bernoulli beam kinematics where plane sections remain plane and perpendicular to the neutral axis during bending. Maximum tensile and compressive stresses occur at extreme outer fibers.',
    derivation: 'Strain variation across depth is $\\epsilon = -y / \\rho$. Hooke’s law yields stress $\\sigma = E\\epsilon = -Ey/\\rho$. Integrating internal moments gives $M = \\int y \\sigma\\,dA = \\frac{E}{I} \\int y^2\\,dA = \\frac{EI}{\\rho}$, leading to $\\sigma = \\frac{My}{I}$.',
    assumptions: ['Linear elastic homogeneous material ($E$ constant).', 'Pure bending without torsional warping or high shear deformations.', 'Small deflections.'],
    variables: [
      { name: 'Bending Stress', symbol: '\\sigma', unit: 'Pascals (MPa = N/mm²)', description: 'Normal stress at distance y from neutral axis.' },
      { name: 'Bending Moment', symbol: 'M', unit: 'Newton-meters (N·m)', description: 'Internal resultant bending moment.' },
      { name: 'Fiber Distance', symbol: 'y', unit: 'Meters (m)', description: 'Perpendicular distance from centroidal neutral axis.' },
      { name: 'Second Moment of Area', symbol: 'I', unit: 'm⁴', description: 'Section area moment of inertia about neutral axis.' },
      { name: 'Section Modulus', symbol: 'Z = I/y_{max}', unit: 'm³', description: 'Elastic section modulus.' }
    ],
    solvedExample: {
      problem: 'A steel I-beam with section modulus Z = 500 cm³ (5 × 10⁻⁴ m³) sustains bending moment M = 40 kN·m. Find maximum stress.',
      steps: [
        'M = 40,000 N·m, Z = 5 × 10⁻⁴ m³',
        'σ_max = M / Z = 40,000 / (5 × 10⁻⁴) = 80,000,000 Pa = 80 MPa.'
      ],
      result: '80 MPa'
    },
    commonMistakes: [
      'Using outer fiber height instead of distance from neutral axis centroid.',
      'Inconsistent unit scaling (e.g. mixing kN·m with mm⁴ without conversion).'
    ],
    relatedCalculator: 'standard',
    calculatorDefaults: { a: '40000', b: '0.0005', op: '/' }
  },

  // ==========================================
  // 12. CHEMICAL ENGINEERING
  // ==========================================
  {
    slug: 'ideal-gas-law',
    title: 'Ideal Gas Equation of State',
    category: 'chemical',
    categoryName: 'Chemical Engineering',
    difficulty: 'Beginner',
    latex: 'P V = n R T = \\frac{m}{M} R T',
    description: 'Fundamental thermodynamic equation of state relating pressure, volume, temperature, and quantity of an ideal gas.',
    theory: 'Combines Boyle’s, Charles’s, and Avogadro’s laws under the assumption of elastic point-mass collisions with zero intermolecular potential energy forces.',
    derivation: 'Derived via kinetic theory of gases through momentum transfer rate of $N$ molecules against vessel boundaries.',
    assumptions: ['Intermolecular volume is negligible compared to total volume.', 'No intermolecular attractive or repulsive forces (low pressure, high temperature).'],
    variables: [
      { name: 'Absolute Pressure', symbol: 'P', unit: 'Pascals (Pa)', description: 'Gas pressure.' },
      { name: 'Volume', symbol: 'V', unit: 'Cubic meters (m³)', description: 'Occupied containment volume.' },
      { name: 'Substance Amount', symbol: 'n', unit: 'Moles (mol)', description: 'Amount of chemical substance.' },
      { name: 'Universal Gas Constant', symbol: 'R', unit: '8.314 J/(mol·K)', description: 'Universal gas constant.' },
      { name: 'Absolute Temperature', symbol: 'T', unit: 'Kelvin (K)', description: 'Thermodynamic absolute temperature.' }
    ],
    solvedExample: {
      problem: 'Find the volume occupied by 2 moles of ideal gas at standard atmospheric pressure (101,325 Pa) and 300 K.',
      steps: [
        'n = 2 mol, R = 8.314 J/(mol·K), T = 300 K, P = 101,325 Pa',
        'V = (n R T) / P = (2 × 8.314 × 300) / 101,325',
        'V = 4,988.4 / 101,325 ≈ 0.04923 m³ (49.23 Liters).'
      ],
      result: '49.23 L'
    },
    commonMistakes: [
      'Using temperature in Celsius instead of absolute Kelvin ($K = °C + 273.15$).',
      'Using gauge pressure rather than absolute pressure.'
    ],
    relatedCalculator: 'unit-temperature',
    calculatorDefaults: { value: '26.85', fromUnit: 'celsius', toUnit: 'kelvin' }
  },

  // ==========================================
  // 13. COMPUTER SCIENCE & IT
  // ==========================================
  {
    slug: 'shannon-entropy',
    title: 'Shannon Information Entropy',
    category: 'computer-science',
    categoryName: 'Computer Science & IT',
    difficulty: 'Intermediate',
    latex: 'H(X) = - \\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i) = \\sum_{i=1}^{n} P(x_i) \\log_2 \\left(\\frac{1}{P(x_i)}\\right)',
    description: 'Measures the average rate of information produced, uncertainty, or average minimum number of bits required to encode an event from a stochastic source.',
    theory: 'Proposed by Claude Shannon in 1948. If all $n$ outcomes are equally probable, entropy achieves its maximum $H(X) = \\log_2(n)$ bits. If an outcome is certain ($P=1$), entropy is 0.',
    derivation: 'Derived axiomatically from properties of information additivity: $I(A \\cap B) = I(A) + I(B) \\implies I(p) = -\\log_2(p)$. The expectation of self-information gives entropy $H(X) = \\mathbb{E}[I(X)]$.',
    assumptions: ['Probabilities must sum to unity: $\\sum P(x_i) = 1$.', 'By continuity convention, $0 \\log_2(0) \\equiv 0$.'],
    variables: [
      { name: 'Entropy', symbol: 'H(X)', unit: 'Bits per symbol (or Shannons)', description: 'Average information content.' },
      { name: 'Event Probability', symbol: 'P(x_i)', unit: 'Probability [0, 1]', description: 'Likelihood of outcome i.' }
    ],
    solvedExample: {
      problem: 'Calculate entropy of an unfair coin with P(Heads) = 0.75 and P(Tails) = 0.25.',
      steps: [
        'H = - [0.75 log₂(0.75) + 0.25 log₂(0.25)]',
        'log₂(0.75) ≈ -0.4150, log₂(0.25) = -2.0',
        'H = - [0.75(-0.4150) + 0.25(-2.0)] = - [-0.3113 - 0.5000] = 0.8113 bits.'
      ],
      result: '0.8113 bits'
    },
    commonMistakes: [
      'Using natural log (ln) or common log (log10) without converting units to nats or dits.',
      'Treating continuous differential entropy identically to discrete Shannon entropy.'
    ],
    relatedCalculator: 'logarithm',
    calculatorDefaults: { val: '2', base: '2' }
  },

  // ==========================================
  // 14. ADVANCED ENGINEERING MATHEMATICS
  // ==========================================
  {
    slug: 'fourier-transform',
    title: 'Continuous Fourier Transform',
    category: 'advanced-math',
    categoryName: 'Advanced Engineering Math',
    difficulty: 'Advanced',
    latex: '\\mathcal{F}\\{f(t)\\} = F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-j \\omega t} dt',
    description: 'Integral transform that decomposes a time-domain signal into its constituent continuous spectrum of sinusoidal frequencies.',
    theory: 'Maps functions from temporal or spatial domains into the frequency domain. Essential for spectral analysis, quantum mechanics wave functions, partial differential equations, and telecommunication modulation.',
    derivation: 'Arises as the continuous limit of the Fourier series representation as period $T \\to \\infty$, turning discrete harmonic spikes into an integral continuum.',
    assumptions: ['Dirichlet conditions: $f(t)$ is absolutely integrable: $\\int_{-\\infty}^{\\infty} |f(t)| dt < \\infty$.', 'Finite number of maxima/minima and discontinuities.'],
    variables: [
      { name: 'Time-domain Signal', symbol: 'f(t)', unit: 'Amplitude units', description: 'Original signal as a function of time.' },
      { name: 'Frequency Spectrum', symbol: 'F(\\omega)', unit: 'Amplitude / (rad/s)', description: 'Complex spectral density.' },
      { name: 'Angular Frequency', symbol: '\\omega', unit: 'Radians per second (rad/s)', description: 'Continuous angular frequency.' },
      { name: 'Complex Unit', symbol: 'j', unit: 'Imaginary unit', description: '$j = \\sqrt{-1}$.' }
    ],
    solvedExample: {
      problem: 'Find Fourier transform of the one-sided decay pulse f(t) = e^(-at) u(t) for a > 0.',
      steps: [
        'F(ω) = ∫₀^∞ e^(-at) e^(-jωt) dt = ∫₀^∞ e^(-(a + jω)t) dt',
        'Evaluate limits: [ -e^(-(a + jω)t) / (a + jω) ] from 0 to ∞',
        'At ∞: e^(-∞) = 0. At 0: - (-1) / (a + jω) = 1 / (a + jω).'
      ],
      result: 'F(ω) = 1 / (a + jω)'
    },
    commonMistakes: [
      'Omitting the negative sign in exponent $e^{-j\\omega t}$ (which belongs to forward transform).',
      'Forgetting that $F(\\omega)$ is generally complex, requiring magnitude $|F(\\omega)|$ and phase $\\angle F(\\omega)$ plots.'
    ],
    relatedCalculator: 'degree-radian',
    calculatorDefaults: { value: '180', fromUnit: 'deg' }
  }
];
