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

    .hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--ink-500);
      line-height: 1.4;
    }

    .field-note {
      margin: 4px 0 0;
      font-size: 12px;
      color: #0f766e;
      font-weight: 700;
      line-height: 1.35;
    }

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
      <p style="color:#64748b;margin:6px 0 0;">4 short steps. Academic context first, then aptitude inputs for precise career discovery.</p>

      <div class="progress" id="progress">
        <div class="progress-step active"></div>
        <div class="progress-step"></div>
        <div class="progress-step"></div>
        <div class="progress-step"></div>
      </div>
      <div class="step-meta" id="stepMeta">Step 1 of 4: Academic Context and Aspiration</div>

      <form id="intakeForm" method="post" action="${pageContext.request.contextPath}/aptipath/student/intake">
        <input type="hidden" name="subscriptionId" value="${subscription.ciSubscriptionId}">
        <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
        <input type="hidden" name="company" value="${companyCode}">

        <section class="step-pane active" data-step="1">
          <h3>Academic Context and Aspiration</h3>
          <div class="field-grid">
            <div>
              <label for="S_CURR_SCHOOL_01">Current school / college / institute *</label>
              <input id="S_CURR_SCHOOL_01" name="S_CURR_SCHOOL_01" type="text" maxlength="220"
                     value="<c:out value='${answers["S_CURR_SCHOOL_01"]}' />" required
                     placeholder="Example: Delhi Public School, VIT, SRM, IIT, local college">
            </div>
            <div>
              <label for="S_CURR_GRADE_01">Current grade / year *</label>
              <select id="S_CURR_GRADE_01" name="S_CURR_GRADE_01" required>
                <option value="">Select</option>
                <option value="8" ${answers['S_CURR_GRADE_01'] == '8' ? 'selected' : ''}>Class 8</option>
                <option value="9" ${answers['S_CURR_GRADE_01'] == '9' ? 'selected' : ''}>Class 9</option>
                <option value="10" ${answers['S_CURR_GRADE_01'] == '10' ? 'selected' : ''}>Class 10</option>
                <option value="11" ${answers['S_CURR_GRADE_01'] == '11' ? 'selected' : ''}>Class 11</option>
                <option value="12" ${answers['S_CURR_GRADE_01'] == '12' ? 'selected' : ''}>Class 12</option>
                <option value="DIPLOMA_1" ${answers['S_CURR_GRADE_01'] == 'DIPLOMA_1' ? 'selected' : ''}>Diploma Year 1</option>
                <option value="DIPLOMA_2" ${answers['S_CURR_GRADE_01'] == 'DIPLOMA_2' ? 'selected' : ''}>Diploma Year 2</option>
                <option value="DIPLOMA_3" ${answers['S_CURR_GRADE_01'] == 'DIPLOMA_3' ? 'selected' : ''}>Diploma Year 3</option>
                <option value="UG_1" ${answers['S_CURR_GRADE_01'] == 'UG_1' ? 'selected' : ''}>UG Year 1</option>
                <option value="UG_2" ${answers['S_CURR_GRADE_01'] == 'UG_2' ? 'selected' : ''}>UG Year 2</option>
                <option value="UG_3" ${answers['S_CURR_GRADE_01'] == 'UG_3' ? 'selected' : ''}>UG Year 3</option>
                <option value="UG_4" ${answers['S_CURR_GRADE_01'] == 'UG_4' ? 'selected' : ''}>UG Year 4</option>
                <option value="UG_5" ${answers['S_CURR_GRADE_01'] == 'UG_5' ? 'selected' : ''}>UG Year 5 / Integrated</option>
                <option value="PG_1" ${answers['S_CURR_GRADE_01'] == 'PG_1' ? 'selected' : ''}>PG Year 1</option>
                <option value="PG_2" ${answers['S_CURR_GRADE_01'] == 'PG_2' ? 'selected' : ''}>PG Year 2</option>
                <option value="MBA_1" ${answers['S_CURR_GRADE_01'] == 'MBA_1' ? 'selected' : ''}>MBA Year 1</option>
                <option value="MBA_2" ${answers['S_CURR_GRADE_01'] == 'MBA_2' ? 'selected' : ''}>MBA Year 2</option>
                <option value="MTECH_1" ${answers['S_CURR_GRADE_01'] == 'MTECH_1' ? 'selected' : ''}>M.Tech Year 1</option>
                <option value="MTECH_2" ${answers['S_CURR_GRADE_01'] == 'MTECH_2' ? 'selected' : ''}>M.Tech Year 2</option>
                <option value="COLLEGE_OTHER" ${answers['S_CURR_GRADE_01'] == 'COLLEGE_OTHER' ? 'selected' : ''}>Other college program</option>
                <option value="WORKING" ${answers['S_CURR_GRADE_01'] == 'WORKING' ? 'selected' : ''}>Working professional</option>
              </select>
            </div>
            <div>
              <label for="S_CURR_BOARD_01">Board / curriculum *</label>
              <select id="S_CURR_BOARD_01" name="S_CURR_BOARD_01" required>
                <option value="">Select</option>
                <option value="CBSE" ${answers['S_CURR_BOARD_01'] == 'CBSE' ? 'selected' : ''}>CBSE</option>
                <option value="ICSE" ${answers['S_CURR_BOARD_01'] == 'ICSE' ? 'selected' : ''}>ICSE</option>
                <option value="STATE_BOARD" ${answers['S_CURR_BOARD_01'] == 'STATE_BOARD' ? 'selected' : ''}>State Board</option>
                <option value="IB" ${answers['S_CURR_BOARD_01'] == 'IB' ? 'selected' : ''}>IB</option>
                <option value="CAMBRIDGE" ${answers['S_CURR_BOARD_01'] == 'CAMBRIDGE' ? 'selected' : ''}>Cambridge (IGCSE/A Levels)</option>
                <option value="NIOS" ${answers['S_CURR_BOARD_01'] == 'NIOS' ? 'selected' : ''}>NIOS</option>
                <option value="DIPLOMA_AUTONOMOUS" ${answers['S_CURR_BOARD_01'] == 'DIPLOMA_AUTONOMOUS' ? 'selected' : ''}>Diploma/Polytechnic Curriculum</option>
                <option value="UNIVERSITY_CURRICULUM" ${answers['S_CURR_BOARD_01'] == 'UNIVERSITY_CURRICULUM' ? 'selected' : ''}>University Curriculum</option>
              </select>
            </div>
            <div id="streamWrap">
              <label for="S_CURR_STREAM_01">Current stream</label>
              <select id="S_CURR_STREAM_01" name="S_CURR_STREAM_01">
                <option value="">Select</option>
                <optgroup label="School Streams">
                  <option value="PCM" ${answers['S_CURR_STREAM_01'] == 'PCM' ? 'selected' : ''}>PCM (Physics, Chemistry, Math)</option>
                  <option value="PCB" ${answers['S_CURR_STREAM_01'] == 'PCB' ? 'selected' : ''}>PCB (Physics, Chemistry, Biology)</option>
                  <option value="PCMB" ${answers['S_CURR_STREAM_01'] == 'PCMB' ? 'selected' : ''}>PCMB</option>
                  <option value="COMMERCE_MATH" ${answers['S_CURR_STREAM_01'] == 'COMMERCE_MATH' ? 'selected' : ''}>Commerce with Math</option>
                  <option value="COMMERCE" ${answers['S_CURR_STREAM_01'] == 'COMMERCE' ? 'selected' : ''}>Commerce</option>
                  <option value="HUMANITIES" ${answers['S_CURR_STREAM_01'] == 'HUMANITIES' ? 'selected' : ''}>Humanities</option>
                  <option value="ARTS" ${answers['S_CURR_STREAM_01'] == 'ARTS' ? 'selected' : ''}>Arts</option>
                </optgroup>
                <optgroup label="Post-12 Streams">
                  <option value="ENGINEERING_TECH" ${answers['S_CURR_STREAM_01'] == 'ENGINEERING_TECH' ? 'selected' : ''}>Engineering and Technology</option>
                  <option value="COMPUTER_DATA_AI" ${answers['S_CURR_STREAM_01'] == 'COMPUTER_DATA_AI' ? 'selected' : ''}>Computer Science, Data and AI</option>
                  <option value="ELECTRONICS_ELECTRICAL" ${answers['S_CURR_STREAM_01'] == 'ELECTRONICS_ELECTRICAL' ? 'selected' : ''}>Electronics and Electrical</option>
                  <option value="MECHANICAL_MANUFACTURING" ${answers['S_CURR_STREAM_01'] == 'MECHANICAL_MANUFACTURING' ? 'selected' : ''}>Mechanical and Manufacturing</option>
                  <option value="CIVIL_BUILT_ENV" ${answers['S_CURR_STREAM_01'] == 'CIVIL_BUILT_ENV' ? 'selected' : ''}>Civil and Built Environment</option>
                  <option value="ARCH_DESIGN" ${answers['S_CURR_STREAM_01'] == 'ARCH_DESIGN' ? 'selected' : ''}>Architecture and Design</option>
                  <option value="BUSINESS_MANAGEMENT" ${answers['S_CURR_STREAM_01'] == 'BUSINESS_MANAGEMENT' ? 'selected' : ''}>Business and Management</option>
                  <option value="COMMERCE_FINANCE" ${answers['S_CURR_STREAM_01'] == 'COMMERCE_FINANCE' ? 'selected' : ''}>Commerce and Finance</option>
                  <option value="ECONOMICS_PUBLIC_POLICY" ${answers['S_CURR_STREAM_01'] == 'ECONOMICS_PUBLIC_POLICY' ? 'selected' : ''}>Economics and Public Policy</option>
                  <option value="LAW_POLICY_GOV" ${answers['S_CURR_STREAM_01'] == 'LAW_POLICY_GOV' ? 'selected' : ''}>Law, Policy and Governance</option>
                  <option value="HEALTHCARE_MEDICAL" ${answers['S_CURR_STREAM_01'] == 'HEALTHCARE_MEDICAL' ? 'selected' : ''}>Medical and Healthcare</option>
                  <option value="HEALTHCARE_LIFE" ${answers['S_CURR_STREAM_01'] == 'HEALTHCARE_LIFE' ? 'selected' : ''}>Healthcare and Life Sciences</option>
                  <option value="LIFE_SCI_BIOTECH" ${answers['S_CURR_STREAM_01'] == 'LIFE_SCI_BIOTECH' ? 'selected' : ''}>Life Sciences and Biotechnology</option>
                  <option value="PURE_SCIENCES" ${answers['S_CURR_STREAM_01'] == 'PURE_SCIENCES' ? 'selected' : ''}>Pure Sciences</option>
                  <option value="SCIENCE_RESEARCH" ${answers['S_CURR_STREAM_01'] == 'SCIENCE_RESEARCH' ? 'selected' : ''}>Science and Research</option>
                  <option value="AGRI_FOOD_ENV" ${answers['S_CURR_STREAM_01'] == 'AGRI_FOOD_ENV' ? 'selected' : ''}>Agriculture, Food and Environment</option>
                  <option value="LAW_POLICY" ${answers['S_CURR_STREAM_01'] == 'LAW_POLICY' ? 'selected' : ''}>Law and Policy</option>
                  <option value="MEDIA_COMM" ${answers['S_CURR_STREAM_01'] == 'MEDIA_COMM' ? 'selected' : ''}>Media and Communication</option>
                  <option value="SOCIAL_SCIENCES" ${answers['S_CURR_STREAM_01'] == 'SOCIAL_SCIENCES' ? 'selected' : ''}>Social Sciences</option>
                  <option value="PSYCHOLOGY_BEHAVIORAL" ${answers['S_CURR_STREAM_01'] == 'PSYCHOLOGY_BEHAVIORAL' ? 'selected' : ''}>Psychology and Behavioral Sciences</option>
                  <option value="EDUCATION_TEACHING" ${answers['S_CURR_STREAM_01'] == 'EDUCATION_TEACHING' ? 'selected' : ''}>Education and Teaching</option>
                  <option value="HOSPITALITY_TOURISM" ${answers['S_CURR_STREAM_01'] == 'HOSPITALITY_TOURISM' ? 'selected' : ''}>Hospitality and Tourism</option>
                  <option value="DEFENCE_AVIATION_MARITIME" ${answers['S_CURR_STREAM_01'] == 'DEFENCE_AVIATION_MARITIME' ? 'selected' : ''}>Defence, Aviation and Maritime</option>
                  <option value="CREATIVE_PERFORMING_ARTS" ${answers['S_CURR_STREAM_01'] == 'CREATIVE_PERFORMING_ARTS' ? 'selected' : ''}>Creative and Performing Arts</option>
                  <option value="SPORTS_FITNESS" ${answers['S_CURR_STREAM_01'] == 'SPORTS_FITNESS' ? 'selected' : ''}>Sports and Fitness</option>
                  <option value="VOCATIONAL_SKILLS" ${answers['S_CURR_STREAM_01'] == 'VOCATIONAL_SKILLS' ? 'selected' : ''}>Vocational and Skill-based Programs</option>
                </optgroup>
              </select>
              <p class="hint" id="streamHint">Required for Class 11/12 and post-12 programs.</p>
            </div>
            <div id="programWrap">
              <label for="S_CURR_PROGRAM_01">Current program / degree</label>
              <select id="S_CURR_PROGRAM_01" name="S_CURR_PROGRAM_01">
                <option value="">Select</option>
                <optgroup label="B.Tech / B.E. Streams">
                  <option value="BE_CSE" ${answers['S_CURR_PROGRAM_01'] == 'BE_CSE' ? 'selected' : ''}>B.E. CSE</option>
                  <option value="BE_IT" ${answers['S_CURR_PROGRAM_01'] == 'BE_IT' ? 'selected' : ''}>B.E. IT</option>
                  <option value="BE_ECE" ${answers['S_CURR_PROGRAM_01'] == 'BE_ECE' ? 'selected' : ''}>B.E. ECE</option>
                  <option value="BE_EEE" ${answers['S_CURR_PROGRAM_01'] == 'BE_EEE' ? 'selected' : ''}>B.E. EEE</option>
                  <option value="BE_MECH" ${answers['S_CURR_PROGRAM_01'] == 'BE_MECH' ? 'selected' : ''}>B.E. Mechanical</option>
                  <option value="BE_CIVIL" ${answers['S_CURR_PROGRAM_01'] == 'BE_CIVIL' ? 'selected' : ''}>B.E. Civil</option>
                  <option value="BTECH_CSE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_CSE' ? 'selected' : ''}>B.Tech CSE</option>
                  <option value="BTECH_CSE_AIML" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_CSE_AIML' ? 'selected' : ''}>B.Tech CSE (AI/ML)</option>
                  <option value="BTECH_AI_DS" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_AI_DS' ? 'selected' : ''}>B.Tech AI and Data Science</option>
                  <option value="BTECH_DATA_SCIENCE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_DATA_SCIENCE' ? 'selected' : ''}>B.Tech Data Science</option>
                  <option value="BTECH_CYBER" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_CYBER' ? 'selected' : ''}>B.Tech Cyber Security</option>
                  <option value="BTECH_IOT" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_IOT' ? 'selected' : ''}>B.Tech IoT</option>
                  <option value="BTECH_IT" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_IT' ? 'selected' : ''}>B.Tech Information Technology</option>
                  <option value="BTECH_ECE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_ECE' ? 'selected' : ''}>B.Tech ECE</option>
                  <option value="BTECH_EEE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_EEE' ? 'selected' : ''}>B.Tech EEE</option>
                  <option value="BTECH_MECH" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_MECH' ? 'selected' : ''}>B.Tech Mechanical</option>
                  <option value="BTECH_CIVIL" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_CIVIL' ? 'selected' : ''}>B.Tech Civil</option>
                  <option value="BTECH_CHEM" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_CHEM' ? 'selected' : ''}>B.Tech Chemical</option>
                  <option value="BTECH_METALLURGY" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_METALLURGY' ? 'selected' : ''}>B.Tech Metallurgy</option>
                  <option value="BTECH_INDUSTRIAL" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_INDUSTRIAL' ? 'selected' : ''}>B.Tech Industrial Engineering</option>
                  <option value="BTECH_PRODUCTION" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_PRODUCTION' ? 'selected' : ''}>B.Tech Production Engineering</option>
                  <option value="BTECH_AUTOMOBILE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_AUTOMOBILE' ? 'selected' : ''}>B.Tech Automobile</option>
                  <option value="BTECH_MECHATRONICS" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_MECHATRONICS' ? 'selected' : ''}>B.Tech Mechatronics</option>
                  <option value="BTECH_PETROLEUM" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_PETROLEUM' ? 'selected' : ''}>B.Tech Petroleum</option>
                  <option value="BTECH_MINING" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_MINING' ? 'selected' : ''}>B.Tech Mining</option>
                  <option value="BTECH_MARINE" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_MARINE' ? 'selected' : ''}>B.Tech Marine Engineering</option>
                  <option value="BTECH_BIOTECH" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_BIOTECH' ? 'selected' : ''}>B.Tech Biotechnology</option>
                  <option value="BTECH_BIOMEDICAL" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_BIOMEDICAL' ? 'selected' : ''}>B.Tech Biomedical Engineering</option>
                  <option value="BTECH_ENVIRONMENTAL" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_ENVIRONMENTAL' ? 'selected' : ''}>B.Tech Environmental Engineering</option>
                  <option value="BTECH_AGRI" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_AGRI' ? 'selected' : ''}>B.Tech Agricultural Engineering</option>
                  <option value="BTECH_FOOD" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_FOOD' ? 'selected' : ''}>B.Tech Food Technology</option>
                  <option value="BTECH_AERO" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_AERO' ? 'selected' : ''}>B.Tech Aerospace</option>
                  <option value="BTECH_ROBOTICS" ${answers['S_CURR_PROGRAM_01'] == 'BTECH_ROBOTICS' ? 'selected' : ''}>B.Tech Robotics</option>
                </optgroup>
                <optgroup label="Architecture and Design">
                  <option value="BARCH" ${answers['S_CURR_PROGRAM_01'] == 'BARCH' ? 'selected' : ''}>B.Arch</option>
                  <option value="BPLAN" ${answers['S_CURR_PROGRAM_01'] == 'BPLAN' ? 'selected' : ''}>B.Plan</option>
                  <option value="BDES" ${answers['S_CURR_PROGRAM_01'] == 'BDES' ? 'selected' : ''}>B.Des</option>
                  <option value="BFA" ${answers['S_CURR_PROGRAM_01'] == 'BFA' ? 'selected' : ''}>BFA (Fine Arts)</option>
                  <option value="BID" ${answers['S_CURR_PROGRAM_01'] == 'BID' ? 'selected' : ''}>BID (Interior Design)</option>
                  <option value="BFD" ${answers['S_CURR_PROGRAM_01'] == 'BFD' ? 'selected' : ''}>BFD (Fashion Design)</option>
                  <option value="ANIMATION_VFX" ${answers['S_CURR_PROGRAM_01'] == 'ANIMATION_VFX' ? 'selected' : ''}>Animation and VFX</option>
                </optgroup>
                <optgroup label="Commerce / Management">
                  <option value="BBA_GENERAL" ${answers['S_CURR_PROGRAM_01'] == 'BBA_GENERAL' ? 'selected' : ''}>BBA (General)</option>
                  <option value="BBA_IB" ${answers['S_CURR_PROGRAM_01'] == 'BBA_IB' ? 'selected' : ''}>BBA International Business</option>
                  <option value="BBA_HR" ${answers['S_CURR_PROGRAM_01'] == 'BBA_HR' ? 'selected' : ''}>BBA HR</option>
                  <option value="BBA_FINANCE" ${answers['S_CURR_PROGRAM_01'] == 'BBA_FINANCE' ? 'selected' : ''}>BBA Finance</option>
                  <option value="BBA_MARKETING" ${answers['S_CURR_PROGRAM_01'] == 'BBA_MARKETING' ? 'selected' : ''}>BBA Marketing</option>
                  <option value="BBA_BUSINESS_ANALYTICS" ${answers['S_CURR_PROGRAM_01'] == 'BBA_BUSINESS_ANALYTICS' ? 'selected' : ''}>BBA Business Analytics</option>
                  <option value="BBA_DIGITAL_MARKETING" ${answers['S_CURR_PROGRAM_01'] == 'BBA_DIGITAL_MARKETING' ? 'selected' : ''}>BBA Digital Marketing</option>
                  <option value="BBA_LOGISTICS" ${answers['S_CURR_PROGRAM_01'] == 'BBA_LOGISTICS' ? 'selected' : ''}>BBA Logistics and Supply Chain</option>
                  <option value="BBA_HOSPITALITY" ${answers['S_CURR_PROGRAM_01'] == 'BBA_HOSPITALITY' ? 'selected' : ''}>BBA Hospitality Management</option>
                  <option value="BBA_AVIATION" ${answers['S_CURR_PROGRAM_01'] == 'BBA_AVIATION' ? 'selected' : ''}>BBA Aviation Management</option>
                  <option value="BCOM" ${answers['S_CURR_PROGRAM_01'] == 'BCOM' ? 'selected' : ''}>B.Com</option>
                  <option value="BCOM_HONS" ${answers['S_CURR_PROGRAM_01'] == 'BCOM_HONS' ? 'selected' : ''}>B.Com (Hons.)</option>
                  <option value="BCOM_ACCOUNTING" ${answers['S_CURR_PROGRAM_01'] == 'BCOM_ACCOUNTING' ? 'selected' : ''}>B.Com Accounting and Finance</option>
                  <option value="BFM" ${answers['S_CURR_PROGRAM_01'] == 'BFM' ? 'selected' : ''}>BFM (Financial Markets)</option>
                  <option value="BAF" ${answers['S_CURR_PROGRAM_01'] == 'BAF' ? 'selected' : ''}>BAF (Accounting and Finance)</option>
                  <option value="BBI" ${answers['S_CURR_PROGRAM_01'] == 'BBI' ? 'selected' : ''}>BBI (Banking and Insurance)</option>
                  <option value="BMS" ${answers['S_CURR_PROGRAM_01'] == 'BMS' ? 'selected' : ''}>BMS</option>
                  <option value="BHM" ${answers['S_CURR_PROGRAM_01'] == 'BHM' ? 'selected' : ''}>BHM (Hotel Management)</option>
                </optgroup>
                <optgroup label="Science / Humanities / Law">
                  <option value="BSC" ${answers['S_CURR_PROGRAM_01'] == 'BSC' ? 'selected' : ''}>B.Sc</option>
                  <option value="BSC_PHYSICS" ${answers['S_CURR_PROGRAM_01'] == 'BSC_PHYSICS' ? 'selected' : ''}>B.Sc Physics</option>
                  <option value="BSC_CHEMISTRY" ${answers['S_CURR_PROGRAM_01'] == 'BSC_CHEMISTRY' ? 'selected' : ''}>B.Sc Chemistry</option>
                  <option value="BSC_MATHS" ${answers['S_CURR_PROGRAM_01'] == 'BSC_MATHS' ? 'selected' : ''}>B.Sc Mathematics</option>
                  <option value="BSC_STATISTICS" ${answers['S_CURR_PROGRAM_01'] == 'BSC_STATISTICS' ? 'selected' : ''}>B.Sc Statistics</option>
                  <option value="BSC_CS" ${answers['S_CURR_PROGRAM_01'] == 'BSC_CS' ? 'selected' : ''}>B.Sc Computer Science</option>
                  <option value="BSC_DATA_SCIENCE" ${answers['S_CURR_PROGRAM_01'] == 'BSC_DATA_SCIENCE' ? 'selected' : ''}>B.Sc Data Science</option>
                  <option value="BSC_IT" ${answers['S_CURR_PROGRAM_01'] == 'BSC_IT' ? 'selected' : ''}>B.Sc IT</option>
                  <option value="BSC_BIOTECH" ${answers['S_CURR_PROGRAM_01'] == 'BSC_BIOTECH' ? 'selected' : ''}>B.Sc Biotechnology</option>
                  <option value="BSC_MICROBIOLOGY" ${answers['S_CURR_PROGRAM_01'] == 'BSC_MICROBIOLOGY' ? 'selected' : ''}>B.Sc Microbiology</option>
                  <option value="BSC_AGRICULTURE" ${answers['S_CURR_PROGRAM_01'] == 'BSC_AGRICULTURE' ? 'selected' : ''}>B.Sc Agriculture</option>
                  <option value="BSC_FORENSIC" ${answers['S_CURR_PROGRAM_01'] == 'BSC_FORENSIC' ? 'selected' : ''}>B.Sc Forensic Science</option>
                  <option value="BSC_ENVIRONMENT" ${answers['S_CURR_PROGRAM_01'] == 'BSC_ENVIRONMENT' ? 'selected' : ''}>B.Sc Environmental Science</option>
                  <option value="BSW" ${answers['S_CURR_PROGRAM_01'] == 'BSW' ? 'selected' : ''}>BSW (Social Work)</option>
                  <option value="BA" ${answers['S_CURR_PROGRAM_01'] == 'BA' ? 'selected' : ''}>B.A.</option>
                  <option value="BA_PSYCHOLOGY" ${answers['S_CURR_PROGRAM_01'] == 'BA_PSYCHOLOGY' ? 'selected' : ''}>B.A. Psychology</option>
                  <option value="BA_ECONOMICS" ${answers['S_CURR_PROGRAM_01'] == 'BA_ECONOMICS' ? 'selected' : ''}>B.A. Economics</option>
                  <option value="BA_JOURNALISM" ${answers['S_CURR_PROGRAM_01'] == 'BA_JOURNALISM' ? 'selected' : ''}>B.A. Journalism / Mass Communication</option>
                  <option value="BA_ENGLISH" ${answers['S_CURR_PROGRAM_01'] == 'BA_ENGLISH' ? 'selected' : ''}>B.A. English</option>
                  <option value="BPA" ${answers['S_CURR_PROGRAM_01'] == 'BPA' ? 'selected' : ''}>BPA (Performing Arts)</option>
                  <option value="BPED" ${answers['S_CURR_PROGRAM_01'] == 'BPED' ? 'selected' : ''}>B.P.Ed.</option>
                  <option value="BALLB" ${answers['S_CURR_PROGRAM_01'] == 'BALLB' ? 'selected' : ''}>BA LLB</option>
                  <option value="BBALLB" ${answers['S_CURR_PROGRAM_01'] == 'BBALLB' ? 'selected' : ''}>BBA LLB</option>
                  <option value="BCOMLLB" ${answers['S_CURR_PROGRAM_01'] == 'BCOMLLB' ? 'selected' : ''}>B.Com LLB</option>
                  <option value="LLB" ${answers['S_CURR_PROGRAM_01'] == 'LLB' ? 'selected' : ''}>LLB</option>
                </optgroup>
                <optgroup label="Medical / Healthcare">
                  <option value="MBBS" ${answers['S_CURR_PROGRAM_01'] == 'MBBS' ? 'selected' : ''}>MBBS</option>
                  <option value="BDS" ${answers['S_CURR_PROGRAM_01'] == 'BDS' ? 'selected' : ''}>BDS</option>
                  <option value="BAMS" ${answers['S_CURR_PROGRAM_01'] == 'BAMS' ? 'selected' : ''}>BAMS</option>
                  <option value="BHMS" ${answers['S_CURR_PROGRAM_01'] == 'BHMS' ? 'selected' : ''}>BHMS</option>
                  <option value="BUMS" ${answers['S_CURR_PROGRAM_01'] == 'BUMS' ? 'selected' : ''}>BUMS</option>
                  <option value="BVSC" ${answers['S_CURR_PROGRAM_01'] == 'BVSC' ? 'selected' : ''}>BVSc and AH</option>
                  <option value="BASLP" ${answers['S_CURR_PROGRAM_01'] == 'BASLP' ? 'selected' : ''}>BASLP</option>
                  <option value="BPHARM" ${answers['S_CURR_PROGRAM_01'] == 'BPHARM' ? 'selected' : ''}>B.Pharm</option>
                  <option value="PHARMD" ${answers['S_CURR_PROGRAM_01'] == 'PHARMD' ? 'selected' : ''}>Pharm.D</option>
                  <option value="BSC_NURSING" ${answers['S_CURR_PROGRAM_01'] == 'BSC_NURSING' ? 'selected' : ''}>B.Sc Nursing</option>
                  <option value="BPT" ${answers['S_CURR_PROGRAM_01'] == 'BPT' ? 'selected' : ''}>BPT</option>
                  <option value="BOT" ${answers['S_CURR_PROGRAM_01'] == 'BOT' ? 'selected' : ''}>BOT (Occupational Therapy)</option>
                  <option value="BMLT" ${answers['S_CURR_PROGRAM_01'] == 'BMLT' ? 'selected' : ''}>BMLT (Medical Lab Technology)</option>
                  <option value="BOPTOM" ${answers['S_CURR_PROGRAM_01'] == 'BOPTOM' ? 'selected' : ''}>B.Optom</option>
                </optgroup>
                <optgroup label="Postgraduate">
                  <option value="MBA" ${answers['S_CURR_PROGRAM_01'] == 'MBA' ? 'selected' : ''}>MBA</option>
                  <option value="MBA_FINANCE" ${answers['S_CURR_PROGRAM_01'] == 'MBA_FINANCE' ? 'selected' : ''}>MBA Finance</option>
                  <option value="MBA_MARKETING" ${answers['S_CURR_PROGRAM_01'] == 'MBA_MARKETING' ? 'selected' : ''}>MBA Marketing</option>
                  <option value="MBA_HR" ${answers['S_CURR_PROGRAM_01'] == 'MBA_HR' ? 'selected' : ''}>MBA HR</option>
                  <option value="MBA_OPERATIONS" ${answers['S_CURR_PROGRAM_01'] == 'MBA_OPERATIONS' ? 'selected' : ''}>MBA Operations</option>
                  <option value="MBA_ANALYTICS" ${answers['S_CURR_PROGRAM_01'] == 'MBA_ANALYTICS' ? 'selected' : ''}>MBA Business Analytics</option>
                  <option value="MBA_IB" ${answers['S_CURR_PROGRAM_01'] == 'MBA_IB' ? 'selected' : ''}>MBA International Business</option>
                  <option value="MBA_PRODUCT" ${answers['S_CURR_PROGRAM_01'] == 'MBA_PRODUCT' ? 'selected' : ''}>MBA Product Management</option>
                  <option value="MBA_SUPPLY_CHAIN" ${answers['S_CURR_PROGRAM_01'] == 'MBA_SUPPLY_CHAIN' ? 'selected' : ''}>MBA Supply Chain</option>
                  <option value="PGDM" ${answers['S_CURR_PROGRAM_01'] == 'PGDM' ? 'selected' : ''}>PGDM</option>
                  <option value="MTECH" ${answers['S_CURR_PROGRAM_01'] == 'MTECH' ? 'selected' : ''}>M.Tech</option>
                  <option value="MTECH_CSE" ${answers['S_CURR_PROGRAM_01'] == 'MTECH_CSE' ? 'selected' : ''}>M.Tech CSE</option>
                  <option value="MTECH_AI" ${answers['S_CURR_PROGRAM_01'] == 'MTECH_AI' ? 'selected' : ''}>M.Tech AI</option>
                  <option value="ME" ${answers['S_CURR_PROGRAM_01'] == 'ME' ? 'selected' : ''}>M.E.</option>
                  <option value="MCA" ${answers['S_CURR_PROGRAM_01'] == 'MCA' ? 'selected' : ''}>MCA</option>
                  <option value="MSC" ${answers['S_CURR_PROGRAM_01'] == 'MSC' ? 'selected' : ''}>M.Sc</option>
                  <option value="MSC_DATA_SCIENCE" ${answers['S_CURR_PROGRAM_01'] == 'MSC_DATA_SCIENCE' ? 'selected' : ''}>M.Sc Data Science</option>
                  <option value="MSC_BIOTECH" ${answers['S_CURR_PROGRAM_01'] == 'MSC_BIOTECH' ? 'selected' : ''}>M.Sc Biotechnology</option>
                  <option value="MPH" ${answers['S_CURR_PROGRAM_01'] == 'MPH' ? 'selected' : ''}>MPH (Public Health)</option>
                  <option value="MCOM" ${answers['S_CURR_PROGRAM_01'] == 'MCOM' ? 'selected' : ''}>M.Com</option>
                  <option value="MA" ${answers['S_CURR_PROGRAM_01'] == 'MA' ? 'selected' : ''}>M.A.</option>
                  <option value="MSW" ${answers['S_CURR_PROGRAM_01'] == 'MSW' ? 'selected' : ''}>MSW</option>
                  <option value="MED" ${answers['S_CURR_PROGRAM_01'] == 'MED' ? 'selected' : ''}>M.Ed.</option>
                  <option value="LLM" ${answers['S_CURR_PROGRAM_01'] == 'LLM' ? 'selected' : ''}>LLM</option>
                </optgroup>
                <optgroup label="Diploma / Certification / Other">
                  <option value="DIPLOMA_ENGINEERING" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_ENGINEERING' ? 'selected' : ''}>Diploma Engineering</option>
                  <option value="DIPLOMA_MECH" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_MECH' ? 'selected' : ''}>Diploma Mechanical</option>
                  <option value="DIPLOMA_ECE" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_ECE' ? 'selected' : ''}>Diploma ECE</option>
                  <option value="DIPLOMA_CIVIL" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_CIVIL' ? 'selected' : ''}>Diploma Civil</option>
                  <option value="DIPLOMA_COMPUTER" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_COMPUTER' ? 'selected' : ''}>Diploma Computer Applications</option>
                  <option value="DIPLOMA_DATA_ANALYTICS" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_DATA_ANALYTICS' ? 'selected' : ''}>Diploma Data Analytics</option>
                  <option value="DIPLOMA_UI_UX" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_UI_UX' ? 'selected' : ''}>Diploma UI/UX</option>
                  <option value="DIPLOMA_ANIMATION" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_ANIMATION' ? 'selected' : ''}>Diploma Animation and Multimedia</option>
                  <option value="DIPLOMA_PARAMEDICAL" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_PARAMEDICAL' ? 'selected' : ''}>Diploma Paramedical</option>
                  <option value="DIPLOMA_HOSPITALITY" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_HOSPITALITY' ? 'selected' : ''}>Diploma Hospitality</option>
                  <option value="DIPLOMA_BUSINESS" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_BUSINESS' ? 'selected' : ''}>Diploma Business</option>
                  <option value="DIPLOMA_LOGISTICS" ${answers['S_CURR_PROGRAM_01'] == 'DIPLOMA_LOGISTICS' ? 'selected' : ''}>Diploma Logistics and Supply Chain</option>
                  <option value="ITI_TECHNICAL" ${answers['S_CURR_PROGRAM_01'] == 'ITI_TECHNICAL' ? 'selected' : ''}>ITI / Technical Trade</option>
                  <option value="CA_CS_CMA" ${answers['S_CURR_PROGRAM_01'] == 'CA_CS_CMA' ? 'selected' : ''}>CA / CS / CMA Track</option>
                  <option value="CERT_CLOUD_DEVOPS" ${answers['S_CURR_PROGRAM_01'] == 'CERT_CLOUD_DEVOPS' ? 'selected' : ''}>Certificate Cloud / DevOps</option>
                  <option value="CERT_DIGITAL_MARKETING" ${answers['S_CURR_PROGRAM_01'] == 'CERT_DIGITAL_MARKETING' ? 'selected' : ''}>Certificate Digital Marketing</option>
                  <option value="OTHER" ${answers['S_CURR_PROGRAM_01'] == 'OTHER' ? 'selected' : ''}>Other Program</option>
                </optgroup>
              </select>
              <p class="hint">Required for post-12 students (UG, PG, professional, diploma, certification).</p>
            </div>
            <div id="yearsLeftWrap">
              <label for="S_CURR_YEARS_LEFT_01">Years left to complete current program</label>
              <select id="S_CURR_YEARS_LEFT_01" name="S_CURR_YEARS_LEFT_01">
                <option value="">Select</option>
                <option value="LESS_THAN_1" ${answers['S_CURR_YEARS_LEFT_01'] == 'LESS_THAN_1' ? 'selected' : ''}>Less than 1 year</option>
                <option value="1_TO_2" ${answers['S_CURR_YEARS_LEFT_01'] == '1_TO_2' ? 'selected' : ''}>1 to 2 years</option>
                <option value="2_TO_3" ${answers['S_CURR_YEARS_LEFT_01'] == '2_TO_3' ? 'selected' : ''}>2 to 3 years</option>
                <option value="3_TO_4" ${answers['S_CURR_YEARS_LEFT_01'] == '3_TO_4' ? 'selected' : ''}>3 to 4 years</option>
                <option value="4_PLUS" ${answers['S_CURR_YEARS_LEFT_01'] == '4_PLUS' ? 'selected' : ''}>More than 4 years</option>
              </select>
            </div>
            <div class="field-full" id="subjectsWrap">
              <label for="S_CURR_SUBJECTS_01">Current subject combination</label>
              <select id="S_CURR_SUBJECTS_01" name="S_CURR_SUBJECTS_01"
                      data-selected="<c:out value='${answers["S_CURR_SUBJECTS_01"]}' />">
                <option value="">Select subject combination</option>
              </select>
              <p class="field-note" id="subjectsNote">For Class 11/12, please include exact subject combination.</p>
            </div>
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
      const gradeField = document.getElementById("S_CURR_GRADE_01");
      const streamField = document.getElementById("S_CURR_STREAM_01");
      const subjectsField = document.getElementById("S_CURR_SUBJECTS_01");
      const programField = document.getElementById("S_CURR_PROGRAM_01");
      const yearsLeftField = document.getElementById("S_CURR_YEARS_LEFT_01");
      const streamWrap = document.getElementById("streamWrap");
      const subjectsWrap = document.getElementById("subjectsWrap");
      const subjectsNote = document.getElementById("subjectsNote");
      const programWrap = document.getElementById("programWrap");
      const yearsLeftWrap = document.getElementById("yearsLeftWrap");
      const subjectOptionCatalog = {
        PCM: [
          { value: "PCM_PHYSICS_CHEMISTRY_MATH", label: "Physics, Chemistry, Mathematics" },
          { value: "PCM_PHYSICS_CHEMISTRY_MATH_CS", label: "Physics, Chemistry, Mathematics, Computer Science" },
          { value: "PCM_PHYSICS_CHEMISTRY_MATH_ECONOMICS", label: "Physics, Chemistry, Mathematics, Economics" }
        ],
        PCB: [
          { value: "PCB_PHYSICS_CHEMISTRY_BIOLOGY", label: "Physics, Chemistry, Biology" },
          { value: "PCB_PHYSICS_CHEMISTRY_BIOLOGY_MATH", label: "Physics, Chemistry, Biology, Mathematics" },
          { value: "PCB_PHYSICS_CHEMISTRY_BIOLOGY_PSYCHOLOGY", label: "Physics, Chemistry, Biology, Psychology" }
        ],
        COMMERCE: [
          { value: "COM_ACC_ECO_BST", label: "Accountancy, Economics, Business Studies" },
          { value: "COM_ACC_ECO_BST_MATH", label: "Accountancy, Economics, Business Studies, Mathematics" },
          { value: "COM_ACC_ECO_BST_IP", label: "Accountancy, Economics, Business Studies, Informatics Practices" },
          { value: "COM_ACC_ECO_BST_ENTREPRENEURSHIP", label: "Accountancy, Economics, Business Studies, Entrepreneurship" }
        ],
        HUMANITIES: [
          { value: "HUM_HISTORY_POLITICAL_SCIENCE_SOCIOLOGY", label: "History, Political Science, Sociology" },
          { value: "HUM_HISTORY_POLITICAL_SCIENCE_PSYCHOLOGY", label: "History, Political Science, Psychology" },
          { value: "HUM_HISTORY_GEOGRAPHY_ECONOMICS", label: "History, Geography, Economics" },
          { value: "HUM_POLITICAL_SCIENCE_ECONOMICS_MATH", label: "Political Science, Economics, Mathematics" }
        ],
        GENERAL: [
          { value: "GENERAL_SCIENCE_MATH_LANGUAGE", label: "Science, Mathematics, Language" },
          { value: "GENERAL_COMMERCE_LANGUAGE_MATH", label: "Commerce, Language, Mathematics" },
          { value: "GENERAL_SOCIAL_SCIENCE_LANGUAGE", label: "Social Science, Language" }
        ]
      };
      const serverSubjectValue = subjectsField ? (subjectsField.getAttribute("data-selected") || "").trim() : "";
      const labels = [
        "Step 1 of 4: Academic Context and Aspiration",
        "Step 2 of 4: Personality",
        "Step 3 of 4: Achievements & Concerns",
        "Step 4 of 4: Support Context"
      ];
      let step = 0;

      function isSeniorSchoolGrade(code) {
        return code === "11" || code === "12";
      }

      function isPost12Grade(code) {
        const post12 = {
          DIPLOMA_1: true, DIPLOMA_2: true, DIPLOMA_3: true,
          UG_1: true, UG_2: true, UG_3: true, UG_4: true, UG_5: true,
          PG_1: true, PG_2: true, MBA_1: true, MBA_2: true,
          MTECH_1: true, MTECH_2: true, COLLEGE_OTHER: true, WORKING: true
        };
        return !!post12[code];
      }

      function toggleFieldWrap(wrapEl, visible) {
        if (!wrapEl) return;
        wrapEl.style.display = visible ? "" : "none";
      }

      function detectSubjectTrack(streamCode) {
        const stream = (streamCode || "").trim().toUpperCase();
        if (!stream) return "GENERAL";
        if (stream.indexOf("COMMERCE") >= 0 || stream.indexOf("BUSINESS") >= 0 || stream.indexOf("FINANCE") >= 0) {
          return "COMMERCE";
        }
        if (stream.indexOf("HUMANITIES") >= 0 || stream.indexOf("ARTS") >= 0 || stream.indexOf("SOCIAL") >= 0
            || stream.indexOf("LAW") >= 0 || stream.indexOf("POLICY") >= 0 || stream.indexOf("MEDIA") >= 0) {
          return "HUMANITIES";
        }
        if (stream.indexOf("PCB") >= 0 || stream.indexOf("HEALTH") >= 0 || stream.indexOf("BIO") >= 0) {
          return "PCB";
        }
        if (stream.indexOf("PCM") >= 0 || stream.indexOf("ENGINEERING") >= 0 || stream.indexOf("TECH") >= 0
            || stream.indexOf("COMPUTER") >= 0 || stream.indexOf("AI") >= 0) {
          return "PCM";
        }
        return "GENERAL";
      }

      function renderSubjectOptions() {
        if (!subjectsField) return;
        const streamCode = streamField && streamField.value ? streamField.value : "";
        const selected = (subjectsField.value || serverSubjectValue || "").trim();
        const track = detectSubjectTrack(streamCode);
        const catalog = subjectOptionCatalog[track] || subjectOptionCatalog.GENERAL;
        const optionValues = new Set();

        subjectsField.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select subject combination";
        subjectsField.appendChild(defaultOption);

        catalog.forEach(function(item) {
          const option = document.createElement("option");
          option.value = item.value;
          option.textContent = item.label;
          subjectsField.appendChild(option);
          optionValues.add(item.value);
        });

        if (selected && !optionValues.has(selected)) {
          const carryOption = document.createElement("option");
          carryOption.value = selected;
          carryOption.textContent = "Current: " + selected.replace(/_/g, " ");
          subjectsField.appendChild(carryOption);
        }
        subjectsField.value = selected;

        if (!subjectsNote) return;
        if (track === "COMMERCE") {
          subjectsNote.textContent = "Commerce track selected: pick the closest subject set (accounts/economics/business).";
          return;
        }
        if (track === "HUMANITIES") {
          subjectsNote.textContent = "Humanities track selected: pick humanities subject set for dynamic section routing.";
          return;
        }
        if (track === "PCB") {
          subjectsNote.textContent = "Biology-oriented track selected.";
          return;
        }
        if (track === "PCM") {
          subjectsNote.textContent = "Math/technology-oriented track selected.";
          return;
        }
        subjectsNote.textContent = "For Class 11/12, select the closest subject combination.";
      }

      function applyAcademicContextRules() {
        const gradeCode = gradeField && gradeField.value ? gradeField.value.trim().toUpperCase() : "";
        const senior = isSeniorSchoolGrade(gradeCode);
        const post12 = isPost12Grade(gradeCode);

        toggleFieldWrap(streamWrap, senior || post12);
        toggleFieldWrap(subjectsWrap, senior || post12);
        toggleFieldWrap(programWrap, post12);
        toggleFieldWrap(yearsLeftWrap, post12);

        if (streamField) {
          streamField.required = senior || post12;
        }
        if (subjectsField) {
          subjectsField.required = senior;
        }
        if (programField) {
          programField.required = post12;
        }
        if (yearsLeftField) {
          yearsLeftField.required = post12;
        }
        renderSubjectOptions();
      }

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
      if (gradeField) {
        gradeField.addEventListener("change", applyAcademicContextRules);
      }
      if (streamField) {
        streamField.addEventListener("change", renderSubjectOptions);
      }
      form.addEventListener("submit", function (event) {
        applyAcademicContextRules();
        if (!validateCurrentStep()) {
          event.preventDefault();
        }
      });

      applyAcademicContextRules();
      setStep(0);
    })();
  </script>
</body>
</html>
