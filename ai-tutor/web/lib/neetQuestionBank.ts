import { dbQuery } from "@/lib/meeraDb";
import { normalizeNeetChapterCode } from "@/lib/neetContent";

export type NeetQuestion = {
  questionId: string;
  subject: string;
  chapterCode: string;
  chapterTitle: string;
  topic: string | null;
  difficulty: string | null;
  year: string | null;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: string | null;
  explanation: string | null;
  allOptionExplanations?: Record<string, string>;
  neetWeight: number | null;
  source: string | null;
  imageUrl: string | null;
  optionImages: {
    A: string | null;
    B: string | null;
    C: string | null;
    D: string | null;
  };
  hasImage?: boolean;
  sourcePage?: number | null;
};

export type NeetExplanationFallback = {
  explanation: string;
  allOptionExplanations: Record<string, string>;
};

export type NeetQuestionWritePayload = {
  questionId: string;
  subject: string;
  chapterCode: string;
  chapterTitle: string;
  topic: string | null;
  difficulty: string | null;
  year: string | null;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string | null;
  explanation: string | null;
  neetWeight: number | null;
  source: string | null;
  imageUrl: string | null;
  optionImages: {
    A: string | null;
    B: string | null;
    C: string | null;
    D: string | null;
  };
};

type PracticeParams = {
  chapter?: string | null;
  subject?: string | null;
  difficulty?: string | null;
  exclude?: string[];
  limit: number;
};

type PyqParams = {
  chapter?: string | null;
  subject?: string | null;
  year?: string | null;
  limit: number;
  offset: number;
  shuffle: boolean;
};

type CanonicalSourceBank = "meera" | "pyq";

type NeetQuestionInput = {
  questionId?: string;
  question_id?: string;
  id?: string;
  subject?: string;
  chapterCode?: string;
  chapter_code?: string;
  chapterTitle?: string;
  chapter_title?: string;
  topic?: string | null;
  difficulty?: string | null;
  year?: string | null;
  questionText?: string;
  question_text?: string;
  question?: string;
  prompt?: string;
  options?: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  };
  optionA?: string;
  option_a?: string;
  optionB?: string;
  option_b?: string;
  optionC?: string;
  option_c?: string;
  optionD?: string;
  option_d?: string;
  correctOption?: string | null;
  correct_option?: string | null;
  explanation?: string | null;
  neetWeight?: number | string | null;
  neet_weight?: number | string | null;
  source?: string | null;
  imageUrl?: string | null;
  question_image?: string | null;
  optionImages?: {
    A?: string | null;
    B?: string | null;
    C?: string | null;
    D?: string | null;
  };
  option_image_a?: string | null;
  option_image_b?: string | null;
  option_image_c?: string | null;
  option_image_d?: string | null;
};

const CANONICAL_QUESTION_SQL = `
  SELECT
    question_id,
    'meera' AS source_bank,
    subject,
    chapter_code,
    chapter_title,
    topic,
    difficulty,
    year,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    explanation,
    neet_weight,
    source AS source_tag,
    question_image,
    option_image_a,
    option_image_b,
    option_image_c,
    option_image_d,
    0 AS source_rank,
    question_image IS NOT NULL AS has_image,
    NULL AS source_pdf,
    NULL AS source_page
  FROM meera_neet_questions
  UNION ALL
  SELECT
    question_id,
    'pyq' AS source_bank,
    subject,
    chapter_code,
    chapter_title,
    NULL AS topic,
    'medium' AS difficulty,
    year,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    NULL AS explanation,
    NULL AS neet_weight,
    COALESCE(source_pdf, 'db_pyq') AS source_tag,
    NULL AS question_image,
    NULL AS option_image_a,
    NULL AS option_image_b,
    NULL AS option_image_c,
    NULL AS option_image_d,
    1 AS source_rank,
    has_image,
    source_pdf,
    source_page
  FROM neet_questions
`;

function toText(value: any): string {
  return value == null ? "" : String(value);
}

function normalizeOptionImages(input: NeetQuestionInput) {
  return {
    A: input.optionImages?.A ?? input.option_image_a ?? null,
    B: input.optionImages?.B ?? input.option_image_b ?? null,
    C: input.optionImages?.C ?? input.option_image_c ?? null,
    D: input.optionImages?.D ?? input.option_image_d ?? null,
  };
}

