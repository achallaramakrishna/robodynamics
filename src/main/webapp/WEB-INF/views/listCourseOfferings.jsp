<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

    <title>Manage Course Offerings</title>
</head>
<body>

<jsp:include page="header.jsp" />

<div class="container-fluid">
    <div class="row flex-nowrap">
        <div class="col-md-10 offset-md-1">

            <br>

            <!-- Back button -->
            <button class="btn btn-secondary mb-3"
                    onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                ← Back to Dashboard
            </button>

            <h2>Manage Course Offerings</h2>
            <hr />

            <!-- Admin Add Button -->
            <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                <button class="btn btn-primary mb-4"
                        onclick="window.location.href='${pageContext.request.contextPath}/courseoffering/showForm';">
                    Add Course Offering
                </button>
            </c:if>

            <!-- Success / Error Messages -->
            <c:if test="${not empty successMessage}">
                <div class="alert alert-success">${successMessage}</div>
            </c:if>

            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">${errorMessage}</div>
            </c:if>

            <!-- 🔍 FILTER BAR -->
            <form method="get"
                  action="${pageContext.request.contextPath}/courseoffering/list"
                  class="row g-3 mb-4 border rounded p-3 bg-light">

                <!-- Course Category -->
                <div class="col-md-3">
                    <label class="form-label">Course Category</label>
                    <select name="categoryId" class="form-select">
                        <option value="">-- All Categories --</option>
                        <c:forEach var="cat" items="${courseCategories}">
                            <option value="${cat.courseCategoryId}"
                                <c:if test="${cat.courseCategoryId == selectedCategoryId}">selected</c:if>>
                                ${cat.courseCategoryName}
                            </option>
                        </c:forEach>
                    </select>
                </div>

                <!-- Course -->
                <div class="col-md-3">
                    <label class="form-label">Course</label>
                    <select name="courseId" class="form-select">
                        <option value="">-- All Courses --</option>
                        <c:forEach var="c" items="${courses}">
                            <option value="${c.courseId}"
                                <c:if test="${c.courseId == selectedCourseId}">selected</c:if>>
                                ${c.courseName}
                            </option>
                        </c:forEach>
                    </select>
                </div>

                <!-- Mentor (Admins only) -->
                <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                    <div class="col-md-3">
                        <label class="form-label">Mentor</label>
                        <select name="mentorId" class="form-select">
                            <option value="">-- All Mentors --</option>
                            <c:forEach var="m" items="${mentors}">
                                <option value="${m.userID}"
                                    <c:if test="${m.userID == selectedMentorId}">selected</c:if>>
                                    ${m.firstName} ${m.lastName}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                </c:if>

                <!-- Buttons -->
                <div class="col-md-3 d-flex align-items-end">
                    <button type="submit" class="btn btn-primary me-2">
                        Apply Filters
                    </button>
                    <a href="${pageContext.request.contextPath}/courseoffering/list"
                       class="btn btn-outline-secondary">
                        Reset
                    </a>
                </div>
            </form>

            <!-- 📋 TABLE -->
            <div class="table-responsive">
                <table class="table table-striped table-bordered align-middle">
                    <thead class="table-dark">
                    <tr>
                        <th>Offering Name</th>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Sessions/Week</th>
                        <th>Days</th>
                        <th>Time</th>

                        <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                            <th>Fee (₹)</th>
                            <th>Actions</th>
                        </c:if>

                        <c:if test="${rdUser.profile_id == 3}">
                            <th>Testimonial</th>
                        </c:if>
                    </tr>
                    </thead>

                    <tbody>
                    <c:forEach var="o" items="${courseOfferings}">
                        <tr>
                            <td>${o.courseOfferingName}</td>
                            <td>${o.course.courseName}</td>
                            <td>${o.instructor.firstName} ${o.instructor.lastName}</td>
                            <td>${o.startDate}</td>
                            <td>${o.endDate}</td>
                            <td>${o.sessionsPerWeek}</td>
                            <td>${o.daysOfWeek}</td>
                            <td>${o.sessionStartTime} - ${o.sessionEndTime}</td>

                            <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                                <td class="text-end">
                                    <fmt:formatNumber value="${o.feeAmount}" pattern="#,##0.00"/>
                                </td>
                                <td>
                                    <a href="${pageContext.request.contextPath}/courseoffering/updateForm?courseOfferingId=${o.courseOfferingId}"
                                       class="btn btn-sm btn-primary">Edit</a>
                                </td>
                            </c:if>

                            <c:if test="${rdUser.profile_id == 3}">
                                <td>
                                    <a href="${pageContext.request.contextPath}/mentor/testimonial-form?courseOfferingId=${o.courseOfferingId}"
                                       class="btn btn-info btn-sm">
                                        Post Testimonial
                                    </a>
                                </td>
                            </c:if>
                        </tr>
                    </c:forEach>

                    <c:if test="${empty courseOfferings}">
                        <tr>
                            <td colspan="10" class="text-center text-muted">
                                No course offerings found.
                            </td>
                        </tr>
                    </c:if>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</div>

<jsp:include page="footer.jsp" />
</body>
</html>
