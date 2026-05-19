import { MINDSPARC_LEVELS } from "@/lib/mindsparcCatalog";
import { MINDSUTRA_LEVELS } from "@/lib/mindsutraCatalog";
import { MONEYMIND_LEVELS } from "@/lib/moneyMindCatalog";
import {
  VIDYA_LEVEL1_LESSONS,
  VIDYA_LEVEL2_LESSONS,
  VIDYA_LEVEL3_LESSONS,
  VIDYA_LEVEL4_LESSONS,
  VIDYA_LEVEL5_LESSONS,
} from "@/lib/vidyaCatalog";

export type TutorDecisionStat = {
  label: string;
  value: string;
};

export type TutorDecisionLessonItem = {
  id: string;
  title: string;
  meta: string;
  freePreview: boolean;
};

export type TutorDecisionLevelItem = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  meta: string;
  lessonCountLabel: string;
  lessons: TutorDecisionLessonItem[];
};

export type TutorDecisionCatalog = {
  id: string;
  accent: string;
  unlockHref: string;
  stats: TutorDecisionStat[];
  levels: TutorDecisionLevelItem[];
};

function countPreviewLessons(levels: TutorDecisionLevelItem[]) {
  return levels.reduce(
    (sum, level) => sum + level.lessons.filter((lesson) => lesson.freePreview).length,
    0,
  );
}

const vedikaLevels: TutorDecisionLevelItem[] = MINDSUTRA_LEVELS.map((level) => ({
  id: level.id,
  name: `Level ${level.order}: ${level.name}`,
  tagline: level.tagline,
  accent: level.color,
  meta: level.gradeEquiv,
  lessonCountLabel: `${level.lessons.length} guided lessons`,
  lessons: level.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    meta: lesson.skill,
    freePreview: lesson.freePreview,
  })),
}));

const yuktiLevels: TutorDecisionLevelItem[] = MINDSPARC_LEVELS.map((level) => ({
  id: level.id,
  name: `Level ${level.order}: ${level.name}`,
  tagline: level.tagline,
  accent: level.color,
  meta: level.ageEquiv,
  lessonCountLabel: `${level.lessons.length} guided lessons`,
  lessons: level.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    meta: `${lesson.category} focus`,
    freePreview: lesson.freePreview,
  })),
}));

const arthaLevels: TutorDecisionLevelItem[] = MONEYMIND_LEVELS.map((level) => ({
  id: level.id,
  name: `Level ${level.order}: ${level.name}`,
  tagline: level.tagline,
  accent: level.color,
  meta: level.gradeEquiv,
  lessonCountLabel: `${level.lessons.length} guided lessons`,
  lessons: level.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    meta: lesson.skill,
    freePreview: lesson.freePreview,
  })),
}));