export function normalizeNeetQuestionWritePayload(input: NeetQuestionInput): NeetQuestionWritePayload {
  const options = input.options ?? {};
  const optionImages = normalizeOptionImages(input);

  return {
    questionId: toText(input.questionId ?? input.question_id ?? input.id),
    subject: toText(input.subject).trim(),
    chapterCode: normalizeNeetChapterCode(toText(input.chapterCode ?? input.chapter_code)) ?? toText(input.chapterCode ?? input.chapter_code),
    chapterTitle: toText(input.chapterTitle ?? input.chapter_title),
    topic: input.topic != null ? toText(input.topic) : null,
    difficulty: input.difficulty != null ? toText(input.difficulty) : "medium",
    year: input.year != null ? toText(input.year) : null,
    questionText: toText(input.questionText ?? input.question_text ?? input.question ?? input.prompt),
    optionA: toText(input.optionA ?? input.option_a ?? options.A),
    optionB: toText(input.optionB ?? input.option_b ?? options.B),
    optionC: toText(input.optionC ?? input.option_c ?? options.C),
    optionD: toText(input.optionD ?? input.option_d ?? options.D),
    correctOption: input.correctOption ?? input.correct_option ?? null,
    explanation: input.explanation != null ? toText(input.explanation) : null,
    neetWeight: input.neetWeight != null ? Number(input.neetWeight) : input.neet_weight != null ? Number(input.neet_weight) : null,
    source: input.source != null ? toText(input.source) : null,
    imageUrl: input.imageUrl ?? input.question_image ?? null,
    optionImages,
  };
}

function mapMeeraRow(r: any): NeetQuestion {
  return enrichNeetQuestion({
    questionId: r.question_id,
    subject: r.subject,
    chapterCode: r.chapter_code,
    chapterTitle: r.chapter_title,
    topic: r.topic ?? null,
    difficulty: r.difficulty ?? null,
    year: r.year ?? null,
    questionText: r.question_text,
    options: {
      A: r.option_a,
      B: r.option_b,
      C: r.option_c,
      D: r.option_d,
    },
    correctOption: r.correct_option ?? null,
    explanation: r.explanation ?? null,
    neetWeight: r.neet_weight ?? null,
    source: r.source ?? null,
    imageUrl: r.question_image ?? null,
    optionImages: {
      A: r.option_image_a ?? null,
      B: r.option_image_b ?? null,
      C: r.option_image_c ?? null,
      D: r.option_image_d ?? null,
    },
    hasImage: Boolean(r.question_image),
    sourcePage: null,
  });
}

function mapPyqRow(r: any): NeetQuestion {
  return enrichNeetQuestion({
    questionId: r.question_id,
    subject: r.subject,
    chapterCode: normalizeNeetChapterCode(r.chapter_code) ?? r.chapter_code,
    chapterTitle: r.chapter_title,
    topic: r.chapter_title ?? null,
    difficulty: "medium",
    year: r.year ?? null,
    questionText: r.question_text,
    options: {
      A: r.option_a,
      B: r.option_b,
      C: r.option_c,
      D: r.option_d,
    },
    correctOption: r.correct_option ?? null,
    explanation: null,
    neetWeight: null,
    source: r.source_pdf ?? "db_pyq",
    imageUrl: null,
    optionImages: {
      A: null,
      B: null,
      C: null,
      D: null,
    },
    hasImage: r.has_image === 1,
    sourcePage: r.source_page ?? null,
  });
}

export function buildFallbackNeetExplanation(question: Pick<NeetQuestion, "subject" | "chapterCode" | "chapterTitle" | "topic" | "correctOption" | "options" | "questionText" | "year">): NeetExplanationFallback {
  const topic = question.topic?.trim() || question.chapterTitle?.trim() || question.chapterCode?.replace(/_/g, " ") || question.subject || "this concept";
  const correct = question.correctOption ?? "the correct option";
  const stem = question.questionText?.trim() ? ` The stem asks about ${question.questionText.trim().slice(0, 80)}.` : "";

  return {
    explanation: `This question tests ${topic}. The correct answer is option ${correct}.${stem} Match each option to the concept and eliminate anything that breaks the rule.`,
    allOptionExplanations: {
      A: question.correctOption === "A"
        ? `Correct. Option A matches the concept tested by ${topic}.`
        : `Incorrect. Option A does not satisfy the key idea in ${topic}.`,
      B: question.correctOption === "B"
        ? `Correct. Option B matches the concept tested by ${topic}.`
        : `Incorrect. Option B does not satisfy the key idea in ${topic}.`,
      C: question.correctOption === "C"
        ? `Correct. Option C matches the concept tested by ${topic}.`
        : `Incorrect. Option C does not satisfy the key idea in ${topic}.`,
      D: question.correctOption === "D"
        ? `Correct. Option D matches the concept tested by ${topic}.`
        : `Incorrect. Option D does not satisfy the key idea in ${topic}.`,
    },
  };
}

