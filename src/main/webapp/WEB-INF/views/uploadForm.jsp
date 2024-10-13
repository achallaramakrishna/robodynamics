<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<html>
<head>
    <title>File Upload Example</title>
</head>
<body>
	<jsp:include page="header.jsp" />

    <h2>File Upload Example</h2>

    <!-- Display any flash messages -->
    <c:if test="${not empty message}">
        <div style="color: green;">${message}</div>
    </c:if>

    <!-- Upload form -->
    <form method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/file/upload">
        <div class="form-group">
            <label for="file">Select file to upload:</label>
            <input type="file" class="form-control-file" name="file" id="file">
        </div>
        <button type="submit" class="btn btn-custom btn-block">Upload</button>
    </form>
    <form method="POST" action="uploadFile" enctype="multipart/form-data">
        <input type="file" name="file"/>
        <button type="submit">Upload</button>
    </form>
    <jsp:include page="footer.jsp" />
</body>

</html>
