<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Robo Dynamics — Book a Free Demo</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
</head>
<body>

<jsp:include page="header.jsp"/>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <h1 class="mb-4 text-center">Book a Free Demo Class</h1>
      <p class="text-muted text-center mb-5">Grades 2–12 • Tuition • Olympiads • Robotics • Coding</p>

      <!-- Parent lead form -->
      <form method="post" action="${pageContext.request.contextPath}/leads" class="p-4 border rounded bg-light">
        <input type="hidden" name="source" value="parents_page"/>
        <input type="hidden" name="audience" value="parent"/>

        <div class="mb-3">
          <label class="form-label">Parent Name</label>
          <input type="text" name="name" class="form-control" required/>
        </div>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Grade</label>
            <select name="grade" class="form-select" required>
              <option value="" disabled selected>Select Grade</option>
              <c:forEach var="g" begin="2" end="12">
                <option value="${g}">Grade ${g}</option>
              </c:forEach>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Board</label>
            <select name="board" class="form-select" required>
              <option value="" disabled selected>Select Board</option>
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State</option>
              <option>IB/IGCSE</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Phone (WhatsApp preferred)</label>
            <input type="tel" name="phone" class="form-control" required/>
          </div>
        </div>

		<div class="mb-3">
		  <label class="form-label">Subjects</label>
		<select name="message" multiple="multiple" class="form-select" required>
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


        <div class="mb-3">
          <label class="form-label">Email (optional)</label>
          <input type="email" name="email" class="form-control"/>
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-calendar2-check"></i> Book Free Demo
        </button>
      </form>
    </div>
  </div>
</div>

<jsp:include page="footer.jsp"/>

</body>
</html>
