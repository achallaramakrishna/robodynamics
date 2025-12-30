<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Course Sessions</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .unit-row {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .action-buttons {
            white-space: nowrap;
        }
    </style>
</head>

<body>

<!-- Header -->
<jsp:include page="/header.jsp" />

<div class="container mt-5">

    <!-- Messages -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success">${successMessage}</div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger">${errorMessage}</div>
    </c:if>

    <!-- Back -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard
    </button>

    <h2 class="mb-4">Manage Course Units and Sessions</h2>

    <!-- ================= FILTER FORM ================= -->
    <form method="get"
          action="${pageContext.request.contextPath}/courseSession/list"
          class="row g-3 mb-4">

        <!-- Course Category -->
        <div class="col-md-4">
            <label class="form-label">Course Category</label>
            <select name="categoryId" class="form-select" onchange="this.form.submit()">
                <option value="">-- All Categories --</option>
                <c:forEach var="cat" items="${categories}">
                    <option value="${cat.courseCategoryId}"
                        <c:if test="${cat.courseCategoryId == selectedCategoryId}">
                            selected
                        </c:if>>
                        ${cat.courseCategoryName}
                    </option>
                </c:forEach>
            </select>
        </div>

        <!-- Course -->
        <div class="col-md-4">
            <label class="form-label">Course</label>
            <select name="courseId" class="form-select" onchange="this.form.submit()">
                <option value="">-- Select Course --</option>
                <c:forEach var="course" items="${courses}">
                    <option value="${course.courseId}"
                        <c:if test="${course.courseId == selectedCourseId}">
                            selected
                        </c:if>>
                        ${course.courseName}
                    </option>
                </c:forEach>
            </select>
        </div>

    </form>

    <!-- ================= ACTION BUTTONS ================= -->
    <c:if test="${selectedCourseId != null && selectedCourseId > 0}">
        <div class="mb-3">
            <a href="${pageContext.request.contextPath}/courseSession/addUnit?courseId=${selectedCourseId}"
               class="btn btn-primary me-2">Add New Unit</a>

            <a href="${pageContext.request.contextPath}/courseSession/addSession?courseId=${selectedCourseId}"
               class="btn btn-success">Add New Session</a>
        </div>

        <!-- JSON Upload -->
        <form action="${pageContext.request.contextPath}/courseSession/uploadJson"
              method="post" enctype="multipart/form-data" class="mb-3">

            <input type="hidden" name="courseId" value="${selectedCourseId}" />

            <label class="form-label">Upload Course Sessions (JSON)</label>
            <input type="file" class="form-control mb-2" name="file" accept=".json" required>

            <button type="submit" class="btn btn-info">Upload JSON</button>
        </form>
    </c:if>

    <!-- ================= SESSION LIST ================= -->
    <c:if test="${selectedCourseId != null && selectedCourseId > 0}">

        <form action="${pageContext.request.contextPath}/courseSession/deleteSelected"
              method="post">

            <input type="hidden" name="courseId" value="${selectedCourseId}" />

            <button type="submit" class="btn btn-danger mb-3"
                    onclick="return confirm('Delete selected sessions?');">
                Delete Selected
            </button>

            <table class="table table-bordered table-striped">
                <thead>
                <tr>
                    <th><input type="checkbox" id="selectAll"></th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Session ID</th>
                    <th>Version</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                <c:forEach var="session" items="${sessions}">
                    <tr class="unit-row">

                        <td>
                            <input type="checkbox" name="selectedIds"
                                   value="${session.courseSessionId}"
                                   class="rowCheck">
                        </td>

                        <td>${session.courseSessionId}</td>
                        <td>${session.sessionTitle}</td>
                        <td>${session.sessionId}</td>
                        <td>${session.version}</td>
                        <td>${session.sessionType}</td>

                        <td>
                            <button class="btn btn-link"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#desc${session.courseSessionId}">
                                View
                            </button>

                            <div class="collapse" id="desc${session.courseSessionId}">
                                <div class="card card-body">
                                    <c:out value="${session.sessionDescription}" escapeXml="false"/>
                                </div>
                            </div>
                        </td>

                        <td class="action-buttons">
                            <a href="editUnit?courseSessionId=${session.courseSessionId}"
                               class="btn btn-warning btn-sm">Edit</a>

                            <a href="delete?courseSessionId=${session.courseSessionId}"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Delete this session?');">
                                Delete
                            </a>
                        </td>
                    </tr>
                </c:forEach>
                </tbody>

            </table>
        </form>

    </c:if>

</div>

<!-- Footer -->
<jsp:include page="/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    document.getElementById("selectAll")?.addEventListener("change", function () {
        document.querySelectorAll(".rowCheck")
            .forEach(cb => cb.checked = this.checked);
    });
</script>

</body>
</html>