export function enrichNeetQuestion(question: NeetQuestion): NeetQuestion {
  if (question.explanation && Object.keys(question.allOptionExplanations ?? {}).length > 0) {
    return question;
  }

  const fallback = buildFallbackNeetExplanation(question);
  return {
    ...question,
    explanation: question.explanation ?? fallback.explanation,
    allOptionExplanations: Object.keys(question.allOptionExplanations ?? {}).length > 0
      ? question.allOptionExplanations
      : fallback.allOptionExplanations,
  };
}

function dedupeQuestions(questions: NeetQuestion[]): NeetQuestion[] {
  const seen = new Set<string>();
  return questions.filter((q) => {
    const key = q.questionId || q.questionText;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchFromMeera(params: PracticeParams): Promise<NeetQuestion[]> {
  const conditions: string[] = [];
  const sqlParams: (string | number)[] = [];

  if (params.chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(params.chapter);
  }
  if (params.subject) {
    conditions.push("subject = ?");
    sqlParams.push(params.subject);
  }
  if (params.difficulty) {
    conditions.push("difficulty = ?");
    sqlParams.push(params.difficulty);
  }
  if (params.exclude && params.exclude.length > 0) {
    conditions.push(`question_id NOT IN (${params.exclude.map(() => "?").join(",")})`);
    sqlParams.push(...params.exclude);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  sqlParams.push(params.limit);

  const rows = await dbQuery(
    `SELECT * FROM meera_neet_questions ${where} ORDER BY RAND() LIMIT ?`,
    sqlParams
  );
  return (rows as any[]).map(mapMeeraRow);
}

async function fetchFromPyqPool(params: PracticeParams): Promise<NeetQuestion[]> {
  const conditions: string[] = ["correct_option IS NOT NULL"];
  const sqlParams: (string | number)[] = [];

  if (params.chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(params.chapter);
  }
  if (params.subject) {
    conditions.push("subject = ?");
    sqlParams.push(params.subject);
  }
  if (params.exclude && params.exclude.length > 0) {
    conditions.push(`question_id NOT IN (${params.exclude.map(() => "?").join(",")})`);
    sqlParams.push(...params.exclude);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  sqlParams.push(params.limit);

  const rows = await dbQuery(
    `SELECT question_id, subject, chapter_code, chapter_title, year,
            question_text, option_a, option_b, option_c, option_d,
            correct_option, has_image, source_pdf, source_page
     FROM neet_questions
     ${where}
     ORDER BY RAND()
     LIMIT ?`,
    sqlParams
  );
  return (rows as any[]).map(mapPyqRow);
}

export async function getPracticeQuestions(params: PracticeParams): Promise<{
  questions: NeetQuestion[];
  sources: string[];
}> {
  const sources: string[] = [];
  const initial = await fetchFromMeera(params).catch(() => [] as NeetQuestion[]);
  if (initial.length > 0) {
    sources.push("meera");
  }

  let questions = initial;
  if (questions.length < params.limit) {
    const exclude = [...(params.exclude ?? []), ...questions.map((q) => q.questionId)];
    const fallback = await fetchFromPyqPool({ ...params, exclude, limit: params.limit - questions.length })
      .catch(() => [] as NeetQuestion[]);
    if (fallback.length > 0) {
      sources.push("pyq_fallback");
      questions = questions.concat(fallback);
    }
  }

  return {
    questions: dedupeQuestions(questions).slice(0, params.limit),
    sources,
  };
}

async function countPyqRows(params: Omit<PyqParams, "limit" | "offset" | "shuffle">): Promise<number> {
  const conditions: string[] = [];
  const sqlParams: (string | number)[] = [];

  if (params.chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(params.chapter);
  }
  if (params.subject) {
    conditions.push("subject = ?");
    sqlParams.push(params.subject);
  }
  if (params.year) {
    conditions.push("year = ?");
    sqlParams.push(params.year);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await dbQuery<{ total: number }>(
    `SELECT COUNT(*) AS total FROM neet_questions ${where}`,
    sqlParams
  );
  return Number(rows[0]?.total ?? 0);
}

async function countMeeraYearRows(params: Omit<PyqParams, "limit" | "offset" | "shuffle">): Promise<number> {
  const conditions: string[] = ["year IS NOT NULL", "year != ''"];
  const sqlParams: (string | number)[] = [];

  if (params.chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(params.chapter);
  }
  if (params.subject) {
    conditions.push("subject = ?");
    sqlParams.push(params.subject);
  }
  if (params.year) {
    conditions.push("year = ?");
    sqlParams.push(params.year);
  }

  const rows = await dbQuery<{ total: number }>(
    `SELECT COUNT(*) AS total FROM meera_neet_questions WHERE ${conditions.join(" AND ")}`,
    sqlParams
  );
  return Number(rows[0]?.total ?? 0);
}

async function fetchPyqYearsFromTable(
  table: "neet_questions" | "meera_neet_questions",
  chapter?: string | null,
  subject?: string | null
): Promise<string[]> {
  const conditions: string[] = ["year IS NOT NULL", "year != ''"];
  const sqlParams: (string | number)[] = [];
  if (chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(chapter);
  }
  if (subject) {
    conditions.push("subject = ?");
    sqlParams.push(subject);
  }
  const rows = await dbQuery<{ year: string }>(
    `SELECT DISTINCT year FROM ${table} WHERE ${conditions.join(" AND ")} ORDER BY year DESC`,
    sqlParams
  );
  return rows.map((row) => row.year).filter(Boolean);
}

export async function getPyqQuestions(params: PyqParams): Promise<{
  questions: NeetQuestion[];
  total: number;
  years: string[];
  source: "neet_questions" | "meera_neet_questions";
}> {
  const order = params.shuffle ? "ORDER BY RAND()" : "ORDER BY year DESC, id ASC";
  const pyqTotal = await countPyqRows(params).catch(() => 0);

  if (pyqTotal > 0) {
    const conditions: string[] = [];
    const sqlParams: (string | number)[] = [];
    if (params.chapter) {
      conditions.push("chapter_code = ?");
      sqlParams.push(params.chapter);
    }
    if (params.subject) {
      conditions.push("subject = ?");
      sqlParams.push(params.subject);
    }
    if (params.year) {
      conditions.push("year = ?");
      sqlParams.push(params.year);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const rows = await dbQuery(
      `SELECT id, question_id, subject, chapter_code, chapter_title,
              year, question_text, option_a, option_b, option_c, option_d,
              correct_option, has_image, source_pdf, source_page
       FROM neet_questions
       ${where}
       ${order}
       LIMIT ${Math.floor(params.limit)} OFFSET ${Math.floor(params.offset)}`,
      sqlParams
    );

    const years = await fetchPyqYearsFromTable("neet_questions", params.chapter, params.subject).catch(() => []);
    return {
      questions: (rows as any[]).map(mapPyqRow),
      total: pyqTotal,
      years,
      source: "neet_questions",
    };
  }

  const meeraTotal = await countMeeraYearRows(params).catch(() => 0);
  const conditions: string[] = ["year IS NOT NULL", "year != ''"];
  const sqlParams: (string | number)[] = [];

  if (params.chapter) {
    conditions.push("chapter_code = ?");
    sqlParams.push(params.chapter);
  }
  if (params.subject) {
    conditions.push("subject = ?");
    sqlParams.push(params.subject);
  }
  if (params.year) {
    conditions.push("year = ?");
    sqlParams.push(params.year);
  }

  const meeraRows = await dbQuery(
    `SELECT question_id, subject, chapter_code, chapter_title, topic, difficulty,
            year, question_text, option_a, option_b, option_c, option_d,
            correct_option, explanation, neet_weight, source,
            question_image, option_image_a, option_image_b, option_image_c, option_image_d
     FROM meera_neet_questions
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${params.shuffle ? "RAND()" : "year DESC, question_id ASC"}
     LIMIT ${Math.floor(params.limit)} OFFSET ${Math.floor(params.offset)}`,
    sqlParams
  );

  const years = await fetchPyqYearsFromTable("meera_neet_questions", params.chapter, params.subject).catch(() => []);
  return {
    questions: (meeraRows as any[]).map(mapMeeraRow),
    total: meeraTotal,
    years,
    source: "meera_neet_questions",
  };
}
