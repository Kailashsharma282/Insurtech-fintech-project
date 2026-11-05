import os
import re

matches = {}

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            for idx, line in enumerate(lines):
                if re.search(r'(subsidy|farmerShare|farmer.*share|sumInsured|gross.*premium)', line, re.IGNORECASE):
                    if filepath not in matches:
                        matches[filepath] = []
                    clean = line.strip().encode('ascii', 'replace').decode('ascii')
                    matches[filepath].append((idx + 1, clean))

with open('subsidy_occurrences.txt', 'w', encoding='utf-8') as out:
    for fp, items in matches.items():
        out.write(f"\n=== {fp} ({len(items)} occurrences) ===\n")
        for line_no, text in items:
            out.write(f"  L{line_no}: {text[:120]}\n")

print(f"Scanned {len(matches)} files with subsidy references.")
