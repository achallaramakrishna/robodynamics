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
    <title>${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Add' : 'Edit'} Course Session Detail</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Add' : 'Edit'} Course Session Detail</h1>

        <!-- Display success or error messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Course Session Detail Form using Spring form tag -->
        <f:form action="${pageContext.request.contextPath}/sessiondetail/save" method="post" modelAttribute="courseSessionDetail">
            <!-- Hidden field for courseSessionDetailId if it's an edit operation -->
            <f:hidden path="courseSessionDetailId"/>

            <!-- Hidden field for courseSessionId and courseId -->
            <f:hidden path="courseSession.courseSessionId" value="${courseSessionId}"/>
            <f:hidden path="course.courseId" value="${courseId}"/>

            <!-- Topic Field -->
            <div class="mb-3">
                <f:label path="topic" cssClass="form-label">Topic</f:label>
                <f:textarea path="topic" cssClass="form-control" rows="3" required="true"></f:textarea>
            </div>

            <!-- Version Field -->
            <div class="mb-3">
                <f:label path="version" cssClass="form-label">Version</f:label>
                <f:input path="version" cssClass="form-control" type="number" required="true"/>
            </div>

            <!-- Type Field (e.g., video, pdf) -->
            <div class="mb-3">
                <f:label path="type" cssClass="form-label">Type</f:label>
                <f:select path="type" cssClass="form-control">
                    <option value="">Select Type</option>
                    <option value="slide" ${courseSessionDetail.type == 'slide' ? 'selected' : ''}>Slide</option>
                    <option value="video" ${courseSessionDetail.type == 'video' ? 'selected' : ''}>Video</option>
                    <option value="pdf" ${courseSessionDetail.type == 'pdf' ? 'selected' : ''}>PDF</option>
                    <option value="document" ${courseSessionDetail.type == 'document' ? 'selected' : ''}>Document</option>
                    <option value="quiz" ${courseSessionDetail.type == 'quiz' ? 'selected' : ''}>Quiz</option>
                </f:select>
            </div>

            <!-- File Field (for uploading files like videos, PDFs) -->
            <div class="mb-3">
                <f:label path="file" cssClass="form-label">File</f:label>
                <f:input path="file" cssClass="form-control" type="text" placeholder="Enter file path or URL"/>
            </div>

            <!-- Submit and Cancel Buttons -->
            <button type="submit" class="btn btn-primary">${courseSessionDetail.courseSessionDetailId == null || courseSessionDetail.courseSessionDetailId == 0 ? 'Save' : 'Update'} Session Detail</button>
            <a href="${pageContext.request.contextPath}/sessiondetail/list?courseSessionId=${courseSessionId}&courseId=${courseId}" class="btn btn-secondary">Cancel</a>
        </f:form>

    </div>

    <!-- Include footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
