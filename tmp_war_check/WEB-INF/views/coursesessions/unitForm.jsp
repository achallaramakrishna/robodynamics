d<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Add' : 'Edit'} Unit</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Include CKEditor CSS (if necessary) -->
    <!-- No CSS needed as CKEditor loads its own styles -->
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Add' : 'Edit'} Unit</h1>

        <!-- Display success or error messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Unit Form using Spring form tag -->
        <f:form action="${pageContext.request.contextPath}/courseSession/saveUnit" method="post" modelAttribute="courseSession">
            <!-- Hidden field for courseSessionId if it's an edit operation -->
            <f:hidden path="courseSessionId"/>

            <!-- Hidden field for courseId since we already selected the course -->
            <f:hidden path="course.courseId" value="${courseId}"/>

            <!-- Hidden field for sessionType (set to 'unit') -->
            <f:hidden path="sessionType" value="unit"/>

            <!-- Unit Title Field -->
            <div class="mb-3">
                <f:label path="sessionTitle" cssClass="form-label">Unit Title</f:label>
                <f:input path="sessionTitle" cssClass="form-control" required="true"/>
            </div>

            <!-- Version Field -->
            <div class="mb-3">
                <f:label path="version" cssClass="form-label">Version</f:label>
                <f:input path="version" cssClass="form-control" type="number" required="true"/>
            </div>

            <!-- Unit ID Field (optional for units) -->
            <div class="mb-3">
                <f:label path="sessionId" cssClass="form-label">Unit ID</f:label>
                <f:input path="sessionId" cssClass="form-control" type="number" placeholder="Enter unit ID (optional)"/>
            </div>

            <!-- Grade Field (if applicable) -->
            <div class="mb-3">
                <f:label path="grade" cssClass="form-label">Grade</f:label>
                <f:input path="grade" cssClass="form-control" type="text" placeholder="Enter grade (optional)"/>
            </div>

            <!-- Unit Description Field -->
            <div class="mb-3">
                <f:label path="sessionDescription" cssClass="form-label">Unit Description</f:label>
                <f:textarea path="sessionDescription" cssClass="form-control" id="sessionDescription" rows="5"></f:textarea>
            </div>

            <!-- Submit and Cancel Buttons -->
            <button type="submit" class="btn btn-primary">${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Save' : 'Update'} Unit</button>
            <a href="${pageContext.request.contextPath}/courseSession/list?courseId=${courseId}" class="btn btn-secondary">Cancel</a>
        </f:form>
    </div>

    <!-- Include CKEditor JS -->
    <script src="https://cdn.ckeditor.com/4.16.2/standard/ckeditor.js"></script>

    <!-- Initialize CKEditor -->
    <script>
        CKEDITOR.replace('sessionDescription');
    </script>

    <!-- Include footer JSP -->
    <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
