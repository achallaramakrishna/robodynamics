<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Ask the AI Guru</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
	<jsp:include page="/header.jsp" />
    <div class="container mt-5">
        <h1>Ask the AI Guru</h1>
        <form action="${pageContext.request.contextPath}/api/ai/ask" method="post">
            <div class="mb-3">
                <label for="prompt" class="form-label">Your Question:</label>
                <textarea class="form-control" id="prompt" name="prompt" rows="4" required>${prompt}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Ask</button>
        </form>

        <c:if test="${not empty aiResponse}">
            <h2 class="mt-5">AI Guru's Response:</h2>
            <div class="alert alert-info">
                <p>${aiResponse}</p>
            </div>
        </c:if>

        <c:if test="${not empty error}">
            <div class="alert alert-danger mt-3">${error}</div>
        </c:if>
    </div>
    	<jsp:include page="/footer.jsp" />
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
