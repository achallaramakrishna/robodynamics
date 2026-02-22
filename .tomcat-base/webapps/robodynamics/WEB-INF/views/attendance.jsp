<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Attendance</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/styles.css">
</head>
<body>
    <h1>Attendance</h1>
    <h2>Session: ${classSession.title}</h2>

    <table border="1">
        <thead>
            <tr>
                <th>Student Name</th>
                <th>Status</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="attendance" items="${attendanceList}">
                <tr>
                    <td>${attendance.student.name}</td>
                    <td>${attendance.status}</td>
                    <td>${attendance.notes}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
    <a href="${pageContext.request.contextPath}/courseTracking/courseSessions?courseOfferingId=${classSession.courseOffering.id}">Back to Course Sessions</a>
</body>
</html>
