<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>Slides List</title>
</head>
<body>
    <h2>Slides</h2>
    <ul>
        <c:forEach items="${slides}" var="slide">
            <li>
                <a href="${pageContext.request.contextPath}/slide/view/${slide.slideId}">
                    ${slide.title}
                </a>
            </li>
        </c:forEach>
    </ul>
    <a href="${pageContext.request.contextPath}/slide/add">Add New Slide</a>
</body>
</html>
