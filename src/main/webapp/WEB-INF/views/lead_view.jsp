<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>View Lead</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>

<jsp:include page="header.jsp" />

<c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
<c:set var="isAdmin" value="${pid == 1 or pid == 2}" />
<c:set var="isMentor" value="${pid == 3}" />

<div class="container py-5">
    <h1 class="mb-4">View Lead</h1>

    <!-- Lead Details -->
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Lead ID: ${lead.id}</h5>
        </div>
        <div class="card-body">
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Audience:</strong> ${lead.audience}</p>
            <p><strong>Status:</strong> ${lead.status}</p>
        </div>
        <div class="card-footer">
            <a href="${pageContext.request.contextPath}/leads/edit/${lead.id}" class="btn btn-warning">Edit Lead</a>
            <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-secondary">Back to Dashboard</a>
        </div>
    </div>

    <!-- Mentor Assignments -->
    <c:if test="${isAdmin || isMentor}">
        <div class="card">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">Mentor Assignments</h5>
            </div>
            <div class="card-body">
                <c:if test="${not empty mentorAssignments}">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mentor Name</th>
                                <th>Skill</th>
                                <th>Demo Mentor</th>
                                <th>Status</th>
                                <c:if test="${isMentor}"><th>Actions</th></c:if>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="assign" items="${mentorAssignments}">
                                <tr>
									<td>${assign.mentor.firstName} ${assign.mentor.lastName}</td>
                                    <td>${assign.skill.skillName}</td>
                                    <td>
									    <c:choose>
									        <c:when test="${assign.demoMentor}">Yes</c:when>
									        <c:otherwise>No</c:otherwise>
									    </c:choose>
									</td>
                                    <td>${assign.status}</td>
                                    <c:if test="${isMentor}">
                                        <td>
                                            <c:if test="${assign.status == 'PENDING'}">
                                                <form method="post" action="${pageContext.request.contextPath}/leads/claim/${lead.id}/${assign.mentor.userId}/${assign.skill.skillId}" style="display:inline">
                                                    <button class="btn btn-primary btn-sm">Claim</button>
                                                </form>
                                                <form method="post" action="${pageContext.request.contextPath}/leads/proposeDate/${lead.id}/${assign.mentor.userId}/${assign.skill.skillId}" style="display:inline">
                                                    <input type="datetime-local" name="newDateTime" required />
                                                    <button class="btn btn-warning btn-sm">Propose New Date</button>
                                                </form>
                                            </c:if>
                                            <c:if test="${assign.status != 'PENDING'}">
                                                <span class="text-muted">Already handled</span>
                                            </c:if>
                                        </td>
                                    </c:if>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </c:if>
                <c:if test="${empty mentorAssignments}">
                    <p>No mentors assigned yet.</p>
                </c:if>
            </div>
        </div>
    </c:if>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
