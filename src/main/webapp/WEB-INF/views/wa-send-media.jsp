<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Send WhatsApp Media</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Header -->
  <jsp:include page="header.jsp" />

  <div class="container mt-5">
    <h2>Send WhatsApp Media</h2>
    <form method="post" action="${pageContext.request.contextPath}/wa/send-media">
      <div class="mb-3">
        <label class="form-label">To (E.164 format, e.g. +91XXXXXXXXXX)</label>
        <input type="text" name="to" class="form-control" required/>
      </div>

      <div class="mb-3">
        <label class="form-label">Caption (optional)</label>
        <input type="text" name="text" class="form-control"/>
      </div>

      <div class="mb-3">
        <label class="form-label">Media URL (publicly accessible)</label>
        <input type="text" name="mediaUrl" class="form-control" placeholder="https://example.com/image.jpg" required/>
      </div>

      <button type="submit" class="btn btn-success">Send Media</button>
    </form>

    <hr/>
    <a href="${pageContext.request.contextPath}/wa/send" class="btn btn-secondary">Back to Text Message</a>
  </div>

  <!-- Footer -->
  <jsp:include page="footer.jsp" />

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
