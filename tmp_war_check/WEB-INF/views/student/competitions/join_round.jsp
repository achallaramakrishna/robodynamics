<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Join Round</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"/>

    <style>
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-left: 5px solid #0d6efd;
            border-radius: 6px;
        }
        .instructions-box {
            background: #f1f2f5;
            border-left: 4px solid #ffc107;
        }
        .join-button {
            width: 100%;
            height: 50px;
            font-size: 1.1rem;
        }
    </style>
</head>

<body>

<!-- HEADER -->
<jsp:include page="/header.jsp"/>

<div class="container mt-4">

    <!-- FLASH MESSAGES -->
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

    <!-- BACK -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/student/competitions/my?studentUserId=${studentUserId}';">
        Back
    </button>

    <!-- TITLE -->
    <h2 class="mb-4">Join Round – <span class="text-primary">${round.roundName}</span></h2>


    <!-- ROUND DETAILS -->
    <div class="info-box mb-4">

        <h4>${round.roundName}</h4>

        <p class="mb-1">
            <strong>Competition:</strong> ${round.competition.title}
        </p>

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
            <strong>Time:</strong>
            ${round.startTime} – ${round.endTime}
        </p>

        <c:choose>

            <!-- ONLINE ROUND -->
            <c:when test="${round.competition.mode == 'Online'}">
                <p class="mb-1"><strong>Mode:</strong> Online</p>

                <c:if test="${not empty round.onlineLink}">
                    <p class="mt-2">
                        <strong>Meeting Link:</strong>
                        <a href="${round.onlineLink}" target="_blank">${round.onlineLink}</a>
                    </p>
                </c:if>
            </c:when>

            <!-- OFFLINE ROUND -->
            <c:when test="${round.competition.mode == 'Offline'}">
                <p class="mb-1"><strong>Mode:</strong> Offline</p>
                <p class="mt-2"><strong>Venue:</strong> ${round.competition.venue}</p>
            </c:when>

            <!-- HYBRID -->
            <c:otherwise>
                <p><strong>Mode:</strong> Hybrid</p>
            </c:otherwise>

        </c:choose>

    </div>


    <!-- INSTRUCTIONS -->
    <div class="instructions-box card card-body mb-4">
        <h5 class="text-warning">Instructions</h5>
        <c:out value="${round.instructions}" escapeXml="false"/>
    </div>


    <!-- JOIN BUTTON SECTION -->
    <c:choose>

        <!-- ONLINE ROUND WITH LINK -->
        <c:when test="${round.competition.mode == 'Online'}">
            <a href="${round.onlineLink}" target="_blank"
               class="btn btn-success join-button">
                Join Online Round
            </a>
        </c:when>

        <!-- OFFLINE ROUND -->
        <c:when test="${round.competition.mode == 'Offline'}">
            <div class="alert alert-info text-center">
                This round is conducted <strong>offline</strong>.
                <br>
                Venue: <strong>${round.competition.venue}</strong>
            </div>
        </c:when>

        <!-- HYBRID -->
        <c:otherwise>
            <div class="alert alert-info text-center">
                This is a hybrid mode round. Check instructions above.
            </div>
        </c:otherwise>

    </c:choose>

</div>

<!-- FOOTER -->
<jsp:include page="/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
