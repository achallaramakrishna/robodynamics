<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Send WhatsApp Message</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Header -->
  <jsp:include page="header.jsp" />

  <div class="container mt-5">
    <h2>Send WhatsApp Message</h2>
    <form method="post" action="${pageContext.request.contextPath}/wa/send">
      <div class="mb-3">
        <label class="form-label">To (E.164 format, e.g. +91XXXXXXXXXX)</label>
        <input type="text" name="to" class="form-control" required/>
      </div>

      <div class="mb-3">
        <label class="form-label">Message</label>
        <textarea name="text" class="form-control" rows="3" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Send</button>
    </form>

    <hr/>
    <a href="${pageContext.request.contextPath}/wa/send-media" class="btn btn-secondary">Send Media Message</a>
  </div>

  <!-- Footer -->
  <jsp:include page="/WEB-INF/views/footer.jsp" />

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
