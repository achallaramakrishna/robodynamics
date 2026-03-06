<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Student Profile</title>
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
      --warn-bg: #fff7ed;
      --warn-ink: #9a3412;
      --ok-bg: #f0fdf4;
      --ok-ink: #166534;
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

    .shell { width: min(980px, 92vw); margin: 28px auto; }

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

    .success {
      margin-top: 12px;
      border: 1px solid #bbf7d0;
      background: var(--ok-bg);
      color: var(--ok-ink);
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
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

    input[type="text"], select {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 11px;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink-900);
      background: #fff;
    }

    .hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--ink-500);
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
      <h1>Student Profile and Grade</h1>
      <p>
        Parent: <strong><c:out value="${parent.displayName}" /></strong><br>
        Student: <strong><c:out value="${student.displayName}" /></strong>
      </p>
      <p>Update grade and academic context to regenerate the correct AptiPath question pool.</p>
    </section>

    <section class="panel">
      <h2>Academic Context</h2>
      <p class="muted">These values are used for AptiPath question targeting and recommendation logic.</p>
      <div class="success">
        If grade is changed, any in-progress test is reset and the next attempt uses the new grade-level question set.
      </div>
      <c:if test="${validationError}">
        <div class="warn">Please fill all required fields for the selected grade before saving.</div>
      </c:if>

      <form method="post" action="${pageContext.request.contextPath}/aptipath/parent/student-profile">
        <input type="hidden" name="subscriptionId" value="${subscription.ciSubscriptionId}">
        <input type="hidden" name="studentId" value="${student.userID}">
        <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
        <input type="hidden" name="company" value="${companyCode}">

        <div class="field-grid">
          <div>
            <label for="S_CURR_SCHOOL_01">Current school / college / institute *</label>
            <input id="S_CURR_SCHOOL_01" name="S_CURR_SCHOOL_01" type="text" maxlength="220"
                   value="<c:out value='${answers["S_CURR_SCHOOL_01"]}' />" required
                   placeholder="Example: Delhi Public School / VIT / SRM">
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
            <label for="S_CURR_STREAM_01">Current stream *</label>
            <select id="S_CURR_STREAM_01" name="S_CURR_STREAM_01"
                    data-selected="<c:out value='${answers["S_CURR_STREAM_01"]}' />">
              <option value="">Select</option>
              <optgroup label="School Streams">
                <option value="PCM">PCM (Physics, Chemistry, Math)</option>
                <option value="PCB">PCB (Physics, Chemistry, Biology)</option>
                <option value="PCMB">PCMB</option>
                <option value="COMMERCE_MATH">Commerce with Math</option>
                <option value="COMMERCE">Commerce</option>
                <option value="HUMANITIES">Humanities</option>
                <option value="ARTS">Arts</option>
              </optgroup>
              <optgroup label="Post-12 Streams">
                <option value="ENGINEERING_TECH">Engineering and Technology</option>
                <option value="COMPUTER_DATA_AI">Computer Science, Data and AI</option>
                <option value="BUSINESS_MANAGEMENT">Business and Management</option>
                <option value="COMMERCE_FINANCE">Commerce and Finance</option>
                <option value="ECONOMICS_PUBLIC_POLICY">Economics and Public Policy</option>
                <option value="LAW_POLICY_GOV">Law, Policy and Governance</option>
                <option value="HEALTHCARE_MEDICAL">Medical and Healthcare</option>
                <option value="MEDIA_COMM">Media and Communication</option>
                <option value="SOCIAL_SCIENCES">Social Sciences</option>
              </optgroup>
            </select>
            <div class="hint">Required for Class 11/12 and post-12 grades.</div>
          </div>

          <div id="subjectsWrap" class="field-full">
            <label for="S_CURR_SUBJECTS_01">Main subjects *</label>
            <select id="S_CURR_SUBJECTS_01" name="S_CURR_SUBJECTS_01"
                    data-selected="<c:out value='${answers["S_CURR_SUBJECTS_01"]}' />">
              <option value="">Select subject combination</option>
            </select>
            <div class="hint">Required for Class 11/12.</div>
          </div>

          <div id="programWrap">
            <label for="S_CURR_PROGRAM_01">Current program / degree *</label>
            <input id="S_CURR_PROGRAM_01" name="S_CURR_PROGRAM_01" type="text" maxlength="180"
                   value="<c:out value='${answers["S_CURR_PROGRAM_01"]}' />"
                   placeholder="Example: BTECH_CSE, MBBS, BBA_GENERAL, MBA">
          </div>

          <div id="yearsLeftWrap">
            <label for="S_CURR_YEARS_LEFT_01">Years left in current program *</label>
            <select id="S_CURR_YEARS_LEFT_01" name="S_CURR_YEARS_LEFT_01">
              <option value="">Select</option>
              <option value="LESS_THAN_1" ${answers['S_CURR_YEARS_LEFT_01'] == 'LESS_THAN_1' ? 'selected' : ''}>Less than 1 year</option>
              <option value="1_TO_2" ${answers['S_CURR_YEARS_LEFT_01'] == '1_TO_2' ? 'selected' : ''}>1 to 2 years</option>
              <option value="2_TO_3" ${answers['S_CURR_YEARS_LEFT_01'] == '2_TO_3' ? 'selected' : ''}>2 to 3 years</option>
              <option value="3_TO_4" ${answers['S_CURR_YEARS_LEFT_01'] == '3_TO_4' ? 'selected' : ''}>3 to 4 years</option>
              <option value="4_PLUS" ${answers['S_CURR_YEARS_LEFT_01'] == '4_PLUS' ? 'selected' : ''}>More than 4 years</option>
            </select>
          </div>
        </div>

        <div class="btn-row">
          <button class="btn btn-primary" type="submit">Save Student Profile</button>
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

  <script>
    (function() {
      const gradeField = document.getElementById('S_CURR_GRADE_01');
      const streamWrap = document.getElementById('streamWrap');
      const subjectsWrap = document.getElementById('subjectsWrap');
      const programWrap = document.getElementById('programWrap');
      const yearsLeftWrap = document.getElementById('yearsLeftWrap');
      const streamField = document.getElementById('S_CURR_STREAM_01');
      const subjectsField = document.getElementById('S_CURR_SUBJECTS_01');
      const programField = document.getElementById('S_CURR_PROGRAM_01');
      const yearsLeftField = document.getElementById('S_CURR_YEARS_LEFT_01');
      const serverStreamValue = streamField ? (streamField.getAttribute('data-selected') || '').trim() : '';
      const serverSubjectValue = subjectsField ? (subjectsField.getAttribute('data-selected') || '').trim() : '';
      const subjectOptionCatalog = {
        PCM: [
          { value: 'PCM_PHYSICS_CHEMISTRY_MATH', label: 'Physics, Chemistry, Mathematics' },
          { value: 'PCM_PHYSICS_CHEMISTRY_MATH_CS', label: 'Physics, Chemistry, Mathematics, Computer Science' },
          { value: 'PCM_PHYSICS_CHEMISTRY_MATH_ECONOMICS', label: 'Physics, Chemistry, Mathematics, Economics' }
        ],
        PCB: [
          { value: 'PCB_PHYSICS_CHEMISTRY_BIOLOGY', label: 'Physics, Chemistry, Biology' },
          { value: 'PCB_PHYSICS_CHEMISTRY_BIOLOGY_MATH', label: 'Physics, Chemistry, Biology, Mathematics' },
          { value: 'PCB_PHYSICS_CHEMISTRY_BIOLOGY_PSYCHOLOGY', label: 'Physics, Chemistry, Biology, Psychology' }
        ],
        COMMERCE: [
          { value: 'COM_ACC_ECO_BST', label: 'Accountancy, Economics, Business Studies' },
          { value: 'COM_ACC_ECO_BST_MATH', label: 'Accountancy, Economics, Business Studies, Mathematics' },
          { value: 'COM_ACC_ECO_BST_IP', label: 'Accountancy, Economics, Business Studies, Informatics Practices' },
          { value: 'COM_ACC_ECO_BST_ENTREPRENEURSHIP', label: 'Accountancy, Economics, Business Studies, Entrepreneurship' }
        ],
        HUMANITIES: [
          { value: 'HUM_HISTORY_POLITICAL_SCIENCE_SOCIOLOGY', label: 'History, Political Science, Sociology' },
          { value: 'HUM_HISTORY_POLITICAL_SCIENCE_PSYCHOLOGY', label: 'History, Political Science, Psychology' },
          { value: 'HUM_HISTORY_GEOGRAPHY_ECONOMICS', label: 'History, Geography, Economics' },
          { value: 'HUM_POLITICAL_SCIENCE_ECONOMICS_MATH', label: 'Political Science, Economics, Mathematics' }
        ],
        GENERAL: [
          { value: 'GENERAL_SCIENCE_MATH_LANGUAGE', label: 'Science, Mathematics, Language' },
          { value: 'GENERAL_COMMERCE_LANGUAGE_MATH', label: 'Commerce, Language, Mathematics' },
          { value: 'GENERAL_SOCIAL_SCIENCE_LANGUAGE', label: 'Social Science, Language' }
        ]
      };

      function isSeniorSchoolGrade(code) {
        return code === '11' || code === '12';
      }

      function isPost12Grade(code) {
        const set = new Set([
          'DIPLOMA_1','DIPLOMA_2','DIPLOMA_3',
          'UG_1','UG_2','UG_3','UG_4','UG_5',
          'PG_1','PG_2','MBA_1','MBA_2',
          'MTECH_1','MTECH_2','COLLEGE_OTHER','WORKING'
        ]);
        return set.has(code);
      }

      function detectSubjectTrack(streamCode) {
        const stream = (streamCode || '').trim().toUpperCase();
        if (!stream) return 'GENERAL';
        if (stream.indexOf('COMMERCE') >= 0 || stream.indexOf('BUSINESS') >= 0 || stream.indexOf('FINANCE') >= 0) {
          return 'COMMERCE';
        }
        if (stream.indexOf('HUMANITIES') >= 0 || stream.indexOf('ARTS') >= 0 || stream.indexOf('SOCIAL') >= 0
            || stream.indexOf('LAW') >= 0 || stream.indexOf('POLICY') >= 0 || stream.indexOf('MEDIA') >= 0) {
          return 'HUMANITIES';
        }
        if (stream.indexOf('PCB') >= 0 || stream.indexOf('HEALTH') >= 0 || stream.indexOf('BIO') >= 0) {
          return 'PCB';
        }
        if (stream.indexOf('PCM') >= 0 || stream.indexOf('ENGINEERING') >= 0 || stream.indexOf('TECH') >= 0
            || stream.indexOf('COMPUTER') >= 0 || stream.indexOf('AI') >= 0) {
          return 'PCM';
        }
        return 'GENERAL';
      }

      function ensureStreamSelection() {
        if (!streamField || !serverStreamValue) return;
        const hasValue = Array.from(streamField.options || []).some(option => option.value === serverStreamValue);
        if (!hasValue) {
          const option = document.createElement('option');
          option.value = serverStreamValue;
          option.textContent = 'Current: ' + serverStreamValue.replace(/_/g, ' ');
          streamField.appendChild(option);
        }
        streamField.value = serverStreamValue;
      }

      function renderSubjectOptions() {
        if (!subjectsField) return;
        const selected = (subjectsField.value || serverSubjectValue || '').trim();
        const track = detectSubjectTrack(streamField ? streamField.value : '');
        const catalog = subjectOptionCatalog[track] || subjectOptionCatalog.GENERAL;
        const optionValues = new Set();
        subjectsField.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select subject combination';
        subjectsField.appendChild(defaultOption);

        catalog.forEach(function(item) {
          const option = document.createElement('option');
          option.value = item.value;
          option.textContent = item.label;
          subjectsField.appendChild(option);
          optionValues.add(item.value);
        });

        if (selected && !optionValues.has(selected)) {
          const carry = document.createElement('option');
          carry.value = selected;
          carry.textContent = 'Current: ' + selected.replace(/_/g, ' ');
          subjectsField.appendChild(carry);
        }
        subjectsField.value = selected;
      }

      function toggleAcademicContext() {
        const gradeCode = gradeField && gradeField.value ? gradeField.value.trim().toUpperCase() : '';
        const senior = isSeniorSchoolGrade(gradeCode);
        const post12 = isPost12Grade(gradeCode);

        const showStream = senior || post12;
        streamWrap.style.display = showStream ? '' : 'none';
        streamField.required = showStream;

        subjectsWrap.style.display = senior ? '' : 'none';
        subjectsField.required = senior;

        programWrap.style.display = post12 ? '' : 'none';
        yearsLeftWrap.style.display = post12 ? '' : 'none';
        programField.required = post12;
        yearsLeftField.required = post12;
        renderSubjectOptions();
      }

      if (gradeField) {
        gradeField.addEventListener('change', toggleAcademicContext);
      }
      if (streamField) {
        streamField.addEventListener('change', renderSubjectOptions);
      }
      ensureStreamSelection();
      toggleAcademicContext();
    })();
  </script>

  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>
</body>
</html>
