export type PythonLevel = "Beginner" | "Intermediate" | "Advanced" | "Elite";

export interface PythonChapter {
  id: string;
  displayCode: string;
  title: string;
  level: PythonLevel;
  description: string;
  topics: string[];
  durationMinutes: number;
  deliveryStatus: "live" | "mapped" | "planned";
  launchUrl?: string;
  aliases?: string[];
}

export interface PythonCurriculumTier {
  id: string;
  level: PythonLevel;
  name: string;
  targetAudience: string;
  tagline: string;
  color: string;
  projectFocus: string;
  terminalMilestone: string;
  competitionGoal: string;
  chapters: PythonChapter[];
}

export type VidyaTierSlug = "core" | "fullstack" | "datascience" | "aielite";

export const VIDYA_CATALOG: PythonCurriculumTier[] = [
  {
    id: "PY_CORE",
    level: "Beginner",
    name: "Vidya Core: The Foundation Sutra",
    targetAudience: "Aspiring developers and first-time coders",
    tagline: "Master algorithmic logic and clean Python syntax.",
    color: "#3B82F6",
    projectFocus: "Professional workspace habits, robust control flow, and composable function design.",
    terminalMilestone: "Junior Python Logic Certification and CLI portfolio build.",
    competitionGoal: "Intra-academy logic sprint leaderboard.",
    chapters: [
      {
        id: "PY_L1_01_SETUP",
        displayCode: "PY_L1_01",
        title: "The Developer Environment",
        level: "Beginner",
        description: "Professional workspace setup, IO streams, and variables.",
        topics: ["Workspace config", "print()", "input()", "variables"],
        durationMinutes: 45,
        deliveryStatus: "live",
        launchUrl: "/ai-tutor/learn?chapterCode=PY_L1_01_SETUP&level=1",
        aliases: ["PY_L1_01"],
      },
      {
        id: "PY_L1_02_DATA",
        displayCode: "PY_L1_02",
        title: "Dynamic Decisions",
        level: "Beginner",
        description: "Build robust logic gates, type casting, and error prevention habits.",
        topics: ["Conditionals", "type casting", "logical operators", "branching"],
        durationMinutes: 50,
        deliveryStatus: "live",
        launchUrl: "/ai-tutor/learn?chapterCode=PY_L1_02_DATA&level=1",
        aliases: ["PY_L1_02"],
      },
      {
        id: "PY_L1_03_CONTROL",
        displayCode: "PY_L1_03",
        title: "Structural Loops & Functions",
        level: "Beginner",
        description: "Modular code design, iteration patterns, and list comprehensions.",
        topics: ["Loops", "functions", "list comprehensions", "modularity"],
        durationMinutes: 60,
        deliveryStatus: "live",
        launchUrl: "/ai-tutor/learn?chapterCode=PY_L1_03_CONTROL&level=1",
        aliases: ["PY_L1_03"],
      },
    ],
  },
  {
    id: "PY_SPECIALIST",
    level: "Intermediate",
    name: "Vidya Specialist: Full-Stack Architect",
    targetAudience: "Backend engineers and API builders",
    tagline: "Architect full-stack backends and secure APIs.",
    color: "#F59E0B",
    projectFocus: "Service integration, persistence layers, and deployable Flask microservices.",
    terminalMilestone: "Professional backend engineer readiness and live API web service.",
    competitionGoal: "Hackathon-grade backend delivery and open-source readiness.",
    chapters: [
      {
        id: "PY_L2_05_DATA",
        displayCode: "PY_L2_05",
        title: "REST APIs & JSON Engineering",
        level: "Intermediate",
        description: "Global data fetching, authentication headers, and rate limiting patterns.",
        topics: ["requests", "JSON parsing", "authentication", "rate limiting"],
        durationMinutes: 60,
        deliveryStatus: "mapped",
        launchUrl: "/python-ai/course/fullstack/lesson/PY_L2_05_DATA",
        aliases: ["PY_L2_05"],
      },
      {
        id: "PY_L2_09_SQL",
        displayCode: "PY_L2_09",
        title: "Database Engineering",
        level: "Intermediate",
        description: "PostgreSQL, CRUD operations, and SQL injection security.",
        topics: ["PostgreSQL", "CRUD", "parameterized queries", "security"],
        durationMinutes: 60,
        deliveryStatus: "mapped",
        launchUrl: "/python-ai/course/fullstack/lesson/PY_L2_09_SQL",
        aliases: ["PY_L2_09"],
      },
      {
        id: "PY_L2_10_FLASK",
        displayCode: "PY_L2_10",
        title: "Web Microservices",
        level: "Intermediate",
        description: "Deployment with Flask, routing, and session management.",
        topics: ["Flask", "routing", "sessions", "deployment"],
        durationMinutes: 75,
        deliveryStatus: "mapped",
        launchUrl: "/python-ai/course/fullstack/lesson/PY_L2_10_FLASK",
        aliases: ["PY_L2_10"],
      },
    ],
  },
  {
    id: "PY_ANALYST",
    level: "Advanced",
    name: "Vidya Analyst: Data Science & Insight",
    targetAudience: "Data analysts and scientific computing learners",
    tagline: "Extract insights from massive global datasets.",
    color: "#8B5CF6",
    projectFocus: "Numerical computing, Pandas analysis, and high-signal dataset interpretation.",
    terminalMilestone: "Data portfolio and market insight analyzer project.",
    competitionGoal: "Kaggle bronze and silver milestone preparation.",
    chapters: [
      {
        id: "PY_L2_08_NUMPY",
        displayCode: "PY_L2_08",
        title: "Scientific Computing",
        level: "Advanced",
        description: "Vectorized calculations with NumPy and mathematical modeling.",
        topics: ["NumPy arrays", "vectorization", "broadcasting", "modeling"],
        durationMinutes: 75,
        deliveryStatus: "mapped",
        launchUrl: "/python-ai/course/datascience/lesson/PY_L2_08_NUMPY",
        aliases: ["PY_L2_08"],
      },
      {
        id: "PY_L2_02_PANDAS",
        displayCode: "PY_L2_02",
        title: "Structured Analytics",
        level: "Advanced",
        description: "Cleaning and analyzing real-world records with Pandas DataFrames.",
        topics: ["DataFrames", "groupby", "time series", "data cleaning"],
        durationMinutes: 80,
        deliveryStatus: "mapped",
        launchUrl: "/python-ai/course/datascience/lesson/PY_L2_02_PANDAS",
        aliases: ["PY_L2_02"],
      },
    ],
  },
  {
    id: "PY_ELITE",
    level: "Elite",
    name: "Vidya Elite: AI & ML Engineer",
    targetAudience: "ML engineers and applied AI builders",
    tagline: "Engineer neural networks and LLM architectures.",
    color: "#10B981",
    projectFocus: "Deep learning systems, transformer-era NLP, and AI product architecture.",
    terminalMilestone: "Sentinel AI computer vision security system.",
    competitionGoal: "Portfolio-grade AI engineering and global challenge readiness.",
    chapters: [
      {
        id: "PY_L3_01_DL",
        displayCode: "PY_L3_01",
        title: "Deep Learning Foundations",
        level: "Elite",
        description: "Neural network patterns, backpropagation, and training loops.",
        topics: ["Neural nets", "loss functions", "backpropagation", "training loops"],
        durationMinutes: 90,
        deliveryStatus: "planned",
        launchUrl: "/python-ai/course/aielite/lesson/PY_L3_01_DL",
        aliases: ["PY_L3_01"],
      },
      {
        id: "PY_L3_02_NLP",
        displayCode: "PY_L3_02",
        title: "Natural Language Mastery",
        level: "Elite",
        description: "LLM architecture, transformers, and vector databases.",
        topics: ["Transformers", "tokenization", "LLMs", "vector databases"],
        durationMinutes: 100,
        deliveryStatus: "planned",
        launchUrl: "/python-ai/course/aielite/lesson/PY_L3_02_NLP",
        aliases: ["PY_L3_02"],
      },
    ],
  },
];

export function findPythonChapterById(chapterId: string): PythonChapter | undefined {
  const normalized = chapterId.trim().toUpperCase();
  for (const tier of VIDYA_CATALOG) {
    for (const chapter of tier.chapters) {
      if (chapter.id === normalized || chapter.displayCode === normalized || chapter.aliases?.includes(normalized)) {
        return chapter;
      }
    }
  }
  return undefined;
}

export function findPythonTierForChapter(chapterId: string): PythonCurriculumTier | undefined {
  const normalized = chapterId.trim().toUpperCase();
  return VIDYA_CATALOG.find((tier) =>
    tier.chapters.some((chapter) => chapter.id === normalized || chapter.displayCode === normalized || chapter.aliases?.includes(normalized)),
  );
}

export function getTierSlugForChapter(chapterId: string): VidyaTierSlug {
  const tier = findPythonTierForChapter(chapterId);
  if (!tier) return "core";
  if (tier.id === "PY_SPECIALIST") return "fullstack";
  if (tier.id === "PY_ANALYST") return "datascience";
  if (tier.id === "PY_ELITE") return "aielite";
  return "core";
}
