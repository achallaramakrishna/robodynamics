#!/bin/bash
set -euo pipefail
p=/opt/tomcat/webapps/ROOT/WEB-INF/views/student/aptipath-result.jsp
echo HAS_DERIVED_MATH=$(grep -F -c 'mathDerivedPct' "$p")
echo HAS_DERIVED_SCALE=$(grep -F -c 'derivedScale' "$p")
echo HAS_SECTION_BASED_FALLBACK=$(grep -F -c 'sectionScoreDisplayMap' "$p")
set -- $(sha256sum "$p")
echo PROD_SHA=$1
echo PROD_SIZE=$(stat -c %s "$p")