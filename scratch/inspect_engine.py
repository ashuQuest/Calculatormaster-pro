import re

with open('frontend/src/calculators/engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

cases = re.findall(r"case '([^']+)':", text)
print('Cases in engine.js:', len(cases))
print(cases)

with open('frontend/src/calculators/registry.js', 'r', encoding='utf-8') as f:
    reg_text = f.read()

cat_match = re.search(r'export const CALCULATORS_CATALOG = \[(.*)\];', reg_text, re.DOTALL)
items = re.findall(r"id:\s*'([^']+)'", cat_match.group(1))

missing = [i for i in items if i not in cases]
print('Missing cases in engine.js:', len(missing))
print(missing)
