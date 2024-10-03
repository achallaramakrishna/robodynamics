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
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2vinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>

<meta charset="UTF-8">
<title>Slide Show</title>

<!-- Custom Styles -->
<style>
/* Same styles as your original JSP */
</style>

</head>
<body>
    <div class="container-fluid">
        <h2 class="animated-title">✨ ${slide.title} ✨</h2>

        <!-- Slide Container that adapts if file (image, video, etc.) is missing -->
        <div class="slide-container" style="display: flex; align-items: center; justify-content: center;">

            <!-- Check if the file URL is not empty -->
            <c:if test="${not empty slide.fileUrl}">
                <c:choose>
                    <!-- Check if the file type is a video -->
                    <c:when test="${slide.fileType == 'video'}">
                        <!-- Video Display -->
                        <div class="file-container" style="padding: 20px; border-radius: 10px; margin-right: 20px;">
                            <video controls style="max-width: 100%; height: auto; border-radius: 10px;">
                                <source src="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </c:when>

                    <!-- Check if the file type is an image -->
                    <c:when test="${slide.fileType == 'image'}">
                        <!-- Image Display -->
                        <div class="file-container" style="padding: 20px; border-radius: 10px; margin-right: 20px;">
                            <img src="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}" alt="Slide Image" class="slide-image" style="width: 100%; max-width: 300px; height: auto; border-radius: 5px;">
                        </div>
                    </c:when>

                    <!-- Check if the file type is a PDF -->
                    <c:when test="${slide.fileType == 'pdf'}">
                        <!-- PDF Display -->
                        <div class="file-container" style="padding: 20px; border-radius: 10px; margin-right: 20px;">
                            <a href="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}" target="_blank" class="btn btn-primary">View PDF</a>
                        </div>
                    </c:when>

                    <!-- Default case for other file types -->
                    <c:otherwise>
                        <div class="file-container" style="padding: 20px; border-radius: 10px; margin-right: 20px;">
                            <a href="${pageContext.request.contextPath}/assets/files/${slide.fileUrl}" target="_blank" class="btn btn-primary">Download File</a>
                        </div>
                    </c:otherwise>
                </c:choose>
            </c:if>

            <!-- Slide Content: Takes full width if no file (image/video/etc.) -->
            <div class="content-box" style="<c:if test='${empty slide.fileUrl}'>width: 100%;</c:if> max-width: 600px;">
                <div class="fun-paragraph">
                    <p>${slide.content}</p>
                </div>
            </div>

        </div>

        <!-- Check if there are fill-in-the-blank questions -->
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
            <form action="${pageContext.request.contextPath}/sessiondetail/navigate" method="post" class="d-inline">
                <input type="hidden" name="currentSlide" value="${currentSlide}" />
                <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
                <button type="submit" name="direction" value="prev" class="btn btn-primary" ${currentSlide == 0 ? 'disabled' : ''}>◀ Prev</button>
                <button type="submit" name="direction" value="next" class="btn btn-primary" ${currentSlide == slideCount - 1 ? 'disabled' : ''}>Next ▶</button>
            </form>
        </div>
    </div>
</body>
</html>
