<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Send WhatsApp Template</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Header -->
  <jsp:include page="/header.jsp" />

  <div class="container mt-5">
    <h2>Send WhatsApp Template</h2>
    <p class="text-muted">
      This uses your Messaging Service (MG…) and Content Template (HX…) configured in <code>application.properties</code>.
    </p>

    <!-- Success / Error banners (optional: filled by controller on redirect back here) -->
    <c:if test="${not empty message}">
      <div class="alert alert-success">${message}</div>
    </c:if>
    <c:if test="${not empty error}">
      <div class="alert alert-danger">${error}</div>
    </c:if>

    <form method="post" action="${pageContext.request.contextPath}/wa/send-template" class="mt-3">
      <div class="mb-3">
        <label class="form-label">To (E.164, e.g. +91XXXXXXXXXX)</label>
        <input type="text" name="to" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Name ({{1}})</label>
        <input type="text" name="name" class="form-control" placeholder="Student name" required>
      </div>

      <button type="submit" class="btn btn-success">Send Template</button>
      <a href="${pageContext.request.contextPath}/wa/send" class="btn btn-outline-secondary ms-2">Send Free-form Text</a>
      <a href="${pageContext.request.contextPath}/wa/send-media" class="btn btn-outline-secondary ms-2">Send Media</a>
    </form>
  </div>

  <!-- Footer -->
  <jsp:include page="footer.jsp" />

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