const vidyaLevels: TutorDecisionLevelItem[] = [
  {
    id: "level-1",
    name: "Level 1: Foundations",
    tagline: "Variables, logic, loops, and your first real Python habits.",
    accent: "#22c55e",
    meta: "Beginner friendly · Age 10–14 · No prerequisites",
    lessonCountLabel: `${VIDYA_LEVEL1_LESSONS.length} guided lessons · 90 programs`,
    lessons: VIDYA_LEVEL1_LESSONS.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      meta: "Core Python foundations",
      freePreview: index < 2,
    })),
  },
  {
    id: "level-2",
    name: "Level 2: Functions and Data",
    tagline: "Move from syntax familiarity into reusable logic and data structures.",
    accent: "#16a34a",
    meta: "Hands-on builder track · Age 11–15 · Requires Level 1",
    lessonCountLabel: `${VIDYA_LEVEL2_LESSONS.length} guided lessons · 90 programs`,
    lessons: VIDYA_LEVEL2_LESSONS.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      meta: "Functions and collections",
      freePreview: index === 0,
    })),
  },
  {
    id: "level-3",
    name: "Level 3: OOP and File I/O",
    tagline: "Build deeper programming confidence with classes, files, and reusable modules.",
    accent: "#15803d",
    meta: "Intermediate growth · Age 12–16 · Requires Level 2",
    lessonCountLabel: `${VIDYA_LEVEL3_LESSONS.length} guided lessons · 90 programs`,
    lessons: VIDYA_LEVEL3_LESSONS.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      meta: "Real-world Python patterns",
      freePreview: index === 0,
    })),
  },
  {
    id: "level-4",
    name: "Level 4: Data Structures",
    tagline: "Stacks, linked lists, trees, graphs, heaps, and the structures behind real systems.",
    accent: "#166534",
    meta: "Structured problem solving · Age 14–18 · Requires Level 3",
    lessonCountLabel: `${VIDYA_LEVEL4_LESSONS.length} guided lessons · 90 programs`,
    lessons: VIDYA_LEVEL4_LESSONS.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      meta: "Data structures and deeper logic",
      freePreview: index === 0,
    })),
  },
  {
    id: "level-5",
    name: "Level 5: Algorithms",
    tagline: "Sorting, searching, recursion, DP, greedy, and graph algorithms — interview-ready.",
    accent: "#f97316",
    meta: "Interview prep & competitive coding · Age 16+",
    lessonCountLabel: `${VIDYA_LEVEL5_LESSONS.length} guided lessons`,
    lessons: VIDYA_LEVEL5_LESSONS.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      meta: "Algorithms and advanced problem solving",
      freePreview: index === 0,
    })),
  },
];

