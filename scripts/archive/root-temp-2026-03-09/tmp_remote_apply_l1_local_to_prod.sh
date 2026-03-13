set -euo pipefail
install -D -m 644 /tmp/course_script_loader.py /opt/robodynamics/ai-tutor/tutor-api/app/services/course_script_loader.py
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api)

echo 'LOADER_ORDER_CHECK'
grep -n 'Prefer per-chapter JSON files over index entries' /opt/robodynamics/ai-tutor/tutor-api/app/services/course_script_loader.py | head -n 1 || true
grep -n 'indexed = self._index.get' /opt/robodynamics/ai-tutor/tutor-api/app/services/course_script_loader.py | head -n 1 || true

echo 'L1_FILE_CHECK'
f=/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
echo FILE_EXISTS=$( [ -f "$f" ] && echo yes || echo no )
sha256sum "$f" | awk '{print "SHA=" $1}'
node - <<'NODE'
const fs=require('fs');
const p='/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
const beats=j.screenplay||[];
const byCue={};
for(const b of beats){byCue[b.cue]=(byCue[b.cue]||0)+1;}
console.log('TS='+(j.teachingScript||[]).length);
console.log('BEATS='+beats.length);
console.log('CUES='+JSON.stringify(byCue));
console.log('PAUSE_STUDENT='+beats.filter(b=>b.pauseType==='student_response').length);
console.log('WITH_SVG='+beats.filter(b=>Array.isArray(b.svgAnimation)&&b.svgAnimation.length>0).length);
console.log('SOURCE='+j.source);
NODE

# Verify what live content root currently has for chapter_scripts reference (informational)
if [ -f /opt/robodynamics/vedic_math/chapter_scripts.json ]; then
  echo CHAPTER_SCRIPTS_SHA=$(sha256sum /opt/robodynamics/vedic_math/chapter_scripts.json | awk '{print $1}')
fi
