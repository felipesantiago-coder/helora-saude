import re

with open('src/components/helora/HeroSection.tsx') as f:
    src = f.read()

orig_lines = src.split('\n')
d = 0
for li, line in enumerate(orig_lines, 1):
    opens = line.count('{')
    closes = line.count('}')
    if opens > 0 or closes > 0:
        old = d
        d += opens - closes
        marker = ''
        if d != old and (d <= 2 or old <= 2):
            marker = f'  <<< {old} -> {d}'
        if opens > 0 or closes > 0:
            print(f'{li:4d} +{opens} -{closes} = {d:3d}{marker}  {line.strip()[:100]}')
print(f'\nFinal depth: {d}')