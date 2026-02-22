<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Parent Intake</title>
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
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      background:
        radial-gradient(900px 420px at 8% -12%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(760px 360px at 108% -14%, rgba(15, 118, 110, 0.16), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #edf3f8 100%);
    }

    .shell { width: min(980px, 92vw); margin: 30px auto; }

    .hero {
      background: linear-gradient(120deg, var(--brand-secondary), var(--brand-primary));
      color: #f8fbff;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 18px 42px rgba(2, 23, 39, 0.12);
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    .hero p { margin: 10px 0 0; line-height: 1.55; color: rgba(241, 247, 255, 0.95); }

    .panel {
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      padding: 20px;
    }

    .muted { color: var(--ink-500); margin: 6px 0 0; }

    .section-head {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }

    .section-kicker {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--brand-primary);
      margin-bottom: 6px;
    }

    .section-note {
      margin-top: 8px;
      font-size: 12px;
      color: #334155;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 7px 9px;
      display: inline-block;
    }

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

    input[type="text"], select, textarea {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 11px;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink-900);
      background: #fff;
    }

    textarea { min-height: 96px; resize: vertical; }

    .radios {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 11px;
    }

    .radios label {
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
    }

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

    .powered {
      margin-top: 14px;
      text-align: right;
      color: var(--ink-500);
      font-size: 12px;
      font-weight: 600;
    }

    @media (max-width: 920px) {
      .field-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>
  <div class="shell">
    <section class="hero">
      <h1>Parent Intake Questionnaire</h1>
      <p>
        Student: <strong><c:out value="${student.displayName}" /></strong><br>
        Plan: <strong><c:out value="${subscription.planName}" /></strong>
      </p>
    </section>

    <section class="panel">
      <h2>Context Before Student Test</h2>
      <p class="muted">Your responses shape the AptiPath 360 recommendation context for this student.</p>

      <form method="post" action="${pageContext.request.contextPath}/aptipath/parent/intake">
        <input type="hidden" name="subscriptionId" value="${subscription.ciSubscriptionId}">
        <input type="hidden" name="studentId" value="${student.userID}">
        <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
        <input type="hidden" name="company" value="${companyCode}">

        <div class="section-head">
          <div class="section-kicker">Mindset Pulse</div>
          <h3>Parent Perspective Check (2 minutes)</h3>
          <p class="muted">
            This helps us understand your real concern and tailor recommendations beyond marks.
          </p>
          <div class="section-note">Optional, but strongly recommended for better report quality.</div>
        </div>

        <div class="field-grid">
          <div>
            <label for="P_MIND_01">Biggest worry right now</label>
            <select id="P_MIND_01" name="P_MIND_01">
              <option value="">Select</option>
              <option value="CAREER_CLARITY" ${answers['P_MIND_01'] == 'CAREER_CLARITY' ? 'selected' : ''}>Child has no clear career direction</option>
              <option value="EXAM_STRESS" ${answers['P_MIND_01'] == 'EXAM_STRESS' ? 'selected' : ''}>Exam stress or anxiety</option>
              <option value="CONSISTENCY_FOCUS" ${answers['P_MIND_01'] == 'CONSISTENCY_FOCUS' ? 'selected' : ''}>Inconsistent study habits</option>
              <option value="SCREEN_DISTRACTION" ${answers['P_MIND_01'] == 'SCREEN_DISTRACTION' ? 'selected' : ''}>High distraction from devices</option>
              <option value="SOCIAL_COMPARISON" ${answers['P_MIND_01'] == 'SOCIAL_COMPARISON' ? 'selected' : ''}>Comparison with peers</option>
              <option value="NONE_SPECIFIC" ${answers['P_MIND_01'] == 'NONE_SPECIFIC' ? 'selected' : ''}>No major concern right now</option>
            </select>
          </div>

          <div>
            <label for="P_MIND_03">What outcome do you expect most?</label>
            <select id="P_MIND_03" name="P_MIND_03">
              <option value="">Select</option>
              <option value="CLEAR_ACTION_PLAN" ${answers['P_MIND_03'] == 'CLEAR_ACTION_PLAN' ? 'selected' : ''}>Clear 90-day action plan</option>
              <option value="STREAM_RECOMMENDATION" ${answers['P_MIND_03'] == 'STREAM_RECOMMENDATION' ? 'selected' : ''}>Best stream and career direction</option>
              <option value="MENTAL_PREP_SUPPORT" ${answers['P_MIND_03'] == 'MENTAL_PREP_SUPPORT' ? 'selected' : ''}>Mental preparedness guidance</option>
              <option value="PARENT_COMMUNICATION" ${answers['P_MIND_03'] == 'PARENT_COMMUNICATION' ? 'selected' : ''}>How to support as a parent</option>
              <option value="COMPLETE_MIX" ${answers['P_MIND_03'] == 'COMPLETE_MIX' ? 'selected' : ''}>All of the above</option>
            </select>
          </div>

          <div class="field-full">
            <label>Confidence in current student target</label>
            <div class="radios">
              <label><input type="radio" name="P_MIND_02" value="LOW" ${answers['P_MIND_02'] == 'LOW' ? 'checked' : ''}> Low confidence</label>
              <label><input type="radio" name="P_MIND_02" value="MEDIUM" ${answers['P_MIND_02'] == 'MEDIUM' ? 'checked' : ''}> Medium confidence</label>
              <label><input type="radio" name="P_MIND_02" value="HIGH" ${answers['P_MIND_02'] == 'HIGH' ? 'checked' : ''}> High confidence</label>
            </div>
          </div>

          <div class="field-full">
            <label for="P_MIND_04">If AptiPath could fix one thing in 90 days, what should it be?</label>
            <input id="P_MIND_04" name="P_MIND_04" type="text" maxlength="220"
                   value="<c:out value='${answers["P_MIND_04"]}' />"
                   placeholder="Example: reduce exam anxiety and improve consistency">
          </div>
        </div>

        <div class="section-head">
          <div class="section-kicker">Core Intake</div>
          <h3>Student Context Before Assessment</h3>
        </div>

        <div class="field-grid">
          <div>
            <label for="P_GOAL_01">Primary goal for next 2 years</label>
            <select id="P_GOAL_01" name="P_GOAL_01" required>
              <option value="">Select</option>
              <option value="STEM_CAREER" ${answers['P_GOAL_01'] == 'STEM_CAREER' ? 'selected' : ''}>STEM-focused pathway</option>
              <option value="MEDICAL_CAREER" ${answers['P_GOAL_01'] == 'MEDICAL_CAREER' ? 'selected' : ''}>Medical pathway</option>
              <option value="COMMERCE_CAREER" ${answers['P_GOAL_01'] == 'COMMERCE_CAREER' ? 'selected' : ''}>Commerce and business</option>
              <option value="CREATIVE_CAREER" ${answers['P_GOAL_01'] == 'CREATIVE_CAREER' ? 'selected' : ''}>Creative and design</option>
            </select>
          </div>

          <div>
            <label for="P_BUDGET_01">Monthly support budget</label>
            <select id="P_BUDGET_01" name="P_BUDGET_01" required>
              <option value="">Select</option>
              <option value="BUDGET_TIGHT" ${answers['P_BUDGET_01'] == 'BUDGET_TIGHT' ? 'selected' : ''}>Tight</option>
              <option value="BUDGET_MEDIUM" ${answers['P_BUDGET_01'] == 'BUDGET_MEDIUM' ? 'selected' : ''}>Medium</option>
              <option value="BUDGET_FLEXIBLE" ${answers['P_BUDGET_01'] == 'BUDGET_FLEXIBLE' ? 'selected' : ''}>Flexible</option>
            </select>
          </div>

          <div>
            <label for="P_GEOGRAPHY_01">Geography flexibility</label>
            <select id="P_GEOGRAPHY_01" name="P_GEOGRAPHY_01" required>
              <option value="">Select</option>
              <option value="LOCAL" ${answers['P_GEOGRAPHY_01'] == 'LOCAL' ? 'selected' : ''}>Local only</option>
              <option value="REGIONAL" ${answers['P_GEOGRAPHY_01'] == 'REGIONAL' ? 'selected' : ''}>Regional</option>
              <option value="NATIONAL" ${answers['P_GEOGRAPHY_01'] == 'NATIONAL' ? 'selected' : ''}>Anywhere in India</option>
              <option value="OPEN" ${answers['P_GEOGRAPHY_01'] == 'OPEN' ? 'selected' : ''}>Open including outside India</option>
            </select>
          </div>

          <div class="field-full">
            <label>How much support does the student currently need?</label>
            <div class="radios">
              <label><input type="radio" name="P_SUPPORT_01" value="HIGH" ${answers['P_SUPPORT_01'] == 'HIGH' ? 'checked' : ''} required> High</label>
              <label><input type="radio" name="P_SUPPORT_01" value="MEDIUM" ${answers['P_SUPPORT_01'] == 'MEDIUM' ? 'checked' : ''}> Medium</label>
              <label><input type="radio" name="P_SUPPORT_01" value="LOW" ${answers['P_SUPPORT_01'] == 'LOW' ? 'checked' : ''}> Low</label>
            </div>
          </div>

          <div>
            <label for="P_COACHING_01">Coaching tolerance</label>
            <select id="P_COACHING_01" name="P_COACHING_01" required>
              <option value="">Select</option>
              <option value="LOW" ${answers['P_COACHING_01'] == 'LOW' ? 'selected' : ''}>Low</option>
              <option value="MODERATE" ${answers['P_COACHING_01'] == 'MODERATE' ? 'selected' : ''}>Moderate</option>
              <option value="HIGH" ${answers['P_COACHING_01'] == 'HIGH' ? 'selected' : ''}>High</option>
              <option value="VERY_HIGH" ${answers['P_COACHING_01'] == 'VERY_HIGH' ? 'selected' : ''}>Very high</option>
            </select>
          </div>

          <div>
            <label for="P_MODEL_01">Preferred learning model</label>
            <select id="P_MODEL_01" name="P_MODEL_01" required>
              <option value="">Select</option>
              <option value="SCHOOL_FOCUSED" ${answers['P_MODEL_01'] == 'SCHOOL_FOCUSED' ? 'selected' : ''}>School focused</option>
              <option value="HYBRID_COACHING" ${answers['P_MODEL_01'] == 'HYBRID_COACHING' ? 'selected' : ''}>Hybrid with coaching</option>
              <option value="PERSONAL_MENTORING" ${answers['P_MODEL_01'] == 'PERSONAL_MENTORING' ? 'selected' : ''}>Personal mentoring</option>
              <option value="SELF_PACED_DIGITAL" ${answers['P_MODEL_01'] == 'SELF_PACED_DIGITAL' ? 'selected' : ''}>Self-paced digital</option>
            </select>
          </div>

          <div>
            <label for="P_STRENGTH_01">Top observed strength</label>
            <input id="P_STRENGTH_01" name="P_STRENGTH_01" type="text" maxlength="220"
                   value="<c:out value='${answers["P_STRENGTH_01"]}' />"
                   placeholder="Example: analytical thinking">
          </div>

          <div>
            <label for="P_CHALLENGE_01">Current challenge</label>
            <input id="P_CHALLENGE_01" name="P_CHALLENGE_01" type="text" maxlength="220"
                   value="<c:out value='${answers["P_CHALLENGE_01"]}' />"
                   placeholder="Example: consistency under exam pressure">
          </div>

          <div>
            <label for="P_LANGUAGE_01">Preferred counseling language</label>
            <select id="P_LANGUAGE_01" name="P_LANGUAGE_01" required>
              <option value="">Select</option>
              <option value="ENGLISH" ${answers['P_LANGUAGE_01'] == 'ENGLISH' ? 'selected' : ''}>English</option>
              <option value="KANNADA" ${answers['P_LANGUAGE_01'] == 'KANNADA' ? 'selected' : ''}>Kannada</option>
              <option value="HINDI" ${answers['P_LANGUAGE_01'] == 'HINDI' ? 'selected' : ''}>Hindi</option>
              <option value="TELUGU" ${answers['P_LANGUAGE_01'] == 'TELUGU' ? 'selected' : ''}>Telugu</option>
            </select>
          </div>

          <div>
            <label for="P_TIMELINE_01">Decision timeline</label>
            <select id="P_TIMELINE_01" name="P_TIMELINE_01" required>
              <option value="">Select</option>
              <option value="IMMEDIATE" ${answers['P_TIMELINE_01'] == 'IMMEDIATE' ? 'selected' : ''}>Within 1 month</option>
              <option value="QUARTER" ${answers['P_TIMELINE_01'] == 'QUARTER' ? 'selected' : ''}>Within 3 months</option>
              <option value="ACADEMIC_YEAR" ${answers['P_TIMELINE_01'] == 'ACADEMIC_YEAR' ? 'selected' : ''}>Within this academic year</option>
            </select>
          </div>

          <div class="field-full">
            <label for="P_NOTES_01">Additional notes</label>
            <textarea id="P_NOTES_01" name="P_NOTES_01" maxlength="900"
                      placeholder="Share anything important for the counselor context"><c:out value='${answers["P_NOTES_01"]}' /></textarea>
          </div>
        </div>

        <div class="btn-row">
          <button class="btn btn-primary" type="submit">Save Intake</button>
          <c:choose>
            <c:when test="${embedMode}">
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/home?embed=1&company=${companyCode}">Back to Parent Workspace</a>
            </c:when>
            <c:otherwise>
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/home">Back to Parent Workspace</a>
            </c:otherwise>
          </c:choose>
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
</body>
</html>
