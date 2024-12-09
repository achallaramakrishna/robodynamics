<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test List</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossorigin="anonymous">

    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMQ/nyM1Gp6UN1siT50RV5wAXRXTz1ovYF55Q7" crossorigin="anonymous" />

    <!-- Custom CSS -->
    <style>
        .table th, .table td {
            text-align: center;
        }

        .btn-share {
            background-color: #17a2b8;
            color: white;
        }

        .btn-share:hover {
            background-color: #138496;
        }
    </style>
</head>
<body>

<jsp:include page="/header.jsp" />

<div class="container mt-5">
    <h1 class="text-center mb-4">Created Tests</h1>

    <!-- Success and Error Messages -->
    <c:if test="${not empty success}">
        <div class="alert alert-success">${success}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- Test List Table -->
    <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
                <th>#</th>
                <th>Test Name</th>
                <th>Course</th>
                <th>Session</th>
                <th>Total Questions</th>
                <th>Duration (Minutes)</th>
                <th>Created By</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <script> console.log("Quizzes:", ${tests}); </script>
        
            <c:forEach var="quiz" items="${tests}" varStatus="status">
                <tr>
                    <td>${status.count}</td>
                    <td>${quiz.quizName}</td>
                    <td>${quiz.course.courseName}</td>
                    <td>${quiz.courseSession.sessionTitle}</td>
                    <td>${quiz.totalQuestions}</td>
                    <td>${quiz.durationMinutes}</td>
                    <td>${quiz.createdByUser.firstName} ${test.createdByUser.lastName}</td>
                    <td>
                        <!-- View Test -->
                        <a href="${pageContext.request.contextPath}/tests/view?testId=${quiz.quizId}" class="btn btn-info btn-sm">
                            <i class="fas fa-eye"></i> View
                        </a>

                        <!-- Edit Test -->
                        <a href="${pageContext.request.contextPath}/tests/edit?testId=${quiz.quizId}" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i> Edit
                        </a>

                        <!-- Delete Test -->
                        <a href="${pageContext.request.contextPath}/tests/delete?testId=${quiz.quizId}" class="btn btn-danger btn-sm"
                           onclick="return confirm('Are you sure you want to delete this test?');">
                            <i class="fas fa-trash"></i> Delete
                        </a>

                        <!-- Share Test URL -->
                        <button class="btn btn-share btn-sm" onclick="copyTestUrl('${pageContext.request.contextPath}/quizzes/take?testId=${quiz.quizId}')">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <!-- No Tests Message -->
    <c:if test="${tests == null || tests.isEmpty()}">
        <p class="text-center text-muted">No tests have been created yet.</p>
    </c:if>
</div>

<jsp:include page="/footer.jsp" />

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
        crossorigin="anonymous"></script>

<!-- Copy Test URL Script -->
<script>
    function copyTestUrl(url) {
        navigator.clipboard.writeText(url).then(function () {
            alert("Test URL copied to clipboard: " + url);
        }, function (err) {
            alert("Failed to copy URL: " + err);
        });
    }
</script>

</body>
</html>
