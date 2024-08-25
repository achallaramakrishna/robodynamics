
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
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

    <title>Slide Show</title>
    <style>
        body {
            background-color: #f8f9fa; /* Light gray background */
            font-family: 'Comic Sans MS', cursive, sans-serif; /* Kid-friendly font */
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #ff6f61; /* Bright red color for the title */
            text-align: center;
        }

        .slide-image {
            display: block;
            margin: 0 auto 20px;
            max-width: 100%;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        p {
            font-size: 18px;
            line-height: 1.5;
            text-align: center;
        }

        .question {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #e3f2fd; /* Light blue background for questions */
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .question label {
            font-size: 18px;
            display: block;
            margin-bottom: 10px;
            color: #0d6efd; /* Bootstrap primary color for question text */
        }

        .correct {
            color: green;
            font-weight: bold;
        }

        .incorrect {
            color: red;
            font-weight: bold;
        }

        .submit-btn {
            background-color: #28a745; /* Bootstrap success color */
            color: white;
            font-size: 20px;
            padding: 15px;
            border-radius: 5px;
            width: 100%;
            border: none;
            margin-top: 20px;
            transition: background-color 0.3s;
        }

        .submit-btn:hover {
            background-color: #218838;
        }

        .nav-buttons {
            margin-top: 30px;
            text-align: center;
        }

        .nav-buttons button {
            margin: 0 10px;
            padding: 10px 20px;
            font-size: 18px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <h2>${slide.title}</h2>
        <p>${slide.content}</p>
        
        <c:if test="${not empty slide.imageUrl}">
            <img src="${pageContext.request.contextPath}/assets/images/${slide.imageUrl}" alt="Slide Image" class="slide-image img-fluid rounded shadow-sm" />
        </c:if>

        <!-- Check if the slide contains fill-in-the-blank questions -->
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
                                <label>${status.index + 1}. ${question.question}</label>
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
            </form>
        </c:if>

        <!-- Navigation Buttons -->
        <div class="nav-buttons">
            <form action="${pageContext.request.contextPath}/sessiondetail/navigate" method="post" class="d-inline">
                <input type="hidden" name="currentSlide" value="${currentSlide}" />
                <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
                <button type="submit" name="direction" value="prev" class="btn btn-primary" ${currentSlide == 0 ? 'disabled' : ''}>Prev</button>
                <button type="submit" name="direction" value="next" class="btn btn-primary" ${currentSlide == slideCount - 1 ? 'disabled' : ''}>Next</button>
            </form>
        </div>
        
    </div>
		
   
</body>
</html>
