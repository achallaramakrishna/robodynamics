<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Course Tracking - Add Entry</title>
</head>
<body>

<h2>Add Course Tracking Entry</h2>
<form action="${pageContext.request.contextPath}/courseTracking/save" method="post" enctype="multipart/form-data">
    <label for="student">Select Student:</label>
    <select name="userId" id="student">
        <c:forEach var="student" items="${students}">
            <option value="${student.userId}">${student.userName}</option>
        </c:forEach>
    </select><br><br>

    <label for="courseSession">Select Course Session:</label>
    <select name="courseSessionId" id="courseSession">
        <c:forEach var="session" items="${courseSessions}">
            <option value="${session.courseSessionId}">${session.sessionTitle}</option>
        </c:forEach>
    </select><br><br>

    <label for="feedback">Feedback:</label>
    <textarea name="feedback" id="feedback" rows="4" cols="50"></textarea><br><br>

    <label for="file">Upload File (image/video):</label>
    <input type="file" name="file" id="file"><br><br>

    <button type="submit">Submit</button>
</form>

<c:if test="${not empty message}">
    <p>${message}</p>
</c:if>

</body>
</html>
