<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Access Denied</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f5f6fa;
        }
        .error-box {
            max-width: 550px;
            margin: 80px auto;
        }
        .lock-icon {
            font-size: 60px;
            color: #dc3545;
        }
        .btn-home {
            margin-top: 15px;
        }
    </style>
</head>
<body>

<jsp:include page="/header.jsp" />

<div class="container error-box">
    <div class="card shadow">
        <div class="card-body text-center">

            <div class="lock-icon mb-3">
                🔒
            </div>

            <h3 class="text-danger">Access Denied</h3>

            <p class="mt-3">
                <c:choose>
                    <c:when test="${not empty errorMessage}">
                        ${errorMessage}
                    </c:when>
                    <c:otherwise>
                        You do not have permission to access this page.
                    </c:otherwise>
                </c:choose>
            </p>

            <a href="${pageContext.request.contextPath}/dashboard" class="btn btn-primary btn-home">
                ⬅ Back to Dashboard
            </a>
        </div>
    </div>
</div>

<jsp:include page="/footer.jsp" />

</body>
</html>
