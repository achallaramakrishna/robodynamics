<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Manage Competitions</title>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet" />

<style>
.action-buttons {
	white-space: nowrap;
}
</style>
</head>
<body>

	<!-- Header -->
	<jsp:include page="/header.jsp" />

	<div class="container mt-4">

		<!-- Flash Messages -->
		<c:if test="${not empty successMessage}">
			<div class="alert alert-success alert-dismissible fade show">
				${successMessage}
				<button class="btn-close" data-bs-dismiss="alert"></button>
			</div>
		</c:if>

		<c:if test="${not empty errorMessage}">
			<div class="alert alert-danger alert-dismissible fade show">
				${errorMessage}
				<button class="btn-close" data-bs-dismiss="alert"></button>
			</div>
		</c:if>

		<!-- Back Button -->
		<button class="btn btn-secondary mb-3"
			onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
			Back to Dashboard</button>

		<h1 class="mb-4">Manage Competitions</h1>

		<!-- Add New Competition -->
		<div class="mb-3">
			<a
				href="${pageContext.request.contextPath}/admin/competitions/create"
				class="btn btn-primary">+ Create New Competition</a>
		</div>

		<!-- Competitions Table -->
		<table class="table table-striped table-bordered">
			<thead>
				<tr class="table-dark">
					<th>ID</th>
					<th>Title</th>
					<th>Category</th>

					<!-- ⭐ NEW: Fee -->
					<th>Fee</th>

					<th>Mode</th>
					<th>Event Date</th>
					<th>Grade Group</th>

					<th>Reg. Start</th>
					<th>Reg. End</th>

					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				<c:forEach var="c" items="${competitions}">
					<tr>
						<td>${c.competitionId}</td>
						<td>${c.title}</td>
						<td>${c.category}</td>

						<!-- ⭐ NEW: Fee Display -->
						<td>₹${c.fee}</td>

						<td>${c.mode}</td>

						<td><fmt:formatDate value="${c.date}" pattern="dd MMM yyyy" />
						</td>

						<td>${c.gradeGroup}</td>

						<td><fmt:formatDate value="${c.registrationStartDate}"
								pattern="dd MMM yyyy" /></td>

						<td><fmt:formatDate value="${c.registrationEndDate}"
								pattern="dd MMM yyyy" /></td>

						<td>${c.status}</td>

						<td class="action-buttons"><a
							href="${pageContext.request.contextPath}/admin/competitions/edit?id=${c.competitionId}"
							class="btn btn-warning btn-sm">Edit</a> <a
							href="${pageContext.request.contextPath}/admin/competitions/rounds?competitionId=${c.competitionId}"
							class="btn btn-info btn-sm">Rounds</a> <a
							href="${pageContext.request.contextPath}/admin/competitions/registrations?id=${c.competitionId}"
							class="btn btn-success btn-sm">Registrations</a> <a
							href="${pageContext.request.contextPath}/admin/competitions/results?competitionId=${c.competitionId}"
							class="btn btn-primary btn-sm">Results</a></td>
					</tr>
				</c:forEach>
			</tbody>


		</table>
	</div>

	<!-- Footer -->
	<jsp:include page="/WEB-INF/views/footer.jsp" />

	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
