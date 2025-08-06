<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container py-3">

    <!-- Back to Dashboard -->
    <div class="mb-3">
        <a href="${pageContext.request.contextPath}/admin/dashboard" class="btn btn-outline-secondary">← Back to Dashboard</a>
    </div>

    <!-- Search Criteria Card -->
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span>🔎 Search Criteria</span>
            <button class="btn btn-light btn-sm d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#advancedFilters">
                Toggle Filters
            </button>
        </div>
        <div class="card-body">
            <form action="${pageContext.request.contextPath}/admin/search/results" method="get" class="row g-3">
                <!-- Basic Search -->
                <div class="col-md-4">
                    <input type="text" name="query" class="form-control" placeholder="Search by Name, ID, Course..." />
                </div>
                <div class="col-md-3">
                    <select name="entityType" class="form-select">
                        <option value="">All</option>
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="course">Course</option>
                        <option value="session">Session</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-success w-100">Search</button>
                </div>

                <!-- Advanced Filters (collapsible on mobile) -->
                <div class="collapse col-12 mt-3" id="advancedFilters">
                    <div class="row g-3">
                        <!-- Student Filters -->
                        <h6 class="text-primary">👩‍🎓 Student Filters</h6>
                        <div class="col-md-4">
                            <input type="text" name="studentName" class="form-control" placeholder="Student Name">
                        </div>
                        <div class="col-md-4">
                            <input type="text" name="studentId" class="form-control" placeholder="Student ID">
                        </div>
                        <div class="col-md-4">
                            <select name="grade" class="form-select">
                                <option value="">Select Grade</option>
                                <c:forEach var="grade" items="${grades}">
                                    <option value="${grade}">${grade}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="text" name="school" class="form-control" placeholder="School Name">
                        </div>
                        <div class="col-md-6">
                            <select name="status" class="form-select">
                                <option value="">Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <!-- Course Filters -->
                        <h6 class="text-primary mt-3">📘 Course Filters</h6>
                        <div class="col-md-6">
                            <input type="text" name="courseName" class="form-control" placeholder="Course Name">
                        </div>
                        <div class="col-md-6">
                            <select name="category" class="form-select">
                                <option value="">Category</option>
                                <option value="Robotics">Robotics</option>
                                <option value="Maths">Maths</option>
                                <option value="Science">Science</option>
                                <option value="Coding">Coding</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="date" name="startDate" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <input type="date" name="endDate" class="form-control">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Search Results Table -->
    <c:if test="${not empty results}">
        <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white">
                Search Results (${fn:length(results)})
            </div>
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Grade</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="r" items="${results}">
                            <tr>
                                <td>${r.name}</td>
                                <td>${r.type}</td>
                                <td>${r.grade}</td>
                                <td>${r.course}</td>
                                <td>${r.status}</td>
                                <td>
                                    <a href="#" class="btn btn-sm btn-primary">View</a>
                                    <a href="#" class="btn btn-sm btn-warning">Edit</a>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mt-3">
            <a href="${pageContext.request.contextPath}/admin/search" class="btn btn-outline-primary">← Back to Search Criteria</a>
        </div>
    </c:if>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
