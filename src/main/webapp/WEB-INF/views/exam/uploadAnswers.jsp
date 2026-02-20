<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <title>Upload Answers</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">
<div class="container mt-5">

    <div class="card shadow">
        <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">📤 Upload Exam Answers</h5>
        </div>

        <div class="card-body">

            <!-- ERROR MESSAGE -->
            <c:if test="${not empty error}">
                <div class="alert alert-danger">${error}</div>
            </c:if>

            <!-- ✅ SAFE HTTPS FORM -->
            <form method="post"
                  enctype="multipart/form-data"
                  action="${ctx}/student/exam/${examPaperId}/upload">

                <div class="mb-3">
                    <label class="form-label fw-semibold">
                        Select Answer Files
                    </label>

                    <input type="file"
                           name="files"
                           class="form-control"
                           multiple
                           accept=".pdf,.jpg,.jpeg,.png"
                           required>

                    <small class="text-muted">
                        Upload one PDF or multiple images (JPG / PNG).
                    </small>
                </div>

                <div class="d-flex justify-content-between">
                    <a href="javascript:history.back()"
                       class="btn btn-outline-secondary">
                        Cancel
                    </a>

                    <button type="submit"
                            class="btn btn-warning px-4 fw-semibold">
                        Submit Answers
                    </button>
                </div>

            </form>
        </div>
    </div>

</div>
</body>
</html>
