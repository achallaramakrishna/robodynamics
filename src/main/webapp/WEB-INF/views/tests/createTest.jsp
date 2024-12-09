<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <title>Create New Test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
</head>
<body>
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h2>Create New Test</h2>

        <!-- Test Creation Form -->
        <form:form method="post" action="${pageContext.request.contextPath}/tests/save" modelAttribute="quiz">
            <!-- Test Name -->
            <div class="mb-3">
                <label for="quizName" class="form-label">Test Name</label>
                <form:input path="quizName" class="form-control" id="quizName" required="true" />
            </div>

            <!-- Course -->
            <div class="mb-3">
                <label for="course" class="form-label">Course</label>
                <select id="course" name="courseId" class="form-control" required="true">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>

            <!-- Course Sessions -->
            <div class="mb-3">
                <label for="courseSession" class="form-label">Course Sessions</label>
                <select id="courseSession" name="courseSessionIds" class="form-control" multiple="multiple" required>
                    <option value="">-- Select Sessions --</option>
                </select>
                <small class="text-muted">Hold down Ctrl (Windows) or Command (Mac) to select multiple sessions.</small>
            </div>

            <!-- Difficulty Levels -->
            <div class="mb-3">
                <label for="difficultyLevel" class="form-label">Difficulty Levels</label>
                <select id="difficultyLevel" name="difficultyLevel" class="form-control" multiple="multiple" required>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>

            <!-- Question Types -->
            <div class="mb-3">
                <label for="questionType" class="form-label">Question Types</label>
                <select id="questionType" name="questionType" class="form-control" multiple="multiple" required>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="fill_in_the_blank">Fill in the Blank</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="long_answer">Long Answer</option>
                    <option value="true_false">True/False</option>
                </select>
            </div>

            <!-- Total Questions -->
            <div class="mb-3">
                <label for="totalQuestions" class="form-label">Total Questions</label>
                <input type="number" name="totalQuestions" class="form-control" id="totalQuestions" required="true" />
            </div>

            <!-- Duration -->
            <div class="mb-3">
                <label for="durationMinutes" class="form-label">Duration (Minutes)</label>
                <input type="number" name="durationMinutes" class="form-control" id="durationMinutes" required="true" />
            </div>

            <!-- Submit Button -->
            <div class="d-flex justify-content-start">
                <button type="submit" class="btn btn-primary me-2">Create Test</button>
                <a href="${pageContext.request.contextPath}/tests/list" class="btn btn-secondary">Cancel</a>
            </div>
        </form:form>

        <!-- Tests Created by the User -->
        <div class="mt-5">
            <h3>Your Tests</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Test Name</th>
                        <th>Course</th>
                        <th>Sessions</th>
                        <th>Total Questions</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="quiz" items="${quizzes}">
                        <tr>
                            <td>${quiz.quizId}</td>
                            <td>${quiz.quizName}</td>
                            <td>${quiz.course.courseName}</td>
                            <td>
                                <c:forEach var="session" items="${quiz.courseSessions}">
                                    ${session.sessionTitle}<br>
                                </c:forEach>
                            </td>
                            <td>${quiz.totalQuestions}</td>
                            <td>${quiz.durationMinutes} mins</td>
                            <td>
                                <a href="${testUrls[quiz.quizId]}" class="btn btn-primary btn-sm">View</a>
                                <a href="${pageContext.request.contextPath}/tests/edit?quizId=${quiz.quizId}" class="btn btn-warning btn-sm">Edit</a>
                                <a href="${pageContext.request.contextPath}/tests/delete?quizId=${quiz.quizId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this test?');">Delete</a>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Dynamic loading of Course Sessions based on selected Course
        $('#course').change(function () {
            let courseId = $(this).val();
            $('#courseSession').html('<option value="">-- Select Sessions --</option>'); // Reset the dropdown

            if (courseId) {
                $.getJSON('${pageContext.request.contextPath}/tests/getCourseSessions', { courseId: courseId }, function (data) {
                    let courseSessions = data.courseSessions;
                    let sessionOptions = '';
                    $.each(courseSessions, function (index, session) {
                        sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                    });
                    $('#courseSession').html(sessionOptions).prop('disabled', false);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Error loading sessions:', textStatus, errorThrown);
                });
            }
        });
    </script>
</body>
</html>
