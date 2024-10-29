<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta charset="UTF-8">
    <title>Upload Questions with Selection</title>
</head>
<body>
    <!-- Include Header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Upload Questions with Selection</h1>
        <hr />

		<!-- Back to Dashboard Button -->
		<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
			Back to Dashboard
		</button>
		<br><br>

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

        <!-- Course, Session, Session Detail, and Association Type Dropdowns -->
        <form id="uploadJsonForm" method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/quizquestions/uploadJson">
            <div class="form-group mb-3">
                <label for="course">Select Course</label>
                <select id="course" name="courseId" class="form-control" required>
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-group mb-3">
                <label for="session">Select Session</label>
                <select id="session" name="sessionId" class="form-control" disabled required>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <div class="form-group mb-3">
                <label for="sessionDetail">Select Session Detail</label>
                <select id="sessionDetail" name="sessionDetailId" class="form-control" disabled required>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>

            <div class="form-group mb-3">
                <label for="associationType">Choose Association Type</label>
                <select id="associationType" name="associationType" class="form-control" required>
                    <option value="">-- Select Association Type --</option>
                    <option value="slide">Slide</option>
                    <option value="quiz">Quiz</option>
                </select>
            </div>

            <div class="form-group mb-3" id="quizSelection" style="display: none;">
                <label for="quiz">Select Quiz</label>
                <select id="quiz" name="quizId" class="form-control">
                    <option value="">-- Select Quiz --</option>
                    <c:forEach var="quiz" items="${quizzes}">
                        <option value="${quiz.quizId}">${quiz.quizName}</option>
                    </c:forEach>
                </select>
            </div>

            <!-- Upload JSON Form -->
            <div class="form-group mb-3">
                <label for="jsonFile" class="form-label">Upload JSON File</label>
                <input type="file" id="jsonFile" name="file" class="form-control" accept=".json" required />
            	<input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
            	
            </div>

            <button type="submit" class="btn btn-primary">Upload Questions</button>
        </form>

        <br />
        <div id="response" class="alert" style="display:none;"></div>

        <!-- Questions Table -->
        <h4 class="mt-5">All Questions</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Question ID</th>
                    <th>Question Text</th>
                    <th>Type</th>
                    <th>Difficulty Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="question" items="${questions}">
                    <tr>
                        <td>${question.questionId}</td>
                        <td>${question.questionText}</td>
                        <td>${question.questionType}</td>
                        <td>${question.difficultyLevel}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/questions/edit?questionId=${question.questionId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/questions/delete?questionId=${question.questionId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this question?');">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <c:if test="${currentPage > 0}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage - 1}&size=${size}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                </c:if>

                <c:forEach var="i" begin="0" end="${totalPages - 1}">
                    <li class="page-item ${i == currentPage ? 'active' : ''}">
                        <a class="page-link" href="?page=${i}&size=${size}">${i + 1}</a>
                    </li>
                </c:forEach>

                <c:if test="${currentPage < totalPages - 1}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage + 1}&size=${size}" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </c:if>
            </ul>
        </nav>

    </div>

    <!-- Include Footer JSP -->
    <jsp:include page="/footer.jsp" />

    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            $('#course').change(function () {
                let courseId = $(this).val();
                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/quizquestions/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let sessionId = $(this).val();
                if (sessionId) {
                    $.getJSON('${pageContext.request.contextPath}/quizquestions/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#uploadJsonForm').hide();
                }
            });

            // Set the hidden courseSessionDetailId field when Session Detail is selected
            $('#sessionDetail').change(function () {
                let sessionDetailId = $(this).val();
                if (sessionDetailId) {
                    $('#courseSessionDetailId').val(sessionDetailId);
                }
            });

            // Show/Hide Quiz selection based on Association Type
            $('#associationType').change(function () {
                let selectedType = $(this).val();
                if (selectedType === 'quiz') {
                    $('#quizSelection').show();
                } else {
                    $('#quizSelection').hide();
                }
            });
        });
    </script>
</body>
</html>
