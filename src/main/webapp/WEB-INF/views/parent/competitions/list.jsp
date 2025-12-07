<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Competitions for Registration</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>

    <style>
        .action-buttons {
            white-space: nowrap;
        }
    </style>
</head>

<body>

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
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back
    </button>

    <h2 class="mb-4">Available Competitions</h2>

    <c:if test="${empty competitions}">
        <div class="alert alert-info">No competitions available at this time.</div>
    </c:if>

    <c:if test="${not empty competitions}">
        <table class="table table-striped table-bordered">
            <thead>
            <tr class="table-dark">
                <th>Title</th>
                <th>Category</th>

                <!-- ⭐ NEW: Fee -->
                <th>Fee (₹)</th>

                <th>Date</th>
                <th>Mode</th>
                <th>Grade Group</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            <c:forEach var="c" items="${competitions}">

                <!-- Already Registered Token -->
                <c:set var="search" value=",${c.competitionId}," />

                <!-- NEW LOGIC: Determine status dynamically -->
                <c:choose>
                    <c:when test="${fn:contains(registeredIdsStr, search)}">
                        <c:set var="computedStatus" value="Registered" />
                    </c:when>

                    <c:when test="${today >= c.registrationStartDate && today <= c.registrationEndDate}">
                        <c:set var="computedStatus" value="Open" />
                    </c:when>

                    <c:when test="${today < c.registrationStartDate}">
                        <c:set var="computedStatus" value="Upcoming" />
                    </c:when>

                    <c:when test="${today > c.registrationEndDate}">
                        <c:set var="computedStatus" value="Closed" />
                    </c:when>

                    <c:otherwise>
                        <c:set var="computedStatus" value="${c.status}" />
                    </c:otherwise>
                </c:choose>

                <tr>
                    <td>${c.title}</td>
                    <td>${c.category}</td>

                    <!-- ⭐ NEW: Fee Display -->
                    <td><strong>₹${c.fee}</strong></td>

                    <td><fmt:formatDate value="${c.date}" pattern="dd MMM yyyy"/></td>
                    <td>${c.mode}</td>
                    <td>${c.gradeGroup}</td>

                    <!-- STATUS BADGE -->
                    <td>
                        <c:choose>
                            <c:when test="${computedStatus == 'Registered'}">
                                <span class="badge bg-primary">Registered</span>
                            </c:when>

                            <c:when test="${computedStatus == 'Open'}">
                                <span class="badge bg-success">Open</span>
                            </c:when>

                            <c:when test="${computedStatus == 'Upcoming'}">
                                <span class="badge bg-warning text-dark">Upcoming</span>
                            </c:when>

                            <c:when test="${computedStatus == 'Closed'}">
                                <span class="badge bg-secondary">Closed</span>
                            </c:when>

                            <c:otherwise>
                                <span class="badge bg-info text-dark">${computedStatus}</span>
                            </c:otherwise>
                        </c:choose>
                    </td>

                    <!-- ACTION BUTTONS -->
                    <td class="action-buttons">
                        <c:choose>

                            <c:when test="${computedStatus == 'Registered'}">
                                <span class="badge bg-primary">Registered</span>
                            </c:when>

                            <c:when test="${computedStatus == 'Open'}">
                                <a href="${pageContext.request.contextPath}/parent/competitions/register?competitionId=${c.competitionId}&parentUserId=${parentUserId}"
                                   class="btn btn-success btn-sm">
                                    Register
                                </a>
                            </c:when>

                            <c:when test="${computedStatus == 'Upcoming'}">
                                <small class="text-warning">Opens Soon</small>
                            </c:when>

                            <c:when test="${computedStatus == 'Closed'}">
                                <small class="text-muted">Registration Closed</small>
                            </c:when>

                            <c:otherwise>
                                <small class="text-muted">Not Available</small>
                            </c:otherwise>

                        </c:choose>
                    </td>

                </tr>

            </c:forEach>
            </tbody>
        </table>
    </c:if>

</div>

<jsp:include page="/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
