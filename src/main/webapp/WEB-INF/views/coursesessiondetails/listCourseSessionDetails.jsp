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
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container mt-5">
    <h1>Manage Course Session Details</h1>

    <!-- Display success or error messages -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${successMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${errorMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </c:if>

    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard
    </button>

    <!-- Course filter -->
    <form action="list" method="get">
        <div class="mb-3">
            <label for="courseId" class="form-label">Select Course</label>
            <select class="form-control" id="courseId" name="courseId" onchange="this.form.submit()">
                <option value="">-- Select Course --</option>
                <c:forEach var="course" items="${courses}">
                    <option value="${course.courseId}" ${param.courseId == course.courseId ? 'selected' : ''}>
                        ${course.courseName}
                    </option>
                </c:forEach>
            </select>
        </div>
    </form>

    <!-- Add button -->
    <c:if test="${param.courseId != null && param.courseId != ''}">
        <a href="${pageContext.request.contextPath}/sessiondetail/add?courseId=${param.courseId}"
           class="btn btn-primary mb-3">Add New Session Detail</a>
    </c:if>

    <!-- JSON upload for bulk -->
    <c:if test="${param.courseId != null && param.courseId != ''}">
        <form action="${pageContext.request.contextPath}/sessiondetail/uploadJson"
              method="post" enctype="multipart/form-data" class="mb-4">
            <input type="hidden" name="courseId" value="${param.courseId}" />
            <div class="mb-3">
                <label for="file" class="form-label">Upload Course Session Details (JSON)</label>
                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
            </div>
            <button type="submit" class="btn btn-success">Upload JSON</button>
        </form>
    </c:if>


    <!-- Bulk Delete Form -->
    <c:if test="${not empty courseSessionDetails}">
    <form id="bulkDeleteForm"
          action="${pageContext.request.contextPath}/sessiondetail/deleteSelected"
          method="post">

        <input type="hidden" name="courseId" value="${param.courseId}" />

        <button type="submit" class="btn btn-danger mb-3"
                onclick="return confirm('Delete all selected session details?');">
            Delete Selected
        </button>


        <!-- Table -->
        <table class="table table-striped mt-3">
            <thead>
            <tr>
                <th>
                    <input type="checkbox" id="selectAll">
                </th>
                <th>ID</th>
                <th>Session ID</th>
                <th>Session Detail ID</th>
                <th>Topic</th>
                <th>Type</th>
                <th>File</th>
                <th>Version</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            <c:forEach var="sessionDetail" items="${courseSessionDetails}">
                <tr>

                    <!-- Row Checkbox -->
                    <td>
                        <input type="checkbox" name="selectedIds"
                               value="${sessionDetail.courseSessionDetailId}"
                               class="rowCheck">
                    </td>

                    <td>${sessionDetail.courseSessionDetailId}</td>
                    <td>${sessionDetail.courseSession.sessionId}</td>
                    <td>${sessionDetail.sessionDetailId}</td>
                    <td>${sessionDetail.topic}</td>
                    <td>${sessionDetail.type}</td>

                    <td>
                        <c:choose>
                            <c:when test="${not empty sessionDetail.file}">
                                <a href="${sessionDetail.file}" target="_blank">${sessionDetail.file}</a>
                            </c:when>
                            <c:otherwise>-</c:otherwise>
                        </c:choose>
                    </td>

                    <td>${sessionDetail.version}</td>

                    <td class="d-flex gap-2">

                        <a href="${pageContext.request.contextPath}/sessiondetail/edit?courseSessionDetailId=${sessionDetail.courseSessionDetailId}"
                           class="btn btn-sm btn-warning">Edit</a>

                        <a href="${pageContext.request.contextPath}/sessiondetail/delete?courseSessionDetailId=${sessionDetail.courseSessionDetailId}"
                           class="btn btn-sm btn-danger"
                           onclick="return confirm('Delete this session detail?');">
                            Delete
                        </a>

                        <!-- Per-row file upload -->
                        <form action="${pageContext.request.contextPath}/sessiondetail/uploadFile"
                              method="post" enctype="multipart/form-data" class="d-inline">

                            <input type="hidden" name="courseId" value="${param.courseId}"/>
                            <input type="hidden" name="courseSessionDetailId" value="${sessionDetail.courseSessionDetailId}"/>

                            <input type="file" name="file" class="d-none"
                                   accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.mp4,.zip"
                                   onchange="this.form.submit()"/>

                            <button type="button" class="btn btn-sm btn-info"
                                    onclick="$(this).prev('input[type=file]').click()">
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

<jsp:include page="/footer.jsp" />

<!-- jQuery Select All Script -->
<script>
    // SELECT ALL checkbox
    $('#selectAll').on('change', function () {
        $('.rowCheck').prop('checked', $(this).prop('checked'));
    });

    // Auto adjust Select All when rows change
    $(document).on('change', '.rowCheck', function () {
        if (!$(this).prop('checked')) {
            $('#selectAll').prop('checked', false);
        }
        if ($('.rowCheck:checked').length === $('.rowCheck').length) {
            $('#selectAll').prop('checked', true);
        }
    });
</script>

</body>
</html>
