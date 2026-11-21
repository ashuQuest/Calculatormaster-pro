import re

with open('frontend/src/calculators/engine.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect line where case 'age' ends
pos = content.find("case 'age':")
print('Found age at:', pos)
