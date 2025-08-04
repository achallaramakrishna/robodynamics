<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
   <!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Bundle JS (includes Popper for toggling accordions) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body>
<jsp:include page="header.jsp"/>

<div class="container my-4">
    <h2 class="text-center mb-4">Admin Dashboard</h2>

    <div class="row">
        <!-- Attendance & Tracking Card -->
        <div class="col-md-4 mb-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">Attendance & Tracking</h5>
                    <p class="card-text">Mark attendance and track student progress</p>
                    <a href="${pageContext.request.contextPath}/attendance-tracking" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>

        <!-- Include other management sections -->
        <jsp:include page="dashboard-sections.jsp"/>
    </div>
</div>

<jsp:include page="footer.jsp"/>
</body>
</html>
