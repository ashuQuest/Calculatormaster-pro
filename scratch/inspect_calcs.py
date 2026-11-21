import re

with open('frontend/src/calculators/registry.js', 'r', encoding='utf-8') as f:
    text = f.read()

# match inside CALCULATORS_CATALOG
cat_match = re.search(r'export const CALCULATORS_CATALOG = \[(.*)\];', text, re.DOTALL)
if cat_match:
    catalog_content = cat_match.group(1)
    items = re.findall(r"id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*category:\s*'([^']+)'", catalog_content)
    print(f'Total catalog items: {len(items)}')
    for idx, (cid, name, cat) in enumerate(items, 1):
        print(f'{idx:02d}. [{cat}] {cid}: {name}')
