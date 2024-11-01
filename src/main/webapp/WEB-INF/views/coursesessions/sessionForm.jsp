<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Add' : 'Edit'} Course Session</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Include CKEditor CSS (if necessary) -->
    <!-- No CSS needed as CKEditor loads its own styles -->
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Add' : 'Edit'} Course Session</h1>

        <!-- Display success or error messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Session Form using Spring form tag -->
        <f:form action="${pageContext.request.contextPath}/courseSession/saveSession" method="post" modelAttribute="courseSession">
            <!-- Hidden field for courseSessionId if it's an edit operation -->
            <f:hidden path="courseSessionId"/>

            <!-- Hidden field for courseId -->
            <f:hidden path="course.courseId" value="${courseId}"/>

            <!-- Hidden field for sessionType (set to 'session') -->
            <f:hidden path="sessionType" value="session"/>

            <!-- Session Title Field -->
            <div class="mb-3">
                <f:label path="sessionTitle" cssClass="form-label">Session Title</f:label>
                <f:input path="sessionTitle" cssClass="form-control" required="true"/>
            </div>

            <!-- Version Field -->
            <div class="mb-3">
                <f:label path="version" cssClass="form-label">Version</f:label>
                <f:input path="version" cssClass="form-control" type="number" required="true"/>
            </div>

            <!-- Session ID Field -->
            <div class="mb-3">
                <f:label path="sessionId" cssClass="form-label">Session ID</f:label>
                <f:input path="sessionId" cssClass="form-control" type="number" placeholder="Enter session ID (optional)"/>
            </div>

            <!-- Parent Unit Selection -->
            <div class="mb-3">
                <f:label path="parentSession.courseSessionId" cssClass="form-label">Parent Unit</f:label>
                <f:select path="parentSession.courseSessionId" cssClass="form-control" required="true">
                    <f:option value="">-- Select Unit --</f:option>
                    <f:options items="${units}" itemValue="courseSessionId" itemLabel="sessionTitle"/>
                </f:select>
            </div>

            <!-- Grade Field (optional) -->
            <div class="mb-3">
                <f:label path="grade" cssClass="form-label">Grade</f:label>
                <f:input path="grade" cssClass="form-control" type="text" placeholder="Enter grade (optional)"/>
            </div>

            <!-- Session Description Field -->
            <div class="mb-3">
                <f:label path="sessionDescription" cssClass="form-label">Session Description</f:label>
                <f:textarea path="sessionDescription" cssClass="form-control" id="sessionDescription" rows="5"></f:textarea>
            </div>

            <!-- Submit and Cancel Buttons -->
            <button type="submit" class="btn btn-primary">${courseSession.courseSessionId == null || courseSession.courseSessionId == 0 ? 'Save' : 'Update'} Session</button>
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
    <jsp:include page="/footer.jsp" />
</body>
</html>
