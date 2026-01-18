<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<html>
<head>
<title>Memory Maps</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
<div class="container mt-4">

    <h3 class="fw-bold">🗺 Memory Maps – ${session.sessionTitle}</h3>

    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
       ← Back to Session
    </a>

    <ul class="list-group">
        <c:forEach items="${memoryMaps}" var="m">
            <li class="list-group-item">
                ${m.topic}
            </li>
        </c:forEach>

        <c:if test="${empty memoryMaps}">
            <li class="list-group-item text-muted">No memory maps available.</li>
        </c:if>
    </ul>

</div>
</body>
</html>
