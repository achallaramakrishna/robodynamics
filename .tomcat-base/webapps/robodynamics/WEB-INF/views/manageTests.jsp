<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Manage Tests</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />
<div class="container py-4">
    <h2 class="mb-3">Manage Tests</h2>
    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>#</th>
                <th>Test ID</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${empty tests}">
                    <tr><td colspan="3" class="text-center">No tests found.</td></tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="test" items="${tests}" varStatus="s">
                        <tr>
                            <td>${s.count}</td>
                            <td>${test.quizTestId}</td>
                            <td>
                                <a href="${pageContext.request.contextPath}/quiztest/quiz/test/${test.quizTestId}" class="btn btn-sm btn-primary">View</a>
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
