import { expect, test, type Locator, type Page } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PROD_BASE_URL = "https://robodynamics.in";
const JWT_SECRET = "change_me_ai_tutor_secret";
const JWT_ISSUER = "robodynamics-java";
const JWT_AUDIENCE = "robodynamics-ai-tutor";
const REPORT_DIR = path.resolve(process.cwd(), "..", "..", "docs", "vedic_math", "playwright_prod");

type LaunchOptions = {
  studentName?: string;
  grade?: string;
  module?: string;
  courseId?: string;
  chapterCode?: string;
  exerciseGroup?: string;
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
  const studentName = options.studentName || "Niagh";
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

function ensureReportDir(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function lessonButtonNameFor(chapterCode?: string): RegExp | null {
  const code = String(chapterCode || "L1_COMPLETING_WHOLE").trim().toUpperCase();
  if (code === "L1_COMPLETING_WHOLE") {
    return /lesson 1: completing the whole/i;
  }
  if (code === "L2_DOUBLING_HALVING") {
    return /lesson 2: doubling and halving/i;
  }
  return null;
}


async function saveScreenshot(page: Page, name: string): Promise<void> {
  ensureReportDir();
  await page.screenshot({
    path: path.join(REPORT_DIR, `${name}.png`),
    fullPage: true,
  });
}

type StartPayload = {
  question?: {
    questionId?: string;
    questionText?: string;
    expectedAnswer?: string;
  };
};

async function resetTutorOriginState(page: Page): Promise<void> {
  await page.context().clearCookies();
}

async function gotoLessonIntro(page: Page, options: LaunchOptions = {}): Promise<void> {
  await resetTutorOriginState(page);
  await page.goto(buildLaunchUrl(options), { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("button", { name: /continue to mission/i }).or(page.getByRole("button", { name: /start lesson/i }))
  ).toBeVisible();
}

async function startLesson(page: Page, options: LaunchOptions = {}): Promise<StartPayload> {
  await gotoLessonIntro(page, options);
  const startResponsePromise = page
    .waitForResponse(
      (response) => (response.url().includes("/api/vedic/start") || response.url().includes("/api/tutor/start")) && response.request().method() === "POST",
      { timeout: 45_000 }
    )
    .catch(() => null);
  const continueButton = page.getByRole("button", { name: /continue to mission/i });
  if (await continueButton.isVisible().catch(() => false)) {
    const beginner = page.getByRole("button", { name: /i am a beginner/i });
    const goal = page.getByRole("button", { name: /school math/i });
    const lessonButtonName = lessonButtonNameFor(options.chapterCode);
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
    const enteredLesson = await page
      .locator(".vedic-focus-stage")
      .waitFor({ state: "visible", timeout: 12_000 })
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
  await expect(input).toBeVisible({ timeout: 45_000 });
  return input;
}

async function currentQuestionText(page: Page): Promise<string> {
  const question = page.locator(".udemy-question-text").first();
  await expect(question).toBeVisible({ timeout: 45_000 });
  return (await question.innerText()).trim();
}

async function waitForStageLabel(page: Page, label: RegExp): Promise<void> {
  await expect(page.locator(".vedic-kicker, .vedic-turn-chip").filter({ hasText: label }).first()).toBeVisible({ timeout: 45_000 });
}

async function waitForPositiveFeedback(page: Page): Promise<void> {
  await expect(
    page
      .locator(".vedic-turn-chip, .udemy-feedback-verdict, .muted")
      .filter({ hasText: /correct|great work|great job|moving to the next question/i })
      .first()
  ).toBeVisible({ timeout: 45_000 });
}

async function expectedAnswerFromFeedback(page: Page): Promise<string> {
  const expectedLine = page.locator(".udemy-feedback p").filter({ hasText: "Expected:" }).first();
  await expect(expectedLine).toBeVisible({ timeout: 45_000 });
  return (await expectedLine.innerText()).replace(/^Expected:\s*/i, "").trim();
}

test.describe("Lesson 1 launch readiness", () => {
  test("[Good] Onboarding loads with a clear start CTA", async ({ page }) => {
    await gotoLessonIntro(page);
    await expect(
      page.getByRole("button", { name: /continue to mission/i }).or(page.getByRole("button", { name: /start lesson/i }))
    ).toBeVisible();
    await saveScreenshot(page, "s1_intro_page");
  });

  test("[Good] Careful Beginner Handoff reaches the live lesson surface", async ({ page }) => {
    const startPayload = await startLesson(page);
    await expect(page.locator(".vedic-focus-card")).toBeVisible();
    await expect(page.getByText(/lesson 1: completing the whole/i)).toBeVisible();
    await saveScreenshot(page, "s2_live_lesson_surface");
  });

  test("[Good] Careful Beginner Handoff reaches an answer-ready student turn", async ({ page }) => {
    const startPayload = await startLesson(page);
    await waitForQuestionCard(page);
    await waitForStageLabel(page, /your turn/i);
    await saveScreenshot(page, "s3_answer_area_visible");
  });

  test("[Bad] Wrong Then Recover keeps the learner on the same step after a wrong answer", async ({ page }) => {
    const startPayload = await startLesson(page);
    const questionBefore = await currentQuestionText(page);
    const input = await waitForQuestionCard(page);
    await input.fill("999");
    await page.getByRole("button", { name: /^check$/i }).click();
    await expect(page.getByText(/try again/i)).toBeVisible({ timeout: 45_000 });
    await expect(page.locator(".udemy-question-text").first()).toContainText(questionBefore);
    await saveScreenshot(page, "s4_wrong_answer_retry");
  });

  test("[Good] Fast Correct Student advances beyond the first step", async ({ page }) => {
    const startPayload = await startLesson(page);
    const input = await waitForQuestionCard(page);
    const expectedAnswer = String(startPayload.question?.expectedAnswer || "").trim();
    const initialQuestion = String(startPayload.question?.questionText || "").trim();
    expect(expectedAnswer.length).toBeGreaterThan(0);
    await input.fill(expectedAnswer);
    await page.getByRole("button", { name: /^check$/i }).click();
    await waitForPositiveFeedback(page);
    await waitForQuestionCard(page);
    if (initialQuestion) {
      await expect(page.locator(".udemy-question-text").first()).not.toContainText(initialQuestion, { timeout: 45_000 });
    }
    await saveScreenshot(page, "s5_correct_answer_advance");
  });

  test("[Good] Help-Seeking Student can reopen board support from student turn", async ({ page }) => {
    const startPayload = await startLesson(page);
    await waitForQuestionCard(page);
    await page.getByRole("button", { name: /show steps/i }).click();
    await expect(page.locator(".vedic-focus-stage.coach .vedic-inline-board")).toBeVisible({ timeout: 45_000 });
    await saveScreenshot(page, "s6_show_steps_board");
  });

  test("[Bad] Skip-Heavy Student reaches a different question without stale state", async ({ page }) => {
    const startPayload = await startLesson(page);
    await waitForQuestionCard(page);
    const before = await currentQuestionText(page);
    await page.getByRole("button", { name: /skip/i }).click();
    await waitForQuestionCard(page);
    await expect(page.locator(".udemy-question-text").first()).not.toContainText(before, { timeout: 45_000 });
    await expect(page.getByText(/try again/i)).toHaveCount(0);
    await saveScreenshot(page, "s7_skip_advances");
  });

  test("[Support] Tutor audio path uses the Sarvam TTS endpoint", async ({ page }) => {
    const startPayload = await startLesson(page);
    await waitForQuestionCard(page);
    const responsePromise = page.waitForResponse((response) => response.url().includes("/api/voice/tts") && response.request().method() === "POST", {
      timeout: 30_000,
    });
    await page.getByRole("button", { name: /^listen$/i }).click();
    const response = await responsePromise;
    const payload = await response.json();
    expect(payload.provider).toBe("sarvam");
    expect(String(payload.audioBase64 || "").length).toBeGreaterThan(100);
  });

  test("[Bad] Silent Or Stuck Student receives a coach rescue instead of dead air", async ({ page }) => {
    const startPayload = await startLesson(page);
    await waitForQuestionCard(page);
    await waitForStageLabel(page, /your turn/i);
    await expect(page.locator(".vedic-kicker, .vedic-turn-chip").filter({ hasText: /coach turn/i }).first()).toBeVisible({ timeout: 18_000 });
    await expect(page.locator(".vedic-inline-board")).toBeVisible({ timeout: 18_000 });
    await saveScreenshot(page, "s8_silence_recovery");
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
    const startPayload = await startLesson(page);
    const input = await waitForQuestionCard(page);
    await page.getByRole("button", { name: /^speak$/i }).click();
    await expect(page.getByText(/microphone access is blocked\. use text input\./i)).toBeVisible({ timeout: 45_000 });
    await expect(page.getByRole("button", { name: /mic blocked/i })).toBeVisible();
    await input.fill("999");
    await page.getByRole("button", { name: /^check$/i }).click();
    await expect(page.getByText(/try again/i)).toBeVisible({ timeout: 45_000 });
    await saveScreenshot(page, "s9_mic_blocked_text_fallback");
    await context.close();
  });

  test("[Bad] Wrong Then Recover accepts the shown expected answer and advances", async ({ page }) => {
    const startPayload = await startLesson(page);
    const questionBefore = await currentQuestionText(page);
    const input = await waitForQuestionCard(page);
    await input.fill("999");
    await page.getByRole("button", { name: /^check$/i }).click();
    const expectedAnswer = await expectedAnswerFromFeedback(page);
    await waitForQuestionCard(page);
    await page.locator("#answerInput").fill(expectedAnswer);
    await page.getByRole("button", { name: /^check$/i }).click();
    await waitForPositiveFeedback(page);
    await waitForQuestionCard(page);
    const questionAfter = await currentQuestionText(page);
    expect(questionAfter).not.toBe(questionBefore);
    await saveScreenshot(page, "s10_wrong_then_recover_advance");
  });

  test("[Good] Interrupted Student resumes from the saved question after pause", async ({ page }) => {
    const startPayload = await startLesson(page);
    const input = await waitForQuestionCard(page);
    const expectedAnswer = String(startPayload.question?.expectedAnswer || "").trim();
    expect(expectedAnswer.length).toBeGreaterThan(0);
    await input.fill(expectedAnswer);
    await page.getByRole("button", { name: /^check$/i }).click();
    await waitForPositiveFeedback(page);
    await waitForQuestionCard(page);
    const questionBeforePause = await currentQuestionText(page);
    await page.getByRole("button", { name: /pause & save/i }).click();
    await expect(page.getByRole("button", { name: /resume saved place/i })).toBeVisible({ timeout: 45_000 });
    await page.getByRole("button", { name: /resume saved place/i }).click();
    await waitForQuestionCard(page);
    const resumedQuestion = await currentQuestionText(page);
    expect(resumedQuestion).toBe(questionBeforePause);
    await saveScreenshot(page, "s13_pause_resume_same_question");
  });

  test("[Good] Returning Student can switch from a later lesson back to Lesson 1", async ({ page }) => {
    await startLesson(page, { chapterCode: "L2_DOUBLING_HALVING" });
    await expect(page.locator(".vedic-topbar-title")).toContainText(/doubling and halving/i, { timeout: 45_000 });
    const questionBeforeSwitch = await currentQuestionText(page);
    await page.getByRole("button", { name: /lesson 1: completing the whole/i }).click();
    await waitForQuestionCard(page);
    await expect(page.locator(".vedic-topbar-title")).toContainText(/completing the whole/i, { timeout: 45_000 });
    await expect(page.locator(".udemy-question-text").first()).not.toContainText(questionBeforeSwitch, { timeout: 45_000 });
    await saveScreenshot(page, "s14_switch_back_previous_lesson");
  });
  test("[Support] Mobile viewport keeps answer controls visible", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const startPayload = await startLesson(page);
    const input = await waitForQuestionCard(page);
    const checkButton = page.getByRole("button", { name: /^check$/i });
    const inputBox = await input.boundingBox();
    const buttonBox = await checkButton.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(844);
    await saveScreenshot(page, "s11_mobile_answer_controls");
    await context.close();
  });

  test("[Support] Desktop header remains visually centered", async ({ page }) => {
    const startPayload = await startLesson(page);
    const header = page.locator(".vedic-topbar-title").first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const headerCenter = headerBox!.x + headerBox!.width / 2;
    const viewportCenter = viewport!.width / 2;
    expect(Math.abs(headerCenter - viewportCenter)).toBeLessThanOrEqual(140);
    await saveScreenshot(page, "s12_desktop_header_center");
  });
});








