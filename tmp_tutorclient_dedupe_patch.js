const fs = require('fs');
const path = 'C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx';
let text = fs.readFileSync(path, 'utf8');
if (!text.includes('const lastSpeechMetaRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });')) {
  text = text.replace(
    '  const lastSpokenQuestionIdRef = useRef("");\r\n  const teachingLockRef = useRef(false);',
    '  const lastSpokenQuestionIdRef = useRef("");\r\n  const lastSpeechMetaRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });\r\n  const teachingLockRef = useRef(false);'
  );
}
if (!text.includes('const normalizedLine = normalizePromptText(line);')) {
  const marker = '    if (!line) {\r\n      setIsSpeaking(false);\r\n      return;\r\n    }\r\n    setTeacherUtterance(line);';
  const replacement = '    if (!line) {\r\n      setIsSpeaking(false);\r\n      return;\r\n    }\r\n\r\n    const normalizedLine = normalizePromptText(line);\r\n    const normalizedQuestionText = normalizePromptText(question?.questionText || "");\r\n    const dedupeKey =\r\n      question?.questionId && normalizedLine && normalizedLine === normalizedQuestionText\r\n        ? `question:${question.questionId}`\r\n        : `line:${normalizedLine}`;\r\n    const now = Date.now();\r\n    const lastSpeech = lastSpeechMetaRef.current;\r\n    if (dedupeKey && lastSpeech.key === dedupeKey && now - lastSpeech.at < 12000) {\r\n      return;\r\n    }\r\n    lastSpeechMetaRef.current = { key: dedupeKey, at: now };\r\n    setTeacherUtterance(line);';
  text = text.replace(marker, replacement);
}
fs.writeFileSync(path, text);
