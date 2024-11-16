<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>View Past Exam Paper</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <!-- Include Header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Past Exam Paper: ${pastExamPaper.examName} (${pastExamPaper.examYear})</h1>
        <p class="lead">${pastExamPaper.description}</p>
        <hr />

        <!-- Exam Instructions -->
        <h5>Instructions:</h5>
        <p>${pastExamPaper.examInstructions}</p>
        <hr />

        <!-- Exam Details -->
        <div class="row mb-3">
            <div class="col-md-4">
                <strong>Year:</strong> ${pastExamPaper.examYear}
            </div>
            <div class="col-md-4">
                <strong>Total Marks:</strong> ${pastExamPaper.totalMarks}
            </div>
            <div class="col-md-4">
                <strong>Exam Level:</strong> ${pastExamPaper.examLevel}
            </div>
        </div>

        <!-- Exam Courses/Sections -->
        <h3>Sections</h3>
        <c:forEach var="section" items="${pastExamPaper.examCourses}">
            <div class="card mb-3">
                <div class="card-header">
                    <h5>${section.sectionName} (${section.course.courseName})</h5>
                    <span>Total Marks: ${section.totalMarks}</span>
                </div>
                <div class="card-body">
                    <!-- Questions for this Section -->
                    <h6>Questions:</h6>
                    <ul class="list-group">
                        <c:forEach var="question" items="${section.questions}">
                            <li class="list-group-item">
                                <p><strong>Q${question.questionNumber}:</strong> ${question.questionText}</p>
                                <p><em>Type:</em> ${question.questionType} | <em>Difficulty:</em> ${question.difficultyLevel} | <em>Marks:</em> ${question.maxMarks}</p>
                                <c:choose>
                                    <c:when test="${question.questionType == 'multiple_choice'}">
                                        <ul>
                                            <c:forEach var="option" items="${question.options}">
                                                <li>
													${option.optionText} 
								                    <c:if test="${option.correct}">
								                        <span>✔</span>
								                    </c:if>
                                                </li>
                                            </c:forEach>
                                        </ul>
                                    </c:when>
                                    <c:otherwise>
                                        <p><strong>Answer:</strong> ${question.correctAnswer}</p>
                                    </c:otherwise>
                                </c:choose>
                            </li>
                        </c:forEach>
                    </ul>
                </div>
            </div>
        </c:forEach>

        <!-- Back Button -->
        <button class="btn btn-secondary mt-3" onclick="window.location.href='${pageContext.request.contextPath}/managePastExamPapers'">
            Back to Manage Past Exam Papers
        </button>
    </div>

    <!-- Include Footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
