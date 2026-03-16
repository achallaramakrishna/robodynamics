path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx"
with open(path, encoding="utf-8") as f:
    src = f.read()

changes = []

# ─── FIX A: Mobile media query — coach scene layout + avatar + speech bubble ──
# The @media block already has .vedic-focus-scene { grid-template-columns: 1fr }
# but .vedic-focus-stage.coach .vedic-focus-scene has higher specificity so it wins.
# We must override with the SAME specificity inside @media.

old_A = "          .vedic-focus-scene {\n            grid-template-columns: 1fr;\n          }"
new_A = """          .vedic-focus-scene {
            grid-template-columns: 1fr;
          }
          /* Coach mode: override high-specificity desktop 2-col with 1-col on mobile */
          .vedic-focus-stage.coach .vedic-focus-scene {
            grid-template-columns: 1fr;
            min-height: unset;
            gap: 0.5rem;
          }
          /* Compact coach card on mobile: small avatar row + speech below */
          .vedic-focus-stage.coach .vedic-focus-coach {
            grid-template-columns: 72px minmax(0, 1fr);
            height: auto;
            align-items: center;
            padding: 0.6rem 0.7rem;
            border-radius: 16px;
            gap: 0.55rem;
          }
          .vedic-focus-stage.coach .vedic-focus-avatar {
            min-height: 72px;
            max-height: 72px;
          }
          /* Speech bubble: show below coach row, full width, bigger text */
          .rd-speech-bubble {
            font-size: 1.05rem;
            line-height: 1.5;
            padding: 0.75rem 0.9rem;
            border-radius: 14px;
            margin-bottom: 0.4rem;
          }
          /* Board: full width below coach area, cap height on mobile */
          .vedic-inline-board.vedic-focus-board {
            max-height: 200px;
            overflow: hidden;
          }
          /* Try It button: full width, tall, easy to tap */
          .vedic-focus-actions {
            flex-direction: column;
            gap: 0.45rem;
          }
          .vedic-focus-actions .button,
          .vedic-focus-actions .vedic-primary-btn {
            width: 100%;
            min-height: 52px;
            font-size: 1.05rem;
          }"""

if old_A in src:
    src = src.replace(old_A, new_A, 1)
    changes.append("FIX A: coach mobile layout — single column, compact avatar row, big speech")
else:
    changes.append("FIX A MISSED")

# ─── FIX B: Topbar — compact single row on mobile ─────────────────────────────
old_B = """          .vedic-topbar {
            padding: 0.65rem 0.7rem;
          }"""
new_B = """          .vedic-topbar {
            padding: 0.5rem 0.6rem;
            gap: 0.25rem;
          }
          /* Topbar: title + actions in one row on mobile */
          .vedic-topbar-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 0.35rem;
          }
          .vedic-topbar-main {
            text-align: left;
            justify-items: start;
            flex: 1;
            min-width: 0;
          }
          .vedic-topbar-title {
            font-size: 0.95rem;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .vedic-topbar-label {
            font-size: 0.68rem;
          }
          /* Actions: compact icon-style buttons */
          .vedic-topbar-actions {
            flex-wrap: nowrap;
            gap: 0.3rem;
            justify-content: flex-end;
          }
          .vedic-topbar-btn {
            min-height: 34px;
            padding: 0.3rem 0.55rem;
            font-size: 0.78rem;
          }
          /* Stats: single row, smaller pills, show only key 3 */
          .vedic-topbar-stats {
            gap: 0.3rem;
            margin-top: 0.2rem;
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 2px;
          }
          .vedic-stat-pill {
            min-height: 30px;
            padding: 0.25rem 0.55rem;
            font-size: 0.78rem;
          }
          /* Hide less-critical pills on mobile to save space */
          .vedic-stat-pill.points,
          .vedic-stat-pill.muted {
            display: none;
          }"""

if old_B in src:
    src = src.replace(old_B, new_B, 1)
    changes.append("FIX B: topbar compact single row, hide pts/timer pills")
else:
    changes.append("FIX B MISSED")

# ─── FIX C: Student turn (YOUR TURN) — answer input area full width ───────────
old_C = """          .vedic-answer-input {
            min-height: 48px;
          }"""
new_C = """          .vedic-answer-input {
            min-height: 54px;
            font-size: 1.1rem;
            border-radius: 16px;
          }
          .vedic-answer-block {
            border-radius: 18px;
          }
          /* Question text bigger and easier to read */
          .udemy-question-text,
          .vedic-question-text {
            font-size: 1.2rem;
            line-height: 1.5;
          }
          /* Hint card text */
          .udemy-hint,
          .vedic-hint-card {
            font-size: 0.98rem;
          }
          /* Check/Submit button — big thumb-friendly target */
          .button.primary,
          .vedic-primary-btn {
            min-height: 52px;
            font-size: 1.05rem;
          }"""

if old_C in src:
    src = src.replace(old_C, new_C, 1)
    changes.append("FIX C: answer input + question text + buttons full-size on mobile")
else:
    changes.append("FIX C MISSED")

# ─── FIX D: vedic-focus-card padding — more breathing room on mobile ──────────
old_D = """          .vedic-focus-card {
            padding: 0.6rem;
            gap: 0.5rem;
          }"""
new_D = """          .vedic-focus-card {
            padding: 0.65rem 0.7rem;
            gap: 0.55rem;
            border-radius: 20px;
          }"""

if old_D in src:
    src = src.replace(old_D, new_D, 1)
    changes.append("FIX D: focus card padding breathing room")
else:
    changes.append("FIX D MISSED")

# ─── FIX E: vedic-focus-panel padding on mobile ───────────────────────────────
old_E = "          .vedic-focus-panel { padding: 0.5rem 0.55rem; gap: 0.45rem; }"
new_E = "          .vedic-focus-panel { padding: 0.6rem 0.65rem; gap: 0.5rem; }"

if old_E in src:
    src = src.replace(old_E, new_E, 1)
    changes.append("FIX E: focus panel padding")
else:
    changes.append("FIX E MISSED (ok if panel not found)")

with open(path, "w", encoding="utf-8") as f:
    f.write(src)

for c in changes:
    print(c)
