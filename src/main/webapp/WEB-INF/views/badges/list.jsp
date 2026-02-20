<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Badges</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Badges</h2>
        <a href="${pageContext.request.contextPath}/badges/add" class="btn btn-primary">Add Badge</a>
    </div>
    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Points Threshold</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${empty badges}">
                    <tr><td colspan="5" class="text-center">No badges found.</td></tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="badge" items="${badges}" varStatus="s">
                        <tr>
                            <td>${s.count}</td>
                            <td>${badge.name}</td>
                            <td>${badge.description}</td>
                            <td>${badge.pointsThreshold}</td>
                            <td>
                                <a href="${pageContext.request.contextPath}/badges/edit/${badge.id}" class="btn btn-sm btn-warning">Edit</a>
                                <a href="${pageContext.request.contextPath}/badges/delete/${badge.id}" class="btn btn-sm btn-danger"
                                   onclick="return confirm('Delete this badge?')">Delete</a>
                            </td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>
</div>
<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
