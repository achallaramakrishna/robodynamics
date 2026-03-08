#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import os
root = "/opt/robodynamics/ai-tutor/web/app"
removed = []
for d, _, files in os.walk(root):
    for f in files:
        p = os.path.join(d, f)
        if "\\" in p:
            os.remove(p)
            removed.append(p)
for p in sorted(removed):
    print(p)
print("REMOVED=", len(removed))
PY