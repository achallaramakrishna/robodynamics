<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Robo Dynamics — Apply to Teach</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
</head>
<body>

<jsp:include page="header.jsp"/>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-lg-8">

      <!-- Mentor intro -->
      <h1 class="mb-4 text-center">Teach. Earn. Inspire.</h1>
      <p class="text-muted text-center mb-5">
        Join Robo Dynamics and inspire the next generation.  
        We provide curriculum, student batches, and parent communication — you focus on teaching.
      </p>

      <!-- Mentor lead form -->
      <form method="post" action="${pageContext.request.contextPath}/leads" class="p-4 border rounded bg-light">
        <input type="hidden" name="source" value="mentors_page"/>
        <input type="hidden" name="audience" value="mentor"/>

        <div class="mb-3">
          <label class="form-label">Your Name</label>
          <input type="text" name="name" class="form-control" required/>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Phone (WhatsApp preferred)</label>
            <input type="tel" name="phone" class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Email (optional)</label>
            <input type="email" name="email" class="form-control"/>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Subjects You Can Teach</label>
          <select name="message" class="form-select" multiple required>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Kannada">Kannada</option>
          </select>
          <small class="text-muted">Hold Ctrl (Windows) / Cmd (Mac) to select multiple subjects.</small>
        </div>

        <button type="submit" class="btn btn-success w-100">
          <i class="bi bi-send"></i> Apply to Teach
        </button>
      </form>

      <div class="mt-4 text-center small text-muted">
        <em>“Onboarding was smooth; payouts are always on time.” — Praveen, Mentor</em>
      </div>

    </div>
  </div>
</div>

<jsp:include page="footer.jsp"/>

</body>
</html>