const vaaniLevels: TutorDecisionLevelItem[] = [
  {
    id: "level-1",
    name: "स्तर 1: हिंदी अक्षर आरंभ",
    tagline: "पहली बार हिंदी पढ़ने वाले बच्चों के लिए अक्षर और ध्वनि की सहज शुरुआत।",
    accent: "#f97316",
    meta: "साक्षरता की पहली सीढ़ी",
    lessonCountLabel: "30 guided lessons",
    lessons: [
      { id: "vaani-l1-1", title: "स्वर ध्वनियों से पहचान", meta: "ध्वनि पहचान", freePreview: true },
      { id: "vaani-l1-2", title: "पहले अक्षरों की ट्रेसिंग", meta: "अक्षर लेखन", freePreview: true },
      { id: "vaani-l1-3", title: "चित्र से अक्षर मिलान", meta: "दृश्य साक्षरता", freePreview: false },
      { id: "vaani-l1-4", title: "व्यंजन अभ्यास की शुरुआत", meta: "आत्मविश्वास निर्माण", freePreview: false },
    ],
  },
  {
    id: "level-2",
    name: "स्तर 2: मात्रा और स्वर परिवर्तन",
    tagline: "मात्राओं की मदद से व्यंजनों को शब्दों में बदलना सीखिए।",
    accent: "#fb923c",
    meta: "मात्रा पहचान और शब्द निर्माण",
    lessonCountLabel: "36 guided lessons",
    lessons: [
      { id: "vaani-l2-1", title: "आ मात्रा का पहला प्रयोग", meta: "मात्रा पहचान", freePreview: true },
      { id: "vaani-l2-2", title: "सरल शब्द बनाना", meta: "शब्द निर्माण", freePreview: false },
      { id: "vaani-l2-3", title: "मात्राओं के साथ ट्रेसिंग", meta: "लेखन अभ्यास", freePreview: false },
      { id: "vaani-l2-4", title: "मात्रा पैटर्न पढ़ना", meta: "शुरुआती पठन", freePreview: false },
    ],
  },
  {
    id: "level-3",
    name: "स्तर 3: संयुक्त व्यंजन",
    tagline: "दैनिक हिंदी शब्दों में आने वाले संयुक्त व्यंजनों को सहज तरीके से समझिए।",
    accent: "#f59e0b",
    meta: "जटिल ध्वनियों में आत्मविश्वास",
    lessonCountLabel: "38 guided lessons",
    lessons: [
      { id: "vaani-l3-1", title: "क वर्ग के संयुक्त अक्षर", meta: "संयुक्त ध्वनियाँ", freePreview: true },
      { id: "vaani-l3-2", title: "त वर्ग के संयुक्त अक्षर", meta: "पठन आत्मविश्वास", freePreview: false },
      { id: "vaani-l3-3", title: "जुड़ी हुई ध्वनियों की पहचान", meta: "पैटर्न पहचान", freePreview: false },
      { id: "vaani-l3-4", title: "सामान्य संयुक्त शब्द पढ़ना", meta: "धाराप्रवाह पठन", freePreview: false },
    ],
  },
  {
    id: "level-4",
    name: "स्तर 4: बारहखड़ी",
    tagline: "हर व्यंजन और स्वर ध्वनि के पूरे बारहखड़ी पैटर्न पर mastery बनाईए।",
    accent: "#ea580c",
    meta: "ध्वनि ग्रिड की समझ",
    lessonCountLabel: "36 guided lessons",
    lessons: [
      { id: "vaani-l4-1", title: "बारहखड़ी की शुरुआत", meta: "ध्वनि ग्रिड समझ", freePreview: true },
      { id: "vaani-l4-2", title: "पूरे व्यंजन क्रम पढ़ना", meta: "पैटर्न स्मृति", freePreview: false },
      { id: "vaani-l4-3", title: "तेज़ पढ़ने का अभ्यास", meta: "पठन लय", freePreview: false },
      { id: "vaani-l4-4", title: "बारहखड़ी recall drills", meta: "आत्मविश्वास अभ्यास", freePreview: false },
    ],
  },
  {
    id: "level-5",
    name: "स्तर 5: सरल वाक्य और छोटी कहानियाँ",
    tagline: "अलग-अलग शब्दों से आगे बढ़कर छोटे वाक्य और शुरुआती कहानियों तक पहुँचिए।",
    accent: "#f97316",
    meta: "वाक्य निर्माण और समझ",
    lessonCountLabel: "30 guided lessons",
    lessons: [
      { id: "vaani-l5-1", title: "दो शब्दों वाले वाक्य", meta: "वाक्य की शुरुआत", freePreview: true },
      { id: "vaani-l5-2", title: "मेरी दुनिया की कहानियाँ", meta: "समझ अभ्यास", freePreview: false },
      { id: "vaani-l5-3", title: "पढ़ो और जवाब दो", meta: "अर्थ निर्माण", freePreview: false },
      { id: "vaani-l5-4", title: "कहानी की लय में पढ़ना", meta: "पठन प्रवाह", freePreview: false },
    ],
  },
  {
    id: "level-6",
    name: "स्तर 6: व्याकरण की बुनियाद",
    tagline: "संज्ञा, सर्वनाम, क्रिया और वाक्य रचना को सरल, guided flow में समझिए।",
    accent: "#c2410c",
    meta: "उन्नत भाषा आत्मविश्वास",
    lessonCountLabel: "42 guided lessons",
    lessons: [
      { id: "vaani-l6-1", title: "संज्ञा और सर्वनाम", meta: "व्याकरण की शुरुआत", freePreview: true },
      { id: "vaani-l6-2", title: "क्रिया और काल पैटर्न", meta: "वाक्य निर्माण", freePreview: false },
      { id: "vaani-l6-3", title: "विशेषण का सही प्रयोग", meta: "भाषा की सटीकता", freePreview: false },
      { id: "vaani-l6-4", title: "जटिल वाक्य प्रवाह", meta: "उन्नत साक्षरता", freePreview: false },
    ],
  },
];

