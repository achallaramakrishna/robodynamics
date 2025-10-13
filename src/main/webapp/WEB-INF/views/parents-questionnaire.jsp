<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <title>Help Us Match the Right Mentor | Robo Dynamics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>
<jsp:include page="header.jsp"/>

<div class="container py-5" style="max-width:800px;">
  <h2 class="mb-4">Hi ${lead.name}, tell us a bit about your child</h2>
  <form method="post" action="${pageContext.request.contextPath}/leads/questionnaire/save">

    <input type="hidden" name="leadId" value="${lead.id}"/>

    <div class="mb-3">
      <label class="form-label">Learning Pace</label>
      <select name="learningPace" class="form-select" required>
        <option value="">Select</option>
        <option>Fast</option>
        <option>Average</option>
        <option>Needs more time</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Interest in Studies</label>
      <select name="interestLevel" class="form-select" required>
        <option value="">Select</option>
        <option>Very interested</option>
        <option>Sometimes loses focus</option>
        <option>Needs motivation</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Objective of Tuition</label>
      <select name="objective" class="form-select" required>
        <option value="">Select</option>
        <option>Better exam scores</option>
        <option>Concept clarity</option>
        <option>Confidence & discipline</option>
        <option>Competitive exam prep</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Biggest Challenge Subject</label>
      <input type="text" class="form-control" name="subjectPriority" placeholder="e.g., Math, Science"/>
    </div>

    <div class="mb-3">
      <label class="form-label">Preferred Teaching Style</label>
      <select name="teacherStyle" class="form-select" required>
        <option value="">Select</option>
        <option>Patient & calm</option>
        <option>Energetic & engaging</option>
        <option>Strict & disciplined</option>
        <option>Friendly mentor-like</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Continue to Mentors</button>
  </form>
</div>

<jsp:include page="footer.jsp"/>
</body>
</html>
