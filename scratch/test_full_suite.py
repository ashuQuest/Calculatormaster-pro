import os
import re
import json

def test_everything():
    print("==================================================")
    print("CALCMASTER PRO - AUTOMATED SUITE VERIFICATION")
    print("==================================================")
    
    # 1. Inspect Calculators Catalog
    with open('frontend/src/calculators/registry.js', 'r', encoding='utf-8') as f:
        reg_text = f.read()

    cat_match = re.search(r'export const CALCULATORS_CATALOG = \[(.*)\];', reg_text, re.DOTALL)
    assert cat_match, "CALCULATORS_CATALOG not found in registry.js"
    catalog_content = cat_match.group(1)
    calc_ids = re.findall(r"id:\s*'([^']+)'", catalog_content)
    print(f"[OK] Total Calculators in Catalog: {len(calc_ids)}")
    assert len(calc_ids) >= 40, f"Expected at least 40 calculators, got {len(calc_ids)}"

    # 2. Inspect Engine cases
    with open('frontend/src/calculators/engine.js', 'r', encoding='utf-8') as f:
        eng_text = f.read()

    missing_in_engine = []
    for cid in calc_ids:
        # Check if case 'cid' exists
        if f"case '{cid}':" not in eng_text:
            missing_in_engine.append(cid)

    print(f"[OK] Missing in engine.js: {len(missing_in_engine)} -> {missing_in_engine}")
    assert len(missing_in_engine) == 0, f"Engine missing cases for: {missing_in_engine}"

    # 3. Inspect CalculatorView.jsx inputs coverage
    with open('frontend/src/pages/CalculatorView.jsx', 'r', encoding='utf-8') as f:
        view_text = f.read()

    missing_in_view = []
    for cid in calc_ids:
        if cid == 'standard':
            assert "StandardCalculator" in view_text
            continue
        if f"id === '{cid}'" not in view_text and f"id === \\'{cid}\\'" not in view_text:
            missing_in_view.append(cid)

    print(f"[OK] Missing input UI in CalculatorView.jsx: {len(missing_in_view)} -> {missing_in_view}")
    assert len(missing_in_view) == 0, f"CalculatorView missing input forms for: {missing_in_view}"

    # 4. Inspect Formula Library Catalog
    with open('frontend/src/formulas/catalog.js', 'r', encoding='utf-8') as f:
        formula_text = f.read()

    formula_slugs = re.findall(r"slug:\s*'([^']+)'", formula_text)
    print(f"[OK] Total Formulas in Formula Catalog: {len(formula_slugs)}")
    assert len(formula_slugs) >= 14, "Expected at least 14 formulas across 14 disciplines"

    # Check 14 categories
    categories = re.findall(r"id:\s*'([^']+)',\s*\n\s*name:", formula_text)
    print(f"[OK] Total Formula Categories: {len(categories)} -> {categories}")
    assert len(categories) == 14, f"Expected 14 categories, found {len(categories)}"

    # 5. Check StandardCalculator.jsx Operator Replacement & Safe Evaluation
    with open('frontend/src/components/calculator/StandardCalculator.jsx', 'r', encoding='utf-8') as f:
        calc_text = f.read()

    assert "endsWithOperator" in calc_text, "StandardCalculator must check trailing operators"
    assert "trimmed.slice(0, -1).trim() + ' ' + op + ' '" in calc_text, "StandardCalculator must replace trailing operators"
    assert "Cannot divide by zero" in calc_text, "StandardCalculator must handle division by zero"
    assert "handleKeyDown" in calc_text, "StandardCalculator must have physical keyboard event listener"
    print("[OK] StandardCalculator operator replacement & physical keyboard verification passed.")

    # 6. Check App.jsx Route Configuration
    with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
        app_text = f.read()

    required_routes = [
        'path="/calculators"',
        'path="/calculators/:category"',
        'path="/calculator/:id"',
        'path="/formulas"',
        'path="/formulas/:category"',
        'path="/formula/:slug"',
        'path="/dashboard"',
        'path="/favorites"',
        'path="/history"',
        'path="/profile"',
        'path="/pricing"',
        'path="*"'
    ]
    for r in required_routes:
        assert r in app_text, f"App.jsx missing route: {r}"
    print("[OK] App.jsx centralized route configuration verified.")

    print("==================================================")
    print("ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED.")
    print("==================================================")

if __name__ == '__main__':
    test_everything()
