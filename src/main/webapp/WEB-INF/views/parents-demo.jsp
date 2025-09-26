<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Book a Free Demo — Robo Dynamics</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<jsp:include page="header.jsp"/>

<div class="container py-4" style="max-width:720px">
  <h1 class="h3 mb-2">Book a free demo</h1>
  <p class="text-muted">Pick a convenient date &amp; time (IST) and share your contact. We’ll confirm shortly.</p>

  <form class="card shadow-sm p-3" method="post" action="${pageContext.request.contextPath}/parents/demo">
    <!-- Optional step banner if redirected from /leads -->
    <c:if test="${param.prefill == '1'}">
      <div class="alert alert-success py-2 mb-3">
        Step 2 of 2 — please confirm your demo details.
      </div>
    </c:if>

    <!-- Keep tracking + source when coming from home -->
    <input type="hidden" name="utm_source" value="${fn:escapeXml(param.utm_source)}"/>
    <input type="hidden" name="utm_medium" value="${fn:escapeXml(param.utm_medium)}"/>
    <input type="hidden" name="utm_campaign" value="${fn:escapeXml(param.utm_campaign)}"/>
    <input type="hidden" name="source" value="${fn:escapeXml(param.source)}"/>

	<input type="hidden" name="audience" value="parent"/>
	<input type="hidden" name="source" value="home_parent_simple"/>

	<!-- Only include leadId if explicitly provided -->
	<c:if test="${not empty param.leadId}">
	  <input type="hidden" name="leadId" value="${fn:escapeXml(param.leadId)}"/>
	</c:if>    

    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Parent name</label>
        <input name="parentName" class="form-control" required
               value="${fn:escapeXml(param.parentName)}" autocomplete="name">
      </div>
      <div class="col-md-6">
        <label class="form-label">WhatsApp / Phone</label>
        <input name="parentPhone" class="form-control" required
               value="${fn:escapeXml(param.parentPhone)}" autocomplete="tel">
      </div>

      <div class="col-md-6">
        <label class="form-label">Student name</label>
        <input name="studentName" class="form-control"
               value="${fn:escapeXml(param.studentName)}" autocomplete="off">
      </div>
      <div class="col-md-3">
        <label class="form-label">Grade</label>
        <input name="grade" class="form-control" placeholder="e.g., 6"
               value="${fn:escapeXml(param.grade)}" autocomplete="off">
      </div>
      <div class="col-md-3">
        <label class="form-label">Board</label>
        <input name="board" class="form-control" placeholder="CBSE/ICSE/..."
               value="${fn:escapeXml(param.board)}" autocomplete="off">
      </div>

      <div class="col-12">
        <label class="form-label">Subjects</label>
        <input name="subjects" class="form-control" placeholder="e.g., Maths + Science"
               value="${fn:escapeXml(param.subjects)}" autocomplete="off">
      </div>

      <div class="col-md-6">
        <label class="form-label">Preferred date &amp; time (IST)</label>
        <input name="demoDateTime" type="datetime-local" class="form-control" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Email (optional)</label>
        <input name="parentEmail" type="email" class="form-control"
               value="${fn:escapeXml(param.parentEmail)}" autocomplete="email">
      </div>

      <div class="col-12 d-grid">
        <button class="btn btn-primary btn-lg" type="submit">
          <i class="bi bi-calendar2-check"></i> Confirm request
        </button>
      </div>

      <p class="small text-muted mb-0">We’ll send a confirmation on WhatsApp. You can reschedule later if needed.</p>
    </div>
  </form>
</div>

<jsp:include page="footer.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
