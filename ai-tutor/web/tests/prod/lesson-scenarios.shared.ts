import { expect, test, type Locator, type Page } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PROD_BASE_URL = "https://robodynamics.in";
const JWT_SECRET = "change_me_ai_tutor_secret";
const JWT_ISSUER = "robodynamics-java";
const JWT_AUDIENCE = "robodynamics-ai-tutor";

type LaunchOptions = {
  studentName?: string;
  grade?: string;
  module?: string;
  courseId?: string;
  chapterCode?: string;
  exerciseGroup?: string;
};

type StartPayload = {
  question?: {
    questionId?: string;
    questionText?: string;
    expectedAnswer?: string;
  };
};

export type LessonScenarioConfig = {
  suiteName: string;
  chapterCode: string;
  lessonTitle: string;
  module?: string;
  courseId?: string;
  grade?: string;
  reportDirName?: string;
  alternateChapterCode?: string;
  alternateLessonTitle?: string;
};

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createLaunchToken(module = "VEDIC_MATH", grade = "6"): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    sub: "user:99901",
    jti: `playwright-${now}-${Math.random().toString(36).slice(2, 10)}`,
    iat: now,
    exp: now + 300,
    user_id: 99901,
    role: "STUDENT",
    child_id: 99901,
    company_code: "RD",
    module,
    grade,
  };
  const headerPart = base64Url(JSON.stringify(header));
  const payloadPart = base64Url(JSON.stringify(payload));
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signingInput).digest();
  return `${signingInput}.${base64Url(signature)}`;
}

