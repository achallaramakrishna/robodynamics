<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page isELIgnored="false" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <title>Exam Result</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

	<style>
		.result-hero {
		    background: linear-gradient(135deg, #0d6efd, #3d8bfd);
		    color: white;
		    border-radius: 16px;
		}
		
		.result-hero .display-4 {
		    font-size: 3.5rem;
		}
		
		.result-hero .badge {
		    border-radius: 30px;
		}
		
	</style>
</head>

<body class="bg-light">

<div class="container mt-4 mb-5">

    <!-- Back -->
    <a href="javascript:history.back()" class="btn btn-outline-secondary mb-3">
        ← Back
    </a>

    <!-- ================= HEADER ================= -->
<c:set var="safeTotal" value="${result.totalMarks != null ? result.totalMarks : 0}" />
<c:set var="safeAwarded" value="${result.totalMarksAwarded != null ? result.totalMarksAwarded : 0}" />
<c:set var="percentage" value="${safeTotal > 0 ? (safeAwarded * 100) / safeTotal : 0}" />

<c:choose>
    <c:when test="${percentage >= 85}">
        <c:set var="headerClass" value="excellent-header"/>
    </c:when>
    <c:when test="${percentage >= 65}">
        <c:set var="headerClass" value="good-header"/>
    </c:when>
    <c:when test="${percentage >= 40}">
        <c:set var="headerClass" value="average-header"/>
    </c:when>
    <c:otherwise>
        <c:set var="headerClass" value="needs-support-header"/>
    </c:otherwise>
</c:choose>

<div class="result-hero ${headerClass} shadow-lg">

    <div class="text-center">
        <h2 class="fw-bold mb-2">Exam Evaluation Complete</h2>

        <div class="marks-big">
            <fmt:formatNumber value="${safeAwarded}" maxFractionDigits="0"/> 
            / ${safeTotal}
        </div>

        <div class="percentage-big">
            <fmt:formatNumber value="${percentage}" maxFractionDigits="0"/>%
        </div>

        <c:choose>
            <c:when test="${result.needsTeacherReview}">
                <span class="badge bg-warning text-dark mt-2 px-3 py-2">
                    Under Review
                </span>
            </c:when>
            <c:otherwise>
                <span class="badge bg-light text-dark mt-2 px-3 py-2">
                    Final Result
                </span>
            </c:otherwise>
        </c:choose>
    </div>

</div>


    <!-- ================= STUDENT + EXAM DETAILS ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">

            <h5 class="fw-bold mb-3">👤 Student & Exam Details</h5>

            <div class="row g-3">
                <div class="col-md-6">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Student Name</div>
                        <div class="fs-6">${result.studentName}</div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Exam Title</div>
                        <div class="fs-6">${result.examTitle}</div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Subject</div>
                        <div>${result.subject}</div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Board</div>
                        <div>${result.board}</div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Exam Date</div>
                        <div>${result.examDate}</div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="border rounded p-3 h-100">
                        <div class="fw-bold text-muted">Duration</div>
                        <div>${result.durationMinutes} mins</div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- ================= RESULT SUMMARY ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">

            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0">📘 Exam Evaluation Summary</h5>

                <c:choose>
                    <c:when test="${result.needsTeacherReview}">
                        <span class="badge bg-warning text-dark fs-6">🧑‍🏫 Under Review</span>
                    </c:when>
                    <c:otherwise>
                        <span class="badge bg-success fs-6">✅ Final Result</span>
                    </c:otherwise>
                </c:choose>
            </div>

            <hr class="mb-4">

            <!-- SAFE CALCULATIONS -->
            <c:set var="safeTotal" value="${result.totalMarks != null ? result.totalMarks : 0}" />
            <c:set var="safeAwarded" value="${result.totalMarksAwarded != null ? result.totalMarksAwarded : 0}" />
            <c:set var="percentage" value="${safeTotal > 0 ? (safeAwarded / safeTotal) * 100 : 0}" />

            <div class="row text-center g-3">

                <div class="col-md-4">
                    <div class="card border-success h-100">
                        <div class="card-body">
                            <div class="fw-bold text-muted">🌟 Marks Obtained</div>
                            <div class="fs-2 fw-bold text-success">
                                <fmt:formatNumber value="${safeAwarded}" maxFractionDigits="1"/>
                                / ${safeTotal}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card border-primary h-100">
                        <div class="card-body">
                            <div class="fw-bold text-muted">🏆 Performance</div>
                            <span class="badge fs-6
                                <c:choose>
                                    <c:when test='${percentage >= 85}'>bg-success</c:when>
                                    <c:when test='${percentage >= 65}'>bg-primary</c:when>
                                    <c:when test='${percentage >= 40}'>bg-warning text-dark</c:when>
                                    <c:otherwise>bg-danger</c:otherwise>
                                </c:choose>">
                                <fmt:formatNumber value="${percentage}" maxFractionDigits="0"/>%
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card border-info h-100">
                        <div class="card-body">
                            <div class="fw-bold text-muted">🆔 Submission ID</div>
                            <div class="fw-bold">${result.submissionId}</div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- PROGRESS -->
            <div class="mt-4">
                <div class="progress" style="height: 22px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated
                        <c:choose>
                            <c:when test='${percentage >= 85}'>bg-success</c:when>
                            <c:when test='${percentage >= 65}'>bg-primary</c:when>
                            <c:when test='${percentage >= 40}'>bg-warning</c:when>
                            <c:otherwise>bg-danger</c:otherwise>
                        </c:choose>"
                        style="width:${percentage}%">
                        🎯 <fmt:formatNumber value="${percentage}" maxFractionDigits="0"/>%
                    </div>
                </div>
            </div>

            <!-- FEEDBACK -->
            <div class="mt-4">
                <h6 class="fw-bold">📝 Teacher / AI Feedback</h6>
                <div class="alert alert-light border p-3 mt-2">
                    <c:out value="${result.overallFeedback}" />
                </div>
            </div>

        </div>
    </div>

    <!-- ================= DOWNLOAD & ANSWERS ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-body text-center">

            <h6 class="fw-bold mb-3">📄 Reports & Solutions</h6>

            <div class="d-flex justify-content-center gap-3 flex-wrap">

                <a class="btn btn-outline-dark"
                   href="${ctx}/student/exam/submission/${result.submissionId}/result/download">
                    ⬇️ Download Full Feedback (PDF)
                </a>

                <c:if test="${result.studentAnswerAvailable}">
                    <a class="btn btn-outline-primary"
                       target="_blank"
                       href="${ctx}/exam/submission/${result.submissionId}/student-answer">
                        🧑‍🎓 Student Answer Sheet
                    </a>
                </c:if>

                <c:if test="${not empty result.examPaperId}">
                    <a class="btn btn-outline-success"
                       target="_blank"
                       href="${ctx}/exam/paper/${result.examPaperId}/model-answer">
                        📘 Model Answers
                    </a>
                </c:if>

            </div>

        </div>
    </div>

    <!-- ================= QUESTION-WISE ================= -->
    <div class="card shadow-sm mb-5">
        <div class="card-header fw-semibold">
            📊 Question-wise Detailed Evaluation
        </div>

        <div class="card-body">
            <div class="accordion" id="questionAccordion">

                <c:forEach var="q" items="${result.questions}" varStatus="s">
                    <div class="accordion-item mb-2">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed fw-semibold"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#q${s.index}">
                                Q${s.index + 1}. ${q.questionText}
                                <span class="ms-auto badge bg-info text-dark">
                                    ${q.marksAwarded} / ${q.maxMarks}
                                </span>
                            </button>
                        </h2>

                        <div id="q${s.index}" class="accordion-collapse collapse">
                            <div class="accordion-body">

                                <div class="mb-3">
                                    <strong>🧑‍🎓 Your Answer</strong>
                                    <c:set var="answerClass" value="alert-secondary" />

									<c:choose>
									    <c:when test="${q.marksAwarded == 0}">
									        <c:set var="answerClass" value="alert-danger" />
									    </c:when>
									
									    <c:when test="${q.marksAwarded == q.maxMarks}">
									        <c:set var="answerClass" value="alert-success" />
									    </c:when>
									
									    <c:otherwise>
									        <c:set var="answerClass" value="alert-warning" />
									    </c:otherwise>
									</c:choose>
									
									<div class="alert ${answerClass} mt-1">
									    <c:choose>
									        <c:when test="${not empty q.studentAnswer}">
									            <pre class="mb-0">${q.studentAnswer}</pre>
									        </c:when>
									        <c:otherwise>
									            <em>No answer provided</em>
									        </c:otherwise>
									    </c:choose>
									</div>

                                </div>

                                <div class="mb-3">
                                    <strong>✅ Correct Answer</strong>
                                    <div class="alert alert-success mt-1">
                                        ${q.correctAnswer}
                                    </div>
                                </div>

                                <div>
                                    <strong>📝 Feedback</strong>
                                    <div class="alert alert-light border mt-1">
                                        ${q.feedback}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </c:forEach>

            </div>
        </div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
