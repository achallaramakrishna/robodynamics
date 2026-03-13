python3 --version || true
if [ -n "$OPENAI_API_KEY" ]; then
  echo OPENAI_KEY_PRESENT
else
  echo OPENAI_KEY_MISSING
fi
