#!/bin/bash
set +e
for cmd in "node -v" "npm -v" "python3 --version" "pip3 --version" "docker --version" "docker compose version" "systemctl is-active nginx"; do
  echo "CMD=$cmd"
  eval $cmd
  echo "RC=$?"
  echo "---"
done