const kaveriLevels: TutorDecisionLevelItem[] = [
  {
    id: "level-1",
    name: "ಹಂತ 1: ಕನ್ನಡ ಅಕ್ಷರ ಆರಂಭ",
    tagline: "ಅಕ್ಷರ, ಧ್ವನಿ ಮತ್ತು ಮೊದಲ ಓದು ಆತ್ಮವಿಶ್ವಾಸಕ್ಕೆ ಮೃದುವಾದ ಆರಂಭ.",
    accent: "#14b8a6",
    meta: "ಮೊದಲ ಕಲಿಕೆಯ ಹೆಜ್ಜೆಗಳು",
    lessonCountLabel: "24 guided lessons",
    lessons: [
      { id: "kaveri-l1-1", title: "ಮೂಲ ಅಕ್ಷರಗಳ ಪರಿಚಯ", meta: "ಲಿಪಿ ಗುರುತು", freePreview: true },
      { id: "kaveri-l1-2", title: "ಧ್ವನಿಯನ್ನು ಕೇಳಿ, ಅಕ್ಷರವನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ", meta: "ಧ್ವನಿ ಮತ್ತು ಬರವಣಿಗೆ", freePreview: true },
      { id: "kaveri-l1-3", title: "ಚಿತ್ರಕ್ಕೆ ಅಕ್ಷರ ಜೋಡಣೆ", meta: "ದೃಶ್ಯ ಸ್ಮರಣೆ", freePreview: false },
      { id: "kaveri-l1-4", title: "ಮೊದಲ ಓದು ಮಾದರಿಗಳು", meta: "ಆರಂಭಿಕ ಸರಾಗತೆ", freePreview: false },
    ],
  },
  {
    id: "level-2",
    name: "ಹಂತ 2: ಮಾರ್ಗದರ್ಶಿತ ಓದು",
    tagline: "ಸಣ್ಣ ಪದಗಳು, ಚಿತ್ರ ಸೂಚನೆಗಳು ಮತ್ತು ಮನೆಯ ಸಹಾಯದೊಂದಿಗೆ ಓದು ಅಭ್ಯಾಸ.",
    accent: "#0f766e",
    meta: "ಮನೆಯ ಅಭ್ಯಾಸಕ್ಕೆ ಸಿದ್ಧ",
    lessonCountLabel: "26 guided lessons",
    lessons: [
      { id: "kaveri-l2-1", title: "ಸಣ್ಣ ಕನ್ನಡ ಪದಗಳನ್ನು ಓದೋಣ", meta: "ಪದ ಆತ್ಮವಿಶ್ವಾಸ", freePreview: true },
      { id: "kaveri-l2-2", title: "ಚಿತ್ರ ಸೂಚನೆಯಿಂದ ಓದು", meta: "ಅರ್ಥ ನಿರ್ಮಾಣ", freePreview: false },
      { id: "kaveri-l2-3", title: "ವಾಕ್ಯ ಆರಂಭ ಅಭ್ಯಾಸ", meta: "ಓದು ಹರಿವು", freePreview: false },
      { id: "kaveri-l2-4", title: "ಮನೆ ಓದು ಸಹಾಯ", meta: "ಕುಟುಂಬ reinforcement", freePreview: false },
    ],
  },
  {
    id: "level-3",
    name: "ಹಂತ 3: ಪದ ನಿರ್ಮಾಣ",
    tagline: "ಅಕ್ಷರಗಳನ್ನು ಸೇರಿಸಿ ಪರಿಚಿತ ಕನ್ನಡ ಪದಗಳು ಮತ್ತು ದಿನನಿತ್ಯದ ಓದು ಮಾದರಿಗಳನ್ನು ಕಟ್ಟೋಣ.",
    accent: "#0d9488",
    meta: "ಪದ ರೂಪಿಸುವ ಆತ್ಮವಿಶ್ವಾಸ",
    lessonCountLabel: "28 guided lessons",
    lessons: [
      { id: "kaveri-l3-1", title: "ದಿನನಿತ್ಯ ಕನ್ನಡ ಪದಗಳನ್ನು ಕಟ್ಟೋಣ", meta: "ಪದ ಮಿಶ್ರಣ", freePreview: true },
      { id: "kaveri-l3-2", title: "ಧ್ವನಿ ಮತ್ತು ಲಿಪಿ ಜೋಡಣೆ", meta: "ಓದು ಬಲವರ್ಧನೆ", freePreview: false },
      { id: "kaveri-l3-3", title: "ಕುಟುಂಬ ಪದಸಂಪತ್ತಿ ಓದು", meta: "ಅರ್ಥ ನಿರ್ಮಾಣ", freePreview: false },
      { id: "kaveri-l3-4", title: "ಕಾಣೆಯಾದ ಅಕ್ಷರ ಕಂಡುಹಿಡಿಯಿರಿ", meta: "ಮಾದರಿ ಆತ್ಮವಿಶ್ವಾಸ", freePreview: false },
    ],
  },
  {
    id: "level-4",
    name: "ಹಂತ 4: ವಾಕ್ಯ ಓದು",
    tagline: "ಪ್ರತ್ಯೇಕ ಪದಗಳಿಂದ ಚಿಕ್ಕ ವಾಕ್ಯಗಳು ಮತ್ತು guided understanding ಕಡೆಗೆ ಸಾಗೋಣ.",
    accent: "#0f766e",
    meta: "ಓದು ಹರಿವು ಮತ್ತು ಅರ್ಥಗ್ರಹಣ",
    lessonCountLabel: "30 guided lessons",
    lessons: [
      { id: "kaveri-l4-1", title: "ಚಿಕ್ಕ ಕನ್ನಡ ವಾಕ್ಯಗಳನ್ನು ಓದಿ", meta: "ವಾಕ್ಯ ಸರಾಗತೆ", freePreview: true },
      { id: "kaveri-l4-2", title: "ಚಿತ್ರದೊಂದಿಗೆ ಅರ್ಥ ಗ್ರಹಿಸೋಣ", meta: "ಅರ್ಥಗ್ರಹಣ ಸಹಾಯ", freePreview: false },
      { id: "kaveri-l4-3", title: "ಸರಿಯಾದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ", meta: "ಪದಸಂಪತ್ತಿ ನಿಖರತೆ", freePreview: false },
      { id: "kaveri-l4-4", title: "ಓದಿ ಪ್ರತಿಕ್ರಿಯಿಸೋಣ", meta: "ಆತ್ಮವಿಶ್ವಾಸ ಅಭ್ಯಾಸ", freePreview: false },
    ],
  },
  {
    id: "level-5",
    name: "ಹಂತ 5: ಕಥೆಗಳು ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿ",
    tagline: "ಚಿಕ್ಕ ಕಥೆಗಳು, ಅರ್ಥಗ್ರಹಣ ಮತ್ತು ಸರಳ ಬರವಣಿಗೆಯೊಂದಿಗೆ ಸ್ವತಂತ್ರ ಓದು ಆತ್ಮವಿಶ್ವಾಸ ಬೆಳೆಸೋಣ.",
    accent: "#115e59",
    meta: "ಸ್ವತಂತ್ರ ಆರಂಭಿಕ ಸाक्षರತೆ",
    lessonCountLabel: "32 guided lessons",
    lessons: [
      { id: "kaveri-l5-1", title: "ನನ್ನ ಮೊದಲ ಕನ್ನಡ ಕಥೆಗಳು", meta: "ಕಥೆ ಆತ್ಮವಿಶ್ವಾಸ", freePreview: true },
      { id: "kaveri-l5-2", title: "ಮುಖ್ಯ ಅರ್ಥ ಕಂಡುಹಿಡಿಯಿರಿ", meta: "ಓದು ಅರ್ಥಗ್ರಹಣ", freePreview: false },
      { id: "kaveri-l5-3", title: "ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಮತ್ತೆ ಹೇಳಿ", meta: "ಅಭಿವ್ಯಕ್ತಿ ನಿರ್ಮಾಣ", freePreview: false },
      { id: "kaveri-l5-4", title: "ಕಥೆ ಲಯದ ಅಭ್ಯಾಸ", meta: "ಸರಾಗತೆ ಮತ್ತು ನೆನಪು", freePreview: false },
    ],
  },
];

