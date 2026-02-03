a<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <title>Exam Papers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>


<div class="container mt-4">

    <!-- BACK -->
    <a href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}"
       class="btn btn-outline-secondary mb-3">
        ← Back to Session Dashboard
    </a>

    <h3 class="fw-bold">${session.sessionTitle} – Exam Papers</h3>
    <p class="text-muted">Select an exam paper to attempt</p>

    <c:if test="${empty examPapers}">
        <div class="alert alert-info">
            No exam papers available for this session.
        </div>
    </c:if>

    <c:if test="${not empty examPapers}">
        <table class="table table-hover align-middle shadow-sm mt-3">
    <thead class="table-light">
        <tr>
            <th style="width:5%">#</th>
            <th>Exam Title</th>
            <th style="width:15%">Duration</th>
            <th style="width:15%">Total Marks</th>
            <th style="width:30%" class="text-center">Actions</th>
        </tr>
    </thead>

    <tbody>
        <c:forEach var="paper" items="${examPapers}" varStatus="status">
            <tr>
                <td>${status.index + 1}</td>

                <td class="fw-semibold">
                    ${paper.title}
                </td>

                <td>
                    <span class="badge bg-secondary">
                        ${paper.durationMinutes} mins
                    </span>
                </td>

                <td>
                    <span class="badge bg-info text-dark">
                        ${paper.totalMarks}
                    </span>
                </td>

				<td class="text-center">
				    <div class="d-flex flex-column align-items-center gap-2">
				
				        <!-- View Exam Paper -->
				        <a href="${ctx}/exam/view?examPaperId=${paper.examPaperId}"
				           class="btn btn-sm btn-primary w-100">
				            View Exam Paper
				        </a>
				
				        <!-- Upload Answer Sheet -->
				        <a href="${ctx}/student/exam/${paper.examPaperId}/upload"
				           class="btn btn-sm btn-success w-100">
				            Upload Answer Sheet
				        </a>
				
				        <!-- View Model Answer -->
				        <a href="${ctx}/exam/model-answer?examPaperId=${paper.examPaperId}"
				           class="btn btn-sm btn-warning text-dark w-100">
				            View Model Answer
				        </a>
				
				    </div>
				</td>
          </tr>
        </c:forEach>
    </tbody>
</table>

    </c:if>

</div>



</body>
</html>
