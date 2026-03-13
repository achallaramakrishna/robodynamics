set -euo pipefail
python3 - <<'PY'
import json
from collections import Counter

path = '/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json'
with open(path, 'r', encoding='utf-8') as f:
    j = json.load(f)

group_configs = {
  'A': {
    'subtopic': 'Introduction to Completing the Whole',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 1: Introduction to Completing the Whole. We focus on friendly numbers and mental structure.',
    'boardAction': 'Write the chapter theme and show one quick whole: 24 + 26 = 50.',
    'checkpointPrompt': "In one sentence, what does 'completing the whole' mean?",
    'microPractice': 'Micro-practice: explain how 24 + 26 becomes 50 using whole completion.'
  },
  'B': {
    'subtopic': 'Pairs That Make 10',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 2: Pairs That Make 10. Instant complements build speed.',
    'boardAction': 'List 1+9, 2+8, 3+7, 4+6, 5+5 and highlight instant recall.',
    'checkpointPrompt': 'What pairs with 7 to make 10? What pairs with 4 to make 10?',
    'microPractice': 'Micro-practice: answer five complement-to-10 prompts in under 20 seconds.'
  },
  'C': {
    'subtopic': 'Ten Point Circle',
    'boardMode': 'svg',
    'teacherLine': 'Scene 3: Ten Point Circle. We use visual branches to track patterns.',
    'boardAction': 'Draw the ten-point circle and label branch families (1,11,21...) and tens branch (10,20,30...).',
    'checkpointPrompt': 'On the ten-point circle, which branch does 32 lie on?',
    'microPractice': 'Micro-practice: place 12, 25, 38, and 40 on the correct branches.'
  },
  'D': {
    'subtopic': 'Completing the Next Ten',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 4: Completing the Next Ten. Reach the nearest ten first, then add the remainder.',
    'boardAction': 'Solve 49 + 5 as 50 + 4 and mark the split on a number jump.',
    'checkpointPrompt': 'Solve 49 + 5 by first completing the next ten.',
    'microPractice': 'Micro-practice: solve 37 + 6 and say how much was used to reach 40.'
  },
  'E': {
    'subtopic': 'Deficiency from Ten',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 5: Deficiency from Ten. State how far a number is below the next base.',
    'boardAction': 'Model deficiency statements: 68 is close to 70 and is 2 below; 58 + 7 = 60 + 5.',
    'checkpointPrompt': 'Fill in: 68 is close to ___ and is ___ below.',
    'microPractice': 'Micro-practice: write deficiency statements for 49, 68, and 79.'
  },
  'F': {
    'subtopic': 'Mental Addition with Carry',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 6: Mental Addition with Carry. Split tens and ones, then recombine calmly.',
    'boardAction': 'Show 56 + 26 = (50+20) + (6+6) = 70 + 12 = 82.',
    'checkpointPrompt': 'Solve 56 + 26 using tens-and-ones split.',
    'microPractice': 'Micro-practice: solve 48 + 45 by splitting tens and ones.'
  },
  'G': {
    'subtopic': 'Grouping Numbers into Wholes',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 7: Grouping Numbers into Wholes. Reorder to create easy whole sums first.',
    'boardAction': 'Demonstrate 19 + 8 + 1 = (19+1)+8 and 33+28+4+32 = (28+32)+33+4.',
    'checkpointPrompt': 'Reorder 19 + 8 + 1 to make a whole first.',
    'microPractice': 'Micro-practice: group 6 + 7 + 4 and solve by forming 10 first.'
  },
  'H': {
    'subtopic': 'Add Near a Base',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 8: Add Near a Base. Add the base value, then adjust by the deficiency.',
    'boardAction': 'Work 54 + 39 as 54 + 40 - 1 and 66 + 19 as 66 + 20 - 1.',
    'checkpointPrompt': 'Solve 54 + 39 using +40 -1.',
    'microPractice': 'Micro-practice: solve 33 + 9 using +10 -1.'
  },
  'I': {
    'subtopic': 'Subtract Near a Base',
    'boardMode': 'free_draw',
    'teacherLine': 'Scene 9: Subtract Near a Base. Subtract the base and add back the deficiency.',
    'boardAction': 'Work 72 - 48 as 72 - 50 + 2 and 55 - 19 as 55 - 20 + 1.',
    'checkpointPrompt': 'Solve 72 - 48 using -50 +2.',
    'microPractice': 'Micro-practice: solve 61 - 38 using -40 +2.'
  }
}

