set -e
curl -sS "https://robodynamics.in/api/vedic/catalog?courseId=vedic_math" > /tmp/ai_catalog.json
echo "CATALOG_HEAD"
head -c 220 /tmp/ai_catalog.json
echo
echo "COURSE_LINE"
grep -o '"courseId":"[^"]*"' /tmp/ai_catalog.json | head -n 1 || true
echo "CHAPTER_COUNT"
grep -o '"chapterCode":"' /tmp/ai_catalog.json | wc -l