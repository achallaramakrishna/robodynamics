<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath Student Intake</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root {
      --brand-primary: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'};
      --brand-secondary: ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'};
      --ink-900: #0f172a;
      --ink-700: #334155;
      --ink-500: #64748b;
      --line: #dbe6ef;
      --surface: #ffffff;
      --ok-bg: #dcfce7;
      --ok-ink: #166534;
      --warn-bg: #fff7ed;
      --warn-ink: #9a3412;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      background:
        radial-gradient(920px 420px at 8% -12%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(760px 340px at 104% -14%, rgba(15, 118, 110, 0.16), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #edf3f8 100%);
    }

    .shell { width: min(980px, 92vw); margin: 20px auto; }

    .hero {
      background: linear-gradient(120deg, var(--brand-secondary), var(--brand-primary));
      color: #f8fbff;
      border-radius: 22px;
      padding: 20px;
      box-shadow: 0 18px 42px rgba(2, 23, 39, 0.12);
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    .hero p {
      margin: 10px 0 0;
      line-height: 1.55;
      color: rgba(241, 247, 255, 0.95);
      font-size: 14px;
    }

    .panel {
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      padding: 20px;
    }

    .mode-chip {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .04em;
      background: var(--ok-bg);
      color: var(--ok-ink);
      text-transform: uppercase;
    }

    .warn {
      margin-top: 12px;
      border: 1px solid #fed7aa;
      background: var(--warn-bg);
      color: var(--warn-ink);
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
    }

    .progress {
      margin: 14px 0 4px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .progress-step {
      height: 8px;
      border-radius: 999px;
      background: #e2e8f0;
    }

    .progress-step.active {
      background: linear-gradient(90deg, var(--brand-secondary), var(--brand-primary));
    }

    .step-meta {
      margin-top: 8px;
      color: var(--ink-500);
      font-size: 13px;
      font-weight: 600;
    }

    .step-pane { display: none; }
    .step-pane.active { display: block; }

    .field-grid {
      margin-top: 14px;
      display: grid;
      gap: 14px;
      grid-template-columns: 1fr 1fr;
    }

    .field-full { grid-column: 1 / -1; }

    label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
      color: var(--ink-700);
    }

    input[type="text"],
    select,
    textarea {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 11px;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink-900);
      background: #fff;
    }

    textarea { min-height: 94px; resize: vertical; }

    .radio-wrap {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 9px 10px;
    }

    .radio-wrap label {
      margin: 0;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-row {
      margin-top: 16px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }

    .btn {
      text-decoration: none;
      border: 0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-primary {
      background: var(--brand-primary);
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 118, 110, .24);
    }

    .btn-secondary {
      background: #e9eff5;
      color: #0f172a;
    }

    .btn:disabled {
      opacity: .45;
      cursor: not-allowed;
      box-shadow: none;
    }

    .powered {
      margin-top: 14px;
      text-align: right;
      color: var(--ink-500);
      font-size: 12px;
      font-weight: 600;
    }

    @media (max-width: 920px) {
      .field-grid { grid-template-columns: 1fr; }
      .btn-row { flex-direction: column; align-items: stretch; }
    }
  </style>
</head>
<body>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>

  <div class="shell">
    <section class="hero">
      <h1>Student Profile Intake</h1>
      <p>
        Before the test, we collect your preferences, strengths, concerns, and motivation signals.
        This improves relevance and career guidance quality.
      </p>
      <p>
        Student: <strong><c:out value="${student.displayName}" /></strong>
      </p>
      <span class="mode-chip">Release Mode: <c:out value="${releaseMode}" /></span>
      <c:if test="${intakeRequired}">
        <div class="warn">Complete this profile intake to unlock AptiPath test access.</div>
      </c:if>
    </section>

    <section class="panel">
      <h2>Step-Based Intake</h2>
      <p style="color:#64748b;margin:6px 0 0;">4 short steps. Be honest. There are no right or wrong answers.</p>

      <div class="progress" id="progress">
        <div class="progress-step active"></div>
        <div class="progress-step"></div>
        <div class="progress-step"></div>
        <div class="progress-step"></div>
      </div>
      <div class="step-meta" id="stepMeta">Step 1 of 4: Aspirations</div>

      <form id="intakeForm" method="post" action="${pageContext.request.contextPath}/aptipath/student/intake">
        <input type="hidden" name="subscriptionId" value="${subscription.ciSubscriptionId}">
        <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
        <input type="hidden" name="company" value="${companyCode}">

        <section class="step-pane active" data-step="1">
          <h3>Aspiration and Direction</h3>
          <div class="field-grid">
            <div>
              <label for="S_GOAL_01">What kind of future role attracts you most? *</label>
              <select id="S_GOAL_01" name="S_GOAL_01" required>
                <option value="">Select</option>
                <option value="ENGINEERING_RESEARCH" ${answers['S_GOAL_01'] == 'ENGINEERING_RESEARCH' ? 'selected' : ''}>Engineering and research</option>
                <option value="MEDICAL_HEALTH" ${answers['S_GOAL_01'] == 'MEDICAL_HEALTH' ? 'selected' : ''}>Medical and health</option>
                <option value="BUSINESS_LEADERSHIP" ${answers['S_GOAL_01'] == 'BUSINESS_LEADERSHIP' ? 'selected' : ''}>Business and leadership</option>
                <option value="DESIGN_CREATIVE" ${answers['S_GOAL_01'] == 'DESIGN_CREATIVE' ? 'selected' : ''}>Design and creative fields</option>
                <option value="PUBLIC_SERVICE" ${answers['S_GOAL_01'] == 'PUBLIC_SERVICE' ? 'selected' : ''}>Public service and social impact</option>
              </select>
            </div>
            <div class="field-full">
              <label for="S_LIFE_01">If everything goes well, where do you see yourself in 10 years? *</label>
              <textarea id="S_LIFE_01" name="S_LIFE_01" required><c:out value='${answers["S_LIFE_01"]}' /></textarea>
            </div>
            <div class="field-full">
              <label for="S_ROLE_01">Any role model or professional you admire?</label>
              <input id="S_ROLE_01" name="S_ROLE_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_ROLE_01"]}' />"
                     placeholder="Example: aerospace engineer, doctor, entrepreneur">
            </div>
          </div>
        </section>

        <section class="step-pane" data-step="2">
          <h3>Personality and Daily Preference</h3>
          <div class="field-grid">
            <div>
              <label for="S_HOBBY_01">Top hobbies or activities you enjoy most *</label>
              <input id="S_HOBBY_01" name="S_HOBBY_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_HOBBY_01"]}' />" required
                     placeholder="Example: coding, sketching, cricket, reading">
            </div>
            <div>
              <label for="S_DISLIKE_01">What kind of work or subjects do you dislike? *</label>
              <input id="S_DISLIKE_01" name="S_DISLIKE_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_DISLIKE_01"]}' />" required
                     placeholder="Example: repetitive memorization, long theory writing">
            </div>
            <div class="field-full">
              <label>How do you learn best? *</label>
              <div class="radio-wrap">
                <label><input type="radio" name="S_STYLE_01" value="VISUAL" ${answers['S_STYLE_01'] == 'VISUAL' ? 'checked' : ''} required> Visual and diagrams</label>
                <label><input type="radio" name="S_STYLE_01" value="PRACTICAL" ${answers['S_STYLE_01'] == 'PRACTICAL' ? 'checked' : ''}> Practical and projects</label>
                <label><input type="radio" name="S_STYLE_01" value="DISCUSSION" ${answers['S_STYLE_01'] == 'DISCUSSION' ? 'checked' : ''}> Discussion and explanation</label>
                <label><input type="radio" name="S_STYLE_01" value="SELF_STUDY" ${answers['S_STYLE_01'] == 'SELF_STUDY' ? 'checked' : ''}> Independent self-study</label>
              </div>
            </div>
            <div>
              <label for="S_MOTIVE_01">What motivates you the most right now?</label>
              <select id="S_MOTIVE_01" name="S_MOTIVE_01">
                <option value="">Select</option>
                <option value="MASTERY" ${answers['S_MOTIVE_01'] == 'MASTERY' ? 'selected' : ''}>Mastering a strong skill</option>
                <option value="FAMILY_EXPECTATION" ${answers['S_MOTIVE_01'] == 'FAMILY_EXPECTATION' ? 'selected' : ''}>Family expectations</option>
                <option value="COMPETITION" ${answers['S_MOTIVE_01'] == 'COMPETITION' ? 'selected' : ''}>Competition and rank</option>
                <option value="REAL_WORLD_IMPACT" ${answers['S_MOTIVE_01'] == 'REAL_WORLD_IMPACT' ? 'selected' : ''}>Building real-world impact</option>
              </select>
            </div>
          </div>
        </section>

        <section class="step-pane" data-step="3">
          <h3>Achievements and Concerns</h3>
          <div class="field-grid">
            <div class="field-full">
              <label for="S_ACHIEVE_01">What achievements are you proud of? *</label>
              <textarea id="S_ACHIEVE_01" name="S_ACHIEVE_01" required><c:out value='${answers["S_ACHIEVE_01"]}' /></textarea>
            </div>
            <div>
              <label for="S_ACCOLADE_01">Any awards, accolades, or recognitions?</label>
              <input id="S_ACCOLADE_01" name="S_ACCOLADE_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_ACCOLADE_01"]}' />"
                     placeholder="Example: olympiad medal, sports captain">
            </div>
            <div>
              <label for="S_FEAR_01">What fear or blocker affects your performance most? *</label>
              <input id="S_FEAR_01" name="S_FEAR_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_FEAR_01"]}' />" required
                     placeholder="Example: fear of failure, exam pressure, time panic">
            </div>
            <div>
              <label for="S_STRESS_01">Stress response pattern</label>
              <select id="S_STRESS_01" name="S_STRESS_01">
                <option value="">Select</option>
                <option value="OVERTHINK" ${answers['S_STRESS_01'] == 'OVERTHINK' ? 'selected' : ''}>I overthink and slow down</option>
                <option value="RUSH" ${answers['S_STRESS_01'] == 'RUSH' ? 'selected' : ''}>I rush and make mistakes</option>
                <option value="FREEZE" ${answers['S_STRESS_01'] == 'FREEZE' ? 'selected' : ''}>I freeze or avoid tasks</option>
                <option value="STABLE" ${answers['S_STRESS_01'] == 'STABLE' ? 'selected' : ''}>I stay mostly stable</option>
              </select>
            </div>
          </div>
        </section>

        <section class="step-pane" data-step="4">
          <h3>Family Context and Support</h3>
          <div class="field-grid">
            <div>
              <label for="S_PARENT_01">How aligned are family expectations with your own interests?</label>
              <select id="S_PARENT_01" name="S_PARENT_01">
                <option value="">Select</option>
                <option value="HIGH_ALIGN" ${answers['S_PARENT_01'] == 'HIGH_ALIGN' ? 'selected' : ''}>Highly aligned</option>
                <option value="PARTIAL_ALIGN" ${answers['S_PARENT_01'] == 'PARTIAL_ALIGN' ? 'selected' : ''}>Partially aligned</option>
                <option value="LOW_ALIGN" ${answers['S_PARENT_01'] == 'LOW_ALIGN' ? 'selected' : ''}>Not aligned</option>
              </select>
            </div>
            <div class="field-full">
              <label for="S_SUPPORT_01">What support do you need most from mentors and parents? *</label>
              <textarea id="S_SUPPORT_01" name="S_SUPPORT_01" required><c:out value='${answers["S_SUPPORT_01"]}' /></textarea>
            </div>
          </div>
        </section>

        <div class="btn-row">
          <div class="btn-group">
            <button class="btn btn-secondary" type="button" id="prevBtn">Previous</button>
            <button class="btn btn-secondary" type="button" id="nextBtn">Next</button>
          </div>
          <div class="btn-group">
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/home">Cancel</a>
            <button class="btn btn-primary" type="submit" id="submitBtn">Save and Continue</button>
          </div>
        </div>
      </form>
    </section>

    <div class="powered">
      <c:choose>
        <c:when test="${not empty branding and not empty branding.poweredByLabel}">
          <c:out value="${branding.poweredByLabel}" />
        </c:when>
        <c:otherwise>
          Powered by Robo Dynamics
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>

  <script>
    (function () {
      const form = document.getElementById("intakeForm");
      const panes = Array.from(document.querySelectorAll(".step-pane"));
      const progress = Array.from(document.querySelectorAll(".progress-step"));
      const stepMeta = document.getElementById("stepMeta");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const submitBtn = document.getElementById("submitBtn");
      const labels = [
        "Step 1 of 4: Aspirations",
        "Step 2 of 4: Personality",
        "Step 3 of 4: Achievements & Concerns",
        "Step 4 of 4: Support Context"
      ];
      let step = 0;

      function setStep(index) {
        step = Math.max(0, Math.min(index, panes.length - 1));
        panes.forEach((pane, i) => pane.classList.toggle("active", i === step));
        progress.forEach((node, i) => node.classList.toggle("active", i <= step));
        stepMeta.textContent = labels[step] || "";
        prevBtn.disabled = step === 0;
        nextBtn.style.display = step === panes.length - 1 ? "none" : "inline-flex";
        submitBtn.style.display = step === panes.length - 1 ? "inline-flex" : "none";
      }

      function validateCurrentStep() {
        const current = panes[step];
        if (!current) return true;
        const required = Array.from(current.querySelectorAll("[required]"));
        for (const field of required) {
          if (field.type === "radio") {
            const name = field.name;
            if (!name) continue;
            const checked = current.querySelector("input[type='radio'][name='" + name + "']:checked");
            if (!checked) {
              field.focus();
              return false;
            }
            continue;
          }
          if (!field.value || !field.value.trim()) {
            field.focus();
            return false;
          }
        }
        return true;
      }

      prevBtn.addEventListener("click", function () {
        setStep(step - 1);
      });
      nextBtn.addEventListener("click", function () {
        if (!validateCurrentStep()) return;
        setStep(step + 1);
      });
      form.addEventListener("submit", function (event) {
        if (!validateCurrentStep()) {
          event.preventDefault();
        }
      });

      setStep(0);
    })();
  </script>
</body>
</html>
