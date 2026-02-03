<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page isELIgnored="false" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <title>Exam Result</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-4">

    <!-- Back -->
    <a href="javascript:history.back()" class="btn btn-outline-secondary mb-3">
        ← Back
    </a>

    <!-- ================= SUMMARY CARD ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">

            <div class="d-flex justify-content-between align-items-center">
                <h4 class="fw-bold mb-0">Exam Result</h4>

                <span class="badge bg-success fs-6">
                    AI Evaluated
                </span>
            </div>

            <hr>

            <div class="row text-center">

                <div class="col-md-4 mb-3">
                    <div class="fw-bold text-muted">Score</div>
                    <div class="fs-3 fw-bold text-primary">
                        ${aiSummary.totalMarksAwarded}
                        /
                        ${aiSummary.maxMarks}
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="fw-bold text-muted">Confidence</div>
                    <div class="fs-4 fw-bold">
                        <fmt:formatNumber value="${aiSummary.confidence * 100}" maxFractionDigits="0"/>%
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="fw-bold text-muted">Status</div>

                    <c:choose>
                        <c:when test="${aiSummary.needsReview}">
                            <span class="badge bg-warning text-dark">
                                Needs Teacher Review
                            </span>
                        </c:when>
                        <c:otherwise>
                            <span class="badge bg-success">
                                Finalized
                            </span>
                        </c:otherwise>
                    </c:choose>
                </div>

            </div>

            <hr>

            <h6 class="fw-bold">Overall Feedback</h6>
            <p class="text-muted mb-0">
                <c:out value="${aiSummary.overallFeedback}" />
            </p>

        </div>
    </div>

    <!-- ================= QUESTION-WISE BREAKDOWN ================= -->
    <div class="card shadow-sm">

        <div class="card-header fw-semibold">
            Question-wise Evaluation
        </div>

        <div class="table-responsive">
            <table class="table table-bordered table-hover mb-0">

                <thead class="table-light">
                    <tr>
                        <th style="width:5%">#</th>
                        <th style="width:45%">Question</th>
                        <th style="width:15%">Marks</th>
                        <th style="width:10%">Confidence</th>
                        <th style="width:25%">Feedback</th>
                    </tr>
                </thead>

                <tbody>
                    <c:forEach var="eval" items="${questionEvaluations}" varStatus="status">

                        <tr>
                            <td class="text-center">
                                ${status.index + 1}
                            </td>

                            <td>
                                <c:out value="${eval.questionText}" />
                            </td>

                            <td class="text-center fw-bold">
                                ${eval.marksAwarded}
                                /
                                ${eval.maxMarks}
                            </td>

                            <td class="text-center">
                                <fmt:formatNumber value="${eval.confidence * 100}" maxFractionDigits="0"/>%
                            </td>

                            <td>
                                <c:out value="${eval.feedback}" />
                            </td>
                        </tr>

                    </c:forEach>

                    <c:if test="${empty questionEvaluations}">
                        <tr>
                            <td colspan="5" class="text-center text-muted">
                                No evaluation data available.
                            </td>
                        </tr>
                    </c:if>
                </tbody>

            </table>
        </div>
    </div>

</div>

</body>
</html>
