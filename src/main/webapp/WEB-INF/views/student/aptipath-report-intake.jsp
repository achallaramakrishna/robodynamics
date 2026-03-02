<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath360 Final Inputs</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", Arial, sans-serif;
      background: linear-gradient(135deg, #071320, #102338);
      color: #e8f4ff;
    }
    .shell {
      width: min(980px, 92vw);
      margin: 24px auto;
    }
    .panel {
      background: rgba(12, 22, 35, 0.86);
      border: 1px solid rgba(56, 189, 248, 0.5);
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 14px 30px rgba(3, 10, 18, 0.5);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 30px;
      color: #67e8f9;
    }
    p {
      margin: 0 0 12px;
      color: #d6ecff;
      line-height: 1.5;
    }
    .alert {
      margin-bottom: 10px;
      border: 1px solid rgba(251, 191, 36, 0.7);
      background: rgba(146, 64, 14, 0.3);
      color: #fde68a;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 700;
    }
    .error {
      margin-bottom: 10px;
      border: 1px solid rgba(248, 113, 113, 0.7);
      background: rgba(127, 29, 29, 0.3);
      color: #fecaca;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 700;
    }
    .q {
      margin-top: 12px;
      border: 1px solid rgba(125, 211, 252, 0.28);
      border-radius: 12px;
      background: rgba(2, 8, 20, 0.45);
      padding: 12px;
    }
    .q h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #bae6fd;
    }
    textarea {
      width: 100%;
      min-height: 95px;
      border-radius: 10px;
      border: 1px solid rgba(125, 211, 252, 0.5);
      background: rgba(2, 6, 16, 0.75);
      color: #ecfeff;
      padding: 10px;
      resize: vertical;
      box-sizing: border-box;
    }
    .row {
      margin-top: 12px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      border: 0;
      border-radius: 999px;
      padding: 11px 16px;
      font-weight: 800;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-primary {
      background: linear-gradient(45deg, #22d3ee, #818cf8);
      color: #02131f;
    }
    .btn-secondary {
      background: #0f172a;
      color: #cbd5e1;
      border: 1px solid #334155;
    }
  </style>
</head>
<body>
  <div class="shell">
    <section class="panel">
      <h1>AptiPath360 Final Reflection Inputs</h1>
      <p>
        Before generating your final report, answer these short reflection prompts.
        This helps personalize the career narrative and parent guidance.
      </p>
      <c:if test="${requiredPrompt}">
        <div class="alert">Final report is locked until these inputs are submitted.</div>
      </c:if>
      <c:if test="${validationError}">
        <div class="error">Please provide meaningful responses (minimum 20 characters for each prompt).</div>
      </c:if>

      <form method="post" action="${pageContext.request.contextPath}/aptipath/student/report-intake">
        <input type="hidden" name="sessionId" value="${sessionRow.ciAssessmentSessionId}" />
        <c:if test="${embedMode}">
          <input type="hidden" name="embed" value="1" />
        </c:if>
        <c:if test="${not empty companyCode}">
          <input type="hidden" name="company" value="${companyCode}" />
        </c:if>

        <c:forEach var="q" items="${followUpQuestions}" varStatus="s">
          <c:set var="code" value="${s.index == 0 ? 'RFQ_01' : (s.index == 1 ? 'RFQ_02' : 'RFQ_03')}" />
          <article class="q">
            <h3>Prompt ${s.index + 1}: <c:out value="${q}" /></h3>
            <textarea name="${code}" required minlength="20" maxlength="1200"><c:out value="${savedAnswers[code]}" /></textarea>
          </article>
        </c:forEach>

        <div class="row">
          <button class="btn btn-primary" type="submit">Generate Final AptiPath360 Report</button>
          <c:choose>
            <c:when test="${embedMode}">
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/home?embed=1&company=${companyCode}">Back to Dashboard</a>
            </c:when>
            <c:otherwise>
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/home">Back to Dashboard</a>
            </c:otherwise>
          </c:choose>
        </div>
      </form>
    </section>
  </div>
</body>
</html>
