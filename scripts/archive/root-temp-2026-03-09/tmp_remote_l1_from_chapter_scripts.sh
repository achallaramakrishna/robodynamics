set -e
f=/opt/robodynamics/vedic_math/chapter_scripts.json
if [ ! -f "$f" ]; then
  echo MISSING=$f
  exit 0
fi
node - <<'NODE'
const fs=require('fs');
const f='/opt/robodynamics/vedic_math/chapter_scripts.json';
const j=JSON.parse(fs.readFileSync(f,'utf8'));
const l1=j['L1_COMPLETING_WHOLE']||{};
const beats=Array.isArray(l1.screenplay)?l1.screenplay:[];
const byCue={};
for(const b of beats){byCue[b.cue]=(byCue[b.cue]||0)+1;}
const pauseStudent=beats.filter(b=>b.pauseType==='student_response').length;
const withSvg=beats.filter(b=>Array.isArray(b.svgAnimation)&&b.svgAnimation.length>0).length;
console.log(JSON.stringify({title:l1.title,source:l1.source,teachingScript:(l1.teachingScript||[]).length,screenplay:beats.length,byCue,pauseStudent,withSvg,firstSubtopics:(l1.subtopics||[]).slice(0,8)},null,2));
NODE
