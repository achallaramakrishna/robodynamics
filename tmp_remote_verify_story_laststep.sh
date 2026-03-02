#!/bin/bash
set -euo pipefail
p=/opt/tomcat/webapps/ROOT/WEB-INF/views/student/aptipath-test.jsp
echo HAS_STORY_BLOCK_ID=$(grep -F -c 'id="storyInsightBlock"' "$p")
echo HAS_STORY_TOGGLE=$(grep -F -c "storyInsightBlock.classList.toggle('hidden', !isLast);" "$p")
set -- $(sha256sum "$p")
echo PROD_SHA=$1
echo PROD_SIZE=$(stat -c %s "$p")