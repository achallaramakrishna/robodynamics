<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet">

<title>Mentor Search</title>

<style>
.section-box {
	border: 1px solid #e3e3e3;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
	padding: 20px;
	margin-bottom: 25px;
}

.section-title {
	font-size: 18px;
	font-weight: bold;
	padding-bottom: 10px;
	border-bottom: 2px solid #e3e3e3;
	margin-bottom: 15px;
}

.mentor-card {
	border-radius: 8px;
	overflow: hidden;
	border: 1px solid #e3e3e3;
}

.mentor-header {
	padding: 12px;
	background: #f8f9fa;
	font-weight: bold;
}

.badge-skill {
	background: #4A90E2;
	color: white;
	padding: 4px 8px;
	font-size: 12px;
	border-radius: 5px;
	margin-right: 4px;
}

.verified-badge {
	background: #28a745;
	color: white;
	font-size: 11px;
	padding: 3px 8px;
	border-radius: 4px;
	margin-left: 5px;
}
</style>
</head>

<body>

	<jsp:include page="/header.jsp" />

	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="col-md-offset-1 col-md-10">

				<br>

				<!-- Back button -->
				<button class="btn btn-secondary"
					onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard</button>

				<br>
				<br>

				<h2 class="fw-bold">Find Mentors</h2>
				<hr />

				<!-- ENQUIRY DETAILS -->
				<div class="section-box">
					<div class="section-title">Enquiry Details</div>

					<!-- Form Starts Here -->
					<form method="get"
						action="${pageContext.request.contextPath}/mentors/search">

						<!-- Hidden Fields to Maintain Pagination -->
						<input type="hidden" name="page" value="1" /> <input
							type="hidden" name="size" value="12" />

						<div class="mb-3">
							<label class="form-label fw-bold">Paste enquiry or notes
								(optional)</label>
							<textarea name="enquiryText" class="form-control" rows="3"
								placeholder="Example: Grade 7 CBSE · Math & Science · Female mentor preferred · Budget ₹3000 · Evening 6pm">${criteria.enquiryText}</textarea>
						</div>

						<!-- SEARCH FILTERS -->
						<div class="section-box">
							<div class="section-title">Search Filters</div>

							<div class="row g-3">

								<!-- Skill (MULTI SELECT) -->
								<div class="col-md-4">
									<label class="form-label">Subject / Skill</label> <select
										name="skillCodes" class="form-control" multiple size="6">
										<c:forEach var="s" items="${skills}">
											<option value="${s.code}"
												<c:if test="${criteria.skillCodes != null && criteria.skillCodes.contains(s.code)}">
                    selected
                </c:if>>
												${s.label}</option>
										</c:forEach>
									</select> <small class="text-muted">Hold CTRL to select multiple</small>
								</div>

								<!-- Grade (MULTI SELECT) -->
								<div class="col-md-3">
									<label class="form-label">Grade</label> <select name="grades"
										class="form-control" multiple size="6">
										<c:forEach begin="1" end="12" var="g">
											<option value="${g}"
												<c:if test="${criteria.grades != null && criteria.grades.contains(g)}">
                    selected
                </c:if>>
												${g}</option>
										</c:forEach>
									</select> <small class="text-muted">Select one or many grades</small>
								</div>

								<!-- Board (Single Select for now) -->
								<div class="col-md-3">
									<label class="form-label">Board</label> <select name="board"
										class="form-control">
										<option value="">-- Any --</option>
										<c:forEach var="b" items="${boards}">
											<option value="${b.label}"
												<c:if test="${criteria.board == b.label}">selected</c:if>>
												${b.label}</option>
										</c:forEach>
									</select>
								</div>

								<!-- Gender -->
								<div class="col-md-3">
									<label class="form-label">Gender Preference</label> <select
										name="gender" class="form-control">
										<option value="">-- Any --</option>
										<option value="Female"
											<c:if test="${criteria.gender == 'Female'}">selected</c:if>>Female</option>
										<option value="Male"
											<c:if test="${criteria.gender == 'Male'}">selected</c:if>>Male</option>
									</select>
								</div>

								<!-- Mode -->
								<div class="col-md-3">
									<label class="form-label">Mode</label> <select name="mode"
										class="form-control">
										<option value="">-- Any --</option>
										<option value="Online"
											<c:if test="${criteria.mode == 'Online'}">selected</c:if>>Online</option>
										<option value="Offline"
											<c:if test="${criteria.mode == 'Offline'}">selected</c:if>>Offline</option>
										<option value="Hybrid"
											<c:if test="${criteria.mode == 'Hybrid'}">selected</c:if>>Hybrid</option>
									</select>
								</div>

								<!-- Verified -->
								<div class="col-md-3">
									<label class="form-label">Verified Only</label><br> <input
										type="checkbox" name="verifiedOnly" value="true"
										<c:if test="${criteria.verifiedOnly}">checked</c:if>>
									Show only verified mentors
								</div>

								<!-- City -->
								<div class="col-md-3">
									<label class="form-label">City</label> <input type="text"
										name="city" class="form-control" value="${criteria.city}">
								</div>

								<!-- Search Button -->
								<div class="col-md-3 d-flex align-items-end">
									<button type="submit" class="btn btn-primary w-100">Search
										Mentors</button>
								</div>


							</div>
						</div>
					</form>
				</div>

				<!-- RESULTS -->
				<h3 class="fw-bold mt-4">Results</h3>
				<hr />

				<div class="row">

					<c:forEach var="m" items="${mentors}">
						<div class="col-md-4 mb-3">
							<div class="mentor-card h-100">

								<div class="mentor-header d-flex justify-content-between">
									<span>${m.fullName}</span>
									<c:if test="${m.isVerified}">
										<span class="verified-badge">✔ Verified</span>
									</c:if>
								</div>

								<div class="card-body">

									<!-- Photo + Headline -->
									<div class="d-flex align-items-center mb-2">
										<c:if test="${not empty m.photoUrl}">
											<img src="${m.photoUrl}" class="rounded-circle me-2"
												style="width: 55px; height: 55px; object-fit: cover;">
										</c:if>

										<div>
											<small class="text-muted">${m.headline}</small><br> <small>${m.city}</small>
										</div>
									</div>

									<!-- Skills -->
									<p>
										<strong>Skills:</strong><br>
										<c:forEach var="s" items="${m.skills}">
											<span class="badge-skill">${s.skillLabel}</span>
										</c:forEach>
									</p>

									<p>
										<strong>Experience:</strong> ${m.experienceYears} yrs
									</p>

									<!-- Action -->
									<a
										href="${pageContext.request.contextPath}/mentors/view/${m.mentorId}"
										class="btn btn-outline-primary btn-sm">View Profile</a>

									<button class="btn btn-sm btn-success mt-1"
										onclick="copyToClipboard('${m.fullName} | ${m.mobile} | ${m.city}')">
										Copy to WhatsApp</button>

								</div>
							</div>
						</div>
					</c:forEach>

					<!-- No Results -->
					<c:if test="${empty mentors}">
						<div class="col-12">
							<div class="alert alert-info">No mentors found. Try
								different filters.</div>
						</div>
					</c:if>
				</div>

				<!-- PAGINATION -->
				<c:if test="${totalPages > 1}">
					<nav aria-label="Page navigation example" class="mt-4">
						<ul class="pagination justify-content-center">

							<!-- Previous -->
							<c:if test="${currentPage > 1}">
								<li class="page-item"><a class="page-link"
									href="?page=${currentPage - 1}&size=${pageSize}&${criteria.queryString}">
										Previous </a></li>
							</c:if>

							<!-- Page Numbers -->
							<c:forEach var="p" begin="1" end="${totalPages}">
								<li class="page-item ${p == currentPage ? 'active' : ''}">
									<a class="page-link"
									href="?page=${p}&size=${pageSize}&${criteria.queryString}">
										${p} </a>
								</li>
							</c:forEach>

							<!-- Next -->
							<c:if test="${currentPage < totalPages}">
								<li class="page-item"><a class="page-link"
									href="?page=${currentPage + 1}&size=${pageSize}&${criteria.queryString}">
										Next </a></li>
							</c:if>

						</ul>
					</nav>
				</c:if>

			</div>
		</div>
	</div>

	<script>
		function copyToClipboard(text) {
			navigator.clipboard.writeText(text);
			alert("Copied to clipboard!");
		}
	</script>

	<jsp:include page="/footer.jsp" />

</body>
</html>
