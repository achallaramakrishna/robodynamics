set -e
h=/opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
if [ -f "$h" ]; then
  echo HAS_INTRO_BUILDER=$(grep -c 'buildIntroSlideBoardSteps' "$h")
  echo HAS_DEMO_STEPS=$(grep -c 'CHAPTER_DEMO_STEPS' "$h")
  echo HAS_DEMO_SPEECH=$(grep -c 'CHAPTER_DEMO_SPEECH' "$h")
  echo INTRO_SLIDE_CALLS=$(grep -n 'buildIntroSlideBoardSteps(1\|buildIntroSlideBoardSteps(2\|buildIntroSlideBoardSteps(3' "$h" | wc -l)
  grep -n 'buildIntroSlideBoardSteps(1\|buildIntroSlideBoardSteps(2\|buildIntroSlideBoardSteps(3' "$h" | head -n 5 || true
fi
