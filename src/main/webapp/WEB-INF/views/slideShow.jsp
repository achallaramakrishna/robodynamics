<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
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
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>

<meta charset="UTF-8">
<title>Slide Show</title>

<!-- Custom Styles to Make it Kid-Friendly and Fun -->
<style>
body {
	background-color: #f3f4f6;
	font-family: 'Comic Sans MS', cursive, sans-serif; /* Playful font */
}

.container {
	max-width: 800px;
	margin: 20px auto;
	padding: 20px;
	background-color: #fff;
	border-radius: 15px;
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
	animation: fadeIn 1s;
}

@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}
h2 {
	color: #ff6f61; /* Bright red color */
	text-align: center;
	font-size: 28px;
	font-weight: bold;
}

.slide-image {
	display: block;
	margin: 0 auto 20px;
	max-width: 100%;
	border-radius: 10px;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.question {
	background-color: #e3f2fd; /* Light blue for questions */
	padding: 15px;
	border-radius: 10px;
	text-align: center;
	margin-bottom: 20px;
}

p {
	font-size: 18px;
	line-height: 1.5;
	color: #34495e;
}

/* Styling for Correct and Incorrect Feedback */
.correct {
	color: #28a745;
	font-weight: bold;
}

.incorrect {
	color: #e74c3c;
	font-weight: bold;
}

/* Navigation Button Styling */
.nav-buttons {
	text-align: center;
	margin-top: 20px;
}

.nav-buttons button {
	margin: 5px;
	font-size: 18px;
	padding: 10px 20px;
	border-radius: 10px;
}

/* Button Color Styling */
.btn-primary {
	background-color: #3498db;
	border-color: #3498db;
}

.btn-primary:disabled {
	background-color: #bdc3c7;
	border-color: #bdc3c7;
}

.btn-success {
	background-color: #2ecc71;
	border-color: #2ecc71;
	font-size: 20px;
}

   .animated-title {
        font-size: 30px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        color: #FF6347;
        text-align: center;
        text-shadow: 2px 2px #FFD700;
        animation: bounceIn 1s ease-out;
    }

    /* New Fun Paragraph Box Design */
    .fun-paragraph {
        background-color: #f9f871; /* Light yellow background */
        padding: 20px;
        border: 3px solid #ff6f61; /* Bright red border */
        border-radius: 10px;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, background-color 0.2s ease;
        margin-bottom: 20px; /* Spacing below the paragraph */
    }

    .fun-paragraph p {
        font-size: 18px;
        color: #333;
        line-height: 1.6;
        font-family: 'Verdana', sans-serif;
        margin: 0; /* Reset default margins */
        text-align: justify;
    }

    /* Hover Effect for Interactivity */
    .fun-paragraph:hover {
        transform: scale(1.05); /* Slight zoom effect on hover */
        background-color: #ffd54f; /* Darken the background color on hover */
    }

    /* Content Box Style */
    .content-box {
        margin-top: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #f6d365, #fda085); /* Fun gradient background */
        border-radius: 15px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    }
</style>

</head>
<body>
	<div class="container-fluid">
		<h2 class="animated-title">✨ ${slide.title} ✨</h2>

<!-- Slide Container that adapts if image is missing -->
<div class="slide-container" style="display: flex; align-items: center; justify-content: center;">

    <!-- Check if the image URL is not empty -->
    <c:if test="${not empty slide.imageUrl}">
        <!-- Yellow Box Container for the Image if it exists -->
        <div class="image-container" style=" padding: 20px; border-radius: 10px; margin-right: 20px;">
            <img src="${pageContext.request.contextPath}/assets/images/${slide.imageUrl}" alt="Slide Image" class="slide-image" style="width: 100%; max-width: 300px; height: auto; border-radius: 5px;">
        </div>
    </c:if>

    <!-- Slide Content: Takes full width if no image -->
    <div class="content-box" style="<c:if test='${empty slide.imageUrl}'>width: 100%;</c:if> max-width: 600px;">
        <div class="fun-paragraph">
            <p>${slide.content}</p>
        </div>
    </div>

</div>


<c:if test="${not empty fillInBlankQuestions}">
    <form action="${pageContext.request.contextPath}/sessiondetail/submitAnswers" method="post">
        <input type="hidden" name="slideId" value="${slide.slideId}" />
        <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
        <input type="hidden" name="currentSlide" value="${currentSlide}" />

        <!-- Layout questions in 3 columns using Bootstrap's grid system -->
        <div class="row">
            <c:forEach var="question" items="${fillInBlankQuestions}" varStatus="status">
                <div class="col-md-4 mb-4">
                    <div class="question">
                        <label><strong> ${status.index + 1}. ${question.question} </strong></label>
                        <input type="text" class="form-control" name="answers[${question.questionId}]" value="${fn:escapeXml(submittedAnswers[question.questionId])}" />
                        <c:if test="${not empty correctness}">
                            <div class="mt-2">
                                <span class="${correctness[question.questionId] ? 'correct' : 'incorrect'}">
                                    ${correctness[question.questionId] ? 'Correct!' : 'Oops! Incorrect'}
                                </span>
                                <c:if test="${!correctness[question.questionId]}">
                                    <br /><span class="correct">Correct Answer: ${question.answer}</span>
                                </c:if>
                            </div>
                        </c:if>
                    </div>
                </div>
            </c:forEach>
        </div>
        <button type="submit" class="submit-btn btn btn-success">Submit Answers</button>

        <!-- Applause logic -->
        <c:choose>
            <c:when test="${not empty correctness}">
                <c:set var="allCorrect" value="true" />
                <c:forEach var="entry" items="${correctness.entrySet()}">
                    <c:if test="${!entry.value}">
                        <c:set var="allCorrect" value="false" />
                    </c:if>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <c:set var="allCorrect" value="false" />
            </c:otherwise>
        </c:choose>

        <!-- JavaScript for showing modal and playing applause only if allCorrect is true -->
        <c:if test="${allCorrect}">
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    // Show the modal when the form is submitted and all answers are correct
                    $('#congratsModal').modal('show');

                    // Play the applause sound
                    var applauseSound = document.getElementById("applauseAudio");
                    applauseSound.play();

                    // Stop the applause after 5 seconds
                    setTimeout(function () {
                        applauseSound.pause();
                        applauseSound.currentTime = 0;  // Reset the audio to the start
                    }, 5000);

                    // Auto-close the modal after 5 seconds
                    setTimeout(function () {
                        $('#congratsModal').modal('hide');
                    }, 5000);
                });
            </script>
        </c:if>
    </form>
