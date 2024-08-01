<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Mark Attendance</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/styles.css">
</head>
<body>
    <h1>Mark Attendance for ${classSession.title}</h1>
    <form action="${pageContext.request.contextPath}/attendance/save" method="post">
        <input type="hidden" name="classSessionId" value="${classSession.id}">
        <table border="1">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="attendance" items="${attendanceList}">
                    <tr>
                        <td>${attendance.student.name}</td>
                        <td>
                            <select name="status">
                                <option value="Present" ${attendance.status == 'Present' ? 'selected' : ''}>Present</option>
                                <option value="Absent" ${attendance.status == 'Absent' ? 'selected' : ''}>Absent</option>
                            </select>
                        </td>
                        <td><input type="text" name="notes" value="${attendance.notes}"></td>
                        <td>
                            <input type="hidden" name="studentId" value="${attendance.student.id}">
                            <input type="submit" value="Save">
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </form>
</body>
</html>
