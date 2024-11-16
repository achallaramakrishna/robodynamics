<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Upload Past Exam Paper</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <!-- Include Header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Upload Past Exam Paper</h1>
        <hr />

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <!-- Display Success Message -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">
                ${message}
            </div>
        </c:if>

        <!-- Display Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">
                ${error}
            </div>
        </c:if>

        <!-- Upload Form for Past Exam Paper JSON -->
        <form id="uploadPastExamPaperForm" method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/uploadPastExamPaper">
            <!-- JSON File Upload Field -->
            <div class="mb-3">
                <label for="jsonFile" class="form-label">Select Past Exam Paper JSON File</label>
                <input type="file" id="jsonFile" name="jsonFile" class="form-control" accept=".json" required />
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary">Upload Exam Paper</button>
        </form>
    </div>

    <!-- Include Footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