</c:if>

<!-- Modal definition, hidden by default -->
<div class="modal fade" id="congratsModal" tabindex="-1" aria-labelledby="congratsModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="congratsModalLabel">👏 Congratulations! 👏</h5>
            </div>
            <div class="modal-body text-center">
                <h2>You got all the answers correct! 🎉</h2>
                <p>Keep up the great work!</p>
            </div>
        </div>
    </div>
</div>

<!-- Applause sound effect -->
<audio id="applauseAudio" src="${pageContext.request.contextPath}/assets/audios/applause-sound.wav"></audio>


		<!-- Navigation Buttons -->
		<div class="nav-buttons">
			<form
				action="${pageContext.request.contextPath}/sessiondetail/navigate"
				method="post" class="d-inline">
				<input type="hidden" name="currentSlide" value="${currentSlide}" />
				<input type="hidden" name="sessionDetailId"
					value="${sessionDetailId}" />
				<button type="submit" name="direction" value="prev"
					class="btn btn-primary" ${currentSlide == 0 ? 'disabled' : ''}>◀
					Prev</button>
				<button type="submit" name="direction" value="next"
					class="btn btn-primary"
					${currentSlide == slideCount - 1 ? 'disabled' : ''}>Next ▶</button>
			</form>
		</div>
</body>
</html>