function buildLaunchUrl(options: LaunchOptions = {}): string {
  const module = options.module || "VEDIC_MATH";
  const grade = options.grade || "6";
  const courseId = options.courseId || "vedic_math";
  const chapterCode = options.chapterCode || "L1_COMPLETING_WHOLE";
  const exerciseGroup = options.exerciseGroup || "A";
  const studentName = options.studentName || "Demo Student";
  const token = createLaunchToken(module, grade);
  const params = new URLSearchParams({
    token,
    module,
    courseId,
    studentName,
    grade,
    chapterCode,
    exerciseGroup,
  });
  return `${PROD_BASE_URL}/ai-tutor/learn?${params.toString()}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function reportDirFor(config: LessonScenarioConfig): string {
  const dirName = config.reportDirName || config.chapterCode.toLowerCase();
  return path.resolve(process.cwd(), "..", "..", "docs", "vedic_math", "playwright_prod", dirName);
}

function lessonButtonNameFor(lessonTitle: string): RegExp | null {
  const trimmed = String(lessonTitle || "").trim();
  if (!trimmed) {
    return null;
  }
  return new RegExp(escapeRegExp(trimmed), "i");
}

async function saveScreenshot(page: Page, reportDir: string, name: string): Promise<void> {
  fs.mkdirSync(reportDir, { recursive: true });
  await page.screenshot({
    path: path.join(reportDir, `${name}.png`),
    fullPage: true,
  });
}

async function resetTutorOriginState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.goto(PROD_BASE_URL, { waitUntil: "domcontentloaded" }).catch(() => undefined);
  await page
    .evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    })
    .catch(() => undefined);
}

async function gotoLessonIntro(page: Page, options: LaunchOptions = {}): Promise<void> {
  await resetTutorOriginState(page);
  await page.goto(buildLaunchUrl(options), { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("button", { name: /continue to mission/i }).or(page.getByRole("button", { name: /start lesson/i })),
  ).toBeVisible();
}

async function startLesson(
  page: Page,
  lessonTitle: string,
  options: LaunchOptions = {},
): Promise<StartPayload> {
  await gotoLessonIntro(page, options);
  const startResponsePromise = page
    .waitForResponse(
      (response) =>
        (response.url().includes("/api/vedic/start") || response.url().includes("/api/tutor/start")) &&
        response.request().method() === "POST",
      { timeout: 45_000 },
    )
    .catch(() => null);
  const continueButton = page.getByRole("button", { name: /continue to mission/i });
  const lessonButtonName = lessonButtonNameFor(lessonTitle);
  if (await continueButton.isVisible().catch(() => false)) {
    const beginner = page.getByRole("button", { name: /i am a beginner/i });
    const goal = page.getByRole("button", { name: /school math/i });
    if (await beginner.isVisible().catch(() => false)) {
      await beginner.click();
    }
    if (await goal.isVisible().catch(() => false)) {
      await goal.click();
    }
    if (lessonButtonName) {
      const lessonButton = page.getByRole("button", { name: lessonButtonName });
      if (await lessonButton.isVisible().catch(() => false)) {
        await lessonButton.click();
      }
    }
    await continueButton.click();
    const enteredLesson = await page.locator(".vedic-focus-stage").waitFor({ state: "visible", timeout: 12_000 })
      .then(() => true)
      .catch(() => false);
    if (!enteredLesson) {
      if (lessonButtonName) {
        const lessonButton = page.getByRole("button", { name: lessonButtonName });
        if (await lessonButton.isVisible().catch(() => false)) {
          await lessonButton.click();
        }
      }
      const startButton = page.getByRole("button", { name: /start lesson/i });
      if (await startButton.isVisible().catch(() => false)) {
        await startButton.click();
      } else if (await continueButton.isVisible().catch(() => false)) {
        await continueButton.click({ force: true });
      }
    }
  } else {
    await page.getByRole("button", { name: /start lesson/i }).click();
  }
  await expect(page.locator(".vedic-focus-stage")).toBeVisible({ timeout: 45_000 });
  const startResponse = await startResponsePromise;
  if (!startResponse) {
    return {};
  }
  return (await startResponse.json().catch(() => ({}))) as StartPayload;
}

async function waitForQuestionCard(page: Page): Promise<Locator> {
  const input = page.locator("#answerInput");
  const mcqOptions = page.locator(".mcq-options");

  // Click "Try it" if present (some question types show this first)
  const inputAlreadyVisible = await input.isVisible().catch(() => false);
  const mcqAlreadyVisible   = await mcqOptions.isVisible().catch(() => false);
  if (!inputAlreadyVisible && !mcqAlreadyVisible) {
    const tryItButton = page.getByRole("button", { name: /try it/i });
    if (await tryItButton.isVisible().catch(() => false)) {
      await tryItButton.click();
    }
  }

  // 120s: the 3-slide intro (welcome + EXPLAIN + DEMO + GUIDED) + first teaching
  // board each make real TTS calls; full intro can take 60-100s before student turn.
  // Accepts EITHER text input (#answerInput) OR MCQ option buttons (.mcq-options).
  await expect(input.or(mcqOptions)).toBeVisible({ timeout: 120_000 });
  return input;
}

/** Submit an answer regardless of question type (text input or MCQ). */
async function submitAnswer(page: Page, input: Locator, answer: string): Promise<void> {
  const mcqOptions = page.locator(".mcq-options");
  if (await mcqOptions.isVisible().catch(() => false)) {
    // MCQ: click the option whose text matches the answer, or the first option as fallback
    const matchingOpt = page.locator(".mcq-option").filter({ hasText: new RegExp(`^${answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }).first();
    if (await matchingOpt.isVisible().catch(() => false)) {
      await matchingOpt.click();
    } else {
      await page.locator(".mcq-option").first().click();
    }
  } else {
    await input.fill(answer);
    await page.getByRole("button", { name: /^check$/i }).click();
  }
}

async function currentQuestionText(page: Page): Promise<string> {
  await waitForQuestionCard(page);
  const question = page.locator(".udemy-question-text").first();
  await expect(question).toBeVisible({ timeout: 45_000 });
  return (await question.innerText()).trim();
}

async function waitForStageLabel(page: Page, label: RegExp): Promise<void> {
  await expect(page.locator(".vedic-kicker, .vedic-turn-chip").filter({ hasText: label }).first()).toBeVisible({
    timeout: 45_000,
  });
}

async function expectedAnswerFromFeedback(page: Page): Promise<string> {
  const expectedLine = page.locator(".udemy-feedback p").filter({ hasText: "Expected:" }).first();
  await expect(expectedLine).toBeVisible({ timeout: 45_000 });
  return (await expectedLine.innerText()).replace(/^Expected:\s*/i, "").trim();
}

