<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Course Sessions</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/styles.css">
</head>
<body>
    <h1>Course Sessions</h1>
    <h2>Course: ${courseOffering.courseOfferingName}</h2>

    <table border="1">
        <thead>
            <tr>
                <th>Session Date</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="session" items="${classSessions}">
                <tr>
                    <td>${session.sessionDate}</td>
                    <td>${session.title}</td>
                    <td>${session.description}</td>
                    <td>
                        <a href="${pageContext.request.contextPath}/courseTracking/attendance?classSessionId=${session.id}">View Attendance</a>
                    </td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</body>
</html>
