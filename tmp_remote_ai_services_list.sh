#!/bin/bash
set -euo pipefail
ls -la /opt/robodynamics/ai-tutor/tutor-api/app/services || true
find /opt/robodynamics/ai-tutor/tutor-api/app/services -maxdepth 1 -type f -name '*.py' -printf '%f\n' | sort || true