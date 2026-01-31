<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <%@ page isELIgnored="false" %>
    <title>Robo Dynamics - Manage Workshops</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js" 
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" 
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js" 
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/" 
            crossorigin="anonymous"></script>
</head>
<body>
    <jsp:include page="header.jsp" />
    <div class="container">
        <h2 class="mt-4">Manage Workshops</h2>
        <!-- Enabling file upload with multipart/form-data -->
        <form:form action="saveWorkshop" modelAttribute="workshop" method="post" enctype="multipart/form-data" class="mt-4">

            <form:hidden path="workshopId" />

            <!-- Workshop Name -->
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <form:input path="name" cssClass="form-control" placeholder="Enter workshop name" />
            </div>

            <!-- Description -->
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <form:textarea path="description" cssClass="form-control" rows="3" placeholder="Enter workshop description"></form:textarea>
            </div>

            <!-- Date -->
            <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <form:input path="date" cssClass="form-control" type="date" />
            </div>

            <!-- Location -->
            <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <form:input path="location" cssClass="form-control" placeholder="Enter location" />
            </div>

            <!-- Flyer Image Upload -->
            <div class="mb-3">
                <label for="flyerImageFile" class="form-label">Flyer Image</label>
                <form:file path="flyerImageFile" cssClass="form-control" />
            </div>

            <!-- Course Contents PDF Upload -->
            <div class="mb-3">
                <label for="courseContentsPdfFile" class="form-label">Course Contents PDF</label>
                <form:file path="courseContentsPdfFile" cssClass="form-control" />
            </div>

            <!-- Duration -->
            <div class="mb-3">
                <label for="duration" class="form-label">Duration (in hours)</label>
                <form:input path="duration" cssClass="form-control" type="number" placeholder="Enter duration in hours" />
            </div>

            <!-- Maximum Participants -->
            <div class="mb-3">
                <label for="maxParticipants" class="form-label">Maximum Participants</label>
                <form:input path="maxParticipants" cssClass="form-control" type="number" placeholder="Enter maximum participants" />
            </div>

            <!-- Registration Fee -->
            <div class="mb-3">
                <label for="registrationFee" class="form-label">Registration Fee</label>
                <form:input path="registrationFee" cssClass="form-control" type="number" step="0.01" placeholder="Enter registration fee" />
            </div>

            <!-- Submit Button -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">Save Workshop</button>
            </div>

        </form:form>

        <!-- Display Existing Workshops -->
        <h3 class="mt-5">Existing Workshops</h3>
        <table class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="workshop" items="${workshops}">
                    <tr>
                        <td>${workshop.workshopId}</td>
                        <td>${workshop.name}</td>
                        <td>${workshop.date}</td>
                        <td>${workshop.location}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/workshops/updateForm?workshopId=${workshop.workshopId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/workshops/delete?workshopId=${workshop.workshopId}" class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>
    <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
