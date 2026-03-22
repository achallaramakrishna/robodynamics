const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

const startBlockStart = lines.findIndex((line) => line.includes('{lessonDuolingoArc?.onboarding?.placementRule ? (                <p className="tutor-onboard-note">'));
if (startBlockStart === -1) throw new Error('placement rule line not found');
const startActionsStart = lines.findIndex((line, idx) => idx > startBlockStart && line.includes('{/* Start button */}'));
if (startActionsStart === -1) throw new Error('start button block not found');
const startActionsEnd = lines.findIndex((line, idx) => idx > startActionsStart && line.trim() === '</div>' && lines[idx + 1] && lines[idx + 1].trim() === '' && lines[idx + 2] && lines[idx + 2].includes('{error ? <p className="error-text">'));
if (startActionsEnd === -1) throw new Error('start button end not found');
const replacement = [
'              {lessonDuolingoArc?.onboarding?.placementRule ? (',
'                <p className="tutor-onboard-note">{lessonDuolingoArc.onboarding.placementRule}</p>',
'              ) : null}',
'',
'              <div className="tutor-onboard-cta">',
'                <button',
'                  type="button"',
'                  className="button tutor-qs-btn tutor-onboard-primary-btn"',
'                  onClick={() => { unlockAudio(); void startSession(); }}',
'                  disabled={!canStart || status === "loading"}',
'                >',
'                  {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : minimalDuolingoLayout ? "Continue to Mission" : "Start Mission"}',
'                </button>',
'                {!canStart && (',
'                  <p className="muted tutor-onboard-cta-note" style={{ fontSize: "0.85rem", textAlign: "center" }}>',
'                    Session token missing — launch from the LMS',
'                  </p>',
'                )}',
'                <p className="tutor-onboard-cta-hint muted">',
'                  Voice {voiceEnabled ? "on" : "off"} |{" "}',
'                  <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>',
'                    {voiceEnabled ? "turn off" : "turn on"}',
'                  </button>',
'                </p>',
'              </div>',
'            </div>',
'          ) : null}',
'',
'          {/* Start button */}',
'          <div className={`tutor-qs-actions${minimalDuolingoLayout ? " tutor-qs-actions-hidden" : ""}`}>',
'            <button',
'              type="button"',
'              className="button tutor-qs-btn"',
'              onClick={() => { unlockAudio(); void startSession(); }}',
'              disabled={!canStart || status === "loading"}',
'            >',
'              {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : minimalDuolingoLayout ? "Continue to Mission" : "Start Mission"}',
'            </button>',
'            {!canStart && (',
'              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center" }}>',
'                Session token missing — launch from the LMS',
'              </p>',
'            )}',
'            <p className="tutor-qs-hint muted">',
'              Voice {voiceEnabled ? "on" : "off"} |{" "}',
'              <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>',
'                {voiceEnabled ? "turn off" : "turn on"}',
'              </button>',
'            </p>',
'          </div>'
];
lines.splice(startBlockStart, startActionsEnd - startBlockStart + 1, ...replacement);

const catchStart = lines.findIndex((line) => line.trim() === '} catch (err) {' && lines[line ? 0 : 0] !== undefined);
const targetCatchStart = lines.findIndex((line, idx) => idx > 2730 && idx < 2760 && line.trim() === '} catch (err) {');
if (targetCatchStart === -1) throw new Error('startSession catch not found');
const targetCatchEnd = targetCatchStart + 4;
lines.splice(targetCatchStart, 5,
'    } catch (err) {',
'      const message = err instanceof Error ? err.message : "Unexpected error";',
'      if (typeof window !== "undefined" && /signature has expired/i.test(message)) {',
'        const fallbackGrade = String(launchTokenGrade || learnerGrade || gradeFromQuery || "4");',
'        const demoChapterCode = requestedChapterCode || activeChapter || selectedChapter;',
'        if (demoChapterCode) {',
'          window.location.href = `/ai-tutor/demo?grade=${encodeURIComponent(fallbackGrade)}&chapter=${encodeURIComponent(demoChapterCode)}&fresh=1`;',
'          return false;',
'        }',
'      }',
'      setStatus("error");',
'      setError(message);',
'      return false;',
'    }'
);

fs.writeFileSync(path, lines.join('\r\n'));