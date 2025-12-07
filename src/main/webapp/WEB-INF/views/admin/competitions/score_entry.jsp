<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Score Entry Panel</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet" />

    <style>
        .score-input {
            width: 80px;
        }
        .comment-box {
            min-width: 200px;
        }
        .action-buttons {
            white-space: nowrap;
        }
        .instructions-card {
            background-color: #f1f2f5;
            border-left: 4px solid #0d6efd;
        }
    </style>
</head>

<body>

<!-- HEADER -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Flash Messages -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success alert-dismissible fade show">
            ${successMessage}
            <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger alert-dismissible fade show">
            ${errorMessage}
            <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>


    <!-- Back Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/admin/competitions/rounds?competitionId=${round.competition.competitionId}';">
        Back
    </button>


    <!-- ROUND DETAILS -->
    <div class="p-3 mb-4 instructions-card">
        <h3 class="mb-2">${round.roundName}</h3>
        <p class="mb-1"><strong>Competition:</strong> ${round.competition.title}</p>

        <p class="mb-1">
            <strong>Judge:</strong>
            <c:choose>
                <c:when test="${round.judge != null}">
                    ${round.judge.firstName} ${round.judge.lastName} (${round.judge.cellPhone})
                </c:when>
                <c:otherwise><span class="text-danger">Not Assigned</span></c:otherwise>
            </c:choose>
        </p>

        <p class="mb-1">
            <strong>Time:</strong> ${round.startTime} - ${round.endTime}
        </p>

        <!-- Instructions -->
        <div class="mt-2">
            <button class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#instructionsBox">
                Show Instructions
            </button>

            <div class="collapse mt-2" id="instructionsBox">
                <div class="card card-body">
                    <c:out value="${round.instructions}" escapeXml="false"/>
                </div>
            </div>
        </div>
    </div>


    <!-- SCORE ENTRY TABLE -->
    <h4 class="mb-3">Participants & Scores</h4>

    <form action="${pageContext.request.contextPath}/admin/competitions/scores/save" method="post">

        <input type="hidden" name="round.roundId" value="${round.roundId}" />
        <input type="hidden" name="judge.userID"
               value="${round.judge != null ? round.judge.userID : ''}" />

        <table class="table table-striped table-bordered">
            <thead>
            <tr class="table-dark">
                <th>Student</th>
                <th>Grade</th>
                <th>Parent</th>
                <th>Score</th>
                <th>Comments</th>
            </tr>
            </thead>

            <tbody>

            <c:forEach var="p" items="${participants}">
                <tr>

                    <!-- Student -->
                    <td>
                        ${p.student.firstName} ${p.student.lastName}
                    </td>

                    <!-- Grade -->
                    <td>${p.student.grade}</td>

                    <!-- Parent -->
                    <td>
                        ${p.parent.firstName} ${p.parent.lastName}
                        <br><small>${p.parent.cellPhone}</small>
                    </td>

                    <!-- Score Input -->
                    <td>
                        <input type="number"
                               class="form-control score-input"
                               name="scores[${p.student.userId}].score"
                               min="0" max="100"
                               value="${existingScores[p.student.userId].score}"
                               step="0.1"
                               required />
                    </td>

                    <!-- Comments -->
                    <td>
                        <textarea name="scores[${p.student.userId}].comments"
                                  class="form-control comment-box"
                                  rows="2">${existingScores[p.student.userId].comments}</textarea>

                        <!-- Hidden fields needed for saving -->
                        <input type="hidden"
                               name="scores[${p.student.userId}].student.userId"
                               value="${p.student.userId}" />

                        <input type="hidden"
                               name="scores[${p.student.userId}].round.roundId"
                               value="${round.roundId}" />

                        <input type="hidden"
                               name="scores[${p.student.userId}].judge.userId"
                               value="${round.judge != null ? round.judge.userId : ''}" />
                    </td>

                </tr>
            </c:forEach>

            </tbody>

        </table>

        <button type="submit" class="btn btn-success">Save All Scores</button>

    </form>

</div>

<!-- FOOTER -->
<jsp:include page="/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
