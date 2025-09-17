<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<html>
<head>
<%@ page isELIgnored="false"%>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<meta charset="UTF-8">
<title>Dashboard</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
    }
    .accordion-button {
        background-color: #007bff;
        color: white;
    }
    .accordion-button:not(.collapsed) {
        background-color: #0056b3;
        color: white;
    }
    .video-container {
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .accordion-body {
        background-color: #f1f1f1;
        padding: 20px;
    }
    .list-group-item {
        border: none;
        padding: 10px 20px;
    }
    .list-group-item:hover {
        background-color: #e2e6ea;
        cursor: pointer;
    }
    /* Sidebar and content container adjustments */
    .main-container {
        display: flex;
        transition: width 0.3s;
        overflow: hidden; /* Hide content when collapsed */
        
    }
    .sidebar-container {
        width: 250px;
        transition: width 0.3s;
    }
    .sidebar-collapsed {
        width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden;
        display: none; /* Hide sidebar completely */
    }
    .content-expanded {
        flex-grow: 1;
        width: 100%;
        padding-left: 20px;
    }
    .toggle-button {
        position: fixed;
        top: 75px; /* Adjust based on header height */
        left: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 1;
    }
</style>

<script type="text/javascript">
(function () {
  // JSP → JS values
  var ctx = '${pageContext.request.contextPath}';
  var enrollmentIdServer = '${studentEnrollment.enrollmentId}';

  // ---- helpers ----
  function resolveMaterialPath(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    // external url
    if (/^https?:\/\//i.test(f)) return f;

    // already a session_materials path? strip leading slash
    if (/^\/?session_materials\//i.test(f)) {
      return f.replace(/^\/+/, '');
    }

    // bare filename -> session_materials/{courseId}/{file}
    return 'session_materials/' + courseId + '/' + f;
  }

  function resolveVideoUrl(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    if (/^https?:\/\//i.test(f)) return f; // external

    if (/^\/?session_materials\//i.test(f)) {
      return ctx + '/' + f.replace(/^\/+/, '');
    }

    // legacy videos folder fallback
    return ctx + '/assets/videos/' + f;
  }

  function hideAll() {
    ['course-video','course-pdf','course-quiz','course-fib',
     'course-flashcard','course-assignment','course-matching-game'
    ].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  // ---- main loader (reads data-* from the clicked <li>) ----
  function loadContentFromLi(liEl) {
    var contentType = liEl.getAttribute('data-type');
    var file        = liEl.getAttribute('data-file') || '';
    var quiz        = liEl.getAttribute('data-quiz') || '';
    var id          = liEl.getAttribute('data-id');
    var courseId    = liEl.getAttribute('data-courseid');

    if (!contentType) return;

    hideAll();

    if (contentType === 'video') {
      var url = resolveVideoUrl(file, courseId);
      if (!url) return;
      var video = document.getElementById('course-video');
      document.getElementById('video-source').src = url;
      video.style.display = 'block';
      video.load();

    } else if (contentType === 'pdf') {
      var normPath = resolveMaterialPath(file, courseId);
      if (!normPath) return;
      var pdf = document.getElementById('course-pdf');
      pdf.src = /^https?:\/\//i.test(normPath)
        ? normPath
        : (ctx + '/mentor/uploads/preview?path=' + encodeURIComponent(normPath));
      pdf.style.display = 'block';

    } else if (contentType === 'slide') {
      var fib = document.getElementById('course-fib');
      fib.src = ctx + '/sessiondetail/start/' + id + '?enrollmentId=' + encodeURIComponent(enrollmentIdServer);
      fib.style.display = 'block';

    } else if (contentType === 'quiz') {
      var q = document.getElementById('course-quiz');
      q.src = ctx + '/quizzes/start/' + quiz;
      q.style.display = 'block';

    } else if (contentType === 'flashcard') {
      var fc = document.getElementById('course-flashcard');
      fc.src = ctx + '/flashcards/start/' + id;
      fc.style.display = 'block';

    } else if (contentType === 'assignment') {
      var asn = document.getElementById('course-assignment');
      asn.src = ctx + '/sessiondetail/assignment/start/' + id;
      asn.style.display = 'block';

    } else if (contentType === 'matching-game') {
      var mg = document.getElementById('course-matching-game');
      mg.src = ctx + '/matching-game/start/' + id;
      mg.style.display = 'block';
    }
  }

  // ---- wiring ----
  document.addEventListener('DOMContentLoaded', function () {
    // show the right pane when any content item is clicked
    document.querySelectorAll('#basicAccordion .list-group-item').forEach(function (li) {
      li.addEventListener('click', function () {
        document.querySelector('.video-container').style.display = 'block';
      });
    });

    // main click handler on list items (ignore clicks inside forms like assignment upload)
    document.querySelectorAll('#course-list li.list-group-item').forEach(function (li) {
      li.addEventListener('click', function (e) {
        if (e.target && e.target.closest('form')) return; // don't hijack uploads
        loadContentFromLi(this); // ← pass the LI (no global `event`)
      });
    });
  });

  // expose for your toggle button
  window.toggleSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('content');
    if (!sidebar || !content) return;
    sidebar.classList.toggle('sidebar-collapsed');
    content.classList.toggle('content-expanded');
  };
})();
</script>

</head>
<body>
    <jsp:include page="header.jsp" />
    <!-- Sidebar Toggle Button -->
    <button class="toggle-button" onclick="toggleSidebar()">☰</button>

    <div class="container-fluid">
        <div class="main-container">
            <div id="sidebar" class="sidebar-container">
                <div class="accordion mt-4" id="basicAccordion">
                    <h2 class="text-center" style="color: #007bff; font-weight: bold;">Course Content</h2>
                    <ul id="course-list" class="list-group">
                        <c:forEach items="${courseSessions}" var="courseSession">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading-${courseSession.sessionId}">
                                    <button class="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapse-${courseSession.sessionId}"
                                        aria-expanded="false" aria-controls="collapse-${courseSession.sessionId}">
                                        ${courseSession.sessionTitle}
                                    </button>
                                </h2>
                                <div id="collapse-${courseSession.sessionId}" class="accordion-collapse collapse"
                                    aria-labelledby="heading-${courseSession.sessionId}" data-bs-parent="#basicAccordion">
                                    <div class="accordion-body">
                                        <ul class="list-group">
                                            <c:forEach items="${courseSession.courseSessionDetails}" var="courseSessionDetail">
                                                <li class="list-group-item list-group-item-action bg-light mb-2"
                                                    style="font-size: 18px; color: #34495E;"
                                                    data-type="${courseSessionDetail.type}"
                                                    data-file="${courseSessionDetail.file}"
                                                    data-quiz="${courseSessionDetail.quiz.quizId}"
                                                    data-details="${courseSessionDetail.topic}"
                                                    data-qa="${courseSessionDetail.topic}"
                                                    data-id="${courseSessionDetail.courseSessionDetailId}" 
                                                    data-courseid="${courseSessionDetail.course.courseId}">
                                                    🧮 ${courseSessionDetail.topic}
                                                    
													<c:if test="${courseSessionDetail.type == 'pdf' && courseSessionDetail.assignment}">
													    <form action="${pageContext.request.contextPath}/student/session-assignment/upload"
													          method="post" enctype="multipart/form-data" class="mt-2">
													        <input type="hidden" name="sessionDetailId" value="${courseSessionDetail.courseSessionDetailId}" />
													        <input type="hidden" name="courseId" value="${courseSessionDetail.course.courseId}" />
    														<input type="hidden" name="enrollmentId" value="${studentEnrollment.enrollmentId}" />
													        <input type="file" name="assignmentFile" required class="form-control" />
													        <button type="submit" class="btn btn-sm btn-success mt-1">Upload Assignment</button>
													    </form>
													</c:if>

                                                </li>
                                            </c:forEach>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </c:forEach>
                    </ul>
                </div>
            </div>

            <div id="content" class="video-container" style="flex-grow: 1;">
                <video id="course-video" class="embed-responsive-item" controls style="width: 100%; height: auto;">
                    <source id="video-source" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <iframe id="course-pdf" style="width: 100%; height: 100%;" src=""></iframe>
                <iframe id="course-quiz" style="display: none; width: 100%; height: 100%;" src=""></iframe>
                <iframe id="course-fib" style="display: none; width: 100%; height: 100%;" src=""></iframe>
                <iframe id="course-flashcard" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                <iframe id="course-assignment" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                <iframe id="course-matching-game" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                
            </div>
        </div>
    </div>

    <jsp:include page="footer.jsp" />
</body>
</html>
