<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Message Sent</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Header -->
  <jsp:include page="header.jsp" />

  <div class="container mt-5">
    <h2>Message Sent Successfully!</h2>
    <p>Twilio SID: <strong>${sid}</strong></p>
    <a href="${pageContext.request.contextPath}/wa/send" class="btn btn-primary">Send Another</a>
  </div>

  <!-- Footer -->
  <jsp:include page="footer.jsp" />

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
