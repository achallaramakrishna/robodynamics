	<%@ page language="java" contentType="text/html; charset=UTF-8"%>
	<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
	<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
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
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	
	<meta charset="UTF-8">
	<title>Slide Show</title>
	
	<meta charset="UTF-8">
	<title>Slide Show</title>
	
	    <style>
	        body {
	            font-family: 'Comic Sans MS', cursive, sans-serif;
	            margin: 0;
	            padding: 0;
	            background-color: #f1f1f1;
	        }
	
	        .container-fluid {
	            padding: 20px;
	        }
	
	        h2 {
	            text-align: center;
	            color: #ff4500;
	            margin-bottom: 20px;
	            font-weight: bold;
	            font-size: 2.5em;
	            text-shadow: 3px 3px 5px #ffdab9; /* Softer shadow */
	        }
	
	        .slide-container {
	            display: flex;
	            flex-direction: row;
	            align-items: center;
	            width: 100%;
	            max-width: 1200px;
	            margin: 0 auto;
	            background-color: #ffe4e1;
	            border: 3px solid #ff4500;
	            border-radius: 20px;
	            padding: 0;
	            box-shadow: 0px 0px 20px rgba(255, 165, 0, 0.4);
	        }
	
	        .file-container {
	            position: relative;
	            padding-top: 35%;
	            width: 50%;
	            height: 0;
	            margin-right: 20px;
	            background-color: #fdfd96;
	            border-radius: 10px;
	        }
	
	        .file-container iframe,
	        .file-container video {
	            position: absolute;
	            top: 0;
	            left: 0;
	            width: 100%;
	            height: 100%;
	            border-radius: 10px;
	        }
	
	        .content-box {
	            width: 80%;
	            max-width: 900px;
	            text-align: left;
	            background-color: #ffffff;
	            padding: 20px;
	            border-radius: 15px;
	            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	            color: #333;
	            margin: 0 auto;
	        }
	
	        .content-box p {
	            font-size: 18px;
	            color: #4b0082; /* Darker fun color */
	        }
	
	        .submit-btn {
	            width: 100%;
	            margin-top: 20px;
	            background-color: #ff4500;
	            color: white;
	            font-size: 20px;
	            font-weight: bold;
	            transition: background-color 0.3s ease;
	            border-radius: 10px;
	        }
	
	        .submit-btn:hover {
	            background-color: #ff6347;
	        }
	
	        .nav-buttons {
	            display: flex;
	            justify-content: space-between;
	            align-items: center;
	            margin-top: 40px;
	            padding: 10px;
	            background-color: #ffebcd;
	            border-radius: 15px;
	            box-shadow: 0px 0px 10px rgba(255, 69, 0, 0.2);
	        }
	
	        .btn-outline-primary {
	            background-color: #ffa500;
	            color: white;
	            border-color: #ffa500;
	            font-size: 18px;
	            font-weight: bold;
	            border-radius: 10px;
	            transition: background-color 0.3s ease;
	        }
	
	        .btn-outline-primary:hover {
	            background-color: #ff6347;
	        }
	        
	        
	
	        .slide-indicator {
	            color: #ff4500;
	            font-weight: bold;
	            font-size: 18px;
	        }
	        
	                /* Progress bar styling */
	        .progress {
	            height: 30px;
	            background-color: #f3f3f3;
	            border-radius: 10px;
	            margin-bottom: 20px;
	        }
	
	        .progress-bar {
	            background-color: #ff4500;
	            font-size: 16px;
	            font-weight: bold;
	            color: white;
	            line-height: 30px;
	            text-align: center;
	        }
	
	        /* Mobile responsive adjustments */
	        @media (max-width: 768px) {
	            .slide-container {
	                flex-direction: column;
	            }
	
	            .file-container,
	            .content-box {
	                width: 100%;
	                margin: 0 0 20px 0;
	            }
	        }
	        
	           /* Toggle Button Styles */
	    .toggle-btn {
	        display: inline-block;
	        width: 100px;
	        height: 40px;
	        background-color: #ccc;
	        border-radius: 25px;
	        position: relative;
	        cursor: pointer;
	        transition: background-color 0.3s ease;
	    }
	
	    .toggle-btn .slider {
	        position: absolute;
	        top: 5px;
	        left: 5px;
	        width: 30px;
	        height: 30px;
	        background-color: white;
	        border-radius: 50%;
	        transition: transform 0.3s ease;
	    }
	
	    .toggle-btn.active {
	        background-color: #4CAF50;
	    }
	
	    .toggle-btn.active .slider {
	        transform: translateX(60px);
	    }
	
	    .mode-label {
	        display: inline-block;
	        margin-left: 15px;
	        font-size: 1.2em;
	        font-weight: bold;
	        color: #4CAF50;
	    }
	
	    .toggle-container {
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        margin-bottom: 20px;
	    }
	    
	        /* Styling for voice mode question and answer */
    .voice-mode-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        padding: 20px;
        border: 2px solid #ff4500;
        background-color: #ffe4e1;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(255, 69, 0, 0.3);
    }

    .current-question-box, .answer-box {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
        padding: 15px;
        background-color: #fdfd96;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(255, 165, 0, 0.4);
    }

    .current-question-box h4, .answer-box h4 {
        font-weight: bold;
        color: #4CAF50;
    }

    .current-question-box p, .answer-box p {
        font-size: 1.2em;
        color: #333;
    }
	        
	    </style>
	</head>
	
	<body>
		<div class="container-fluid">
			
					<!-- Navigation Buttons at the Top -->
		<div class="nav-buttons">
		    <form action="${pageContext.request.contextPath}/sessiondetail/navigateSlides" method="post" class="d-inline-flex w-100">
		        <input type="hidden" name="currentSlide" value="${currentSlide}" />
		        <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
		        <input type="hidden" name="enrollmentId" value="${enrollmentId}" />

		        <!-- Previous Button -->
		        <button type="submit" name="direction" value="prev" class="btn btn-outline-primary" style="min-width: 120px;"
		            ${currentSlide == 0 ? 'disabled' : ''}>
		            ◀ Prev
		        </button>

		        <!-- Slide Indicator -->
		        <div class="slide-indicator text-center w-100">
		            <span class="badge bg-secondary">Slide ${currentSlide + 1} of ${slideCount}</span>
		        </div>

		        <!-- Next Button -->
		        <button type="submit" name="direction" value="next" class="btn btn-outline-primary" style="min-width: 120px;"
		            ${currentSlide == slideCount - 1 ? 'disabled' : ''}>
		            Next ▶
		        </button>
		    </form>
		</div>
	
			<h2 class="animated-title">✨ ${slide.title} ✨</h2>
	
		<!-- Toggle Button only when there are fill-in-the-blank questions -->
        <c:if test="${not empty fillInBlankQuestions && enableVoiceMode}">
	        <div class="toggle-container">
	            <div class="toggle-btn" id="toggleBtn" onclick="toggleMode()">
	                <div class="slider"></div>
	            </div>
	            <span class="mode-label" id="modeLabel">Text Mode</span>
	        </div>
	    </c:if>
	
			<!-- Progress Bar -->
			<div class="progress">
				<div class="progress-bar bg-success" role="progressbar"
					style="width: ${progress}%" aria-valuenow="${progress}"
					aria-valuemin="0" aria-valuemax="100">${progress}%</div>
			</div>
	
			<div class="slide-container">
				<c:if test="${not empty slide.fileUrl}">
					<c:choose>
						<c:when test="${slide.fileType == 'video'}">
							<div class="file-container">
								<video controls>
									<source
										src="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}"
										type="video/mp4">
									Your browser does not support the video tag.
								</video>
							</div>
						</c:when>
	
						<c:when test="${slide.fileType == 'image'}">
							<div class="file-container">
								<img
									src="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}"
									alt="Slide Image" class="slide-image">
							</div>
						</c:when>
	
						<c:when test="${slide.fileType == 'pdf'}">
							<div class="file-container">
								<a
									href="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}"
									target="_blank" class="btn btn-primary">View PDF</a>
							</div>
						</c:when>
	
						<c:when test="${slide.fileType == 'youtube'}">
							<div class="file-container">
								<iframe src="${slide.fileUrl}" frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen> </iframe>
							</div>
						</c:when>
	
						<c:otherwise>
							<div class="file-container">
								<p>No valid content to display</p>
							</div>
						</c:otherwise>
					</c:choose>
				</c:if>
	
				<div class="content-box">
					<p>${slide.content}</p>
				</div>
			</div>
	
			<div id="text-mode-container" style="display: block;">
				<c:if test="${not empty fillInBlankQuestions}">
					<form
						action="${pageContext.request.contextPath}/sessiondetail/submitAnswers"
						method="post">
						<input type="hidden" name="slideId" value="${slide.slideId}" /> <input
							type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
						<input type="hidden" name="enrollmentId" value="${enrollmentId}" />
						<input type="hidden" name="currentSlide" value="${currentSlide}" />
	
						<%-- 				<!-- Display total points earned and maximum points -->
					<div class="alert alert-success mt-3">
					    You earned <strong>${totalPoints}</strong> out of <strong>${possiblePoints}</strong> points!
					</div> --%>
	
						<div class="row">
							<c:forEach var="question" items="${fillInBlankQuestions}"
								varStatus="status">
								<div class="col-md-4 mb-4">
									<div class="question">
										<label><strong> ${status.index + 1}.
												${question.questionText} </strong></label> <input type="text"
											class="form-control" name="answers[${question.questionId}]"
											value="${fn:escapeXml(submittedAnswers[question.questionId])}" />
										<c:if test="${not empty correctness}">
											<div class="mt-2">
												<span
													class="${correctness[question.questionId] ? 'correct' : 'incorrect'}">
													${correctness[question.questionId] ? 'Correct!' : 'Oops! Incorrect'}
												</span>
												                                         <c:if test="${!correctness[question.questionId]}">
	                                            <br /><span class="correct">Correct Answer: ${question.correctAnswer}</span>
	                                        </c:if> 
											</div>
										</c:if>
									</div>
								</div>
							</c:forEach>
						</div>
						<button type="submit" class="submit-btn btn">Submit
							Answers</button>
	
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
	
						<c:if test="${allCorrect}">
							<script>
	                        document.addEventListener("DOMContentLoaded", function () {
	                        	var $jq = jQuery.noConflict();
	                        	$jq('#congratsModal').modal('show');
	                            var applauseSound = document.getElementById("applauseAudio");
	                            applauseSound.play();
	                            setTimeout(function () {
	                                applauseSound.pause();
	                                applauseSound.currentTime = 0;
	                            }, 5000);
	                        });
	                    </script>
						</c:if>
					</form>
				</c:if>
			</div>

		<!-- Voice Mode (One question at a time) -->
		<c:if test="${enableVoiceMode}">

			<div id="voice-mode-container" style="display: none;">
				<div id="voice-question-area" class="voice-mode-content">
					<!-- Display the current question -->
					<div id="current-question" class="current-question-box">
						<h4>Current Question:</h4>
						<p id="questionText">Press Start Voice Mode to begin.</p>
					</div>

					<!-- Button to start voice mode -->
					<button class="btn btn-primary" onclick="startVoiceQuestion()">Start
						Voice Mode</button>

					<!-- Display the spoken answer -->
					<div id="spoken-answer" class="answer-box" style="display: none;">
						<h4>Your Answer:</h4>
						<p id="answerText">Waiting for your answer...</p>
					</div>
				</div>
			</div>
		</c:if>


	</div>
	
		<div class="modal fade" id="congratsModal" tabindex="-1" aria-labelledby="congratsModalLabel" aria-hidden="true">
	            <div class="modal-dialog modal-dialog-centered">
	                <div class="modal-content">
	                    <div class="modal-header">
	                        <h5 class="modal-title" id="congratsModalLabel">👏 Congratulations! 👏</h5>
	                    </div>
	                    <div class="modal-body text-center">
	                        <h2>You got all the answers correct! 🎉</h2>
					    You earned <strong>${pointsEarned}</strong> out of <strong>${totalPoints}</strong> points!
	                        <p>Keep up the great work!</p>
	                    </div>
	                </div>
	            </div>
	        </div>
	
	        <audio id="applauseAudio" src="${pageContext.request.contextPath}/assets/audios/applause-sound.wav" preload="auto"></audio>
	
	        <div class="nav-buttons">
	            <form action="${pageContext.request.contextPath}/sessiondetail/navigateSlides" method="post" class="d-inline-flex w-100">
	                <input type="hidden" name="currentSlide" value="${currentSlide}" />
	                <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
	                <input type="hidden" name="enrollmentId" value="${enrollmentId}" />
	
	                <!-- Previous Button -->
	                <button type="submit" name="direction" value="prev" class="btn btn-outline-primary" style="min-width: 120px;"
	                    ${currentSlide == 0 ? 'disabled' : ''}>
	                    ◀ Prev
	                </button>
	
	                <!-- Slide Indicator -->
	                <div class="slide-indicator text-center w-100">
	                    <span class="badge bg-secondary">Slide ${currentSlide + 1} of ${slideCount}</span>
	                </div>
	
	                <!-- Next Button -->
	                <button type="submit" name="direction" value="next" class="btn btn-outline-primary" style="min-width: 120px;"
	                    ${currentSlide == slideCount - 1 ? 'disabled' : ''}>
	                    Next ▶
	                </button>
	            </form>
	        </div>
	
		<script>
	
		  document.addEventListener("DOMContentLoaded", function () {
			  
			    document.addEventListener("keydown", function (event) {
		            // Check which key is pressed
		            if (event.key === "ArrowLeft") {
		                // Navigate to the previous slide if available
		                navigateSlide('prev');
		            } else if (event.key === "ArrowRight") {
		                // Navigate to the next slide if available
		                navigateSlide('next');
		            }
		        });

		        // Function to handle slide navigation
		        function navigateSlide(direction) {
		            // Create a form and post it to trigger slide navigation
		            const form = document.createElement('form');
		            form.method = 'POST';
		            form.action = `${pageContext.request.contextPath}/sessiondetail/navigateSlides`;

		            // Add required hidden input fields
		            const currentSlideInput = document.createElement('input');
		            currentSlideInput.type = 'hidden';
		            currentSlideInput.name = 'currentSlide';
		            currentSlideInput.value = parseInt(${currentSlide});

		            const sessionDetailIdInput = document.createElement('input');
		            sessionDetailIdInput.type = 'hidden';
		            sessionDetailIdInput.name = 'sessionDetailId';
		            sessionDetailIdInput.value = ${sessionDetailId};

		            const enrollmentIdInput = document.createElement('input');
		            enrollmentIdInput.type = 'hidden';
		            enrollmentIdInput.name = 'enrollmentId';
		            enrollmentIdInput.value = ${enrollmentId};

		            const directionInput = document.createElement('input');
		            directionInput.type = 'hidden';
		            directionInput.name = 'direction';
		            directionInput.value = direction;

		            // Append inputs to the form
		            form.appendChild(currentSlideInput);
		            form.appendChild(sessionDetailIdInput);
		            form.appendChild(enrollmentIdInput);
		            form.appendChild(directionInput);

		            // Add form to document body and submit
		            document.body.appendChild(form);
		            form.submit();
		        }
		   
		        let isVoiceMode = false;
	
		        // Toggle mode logic
		        function toggleMode() {
		            const toggleBtn = document.getElementById('toggleBtn');
		            const modeLabel = document.getElementById('modeLabel');
		            const textModeContainer = document.getElementById('text-mode-container');
		            const voiceModeContainer = document.getElementById('voice-mode-container');
	
		            if (isVoiceMode) {
		                toggleBtn.classList.remove('active');
		                modeLabel.textContent = "Text Mode";
		                textModeContainer.style.display = "block";
		                voiceModeContainer.style.display = "none";
		            } else {
		                toggleBtn.classList.add('active');
		                modeLabel.textContent = "Voice Mode";
		                textModeContainer.style.display = "none";
		                voiceModeContainer.style.display = "block";
		            }
	
		            isVoiceMode = !isVoiceMode;
		        }
	
		        window.toggleMode = toggleMode;  // Make the function accessible globally
		    });
		
	    const synth = window.speechSynthesis;
	    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
	    recognition.continuous = false;
	    recognition.interimResults = false;
	    recognition.lang = 'en-US';
	
	    // Converting Java object list to JSON format
	    const fillInBlankQuestions = [
	        <c:forEach var="question" items="${fillInBlankQuestions}"  varStatus="status">
	            {
	                questionId: "${question.questionId}",
	                questionText: "${fn:escapeXml(question.questionText)}",
	                correctAnswer: "${fn:escapeXml(question.correctAnswer)}"
	            }<c:if test="${!status.last}">,</c:if>
	        </c:forEach>
	    ];
	    
	    let currentQuestionIndex = 0;
	
	    function startVoiceQuestion() {
	        if (currentQuestionIndex < fillInBlankQuestions.length) {
	            let currentQuestion = fillInBlankQuestions[currentQuestionIndex];
	            askQuestion(currentQuestion.questionText, currentQuestion.correctAnswer, currentQuestion.questionId);
	        } else {
	            alert("All questions answered!");
	        }
	    }
	
	    function askQuestion(questionText, correctAnswer, questionId) {
	        // Update the UI to show the question
	        document.getElementById("questionText").textContent = questionText;
	        
	        let utter = new SpeechSynthesisUtterance(questionText);
	        synth.speak(utter);

	        utter.onend = function () {
	            // Introduce a small delay before starting speech recognition
	            setTimeout(function() {
	                recognition.start();
	                console.log('Speech recognition started');
	            }, 500); // 500ms delay
	        };

	        recognition.onresult = function (event) {
	            let spokenAnswer = event.results[0][0].transcript.trim();
	            console.log('spoken answer - ' + spokenAnswer);

	            // Show the spoken answer in the UI
	            document.getElementById("spoken-answer").style.display = "block";
	            document.getElementById("answerText").textContent = spokenAnswer;

	            verifyAnswer(spokenAnswer, correctAnswer, questionId);
	        };

	        recognition.onerror = function(event) {
	            console.error('Speech recognition error: ', event.error);
	        };

	        recognition.onend = function() {
	            console.log('Speech recognition ended.');
	        };
	    }

	    function verifyAnswer(spokenAnswer, correctAnswer, questionId) {
	        if (spokenAnswer === correctAnswer) {
	            alert("Correct! Moving to the next question.");
	            currentQuestionIndex++;
	            startVoiceQuestion();
	        } else {
	            alert("Incorrect. Please try again.");
	        }

	        // Optionally send answer to backend for logging
	        $.post("${pageContext.request.contextPath}/sessiondetail/submitVoiceAnswer", {
	            slideId: ${slide.slideId},
	            sessionDetailId: ${sessionDetailId},
	            enrollmentId: ${enrollmentId},
	            questionId: questionId,
	            spokenAnswer: spokenAnswer,
	            correct: spokenAnswer === correctAnswer
	        });
	    }	
	
	</script>
	</body>
	</html>
