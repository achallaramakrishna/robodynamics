#!/bin/bash
set -euo pipefail
systemctl status rd-ai-tutor-api --no-pager -l || true
journalctl -u rd-ai-tutor-api -n 160 --no-pager || true