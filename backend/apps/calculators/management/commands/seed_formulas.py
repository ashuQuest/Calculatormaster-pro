from django.core.management.base import BaseCommand
from apps.calculators.models import FormulaCategory, FormulaItem, FormulaVariable, FormulaExample

FORMULA_CATEGORIES = [
    { 'slug': 'basic-math', 'name': 'Basic Mathematics', 'icon': 'Calculator', 'description': 'Arithmetic, proportions, percentages, and number theory.', 'order': 1 },
    { 'slug': 'algebra', 'name': 'Algebra', 'icon': 'Sigma', 'description': 'Polynomials, quadratic equations, progressions, and series.', 'order': 2 },
    { 'slug': 'geometry-trig', 'name': 'Geometry & Trigonometry', 'icon': 'Compass', 'description': 'Angles, triangles, coordinate systems, and solid geometry.', 'order': 3 },
    { 'slug': 'calculus', 'name': 'Calculus & Differential Equations', 'icon': 'Infinity', 'description': 'Derivatives, integrals, limits, and differential forms.', 'order': 4 },
    { 'slug': 'statistics', 'name': 'Statistics & Probability', 'icon': 'BarChart2', 'description': 'Distributions, expected values, dispersion, and Bayes theorem.', 'order': 5 },
    { 'slug': 'linear-algebra', 'name': 'Linear Algebra', 'icon': 'Grid', 'description': 'Vectors, matrices, determinants, eigenvalues, and spaces.', 'order': 6 },
    { 'slug': 'physics', 'name': 'Physics', 'icon': 'Atom', 'description': 'Classical mechanics, thermodynamics, electromagnetism, and optics.', 'order': 7 },
    { 'slug': 'electrical', 'name': 'Electrical Engineering', 'icon': 'Zap', 'description': 'Circuits, Ohm’s & Kirchhoff’s laws, AC power, and impedance.', 'order': 8 },
    { 'slug': 'electronics', 'name': 'Electronics & Communication', 'icon': 'Cpu', 'description': 'Semiconductors, filters, amplifiers, and signal theory.', 'order': 9 },
    { 'slug': 'mechanical', 'name': 'Mechanical Engineering', 'icon': 'Settings', 'description': 'Fluid mechanics, heat transfer, stress-strain, and machines.', 'order': 10 },
    { 'slug': 'civil', 'name': 'Civil & Structural Engineering', 'icon': 'Building2', 'description': 'Beams, hydraulics, soil mechanics, and structural analysis.', 'order': 11 },
    { 'slug': 'chemical', 'name': 'Chemical Engineering', 'icon': 'FlaskConical', 'description': 'Kinetics, thermodynamics, mass transfer, and equilibrium.', 'order': 12 },
    { 'slug': 'computer-science', 'name': 'Computer Science & IT', 'icon': 'Binary', 'description': 'Big-O complexity, information theory, cryptography, and logic.', 'order': 13 },
    { 'slug': 'advanced-math', 'name': 'Advanced Engineering Math', 'icon': 'Orbit', 'description': 'Fourier transforms, Laplace transforms, and complex analysis.', 'order': 14 }
]