j['subtopics'] = [group_configs[g]['subtopic'] for g in 'ABCDEFGHI']

for ts in j.get('teachingScript', []):
    g = str(ts.get('exerciseGroup', '')).upper()
    if g not in group_configs:
        continue
    cfg = group_configs[g]
    ts['subtopic'] = cfg['subtopic']
    ts['boardMode'] = cfg['boardMode']
    ts['teacherLine'] = cfg['teacherLine']
    ts['boardAction'] = cfg['boardAction']
    ts['checkpointPrompt'] = cfg['checkpointPrompt']
    ts['microPractice'] = cfg['microPractice']

cue_teacher = {
  'intro': 'Intro: {topic}. We will move explain, demo, guided, practice, and check in order.',
  'explain': 'Explain: Here is the core idea for {topic} and why it works.',
  'demo': 'Demo: Watch me solve one board example for {topic} step by step.',
  'guided': 'Guided: You try the next one; I will nudge only where needed.',
  'practice': 'Practice: Solve this one independently using the same flow.',
  'check': 'Check: Let us verify your answer and reasoning together.',
  'checkpoint': 'Checkpoint: Give your final method in one concise line.'
}
cue_board = {
  'intro': 'Set board title, objective, and one anchor example for {topic}.',
  'explain': 'Draw concept map and annotate rule language for {topic}.',
  'demo': 'Write each step on board and narrate the decision points.',
  'guided': 'Leave blanks on board and prompt learner for each missing step.',
  'practice': 'Show only the question; keep board clean for student solve.',
  'check': 'Mark the correct path and highlight where errors usually happen.',
  'checkpoint': 'Pause for student response and capture one-sentence summary.'
}

for beat in j.get('screenplay', []):
    g = str(beat.get('exerciseGroup', '')).upper()
    if g not in group_configs:
        continue
    cfg = group_configs[g]
    old_sub = str(beat.get('subtopic', ''))
    new_sub = cfg['subtopic']
    cue = str(beat.get('cue', '')).lower()

    beat['subtopic'] = new_sub
    beat['boardMode'] = cfg['boardMode']
    beat['checkpointPrompt'] = cfg['checkpointPrompt']
    beat['fallbackHint'] = cfg['microPractice']

    if cue in cue_teacher:
        beat['teacherLine'] = cue_teacher[cue].format(topic=new_sub)
    if cue in cue_board:
        beat['boardAction'] = cue_board[cue].format(topic=new_sub)

    if cue == 'checkpoint':
        beat['pauseType'] = 'student_response'
        beat['holdSec'] = 0.85
        beat['expectedStudentResponse'] = 'Student states answer and why the method works.'

    for obj in beat.get('svgAnimation', []) or []:
        if obj.get('kind') == 'text' and isinstance(obj.get('text'), str) and old_sub and old_sub in obj['text']:
            obj['text'] = obj['text'].replace(old_sub, new_sub)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(j, f, indent=2, ensure_ascii=False)
    f.write('\n')

beats = j.get('screenplay') or []
print('UPDATED_REMOTE_JSON=1')
print('TS=', len(j.get('teachingScript') or []))
print('BEATS=', len(beats))
print('CUES=', dict(Counter(b.get('cue') for b in beats)))
PY

systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api || true)

python3 - <<'PY'
import json
from collections import Counter
path='/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json'
with open(path,'r',encoding='utf-8') as f:
    j=json.load(f)
print('UNIQUE_TS_SUBTOPICS=', len(set((x.get('subtopic') or '').strip() for x in (j.get('teachingScript') or []))))
for g in 'ABCDEFGHI':
    arr=[b for b in (j.get('screenplay') or []) if str(b.get('exerciseGroup','')).upper()==g]
    arr=sorted(arr,key=lambda x:int(x.get('sequence',0)))
    print('ORDER_'+g+'='+ '->'.join((b.get('cue') or '') for b in arr))
print('CUE_COUNTS=', dict(Counter((b.get('cue') or '') for b in (j.get('screenplay') or []))))
print('CHECKPOINT_PAUSE=', sum(1 for b in (j.get('screenplay') or []) if (b.get('cue')=='checkpoint' and b.get('pauseType')=='student_response')))
print('TS_SUBTOPICS=', [x.get('subtopic') for x in (j.get('teachingScript') or [])])
PY
