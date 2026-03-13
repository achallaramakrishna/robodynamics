#!/bin/sh
curl -s http://127.0.0.1:8080/ | grep -E 'id="career-discover"|id="career-pricing"|id="exam-courses"|id="tuition-info"' | head -n 20
