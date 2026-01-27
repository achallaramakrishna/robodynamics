<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>
    <c:choose>
      <c:when test="${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0}">Add</c:when>
      <c:otherwise>Edit</c:otherwise>
    </c:choose>
    Course Session Detail
  </title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container mt-5">
  <h1 class="mb-3">
    <c:choose>
      <c:when test="${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0}">Add</c:when>
      <c:otherwise>Edit</c:otherwise>
    </c:choose>
    Course Session Detail
  </h1>

  <c:if test="${not empty message}"><div class="alert alert-success"><c:out value="${message}"/></div></c:if>
  <c:if test="${not empty error}"><div class="alert alert-danger"><c:out value="${error}"/></div></c:if>

  <f:form action="${pageContext.request.contextPath}/sessiondetail/save" method="post" modelAttribute="courseSessionDetail">
    <!-- PK (for edit) -->
    <f:hidden path="courseSessionDetailId"/>

    <!-- Course dropdown -->
    <div class="mb-3">
      <label class="form-label">Course</label>
      <select id="courseSelect" name="course.courseId" class="form-control" required>
        <option value="">-- Select Course --</option>
        <c:forEach var="c" items="${courses}">
          <option value="${c.courseId}" <c:if test="${selectedCourseId == c.courseId}">selected</c:if>>
            <c:out value="${c.courseName}"/>
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

    <!-- Business key (editable only if you truly need it) -->
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
        <option value="slide"    <c:if test="${courseSessionDetail.type == 'slide'}">selected</c:if>   >Slide</option>
        <option value="video"    <c:if test="${courseSessionDetail.type == 'video'}">selected</c:if>   >Video</option>
        <option value="pdf"      <c:if test="${courseSessionDetail.type == 'pdf'}">selected</c:if>     >PDF</option>
        <option value="document" <c:if test="${courseSessionDetail.type == 'document'}">selected</c:if>>Document</option>
        <option value="quiz"     <c:if test="${courseSessionDetail.type == 'quiz'}">selected</c:if>    >Quiz</option>
        <option value="flashcard"     <c:if test="${courseSessionDetail.type == 'flashcard'}">selected</c:if>    >Flashcard</option>
        <option value="matchinggame"     <c:if test="${courseSessionDetail.type == 'flashcard'}">selected</c:if>    >Matching Game</option>
        <option value="matchpairs"     <c:if test="${courseSessionDetail.type == 'matchpairs'}">selected</c:if>    >Match Pairs</option>
        
      </f:select>
    </div>
    
    <div class="form-check mb-3">
	    <f:checkbox path="assignment" cssClass="form-check-input" id="assignmentCheck"/>
	    <label class="form-check-label" for="assignmentCheck">
	        Has Assignment?
	    </label>
	</div>
	    

    <!-- File -->
    <div class="mb-3">
      <f:label path="file" cssClass="form-label">File</f:label>
      <f:input path="file" cssClass="form-control" type="text" placeholder="Enter file path or URL"/>
    </div>

    <button type="submit" class="btn btn-primary">
      <c:choose>
        <c:when test="${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0}">Save</c:when>
        <c:otherwise>Update</c:otherwise>
      </c:choose>
      Session Detail
    </button>
    <a href="${pageContext.request.contextPath}/sessiondetail/list?courseId=${selectedCourseId != null ? selectedCourseId : 0}" class="btn btn-secondary">Cancel</a>
  </f:form>
</div>

<script>
(function(){
  const ctx = '${pageContext.request.contextPath}';
  const $course = $('#courseSelect');
  const $session = $('#courseSessionSelect');

  // Safely embed numeric defaults
  const selectedCourseId = Number('${selectedCourseId != null ? selectedCourseId : 0}');
  const selectedCourseSessionId = Number('${selectedCourseSessionId != null ? selectedCourseSessionId : 0}');

  function setSessions(items, preselectId){
    let html = '<option value="">-- Select Session --</option>';
    items.forEach(function(s){
      const sel = (preselectId && Number(preselectId) === Number(s.sessionId)) ? ' selected' : '';
      html += '<option value="'+ s.sessionId +'"'+ sel +'>' + s.sessionTitle + '</option>';
    });
    $session.html(html);
    $session.prop('disabled', items.length === 0);
  }

  function loadSessions(courseId, preselectId){
    if(!courseId){
      setSessions([], null);
      return;
    }
    // disable while loading
    $session.prop('disabled', true).html('<option value="">Loading...</option>');
    $.getJSON(ctx + '/sessiondetail/getCourseSessions', { courseId: courseId })
      .done(function(data){
        const items = (data && Array.isArray(data.courseSessions)) ? data.courseSessions : [];
        setSessions(items, preselectId);
      })
      .fail(function(){
        setSessions([], null);
        alert('Failed to load sessions for the selected course.');
      });
  }

  // On page load: if a course is preselected, load sessions and preselect session
  if(selectedCourseId){
    // make sure the course dropdown visually reflects the selection
    $course.val(String(selectedCourseId));
    loadSessions(selectedCourseId, selectedCourseSessionId || null);
  } else {
    // no course -> keep session disabled
    setSessions([], null);
  }

  // When course changes, reload sessions
  $course.on('change', function(){
    const cid = $(this).val();
    loadSessions(cid, null);
  });
})();
</script>

<jsp:include page="/footer.jsp" />
</body>
</html>