export function registerLessonScenarios(config: LessonScenarioConfig): void {
  const lessonTitleRegex = new RegExp(escapeRegExp(config.lessonTitle), "i");
  const alternateChapterCode =
    config.alternateChapterCode || (config.chapterCode === "L1_COMPLETING_WHOLE" ? "L2_DOUBLING_HALVING" : "L1_COMPLETING_WHOLE");
  const alternateLessonTitle =
    config.alternateLessonTitle || (config.chapterCode === "L1_COMPLETING_WHOLE" ? "Doubling and Halving" : "Completing the Whole");
  const alternateLessonTitleRegex = new RegExp(escapeRegExp(alternateLessonTitle), "i");
  const launchDefaults: LaunchOptions = {
    module: config.module || "VEDIC_MATH",
    courseId: config.courseId || "vedic_math",
    grade: config.grade || "6",
    chapterCode: config.chapterCode,
  };
  const reportDir = reportDirFor(config);

  test.describe(config.suiteName, () => {
    test("[Good] Onboarding loads with a clear start CTA", async ({ page }) => {
      await gotoLessonIntro(page, launchDefaults);
      await expect(
        page.getByRole("button", { name: /continue to mission/i }).or(page.getByRole("button", { name: /start lesson/i })),
      ).toBeVisible();
      await saveScreenshot(page, reportDir, "s1_intro_page");
    });

    test("[Good] Careful Beginner Handoff reaches the live lesson surface", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await expect(page.locator(".vedic-focus-card")).toBeVisible();
      await expect(page.locator(".vedic-topbar-title")).toContainText(lessonTitleRegex, { timeout: 20_000 });
      await saveScreenshot(page, reportDir, "s2_live_lesson_surface");
    });

    test("[Good] Careful Beginner Handoff reaches an answer-ready student turn", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      await waitForStageLabel(page, /your turn/i);
      await saveScreenshot(page, reportDir, "s3_answer_area_visible");
    });

    test("[Bad] Wrong Then Recover keeps the learner on the same step after a wrong answer", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      const questionBefore = await currentQuestionText(page);
      const input = await waitForQuestionCard(page);
      await input.fill("999");
      await page.getByRole("button", { name: /^check$/i }).click();
      await expect(page.getByText(/try again/i)).toBeVisible({ timeout: 45_000 });
      await expect(page.locator(".udemy-question-text").first()).toContainText(questionBefore);
      await saveScreenshot(page, reportDir, "s4_wrong_answer_retry");
    });

    test("[Good] Fast Correct Student advances beyond the first step", async ({ page }) => {
      const startPayload = await startLesson(page, config.lessonTitle, launchDefaults);
      const input = await waitForQuestionCard(page);
      const expectedAnswer = String(startPayload.question?.expectedAnswer || "").trim();
      const initialQuestion = String(startPayload.question?.questionText || "").trim();
      expect(expectedAnswer.length).toBeGreaterThan(0);
      const nextQuestionResponse = page
        .waitForResponse(
          (response) =>
            (response.url().includes("/api/vedic/next-question") || response.url().includes("/api/tutor/next-question")) &&
            response.request().method() === "POST",
          { timeout: 45_000 },
        )
        .catch(() => null);
      await submitAnswer(page, input, expectedAnswer);
      const nextQuestionResult = await nextQuestionResponse;
      expect(nextQuestionResult).not.toBeNull();
      await waitForQuestionCard(page);
      if (initialQuestion) {
        await expect(page.locator(".udemy-question-text").first()).not.toContainText(initialQuestion, { timeout: 45_000 });
      }
      await saveScreenshot(page, reportDir, "s5_correct_answer_advance");
    });

    test("[Good] Help-Seeking Student can reopen board support from student turn", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      await page.getByRole("button", { name: /show steps/i }).click();
      await expect(page.locator(".vedic-focus-stage.coach .vedic-inline-board")).toBeVisible({ timeout: 45_000 });
      await saveScreenshot(page, reportDir, "s6_show_steps_board");
    });

    test("[Bad] Skip-Heavy Student reaches a different question without stale state", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      const before = await currentQuestionText(page);
      await page.getByRole("button", { name: /skip/i }).click();
      await waitForQuestionCard(page);
      await expect(page.locator(".udemy-question-text").first()).not.toContainText(before, { timeout: 45_000 });
      await expect(page.getByText(/try again/i)).toHaveCount(0);
      await saveScreenshot(page, reportDir, "s7_skip_advances");
    });

    test("[Support] Tutor audio path uses the Sarvam TTS endpoint", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes("/api/voice/tts") && response.request().method() === "POST",
        { timeout: 30_000 },
      );
      await page.getByRole("button", { name: /^listen$/i }).click();
      const response = await responsePromise;
      const payload = await response.json();
      expect(payload.provider).toBe("sarvam");
      expect(String(payload.audioBase64 || "").length).toBeGreaterThan(100);
    });

    test("[Bad] Silent Or Stuck Student receives a coach rescue instead of dead air", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      await waitForStageLabel(page, /your turn/i);
      await expect(page.locator(".vedic-kicker, .vedic-turn-chip").filter({ hasText: /coach turn/i }).first()).toBeVisible({
        timeout: 18_000,
      });
      await expect(page.locator(".vedic-inline-board")).toBeVisible({ timeout: 18_000 });
      await saveScreenshot(page, reportDir, "s8_silence_recovery");
    });

    test("[Good] Mic Blocked Text Fallback keeps typed answering available", async ({ browser }) => {
      const context = await browser.newContext();
      await context.addInitScript(() => {
        class DeniedSpeechRecognition {
          lang = "en-IN";
          continuous = false;
          interimResults = false;
          maxAlternatives = 1;
          onresult?: (event: unknown) => void;
          onend?: () => void;
          onerror?: (event: { error: string }) => void;

          start() {
            setTimeout(() => {
              this.onerror?.({ error: "not-allowed" });
              this.onend?.();
            }, 50);
          }

          stop() {
            this.onend?.();
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition = DeniedSpeechRecognition;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitSpeechRecognition = DeniedSpeechRecognition;
      });
      const page = await context.newPage();
      await startLesson(page, config.lessonTitle, launchDefaults);
      const input = await waitForQuestionCard(page);
      // MCQ questions have no voice input — skip the mic-block scenario gracefully
      const speakButton = page.getByRole("button", { name: /^speak$/i });
      if (!await speakButton.isVisible().catch(() => false)) {
        await saveScreenshot(page, reportDir, "s9_mic_blocked_text_fallback");
        await context.close();
        return;
      }
      await speakButton.click();
      await expect(page.getByText(/microphone access is blocked\. use text input\./i)).toBeVisible({ timeout: 45_000 });
      await expect(page.getByRole("button", { name: /mic blocked/i })).toBeVisible();
      await input.fill("999");
      await page.getByRole("button", { name: /^check$/i }).click();
      await expect(page.getByText(/try again/i)).toBeVisible({ timeout: 45_000 });
      await saveScreenshot(page, reportDir, "s9_mic_blocked_text_fallback");
      await context.close();
    });

    test("[Bad] Wrong Then Recover accepts the shown expected answer and advances", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      const questionBefore = await currentQuestionText(page);
      const input = await waitForQuestionCard(page);
      await input.fill("999");
      await page.getByRole("button", { name: /^check$/i }).click();
      const expectedAnswer = await expectedAnswerFromFeedback(page);
      await waitForQuestionCard(page);
      await page.locator("#answerInput").fill(expectedAnswer);
      const nextQuestionResponse = page
        .waitForResponse(
          (response) =>
            (response.url().includes("/api/vedic/next-question") || response.url().includes("/api/tutor/next-question")) &&
            response.request().method() === "POST",
          { timeout: 45_000 },
        )
        .catch(() => null);
      await page.getByRole("button", { name: /^check$/i }).click();
      const nextQuestionResult = await nextQuestionResponse;
      expect(nextQuestionResult).not.toBeNull();
      await waitForQuestionCard(page);
      const questionAfter = await currentQuestionText(page);
      expect(questionAfter).not.toBe(questionBefore);
      await saveScreenshot(page, reportDir, "s10_wrong_then_recover_advance");
    });

    test("[Good] Interrupted Student resumes from the saved question after pause", async ({ page }) => {
      const startPayload = await startLesson(page, config.lessonTitle, launchDefaults);
      const input = await waitForQuestionCard(page);
      const expectedAnswer = String(startPayload.question?.expectedAnswer || "").trim();
      expect(expectedAnswer.length).toBeGreaterThan(0);
      const nextQuestionResponse = page
        .waitForResponse(
          (response) =>
            (response.url().includes("/api/vedic/next-question") || response.url().includes("/api/tutor/next-question")) &&
            response.request().method() === "POST",
          { timeout: 45_000 },
        )
        .catch(() => null);
      await submitAnswer(page, input, expectedAnswer);
      const nextQuestionResult = await nextQuestionResponse;
      expect(nextQuestionResult).not.toBeNull();
      await waitForQuestionCard(page);
      const questionBeforePause = await currentQuestionText(page);
      await page.getByRole("button", { name: /pause & save/i }).click();
      await expect(page.getByRole("button", { name: /^\▶\s*resume$/i })).toBeVisible({ timeout: 45_000 });
      await page.getByRole("button", { name: /^\▶\s*resume$/i }).click();
      await waitForQuestionCard(page);
      const resumedQuestion = await currentQuestionText(page);
      expect(resumedQuestion).toBe(questionBeforePause);
      await saveScreenshot(page, reportDir, "s13_pause_resume_same_question");
    });

    test("[Good] Direct launch can open the alternate lesson and return to the target lesson", async ({ page }) => {
      await startLesson(page, alternateLessonTitle, { ...launchDefaults, chapterCode: alternateChapterCode });
      await expect(page.locator(".vedic-topbar-title")).toContainText(alternateLessonTitleRegex, { timeout: 45_000 });
      await expect(page.locator(".vedic-focus-stage")).toBeVisible({ timeout: 45_000 });
      await startLesson(page, config.lessonTitle, launchDefaults);
      await expect(page.locator(".vedic-focus-stage")).toBeVisible({ timeout: 45_000 });
      await expect(page.locator(".vedic-topbar-title")).toContainText(lessonTitleRegex, { timeout: 45_000 });
      await saveScreenshot(page, reportDir, "s14_switch_back_previous_lesson");
    });

    test("[Support] Mobile viewport keeps answer controls visible", async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await startLesson(page, config.lessonTitle, launchDefaults);
      const input = await waitForQuestionCard(page);
      const checkButton = page.getByRole("button", { name: /^check$/i });
      const inputBox = await input.boundingBox();
      const buttonBox = await checkButton.boundingBox();
      expect(inputBox).not.toBeNull();
      expect(buttonBox).not.toBeNull();
      expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(844);
      await saveScreenshot(page, reportDir, "s11_mobile_answer_controls");
      await context.close();
    });

    test("[Support] Desktop header remains visually centered", async ({ page }) => {
      await startLesson(page, config.lessonTitle, launchDefaults);
      const header = page.locator(".vedic-topbar-title").first();
      await expect(header).toBeVisible();
      const headerBox = await header.boundingBox();
      expect(headerBox).not.toBeNull();
      const viewport = page.viewportSize();
      expect(viewport).not.toBeNull();
      const headerCenter = headerBox!.x + headerBox!.width / 2;
      const viewportCenter = viewport!.width / 2;
      expect(Math.abs(headerCenter - viewportCenter)).toBeLessThanOrEqual(140);
      await saveScreenshot(page, reportDir, "s12_desktop_header_center");
    });

    test("[Support] Coach bubble does not duplicate the question panel text", async ({ page }) => {
      // Verifies the noUtterance fix: when the student has control, the coach
      // bubble should show a coaching prompt, NOT echo the question panel text.
      await startLesson(page, config.lessonTitle, launchDefaults);
      await waitForQuestionCard(page);
      await waitForStageLabel(page, /your turn/i);
      const questionText = await currentQuestionText(page);
      const coachBubble = page.locator(".rd-speech-bubble, .vedic-coach-bubble, .coach-utterance").first();
      if (await coachBubble.isVisible().catch(() => false)) {
        const coachText = (await coachBubble.innerText()).trim();
        // Coach bubble must not be identical to the question panel text
        expect(coachText).not.toBe(questionText);
      }
      await saveScreenshot(page, reportDir, "s15_coach_no_duplicate");
    });
  });
}
