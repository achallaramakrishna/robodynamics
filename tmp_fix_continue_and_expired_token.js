const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(from, to, label) {
  if (!text.includes(from)) throw new Error(`missing ${label}`);
  text = text.replace(from, to);
}

replaceOnce(
`              {lessonDuolingoArc?.onboarding?.placementRule ? (                <p className="tutor-onboard-note">{lessonDuolingoArc.onboarding.placementRule}</p>
              ) : null}
            </div>
          ) : null}

          {/* Start button */}
          <div className="tutor-qs-actions">
            <button
              type="button"
              className="button tutor-qs-btn"
              onClick={() => { unlockAudio(); void startSession(); }}
              disabled={!canStart || status === "loading"}
            >
              {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : minimalDuolingoLayout ? "Continue to Mission" : "Start Mission"}
            </button>
            {!canStart && (
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center" }}>
                Session token missing — launch from the LMS
              </p>
            )}
            <p className="tutor-qs-hint muted">
              Voice {voiceEnabled ? "on" : "off"} |{" "}
              <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>
                {voiceEnabled ? "turn off" : "turn on"}
              </button>
            </p>
          </div>`,
`              {lessonDuolingoArc?.onboarding?.placementRule ? (
                <p className="tutor-onboard-note">{lessonDuolingoArc.onboarding.placementRule}</p>
              ) : null}

              {minimalDuolingoLayout ? (
                <div className="tutor-onboard-cta">
                  <button
                    type="button"
                    className="button tutor-qs-btn tutor-onboard-primary-btn"
                    onClick={() => { unlockAudio(); void startSession(); }}
                    disabled={!canStart || status === "loading"}
                  >
                    {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : "Continue to Mission"}
                  </button>
                  {!canStart && (
                    <p className="muted tutor-onboard-cta-note" style={{ fontSize: "0.85rem", textAlign: "center" }}>
                      Session token missing — launch from the LMS
                    </p>
                  )}
                  <p className="tutor-onboard-cta-hint muted">
                    Voice {voiceEnabled ? "on" : "off"} |{" "}
                    <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>
                      {voiceEnabled ? "turn off" : "turn on"}
                    </button>
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Start button */}
          <div className={`tutor-qs-actions${minimalDuolingoLayout ? " tutor-qs-actions-hidden" : ""}`}>
            <button
              type="button"
              className="button tutor-qs-btn"
              onClick={() => { unlockAudio(); void startSession(); }}
              disabled={!canStart || status === "loading"}
            >
              {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : minimalDuolingoLayout ? "Continue to Mission" : "Start Mission"}
            </button>
            {!canStart && (
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center" }}>
                Session token missing — launch from the LMS
              </p>
            )}
            <p className="tutor-qs-hint muted">
              Voice {voiceEnabled ? "on" : "off"} |{" "}
              <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>
                {voiceEnabled ? "turn off" : "turn on"}
              </button>
            </p>
          </div>`,
"move primary cta into onboarding card"
);

replaceOnce(
`    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
      return false;
    }
  }`,
`    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      if (typeof window !== "undefined" && /signature has expired/i.test(message)) {
        const fallbackGrade = String(launchTokenGrade || learnerGrade || gradeFromQuery || "4");
        const demoChapterCode = requestedChapterCode || requestedCourseId || activeChapter || selectedChapter;
        if (demoChapterCode) {
          window.location.href = "/ai-tutor/demo?grade=" + encodeURIComponent(fallbackGrade) + "&chapter=" + encodeURIComponent(demoChapterCode) + "&fresh=1";
          return false;
        }
      }
      setStatus("error");
      setError(message);
      return false;
    }
  }`,
"expired token refresh redirect"
);

fs.writeFileSync(path, text);