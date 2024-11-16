<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Course Tracking</title>
</head>
<body>

<h2>Course Tracking Details</h2>

<c:forEach var="entry" items="${trackingEntries}">
    <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
        <h3>Session: ${entry.courseSession.sessionTitle}</h3>
        <p><strong>Feedback:</strong> ${entry.feedback}</p>
        <c:if test="${not empty entry.filePath}">
            <p><strong>Uploaded File:</strong></p>
            <c:choose>
                <c:when test="${entry.filePath.endsWith('.jpg') || entry.filePath.endsWith('.png')}">
                    <img src="${entry.filePath}" alt="Uploaded Image" width="300">
                </c:when>
                <c:when test="${entry.filePath.endsWith('.mp4') || entry.filePath.endsWith('.mov')}">
                    <video width="300" controls>
                        <source src="${entry.filePath}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </c:when>
            </c:choose>
        </c:if>
        <p><strong>Posted on:</strong> <fmt:formatDate value="${entry.createdAt}" pattern="MM/dd/yyyy HH:mm" /></p>

        <!-- Social Media Links -->
        <div>
            <p>Share on:</p>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${entry.filePath}" target="_blank">Facebook</a> |
            <a href="https://www.instagram.com/?url=${entry.filePath}" target="_blank">Instagram</a> |
            <a href="https://twitter.com/share?url=${entry.filePath}" target="_blank">Twitter</a>
        </div>
    </div>
</c:forEach>

</body>
</html>
