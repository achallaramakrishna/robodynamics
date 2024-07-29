<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>
<title>Take Quiz</title>
<!-- Bootstrap CSS -->
<link
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
	rel="stylesheet">
</head>
<body>
	<div class="container mt-5">
		<h1 class="text-center">Take Quiz</h1>
		<form:form id="quizForm" action="submit" method="post" modelAttribute="quizAnswerForm">
			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title" id="question">${currentQuiz.question}</h5>
					<div class="form-check">
						<form:radiobutton path="userAnswer" value="${currentQuiz.option1}"
							id="option1" cssClass="form-check-input" />
						<label class="form-check-label" for="option1" id="labelOption1">${currentQuiz.option1}</label>
					</div>
					<div class="form-check">
						<form:radiobutton path="userAnswer" value="${currentQuiz.option2}"
							id="option2" cssClass="form-check-input" />
						<label class="form-check-label" for="option2" id="labelOption2">${currentQuiz.option2}</label>
					</div>
					<div class="form-check">
						<form:radiobutton path="userAnswer" value="${currentQuiz.option3}"
							id="option3" cssClass="form-check-input" />
						<label class="form-check-label" for="option3" id="labelOption3">${currentQuiz.option3}</label>
					</div>
					<div class="form-check">
						<form:radiobutton path="userAnswer" value="${currentQuiz.option4}"
							id="option4" cssClass="form-check-input" />
						<label class="form-check-label" for="option4" id="labelOption4">${currentQuiz.option4}</label>
					</div>
				</div>
			</div>

			<div class="d-flex justify-content-between mt-4">
				<button type="button" class="btn btn-secondary"
					onclick="navigateQuiz('prev')">Previous</button>
				<button type="button" class="btn btn-secondary"
					onclick="navigateQuiz('next')">Next</button>
			</div>

			<div class="text-center mt-4">
				<input type="submit" class="btn btn-success btn-lg"
					value="Submit Quiz">
			</div>
		</form:form>
	</div>

	<!-- Bootstrap JS, Popper.js, and jQuery -->
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
	<script
		src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

	<script>
		var currentQuizIndex = 0;
		var quizzes = JSON.parse('${quizzes}');

		function navigateQuiz(direction) {
			if (direction === 'prev') {
				currentQuizIndex = Math.max(0, currentQuizIndex - 1);
			} else if (direction === 'next') {
				currentQuizIndex = Math.min(quizzes.length - 1,
						currentQuizIndex + 1);
			}
			updateQuizView();
		}

		function updateQuizView() {
			var quiz = quizzes[currentQuizIndex];
			document.getElementById('question').textContent = quiz.question;
			document.getElementById('option1').value = quiz.option1;
			document.getElementById('labelOption1').textContent = quiz.option1;
			document.getElementById('option2').value = quiz.option2;
			document.getElementById('labelOption2').textContent = quiz.option2;
			document.getElementById('option3').value = quiz.option3;
			document.getElementById('labelOption3').textContent = quiz.option3;
			document.getElementById('option4').value = quiz.option4;
			document.getElementById('labelOption4').textContent = quiz.option4;

			// Clear previous selections
			var options = document.getElementsByName('answer');
			for (var i = 0; i < options.length; i++) {
				options[i].checked = false;
			}
		}

		document.addEventListener('DOMContentLoaded', function() {
			updateQuizView();
		});
	</script>
</body>
</html>
