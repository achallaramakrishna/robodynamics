<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Course Session Details</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-5">
    <h1 class="mb-4">Manage Course Session Details</h1>

    <!-- Alerts -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success">${successMessage}</div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger">${errorMessage}</div>
    </c:if>

    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard
    </button>

    <!-- ================= FILTERS ================= -->
    <form method="get"
          action="${pageContext.request.contextPath}/sessiondetail/list"
          class="row mb-4">

        <!-- Course Category -->
        <div class="col-md-4">
            <label class="form-label">Course Category</label>
            <select name="categoryId"
                    class="form-select"
                    onchange="this.form.submit()">
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
            <select name="courseId"
                    class="form-select"
                    onchange="this.form.submit()">
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

    <!-- ================= ACTIONS ================= -->
    <c:if test="${selectedCourseId != null && selectedCourseId > 0}">

        <a href="${pageContext.request.contextPath}/sessiondetail/add?courseId=${selectedCourseId}"
           class="btn btn-primary mb-3">
            Add New Session Detail
        </a>

        <!-- JSON Upload -->
        <form action="${pageContext.request.contextPath}/sessiondetail/uploadJson"
              method="post"
              enctype="multipart/form-data"
              class="mb-4">

            <input type="hidden" name="courseId" value="${selectedCourseId}" />

            <label class="form-label">Upload Course Session Details (JSON)</label>
            <input type="file" class="form-control mb-2" name="file" accept=".json" required>

            <button type="submit" class="btn btn-success">Upload JSON</button>
        </form>

    </c:if>

    <!-- ================= TABLE ================= -->
    <c:if test="${not empty courseSessionDetails}">

        <form action="${pageContext.request.contextPath}/sessiondetail/deleteSelected"
              method="post">

            <input type="hidden" name="courseId" value="${selectedCourseId}" />

            <button type="submit"
                    class="btn btn-danger mb-3"
                    onclick="return confirm('Delete selected session details?');">
                Delete Selected
            </button>

            <table class="table table-striped table-bordered">
                <thead>
                <tr>
                    <th><input type="checkbox" id="selectAll"></th>
                    <th>ID</th>
                    <th>Session ID</th>
                    <th>Detail ID</th>
                    <th>Topic</th>
                    <th>Type</th>
                    <th>Assignment</th>
                    <th>File</th>
                    <th>Version</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                <c:forEach var="d" items="${courseSessionDetails}">
                    <tr>

                        <td>
                            <input type="checkbox"
                                   class="rowCheck"
                                   name="selectedIds"
                                   value="${d.courseSessionDetailId}">
                        </td>

                        <td>${d.courseSessionDetailId}</td>
                        <td>${d.courseSession.sessionId}</td>
                        <td>${d.sessionDetailId}</td>
                        <td>${d.topic}</td>
                        <td>${d.type}</td>

                        <td>
                            <c:choose>
                                <c:when test="${d.assignment}">Yes</c:when>
                                <c:otherwise>No</c:otherwise>
                            </c:choose>
                        </td>

                        <td>
                            <c:choose>
                                <c:when test="${not empty d.file}">
                                    <a href="${d.file}" target="_blank">View</a>
                                </c:when>
                                <c:otherwise>-</c:otherwise>
                            </c:choose>
                        </td>

                        <td>${d.version}</td>

                        <td class="d-flex gap-2">

                            <a href="${pageContext.request.contextPath}/sessiondetail/edit?courseSessionDetailId=${d.courseSessionDetailId}"
                               class="btn btn-warning btn-sm">Edit</a>

                            <a href="${pageContext.request.contextPath}/sessiondetail/delete?courseSessionDetailId=${d.courseSessionDetailId}"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Delete this session detail?');">
                                Delete
                            </a>

                            <!-- File Upload -->
                            <form action="${pageContext.request.contextPath}/sessiondetail/uploadFile"
                                  method="post"
                                  enctype="multipart/form-data"
                                  class="d-inline">

                                <input type="hidden" name="courseId" value="${selectedCourseId}">
                                <input type="hidden" name="courseSessionDetailId" value="${d.courseSessionDetailId}">

                                <input type="file"
                                       name="file"
                                       class="d-none"
                                       accept=".pdf,.doc,.ppt,.png,.jpg,.mp4,.zip"
                                       onchange="this.form.submit()">

                                <button type="button"
                                        class="btn btn-info btn-sm"
                                        onclick="$(this).prev('input').click()">
                                    Upload
                                </button>
                            </form>

                        </td>
                    </tr>
                </c:forEach>
                </tbody>

            </table>
        </form>

    </c:if>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<script>
    $('#selectAll').on('change', function () {
        $('.rowCheck').prop('checked', this.checked);
    });
</script>

</body>
</html>
