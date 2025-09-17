<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leads Dashboard - Admin</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

  <!-- Include Header -->
  <jsp:include page="header.jsp" />

  <!-- Role flags (pure JSP EL) -->
  <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
  <c:set var="isAdmin" value="${pid == 1 or pid == 2}" />
  <c:set var="isMentor" value="${pid == 3}" />
  <c:set var="isParent" value="${pid == 4}" />
  <c:set var="isStudent" value="${pid == 5}" />

  <div class="container my-4">
    <h2 class="text-center mb-4">Leads Dashboard</h2>

    <!-- Row for Leads Management Section -->
    <div class="row">
      <!-- Leads Management Card -->
      <div class="col-md-12 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">📈 Leads Management</h5>
          </div>
          <div class="card-body">
            <p class="card-text">View, edit, update, and manage leads for both Parents and Mentors.</p>
            <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-primary">Go to Leads Dashboard</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Row for Leads Table -->
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">All Leads</h5>
          </div>
          <div class="card-body">
            <!-- Leads Table -->
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Audience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="lead" items="${leads}">
                  <tr>
                    <td>${lead.id}</td>
                    <td>${lead.name}</td>
                    <td>${lead.phone}</td>
                    <td>${lead.email}</td>
                    <td>${lead.audience}</td>
                    <td>${lead.status}</td>
                    <td>
                      <a href="${pageContext.request.contextPath}/leads/view/${lead.id}" class="btn btn-info btn-sm">View</a>
                      <a href="${pageContext.request.contextPath}/leads/edit/${lead.id}" class="btn btn-warning btn-sm">Edit</a>
                      <a href="${pageContext.request.contextPath}/leads/delete/${lead.id}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this lead?')">Delete</a>
                    </td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Include Footer -->
  <jsp:include page="footer.jsp" />

  <!-- Bootstrap JS Bundle (Required for Bootstrap Components like Modals) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