FORMULAS = [
    {
        'slug': 'percentage-change',
        'title': 'Percentage Change & Growth Rate',
        'category_slug': 'basic-math',
        'difficulty': 'Beginner',
        'latex_expression': r'\Delta\% = \left( \frac{V_2 - V_1}{V_1} \right) \times 100\%',
        'plain_formula': 'Change% = ((V2 - V1) / V1) * 100',
        'description': 'Calculates the relative degree of increase or decrease between an initial value and a subsequent value expressed as a percentage.',
        'theory': 'Percentage change standardizes differences relative to a benchmark starting value V1. A positive result indicates growth or appreciation, while a negative result represents depreciation or contraction.',
        'derivation': '1. Compute absolute delta: ΔV = V2 - V1.\n2. Divide by the initial benchmark V1 to find relative fractional change.\n3. Multiply by 100 to convert to percentage.',
        'boundary_conditions': ['Initial value V1 != 0.', 'Units of V1 and V2 must be identical.'],
        'common_mistakes': ['Dividing by final value V2 instead of initial value V1.', 'Forgetting that physical quantities cannot decrease more than 100%.'],
        'related_calculator_slug': 'percentage',
        'default_inputs': { 'type': 'change', 'val1': '250000', 'val2': '315000' },
        'variables': [
            { 'name': 'Initial Value', 'symbol_latex': 'V_1', 'unit': 'Dimensionless / Currency', 'description': 'Original benchmark amount.' },
            { 'name': 'Final Value', 'symbol_latex': 'V_2', 'unit': 'Dimensionless / Currency', 'description': 'Observed value after change.' },
            { 'name': 'Percentage Change', 'symbol_latex': r'\Delta\%', 'unit': '%', 'description': 'Relative growth or decline.' }
        ],
        'examples': [
            {
                'problem_statement': 'A company revenue grew from ₹2,50,000 to ₹3,15,000. Calculate percentage growth.',
                'solution_steps': ['Calculate delta: ₹3,15,000 - ₹2,50,000 = ₹65,000', 'Divide by initial: ₹65,000 / ₹2,50,000 = 0.26', 'Multiply by 100%: 0.26 × 100% = +26.00% growth.'],
                'final_result': '+26.00%'
            }
        ]
    },
    {
        'slug': 'quadratic-formula',
        'title': 'Quadratic Equation Formula',
        'category_slug': 'algebra',
        'difficulty': 'Intermediate',
        'latex_expression': r'x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}',
        'plain_formula': 'x = (-b ± sqrt(b^2 - 4ac)) / (2a)',
        'description': 'Closed-form roots of the general second-degree polynomial equation ax^2 + bx + c = 0.',
        'theory': 'The nature of roots is determined by the discriminant Δ = b^2 - 4ac. Real distinct if Δ > 0, repeated if Δ = 0, and complex conjugate if Δ < 0.',
        'derivation': 'Derived through completing the square on ax^2 + bx + c = 0.',
        'boundary_conditions': ['Leading coefficient a != 0.', 'Coefficients a, b, c in R.'],
        'common_mistakes': ['Neglecting the negative sign in -b when b is already negative.', 'Forgetting that 2a divides the entire numerator.'],
        'related_calculator_slug': 'quadratic-equation',
        'default_inputs': { 'a': '1', 'b': '-5', 'c': '6' },
        'variables': [
            { 'name': 'Quadratic Coefficient', 'symbol_latex': 'a', 'unit': 'Dimensionless', 'description': 'Non-zero coefficient of x².' },
            { 'name': 'Linear Coefficient', 'symbol_latex': 'b', 'unit': 'Dimensionless', 'description': 'Coefficient of x.' },
            { 'name': 'Constant Term', 'symbol_latex': 'c', 'unit': 'Dimensionless', 'description': 'Independent constant.' }
        ],
        'examples': [
            {
                'problem_statement': 'Solve x^2 - 5x + 6 = 0.',
                'solution_steps': ['Identify: a = 1, b = -5, c = 6', 'Discriminant Δ = (-5)² - 4(1)(6) = 25 - 24 = 1', 'Roots: x = [5 ± 1] / 2 => x1 = 3, x2 = 2.'],
                'final_result': 'x = 3, x = 2'
            }
        ]
    },
    {
        'slug': 'ohms-law',
        'title': "Ohm's Law & Electric Power",
        'category_slug': 'electrical',
        'difficulty': 'Beginner',
        'latex_expression': r'V = I \cdot R \quad \Longleftrightarrow \quad P = V \cdot I = I^2 R = \frac{V^2}{R}',
        'plain_formula': 'V = I * R, P = V * I = I^2 * R',
        'description': 'Fundamental relationship governing voltage, current, resistance, and dissipated electrical power in linear DC conductors.',
        'theory': 'In ohmic conductors, current density is proportional to electric field. Potential drop V equals current I multiplied by resistance R.',
        'derivation': 'Power is the time rate of electrical work: P = dW/dt = (dq/dt) * V = I * V. Substituting V = IR gives P = I²R.',
        'boundary_conditions': ['Linear ohmic conductor.', 'Constant temperature and resistance.'],
        'common_mistakes': ['Applying to AC reactive circuits without considering phase angle and power factor.'],
        'related_calculator_slug': 'electricity-bill',
        'default_inputs': { 'watts': '2300', 'hours': '4', 'rate': '8' },
        'variables': [
            { 'name': 'Voltage', 'symbol_latex': 'V', 'unit': 'Volts (V)', 'description': 'Electrical potential difference.' },
            { 'name': 'Current', 'symbol_latex': 'I', 'unit': 'Amperes (A)', 'description': 'Rate of charge flow.' },
            { 'name': 'Resistance', 'symbol_latex': 'R', 'unit': 'Ohms (Ω)', 'description': 'Opposition to current.' }
        ],
        'examples': [
            {
                'problem_statement': 'An electric heater operating on 230 V draws 10 A of current. Calculate its resistance and power rating.',
                'solution_steps': ['Resistance: R = V / I = 230 / 10 = 23 Ω', 'Power: P = V × I = 230 × 10 = 2,300 W (2.3 kW).'],
                'final_result': 'R = 23 Ω, P = 2.3 kW'
            }
        ]
    }
]

class Command(BaseCommand):
    help = 'Seed Formula Categories and Items into Database'

    def handle(self, *args, **options):
        self.stdout.write('Seeding formula categories...')
        cat_map = {}
        for cat_data in FORMULA_CATEGORIES:
            cat, created = FormulaCategory.objects.update_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'icon': cat_data['icon'],
                    'description': cat_data['description'],
                    'display_order': cat_data['order']
                }
            )
            cat_map[cat.slug] = cat

        self.stdout.write(f'Created/updated {len(cat_map)} categories.')

        self.stdout.write('Seeding formula items...')
        for f_data in FORMULAS:
            cat = cat_map.get(f_data['category_slug'])
            if not cat:
                continue
            
            formula, created = FormulaItem.objects.update_or_create(
                slug=f_data['slug'],
                defaults={
                    'title': f_data['title'],
                    'category': cat,
                    'difficulty': f_data['difficulty'],
                    'latex_expression': f_data['latex_expression'],
                    'plain_formula': f_data['plain_formula'],
                    'description': f_data['description'],
                    'theory': f_data['theory'],
                    'derivation': f_data['derivation'],
                    'boundary_conditions': f_data['boundary_conditions'],
                    'common_mistakes': f_data['common_mistakes'],
                    'related_calculator_slug': f_data['related_calculator_slug'],
                    'default_inputs': f_data['default_inputs']
                }
            )

            # Seed variables
            formula.variables.all().delete()
            for idx, v_data in enumerate(f_data.get('variables', [])):
                FormulaVariable.objects.create(
                    formula=formula,
                    name=v_data['name'],
                    symbol_latex=v_data['symbol_latex'],
                    unit=v_data['unit'],
                    description=v_data['description'],
                    order=idx
                )

            # Seed examples
            formula.examples.all().delete()
            for ex_data in f_data.get('examples', []):
                FormulaExample.objects.create(
                    formula=formula,
                    problem_statement=ex_data['problem_statement'],
                    solution_steps=ex_data['solution_steps'],
                    final_result=ex_data['final_result']
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded formula library!'))
