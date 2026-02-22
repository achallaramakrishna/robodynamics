<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Thank You | Mentor Onboarding</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>

  <style>
    body { background:#f7fafc; }
    .card { border:0; border-radius:16px; box-shadow:0 8px 28px rgba(0,0,0,.08); }
    .emoji { font-size:3rem; }
  </style>
</head>
<body>

<jsp:include page="/header.jsp"/>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      <div class="card text-center p-4">
        <div class="emoji mb-3">🎉</div>
        <h2 class="mb-3">You’re all set!</h2>
        <p class="mb-4">
          Thank you for completing your mentor onboarding.  
          Your profile has been submitted successfully.
        </p>
        <p class="text-muted">
          Our team may review your details and contact you if required.
        </p>
        <a href="<c:url value='/login'/>" class="btn btn-primary mt-3">
          Go to Login
        </a>
      </div>
    </div>
  </div>
</div>

<jsp:include page="/footer.jsp"/>

</body>
</html>
