<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<!-- Include header JSP -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">
    <!-- Display success/error messages -->
    <c:if test="${not empty message}">
        <div class="alert alert-success" role="alert">${message}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger" role="alert">${error}</div>
    </c:if>

    <h2>${slide.slideId == 0 ? 'Add Slide' : 'Edit Slide'}</h2>

    <!-- Slide Form -->
    <form action="${pageContext.request.contextPath}/slides/save" method="post">
        <input type="hidden" name="slideId" value="${slide.slideId}">
        <input type="hidden" name="courseSessionDetailId" value="${courseSessionDetailId}">
        
        <div class="mb-3">
            <label for="title" class="form-label">Slide Title</label>
            <input type="text" class="form-control" id="title" name="title" value="${slide.title}" required>
        </div>
        <div class="mb-3">
            <label for="content" class="form-label">Slide Content</label>
            <textarea class="form-control" id="content" name="content" rows="3" required>${slide.content}</textarea>
        </div>
        <div class="mb-3">
            <label for="fileUrl" class="form-label">File URL</label>
            <input type="text" class="form-control" id="fileUrl" name="fileUrl" value="${slide.fileUrl}">
        </div>
        <div class="mb-3">
            <label for="fileType" class="form-label">File Type</label>
            <input type="text" class="form-control" id="fileType" name="fileUrl" value="${slide.fileType}">
        </div>
        <div class="mb-3">
            <label for="slideNumber" class="form-label">Slide Number</label>
            <input type="number" class="form-control" id="slideNumber" name="slideNumber" value="${slide.slideNumber}" required>
        </div>
        <div class="mb-3">
            <label for="slideOrder" class="form-label">Slide Order</label>
            <input type="number" class="form-control" id="slideOrder" name="slideOrder" value="${slide.slideOrder}" required>
        </div>

        <button type="submit" class="btn btn-primary">${slide.slideId == 0 ? 'Add Slide' : 'Update Slide'}</button>
        <button type="button" class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/slides/list?courseSessionDetailId=${courseSessionDetailId}'">Cancel</button>
    </form>
</div>

</body>
</html>
		