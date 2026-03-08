#!/bin/bash
set -euo pipefail
python3 - <<'"'"'PY'"'"'
import os
root = "/opt/robodynamics/ai-tutor/web/app"
found = []
for d, _, files in os.walk(root):
    for f in files:
        p = os.path.join(d, f)
        if "\\" in p:
            found.append(p)
for p in sorted(found):
    print(p)
print("COUNT=", len(found))
PY