export const TUTOR_DECISION_CATALOGS: Record<string, TutorDecisionCatalog> = {
  vedika: {
    id: "vedika",
    accent: "#f97316",
    unlockHref: "/pricing/vedika",
    stats: [
      { label: "Levels", value: String(vedikaLevels.length) },
      {
        label: "Guided Lessons",
        value: String(vedikaLevels.reduce((sum, level) => sum + level.lessons.length, 0)),
      },
      { label: "Preview Lessons", value: String(countPreviewLessons(vedikaLevels)) },
      { label: "Learning Promise", value: "Speed and confidence" },
    ],
    levels: vedikaLevels,
  },
  yukti: {
    id: "yukti",
    accent: "#10b981",
    unlockHref: "/pricing/yukti",
    stats: [
      { label: "Levels", value: String(yuktiLevels.length) },
      {
        label: "Guided Lessons",
        value: String(yuktiLevels.reduce((sum, level) => sum + level.lessons.length, 0)),
      },
      { label: "Preview Lessons", value: String(countPreviewLessons(yuktiLevels)) },
      { label: "Learning Promise", value: "Sharper reasoning" },
    ],
    levels: yuktiLevels,
  },
  artha: {
    id: "artha",
    accent: "#f59e0b",
    unlockHref: "/pricing/moneymind",
    stats: [
      { label: "Levels", value: String(arthaLevels.length) },
      {
        label: "Guided Lessons",
        value: String(arthaLevels.reduce((sum, level) => sum + level.lessons.length, 0)),
      },
      { label: "Preview Lessons", value: String(countPreviewLessons(arthaLevels)) },
      { label: "Learning Promise", value: "Money judgment first" },
    ],
    levels: arthaLevels,
  },
  vidya: {
    id: "vidya",
    accent: "#22c55e",
    unlockHref: "/pricing/vidya",
    stats: [
      { label: "Levels", value: String(vidyaLevels.length) },
      {
        label: "Guided Lessons",
        value: String(vidyaLevels.reduce((sum, level) => sum + level.lessons.length, 0)),
      },
      { label: "Coding Challenges", value: "450+" },
      { label: "Age Range", value: "10–18+" },
    ],
    levels: vidyaLevels,
  },
  vaani: {
    id: "vaani",
    accent: "#f97316",
    unlockHref: "/pricing/vaani",
    stats: [
      { label: "स्तर", value: String(vaaniLevels.length) },
      { label: "Guided Lessons", value: "212" },
      { label: "Preview Lessons", value: String(countPreviewLessons(vaaniLevels)) },
      { label: "वादा", value: "हिंदी confidence" },
    ],
    levels: vaaniLevels,
  },
  kaveri: {
    id: "kaveri",
    accent: "#14b8a6",
    unlockHref: "/pricing/kaveri",
    stats: [
      { label: "ಹಂತಗಳು", value: String(kaveriLevels.length) },
      {
        label: "Guided Lessons",
        value: "140",
      },
      { label: "Preview Lessons", value: String(countPreviewLessons(kaveriLevels)) },
      { label: "ವಚನ", value: "Warm Kannada growth" },
    ],
    levels: kaveriLevels,
  },
};

export function getTutorDecisionCatalog(id?: string | null) {
  const normalized = String(id || "").trim().toLowerCase();
  return TUTOR_DECISION_CATALOGS[normalized] ?? null;
}
