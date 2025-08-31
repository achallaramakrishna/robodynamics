<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Add' : 'Edit'} Course Session Detail</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container mt-5">
  <h1 class="mb-3">${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Add' : 'Edit'} Course Session Detail</h1>

  <c:if test="${not empty message}"><div class="alert alert-success">${message}</div></c:if>
  <c:if test="${not empty error}"><div class="alert alert-danger">${error}</div></c:if>

  <f:form action="${pageContext.request.contextPath}/sessiondetail/save" method="post" modelAttribute="courseSessionDetail">
    <!-- PK (for edit) -->
    <f:hidden path="courseSessionDetailId"/>

    <!-- Course dropdown -->
    <div class="mb-3">
      <label class="form-label">Course</label>
      <select id="courseSelect" name="course.courseId" class="form-control" required>
        <option value="">-- Select Course --</option>
        <c:forEach var="c" items="${courses}">
          <option value="${c.courseId}" ${selectedCourseId == c.courseId ? 'selected' : ''}>
            ${c.courseName}
          </option>
        </c:forEach>
      </select>
    </div>

    <!-- Course Session dropdown (cascades from Course) -->
    <div class="mb-3">
      <label class="form-label">Course Session</label>
      <select id="courseSessionSelect" name="courseSession.courseSessionId" class="form-control" required disabled>
        <option value="">-- Select Session --</option>
      </select>
      <div id="sessionHelp" class="form-text">Choose a course to load its sessions.</div>
    </div>

    <!-- Topic -->
    <div class="mb-3">
      <f:label path="topic" cssClass="form-label">Topic</f:label>
      <f:textarea path="topic" cssClass="form-control" rows="3" required="true"></f:textarea>
    </div>

    <!-- Business key (keep only if you truly need this editable) -->
    <div class="mb-3">
      <f:label path="sessionDetailId" cssClass="form-label">Session Detail Id</f:label>
      <f:input path="sessionDetailId" cssClass="form-control" type="number" required="true"/>
    </div>

    <!-- Version -->
    <div class="mb-3">
      <f:label path="version" cssClass="form-label">Version</f:label>
      <f:input path="version" cssClass="form-control" type="number" required="true"/>
    </div>

    <!-- Type -->
    <div class="mb-3">
      <f:label path="type" cssClass="form-label">Type</f:label>
      <f:select path="type" cssClass="form-control">
        <option value="">Select Type</option>
        <option value="slide" ${courseSessionDetail.type == 'slide' ? 'selected' : ''}>Slide</option>
        <option value="video" ${courseSessionDetail.type == 'video' ? 'selected' : ''}>Video</option>
        <option value="pdf" ${courseSessionDetail.type == 'pdf' ? 'selected' : ''}>PDF</option>
        <option value="document" ${courseSessionDetail.type == 'document' ? 'selected' : ''}>Document</option>
        <option value="quiz" ${courseSessionDetail.type == 'quiz' ? 'selected' : ''}>Quiz</option>
      </f:select>
    </div>

    <!-- File -->
    <div class="mb-3">
      <f:label path="file" cssClass="form-label">File</f:label>
      <f:input path="file" cssClass="form-control" type="text" placeholder="Enter file path or URL"/>
    </div>

    <button type="submit" class="btn btn-primary">
      ${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Save' : 'Update'} Session Detail
    </button>
    <a href="${pageContext.request.contextPath}/sessiondetail/list?courseId=${selectedCourseId != null ? selectedCourseId : 0}" class="btn btn-secondary">Cancel</a>
  </f:form>
</div>

<script>
(function(){
  const ctx = '${pageContext.request.contextPath}';
  const $course = $('#courseSelect');
  const $session = $('#courseSessionSelect');
  const selectedCourseId = ${selectedCourseId != null ? selectedCourseId : 0};
  const selectedCourseSessionId = ${selectedCourseSessionId != null ? selectedCourseSessionId : 0};

  function loadSessions(courseId, preselectId){
    if(!courseId){ $session.prop('disabled', true).html('<option value="">-- Select Session --</option>'); return; }
    $.getJSON(ctx + '/sessiondetail/getCourseSessions', { courseId: courseId })
      .done(function(data){
        const items = data && data.courseSessions ? data.courseSessions : [];
        let html = '<option value="">-- Select Session --</option>';
        items.forEach(function(s){
          // NOTE: DTO uses `sessionId` + `sessionTitle`
          const sel = (preselectId && preselectId == s.sessionId) ? ' selected' : '';
          html += '<option value="'+ s.sessionId +'"'+ sel +'>' + s.sessionTitle + '</option>';
        });
        $session.html(html).prop('disabled', items.length === 0);
      })
      .fail(function(){ 
        $session.prop('disabled', true).html('<option value="">-- Select Session --</option>');
        alert('Failed to load sessions for the selected course.');
      });
  }

  // On page load: if a course is preselected, load sessions and preselect session
  if(selectedCourseId){
    loadSessions(selectedCourseId, selectedCourseSessionId || null);
  }

  // When course changes, reload sessions
  $course.on('change', function(){ loadSessions($(this).val(), null); });
})();
</script>

<jsp:include page="/footer.jsp" />
</body>
</html>
