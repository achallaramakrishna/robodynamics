<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>View Lead</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>

    <!-- Include Header -->
    <jsp:include page="header.jsp" />

    <div class="container py-5">
        <h1 class="mb-4">View Lead</h1>

        <!-- Lead Details -->
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Lead ID: ${lead.id}</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label><strong>Name:</strong></label>
                    <p>${lead.name}</p>
                </div>
                <div class="mb-3">
                    <label><strong>Phone:</strong></label>
                    <p>${lead.phone}</p>
                </div>
                <div class="mb-3">
                    <label><strong>Email:</strong></label>
                    <p>${lead.email}</p>
                </div>
                <div class="mb-3">
                    <label><strong>Audience:</strong></label>
                    <p>${lead.audience}</p>
                </div>
                <div class="mb-3">
                    <label><strong>Status:</strong></label>
                    <p>${lead.status}</p>
                </div>

                <!-- Edit Button -->
                <a href="${pageContext.request.contextPath}/leads/edit/${lead.id}" class="btn btn-warning">Edit Lead</a>
                <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-secondary">Back to Dashboard</a>
            </div>
        </div>
    </div>

    <!-- Include Footer -->
    <jsp:include page="footer.jsp" />

    <!-- Bootstrap JS Bundle (Required for Bootstrap Components like Modals) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
