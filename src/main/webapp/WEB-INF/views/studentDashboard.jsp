<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

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

<title>Student Dashboard</title>
</head>
<body>

	<!-- Include header JSP -->
	<jsp:include page="header.jsp" />

	<div class="container-fluid mt-4">
		<div class="row">
			<!-- View Courses Card -->
			<div class="col-12 col-md-6 mb-4">
				<div class="card shadow-sm">
					<div class="card-body text-center">
						<h5 class="card-title">View Courses</h5>
						<p class="card-text">Browse and view your enrolled courses.</p>
						<a href="${pageContext.request.contextPath}/enrollment/listbystudent" class="btn btn-primary">
							View Courses
						</a>
					</div>
				</div>
			</div>

			<!-- Take Quizzes Card -->
			<div class="col-12 col-md-6 mb-4">
				<div class="card shadow-sm">
					<div class="card-body text-center">
						<h5 class="card-title">Take Quizzes</h5>
						<p class="card-text">Challenge yourself with quizzes.</p>
						<a href="${pageContext.request.contextPath}/quizzes" class="btn btn-primary">
							Take Quizzes
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Achievements Section -->
		<div class="row">
			<!-- Quizzes Taken Card -->
			<div class="col-12 col-md-4 mb-4">
				<div class="card text-white bg-info shadow-sm">
					<div class="card-body text-center">
						<h5 class="card-title"><i class="bi bi-pencil-square"></i> Quizzes Taken</h5>
						<p class="display-4">${totalQuizzes}</p>
					</div>
				</div>
			</div>

			<!-- Total Points Scored Card -->
			<div class="col-12 col-md-4 mb-4">
				<div class="card text-white bg-success shadow-sm">
					<div class="card-body text-center">
						<h5 class="card-title"><i class="bi bi-trophy-fill"></i> Total Points</h5>
						<p class="display-4">${totalPoints}</p>
					</div>
				</div>
			</div>

			<!-- Badges Earned Card -->
			<div class="col-12 col-md-4 mb-4">
				<div class="card text-white bg-warning shadow-sm">
					<div class="card-body text-center">
						<h5 class="card-title"><i class="bi bi-award-fill"></i> Badges Earned</h5>
						<ul class="list-group list-group-flush text-dark">
							<c:forEach var="badge" items="${badges}">
								<li class="list-group-item text-center">${badge.badgeName}</li>
							</c:forEach>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Quiz Results Section -->
		<div class="row mt-4">
			<div class="col-12">
				<h3>My Quiz Results</h3>
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th>Quiz Name</th>
							<th>Score</th>
							<th>Passed</th>
							<th>Completion Date</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="result" items="${quizResults}">
							<tr>
								<td>${result.quiz.quizName}</td>
								<td>${result.score}</td>
								<td><c:out value="${result.passed ? 'Yes' : 'No'}" /></td>
								<td>${result.completedAt}</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Include footer JSP -->
	<jsp:include page="footer.jsp" />

</body>
</html>
