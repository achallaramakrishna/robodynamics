#!/usr/bin/env bash
BASE='/opt/robodynamics/cms-engine/workspace/courses/162/chapters/be0aaa5c-9ba5-41d7-a524-9d3f71b97ca7/assets'
for f in \
  "$BASE/notes/notes_day_01.json" \
  "$BASE/exam_papers/exam_day_01.json" \
  "$BASE/flashcards/fc_concept_beginner_01.json" \
  "$BASE/flashcards/fc_d01_01_jvm_platform.json" \
  "$BASE/lab_manuals/lab_day_01.json" \
  "$BASE/lab_manuals/lab_d01_01_jvm_platform.json"; do
  echo "===== $f ====="
  if [ -f "$f" ]; then
    head -n 60 "$f"
  else
    echo "MISSING"
  fi
  echo
 done
