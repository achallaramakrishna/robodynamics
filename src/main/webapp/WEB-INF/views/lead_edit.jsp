<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Edit Lead</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>

    <!-- Include Header -->
    <jsp:include page="header.jsp" />

    <div class="container py-5">
        <h1 class="mb-4">Edit Lead</h1>

        <form:form modelAttribute="lead" method="POST" action="${pageContext.request.contextPath}/leads/update/${lead.id}">
            <div class="form-group mb-3">
                <label for="name" class="form-label">Name</label>
                <form:input path="name" class="form-control" id="name"/>
            </div>
            <div class="form-group mb-3">
                <label for="phone" class="form-label">Phone</label>
                <form:input path="phone" class="form-control" id="phone"/>
            </div>
            <div class="form-group mb-3">
                <label for="email" class="form-label">Email</label>
                <form:input path="email" class="form-control" id="email"/>
            </div>
            <div class="form-group mb-3">
                <label for="audience" class="form-label">Audience</label>
                <form:select path="audience" class="form-select" id="audience">
                    <option value="parent" <c:if test="${lead.audience == 'parent'}">selected</c:if>>Parent</option>
                    <option value="mentor" <c:if test="${lead.audience == 'mentor'}">selected</c:if>>Mentor</option>
                </form:select>
            </div>
            <div class="form-group mb-3">
                <label for="status" class="form-label">Status</label>
                <form:select path="status" class="form-select" id="status">
                    <option value="new" <c:if test="${lead.status == 'new'}">selected</c:if>>New</option>
                    <option value="contacted" <c:if test="${lead.status == 'contacted'}">selected</c:if>>Contacted</option>
                    <option value="qualified" <c:if test="${lead.status == 'qualified'}">selected</c:if>>Qualified</option>
                    <option value="won" <c:if test="${lead.status == 'won'}">selected</c:if>>Won</option>
                    <option value="lost" <c:if test="${lead.status == 'lost'}">selected</c:if>>Lost</option>
                </form:select>
            </div>
            <div class="form-group mb-3">
                <button type="submit" class="btn btn-primary">Update Lead</button>
            </div>
        </form:form>
    </div>

    <!-- Include Footer -->
    <jsp:include page="footer.jsp" />

    <!-- Bootstrap JS Bundle (Required for Bootstrap Components like Modals) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
