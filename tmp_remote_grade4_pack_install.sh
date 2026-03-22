#!/bin/bash
set -euo pipefail

API=/opt/robodynamics/ai-tutor/tutor-api
DEST="$API/content-template/vedic_math/grade_4/chapter"
mkdir -p "$DEST"

install -m 644 /tmp/ms_g4_chapters.json "$API/content-template/vedic_math/grade_4/chapters.json"
install -m 644 /tmp/ms_VM_G4_L1_FAST_ADDITION.json "$DEST/VM_G4_L1_FAST_ADDITION.json"
install -m 644 /tmp/ms_VM_G4_L2_TABLES_11_TO_19.json "$DEST/VM_G4_L2_TABLES_11_TO_19.json"
install -m 644 /tmp/ms_VM_G4_L3_DOUBLING_HALVING.json "$DEST/VM_G4_L3_DOUBLING_HALVING.json"
install -m 644 /tmp/ms_VM_G4_L4_MULT_BY_11.json "$DEST/VM_G4_L4_MULT_BY_11.json"
install -m 644 /tmp/ms_VM_G4_L5_SUBT_BORROW_FREE.json "$DEST/VM_G4_L5_SUBT_BORROW_FREE.json"
install -m 644 /tmp/ms_VM_G4_L6_MULT_BY_5_25.json "$DEST/VM_G4_L6_MULT_BY_5_25.json"
install -m 644 /tmp/ms_VM_G4_L7_NEAR_100.json "$DEST/VM_G4_L7_NEAR_100.json"
install -m 644 /tmp/ms_VM_G4_L8_CRISS_CROSS_2DIG.json "$DEST/VM_G4_L8_CRISS_CROSS_2DIG.json"

systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api)"
