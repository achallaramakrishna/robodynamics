<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html lang="en">
<head>
<%@ page isELIgnored="false"%>

    <meta charset="ISO-8859-1">
    <title>Robo Dynamics - Quiz Dashboard</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

    <!-- Include Header -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Quiz Dashboard</h1>
        
                <!-- Create Quiz Button -->
        <div class="row mb-4">
            <div class="col-md-12 text-right">
                <a href="${pageContext.request.contextPath}/quizzes/create" class="btn btn-success">Create Quiz</a>
            </div>
        </div>

        <!-- Filter Section -->
        <form:form method="get" action="/quizzes/dashboard" modelAttribute="quizDashboardForm" cssClass="row mb-3">
            <div class="col-md-4">
                <label for="courseFilter" class="form-label">Filter by Course</label>
                <form:select path="courseId" cssClass="form-control">
                    <option value="">All Courses</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}" ${course.courseId == quizDashboardForm.courseId ? 'selected' : ''}>${course.courseName}</option>
                    </c:forEach>
                </form:select>
            </div>
            <div class="col-md-4">
                <label for="statusFilter" class="form-label">Filter by Status</label>
                <form:select path="status" cssClass="form-control">
                    <option value="">All Statuses</option>
                    <option value="published" ${'published' == quizDashboardForm.status ? 'selected' : ''}>Published</option>
                    <option value="archived" ${'archived' == quizDashboardForm.status ? 'selected' : ''}>Archived</option>
                </form:select>
            </div>
            <div class="col-md-4">
                <label for="difficultyFilter" class="form-label">Filter by Difficulty</label>
                <form:select path="difficultyLevel" cssClass="form-control">
                    <option value="">All Difficulty Levels</option>
                    <c:forEach var="difficulty" items="${difficultyLevels}">
                        <option value="${difficulty}" ${difficulty == quizDashboardForm.difficultyLevel ? 'selected' : ''}>${difficulty}</option>
                    </c:forEach>
                </form:select>
            </div>
            <div class="col-md-12 mt-3">
                <button type="submit" class="btn btn-primary">Apply Filters</button>
            </div>
        </form:form>

        <!-- Quizzes Table -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Quiz Name</th>
                    <th>Course</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
		<tbody>
		    <c:forEach var="quiz" items="${quizzes}">
		        <tr>
		            <td>${quiz.quizName}</td>
		
		            <!-- Access the course name from the first mapped question's courseSessionDetail -->
		            <td>
		                <c:choose>
		                    <c:when test="${not empty quizQuestionMaps[quiz.quizId]}">
		                        <c:set var="questionMaps" value="${quizQuestionMaps[quiz.quizId]}" />
		                        ${questionMaps[0].question.courseSessionDetail.session.course.courseName}
		                    </c:when>
		                    <c:otherwise>
		                        No course available
		                    </c:otherwise>
		                </c:choose>
		            </td>
		
		            <td>${quiz.difficultyLevel}</td>
		            <td>${quiz.status}</td>
		
		            <td>
		                <a href="/quizzes/view?quizId=${quiz.quizId}" class="btn btn-info btn-sm">View</a>
		                <a href="/quizzes/edit?quizId=${quiz.quizId}" class="btn btn-warning btn-sm">Edit</a>
		                <a href="/quizzes/toggleStatus?quizId=${quiz.quizId}" class="btn btn-secondary btn-sm">
		                    ${quiz.status == 'published' ? 'Archive' : 'Publish'}
		                </a>
		                <a href="/quizzes/delete?quizId=${quiz.quizId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this quiz?');">Delete</a>
		            </td>
		        </tr>
		    </c:forEach>
		</tbody>


        </table>
    </div>

    <!-- Include Footer -->
    <jsp:include page="/footer.jsp" />

</body>
</html>
