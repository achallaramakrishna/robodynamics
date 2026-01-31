<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

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

	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="col-md-offset-1 col-md-10">
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary mt-3" onclick="window.location.href='${pageContext.request.contextPath}/studentDashboard';">
					Back to Dashboard
				</button>
				<br><br>
				<h2 class="mt-4">Available Quizzes</h2>
				<hr />

				<table class="table table-bordered mt-3">
					<thead>
						<tr>
							<th>Quiz Name</th>
							<th>Difficulty Level</th>
							<th>Quiz Type</th>
							<th>Time Limit (Seconds)</th>
							<th>Take Quiz</th>
						</tr>
					</thead>
					<tbody>
						
						<c:forEach var="quiz" items="${quizzes}">
							<tr>
								<td>${quiz.quizName}</td>
								<td>${quiz.difficultyLevel}</td>
								<td>${quiz.quizType}</td>
								<td>${quiz.timeLimitSeconds}</td>
								<td class="d-flex gap-2">
								    <a href="${pageContext.request.contextPath}/quizzes/start/${quiz.quizId}"
								       class="btn btn-primary btn-sm">
								        Start
								    </a>
								
								    <button type="button"
								            class="btn btn-outline-secondary btn-sm"
								            onclick="copyQuizLink('${pageContext.request.contextPath}/quizzes/start/${quiz.quizId}')">
								        📋 Copy Link
								    </button>
								</td>

							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
	</div>

<script>
function copyQuizLink(relativeUrl) {

    const fullUrl = window.location.origin + relativeUrl;

    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Quiz link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Quiz link copied to clipboard!');
        } catch (err) {
            alert('Failed to copy link');
        }

        document.body.removeChild(textArea);
    }
}
</script>

</body>
</html>
