<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<!-- Bootstrap CSS -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
	integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
	crossorigin="anonymous"></script>
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Quiz List</title>
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

        <!-- Quizzes Table -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Quiz Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="quiz" items="${quizzes}">
                    <tr>
                        <td>${quiz.quizName}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/quizzes/edit?quizId=${quiz.quizId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/quizzes/delete?quizId=${quiz.quizId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this quiz?');">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        <!-- Pagination Controls -->
	    <nav aria-label="Page navigation">
	        <ul class="pagination justify-content-center">
	            <c:if test="${currentPage > 0}">
	                <li class="page-item">
	                    <a class="page-link" href="${pageContext.request.contextPath}/quizzes/dashboard?page=${currentPage - 1}&size=${size}">Previous</a>
	                </li>
	            </c:if>
	            <c:forEach begin="0" end="${totalPages - 1}" var="i">
	                <li class="page-item ${currentPage == i ? 'active' : ''}">
	                    <a class="page-link" href="${pageContext.request.contextPath}/quizzes/dashboard?page=${i}&size=${size}">${i + 1}</a>
	                </li>
	            </c:forEach>
	            <c:if test="${currentPage < totalPages - 1}">
	                <li class="page-item">
	                    <a class="page-link" href="${pageContext.request.contextPath}/quizzes/dashboard?page=${currentPage + 1}&size=${size}">Next</a>
	                </li>
	            </c:if>
	        </ul>
	    </nav>
    </div>

    <!-- Include Footer -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
