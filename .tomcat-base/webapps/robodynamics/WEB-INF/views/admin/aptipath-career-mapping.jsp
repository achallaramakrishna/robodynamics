<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath Career Mapping Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      --ink: #0f172a;
      --muted: #475569;
      --line: #dbe4ee;
      --surface: #ffffff;
      --brand: #0f766e;
      --bg: #f3f7fb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
      color: var(--ink);
      background: linear-gradient(180deg, #f7fbff 0%, var(--bg) 100%);
    }
    .shell { width: min(1200px, 95vw); margin: 24px auto; }
    .hero {
      background: linear-gradient(120deg, #0f172a, var(--brand));
      color: #f8fbff;
      border-radius: 16px;
      padding: 18px;
    }
    .hero h1 { margin: 0 0 6px; font-size: 22px; }
    .hero p { margin: 0; font-size: 13px; color: rgba(248, 251, 255, 0.95); }
    .panel {
      margin-top: 14px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }
    .row {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-bottom: 10px;
    }
    .row-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .row-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 5px;
    }
    input, select, textarea, button {
      width: 100%;
      border: 1px solid #cdd9e6;
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
    }
    textarea { min-height: 70px; resize: vertical; }
    .btn {
      border: 0;
      cursor: pointer;
      font-weight: 700;
      border-radius: 10px;
      padding: 9px 12px;
    }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-secondary { background: #e2e8f0; color: #0f172a; }
    .btn-danger { background: #fee2e2; color: #991b1b; }
    .btn-small { width: auto; padding: 6px 10px; font-size: 12px; }
    .muted { color: var(--muted); font-size: 12px; }
    .pill {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      border-radius: 999px;
      padding: 4px 8px;
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      color: #1d4ed8;
    }
    .pill.inactive {
      border-color: #fecaca;
      background: #fff1f2;
      color: #b91c1c;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    th, td {
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      padding: 8px 6px;
      vertical-align: top;
    }
    th { color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    .stack { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .notice {
      margin-top: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      background: #ecfeff;
      border: 1px solid #a5f3fc;
      color: #0f172a;
      font-size: 12px;
      font-weight: 700;
    }
    @media (max-width: 980px) {
      .row, .row-2, .row-5 { grid-template-columns: 1fr; }
      .shell { width: min(96vw, 1200px); }
    }
  </style>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />
<div class="shell">
  <section class="hero">
    <h1>AptiPath Career Mapping Admin</h1>
    <p>Manage catalog roles, prerequisites, subject cutoffs, and adjustment rules without SQL edits.</p>
  </section>

  <section class="panel">
    <form method="get" action="${pageContext.request.contextPath}/admin/aptipath/career-mapping">
      <div class="row row-2">
        <div>
          <label>Module Code</label>
          <input type="text" name="module" value="<c:out value='${moduleCode}'/>" />
        </div>
        <div>
          <label>Assessment Version</label>
          <input type="text" name="version" value="<c:out value='${assessmentVersion}'/>" />
        </div>
      </div>
      <div class="stack">
        <label style="margin:0;">
          <input style="width:auto; margin-right:6px;" type="checkbox" name="includeInactive" value="1" <c:if test="${includeInactive}">checked</c:if> />
          Include inactive rows
        </label>
        <button class="btn btn-primary btn-small" type="submit">Reload</button>
      </div>
    </form>
    <c:if test="${not empty saved}">
      <div class="notice">Saved: <c:out value="${saved}" /></div>
    </c:if>
    <p class="muted" style="margin-top:8px;">
      Catalog rows: <strong><c:out value="${catalogRows.size()}" /></strong>,
      Adjustment rows: <strong><c:out value="${adjustmentRows.size()}" /></strong>.
    </p>
  </section>

  <section class="panel" id="catalog-form">
    <h2 style="margin:0 0 10px;">Career Catalog Editor</h2>
    <form method="post" action="${pageContext.request.contextPath}/admin/aptipath/career-mapping/catalog/save">
      <input type="hidden" name="ciCareerCatalogId" value="<c:out value='${editCatalog.ciCareerCatalogId}'/>" />
      <input type="hidden" name="moduleCode" value="<c:out value='${moduleCode}'/>" />
      <input type="hidden" name="assessmentVersion" value="<c:out value='${assessmentVersion}'/>" />
      <div class="row row-2">
        <div>
          <label>Career Code</label>
          <input type="text" name="careerCode" value="<c:out value='${editCatalog.careerCode}'/>" />
        </div>
        <div>
          <label>Career Name</label>
          <input type="text" name="careerName" required value="<c:out value='${editCatalog.careerName}'/>" />
        </div>
      </div>
      <div class="row row-2">
        <div>
          <label>Cluster Name</label>
          <input type="text" name="clusterName" required value="<c:out value='${editCatalog.clusterName}'/>" />
        </div>
        <div>
          <label>Fit Strategy</label>
          <input type="text" name="fitStrategy" value="<c:out value='${editCatalog.fitStrategy}'/>" placeholder="DEFAULT_CLUSTER_BASE / LAW_SPECIAL ..." />
        </div>
      </div>
      <div class="row row-2">
        <div>
          <label>Required Subjects CSV</label>
          <input type="text" name="requiredSubjectsCsv" value="<c:out value='${editCatalog.requiredSubjectsCsv}'/>" />
        </div>
        <div>
          <label>Entrance Exams CSV</label>
          <input type="text" name="entranceExamsCsv" value="<c:out value='${editCatalog.entranceExamsCsv}'/>" />
        </div>
      </div>
      <div class="row row-5">
        <div><label>Min Math (0-5)</label><input type="number" min="0" max="5" name="minMathLevel" value="<c:out value='${editCatalog.minMathLevel}'/>" /></div>
        <div><label>Min Physics (0-5)</label><input type="number" min="0" max="5" name="minPhysicsLevel" value="<c:out value='${editCatalog.minPhysicsLevel}'/>" /></div>
        <div><label>Min Chemistry (0-5)</label><input type="number" min="0" max="5" name="minChemistryLevel" value="<c:out value='${editCatalog.minChemistryLevel}'/>" /></div>
        <div><label>Min Biology (0-5)</label><input type="number" min="0" max="5" name="minBiologyLevel" value="<c:out value='${editCatalog.minBiologyLevel}'/>" /></div>
        <div><label>Min Language (0-5)</label><input type="number" min="0" max="5" name="minLanguageLevel" value="<c:out value='${editCatalog.minLanguageLevel}'/>" /></div>
      </div>
      <div class="row row-2">
        <div>
          <label>Target Phase</label>
          <input type="text" name="targetPhase" value="<c:out value='${editCatalog.targetPhase}'/>" placeholder="POST_12 / POST_10_TO_POST12" />
        </div>
        <div>
          <label>Sort Order</label>
          <input type="number" name="sortOrder" value="<c:out value='${editCatalog.sortOrder}'/>" />
        </div>
      </div>
      <div class="row row-2">
        <div>
          <label>Pathway Hint</label>
          <textarea name="pathwayHint"><c:out value="${editCatalog.pathwayHint}" /></textarea>
        </div>
        <div>
          <label>Exam Hint</label>
          <textarea name="examHint"><c:out value="${editCatalog.examHint}" /></textarea>
        </div>
      </div>
      <div class="row row-2">
        <div>
          <label>Prerequisite Summary</label>
          <textarea name="prerequisiteSummary"><c:out value="${editCatalog.prerequisiteSummary}" /></textarea>
        </div>
        <div>
          <label>Status</label>
          <select name="status">
            <option value="ACTIVE" <c:if test="${empty editCatalog or editCatalog.status == 'ACTIVE'}">selected</c:if>>ACTIVE</option>
            <option value="INACTIVE" <c:if test="${editCatalog.status == 'INACTIVE'}">selected</c:if>>INACTIVE</option>
          </select>
        </div>
      </div>
      <div class="stack">
        <button type="submit" class="btn btn-primary btn-small">Save Career Row</button>
        <a class="btn btn-secondary btn-small" href="${pageContext.request.contextPath}/admin/aptipath/career-mapping?module=${moduleCode}&version=${assessmentVersion}&includeInactive=${includeInactive ? 1 : 0}">Clear Form</a>
      </div>
    </form>
  </section>

  <section class="panel">
    <h3 style="margin:0 0 8px;">Career Catalog Rows</h3>
    <div style="overflow:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Career</th>
            <th>Cluster</th>
            <th>Cutoffs</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="r" items="${catalogRows}">
            <tr>
              <td><c:out value="${r.ciCareerCatalogId}" /></td>
              <td>
                <strong><c:out value="${r.careerName}" /></strong><br>
                <span class="muted"><c:out value="${r.careerCode}" /></span>
              </td>
              <td><c:out value="${r.clusterName}" /></td>
              <td>
                M:<c:out value="${r.minMathLevel}" />,
                P:<c:out value="${r.minPhysicsLevel}" />,
                C:<c:out value="${r.minChemistryLevel}" />,
                B:<c:out value="${r.minBiologyLevel}" />,
                L:<c:out value="${r.minLanguageLevel}" />
              </td>
              <td>
                <span class="pill ${r.status == 'INACTIVE' ? 'inactive' : ''}"><c:out value="${r.status}" /></span>
              </td>
              <td>
                <div class="stack">
                  <a class="btn btn-secondary btn-small" href="${pageContext.request.contextPath}/admin/aptipath/career-mapping?module=${moduleCode}&version=${assessmentVersion}&includeInactive=${includeInactive ? 1 : 0}&editCatalogId=${r.ciCareerCatalogId}#catalog-form">Edit</a>
                  <form method="post" action="${pageContext.request.contextPath}/admin/aptipath/career-mapping/catalog/status">
                    <input type="hidden" name="ciCareerCatalogId" value="<c:out value='${r.ciCareerCatalogId}'/>" />
                    <input type="hidden" name="moduleCode" value="<c:out value='${moduleCode}'/>" />
                    <input type="hidden" name="assessmentVersion" value="<c:out value='${assessmentVersion}'/>" />
                    <input type="hidden" name="includeInactive" value="<c:out value='${includeInactive ? 1 : 0}'/>" />
                    <input type="hidden" name="status" value="${r.status == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}" />
                    <button type="submit" class="btn ${r.status == 'ACTIVE' ? 'btn-danger' : 'btn-primary'} btn-small">${r.status == 'ACTIVE' ? 'Deactivate' : 'Activate'}</button>
                  </form>
                </div>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel" id="adjustment-form">
    <h2 style="margin:0 0 10px;">Adjustment Rule Editor</h2>
    <form method="post" action="${pageContext.request.contextPath}/admin/aptipath/career-mapping/adjustment/save">
      <input type="hidden" name="ciCareerAdjustmentId" value="<c:out value='${editAdjustment.ciCareerAdjustmentId}'/>" />
      <input type="hidden" name="moduleCode" value="<c:out value='${moduleCode}'/>" />
      <input type="hidden" name="assessmentVersion" value="<c:out value='${assessmentVersion}'/>" />
      <div class="row row-5">
        <div><label>Signal Type</label><input type="text" name="signalType" required value="<c:out value='${editAdjustment.signalType}'/>" placeholder="INTENT / SELF_SIGNAL" /></div>
        <div><label>Signal Code</label><input type="text" name="signalCode" required value="<c:out value='${editAdjustment.signalCode}'/>" /></div>
        <div><label>Signal Band</label><input type="text" name="signalBand" value="<c:out value='${editAdjustment.signalBand}'/>" placeholder="ANY / HIGH / LOW" /></div>
        <div><label>Cluster Name</label><input type="text" name="clusterName" required value="<c:out value='${editAdjustment.clusterName}'/>" /></div>
        <div><label>Boost Value</label><input type="text" name="boostValue" required value="<c:out value='${editAdjustment.boostValue}'/>" /></div>
      </div>
      <div class="row row-2">
        <div><label>Sort Order</label><input type="number" name="sortOrder" value="<c:out value='${editAdjustment.sortOrder}'/>" /></div>
        <div>
          <label>Status</label>
          <select name="status">
            <option value="ACTIVE" <c:if test="${empty editAdjustment or editAdjustment.status == 'ACTIVE'}">selected</c:if>>ACTIVE</option>
            <option value="INACTIVE" <c:if test="${editAdjustment.status == 'INACTIVE'}">selected</c:if>>INACTIVE</option>
          </select>
        </div>
      </div>
      <div class="stack">
        <button type="submit" class="btn btn-primary btn-small">Save Adjustment Rule</button>
        <a class="btn btn-secondary btn-small" href="${pageContext.request.contextPath}/admin/aptipath/career-mapping?module=${moduleCode}&version=${assessmentVersion}&includeInactive=${includeInactive ? 1 : 0}#adjustment-form">Clear Form</a>
      </div>
    </form>
  </section>

  <section class="panel">
    <h3 style="margin:0 0 8px;">Adjustment Rules</h3>
    <div style="overflow:auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Signal</th>
            <th>Cluster</th>
            <th>Boost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="a" items="${adjustmentRows}">
            <tr>
              <td><c:out value="${a.ciCareerAdjustmentId}" /></td>
              <td><strong><c:out value="${a.signalType}" /></strong>: <c:out value="${a.signalCode}" /> (<c:out value="${a.signalBand}" />)</td>
              <td><c:out value="${a.clusterName}" /></td>
              <td><c:out value="${a.boostValue}" /></td>
              <td><span class="pill ${a.status == 'INACTIVE' ? 'inactive' : ''}"><c:out value="${a.status}" /></span></td>
              <td>
                <div class="stack">
                  <a class="btn btn-secondary btn-small" href="${pageContext.request.contextPath}/admin/aptipath/career-mapping?module=${moduleCode}&version=${assessmentVersion}&includeInactive=${includeInactive ? 1 : 0}&editAdjustmentId=${a.ciCareerAdjustmentId}#adjustment-form">Edit</a>
                  <form method="post" action="${pageContext.request.contextPath}/admin/aptipath/career-mapping/adjustment/status">
                    <input type="hidden" name="ciCareerAdjustmentId" value="<c:out value='${a.ciCareerAdjustmentId}'/>" />
                    <input type="hidden" name="moduleCode" value="<c:out value='${moduleCode}'/>" />
                    <input type="hidden" name="assessmentVersion" value="<c:out value='${assessmentVersion}'/>" />
                    <input type="hidden" name="includeInactive" value="<c:out value='${includeInactive ? 1 : 0}'/>" />
                    <input type="hidden" name="status" value="${a.status == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}" />
                    <button type="submit" class="btn ${a.status == 'ACTIVE' ? 'btn-danger' : 'btn-primary'} btn-small">${a.status == 'ACTIVE' ? 'Deactivate' : 'Activate'}</button>
                  </form>
                </div>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </div>
  </section>
</div>
<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
