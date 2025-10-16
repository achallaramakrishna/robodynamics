<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossorigin="anonymous">

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
            crossorigin="anonymous"></script>

    <title>Manage Course Offerings</title>
</head>
<body>
<jsp:include page="header.jsp" />

<div class="container-fluid">
    <div class="row flex-nowrap">
        <div class="col-md-offset-1 col-md-10">
            <br>

            <!-- Back button -->
            <button class="btn btn-secondary mb-3"
                    onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                ← Back to Dashboard
            </button>

            <h2>Manage Course Offerings</h2>
            <hr />

            <!-- Only admins see the Add button -->
            <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                <input type="button" value="Add Course Offering"
                       onclick="window.location.href='${pageContext.request.contextPath}/courseoffering/showForm'; return false;"
                       class="btn btn-primary mb-4" />
            </c:if>

				<c:if test="${not empty successMessage}">
				    <div class="alert alert-success alert-dismissible fade show" role="alert">
				        ${successMessage}
				        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
				    </div>
				</c:if>
				
				<c:if test="${not empty errorMessage}">
				    <div class="alert alert-danger alert-dismissible fade show" role="alert">
				        ${errorMessage}
				        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
				    </div>
				</c:if>

            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3>Course Offerings List</h3>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered align-middle">
                            <thead class="table-dark">
                            <tr>
                                <th>Course Offering Name</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Sessions/Week</th>
                                <th>Days</th>
                                <th>Time</th>
                                <!-- Only admins see Actions column -->
                                <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                                    <th>Actions</th>
                                </c:if>
                            </tr>
                            </thead>

                            <tbody>
                            <c:forEach var="tempCourseOffering" items="${courseOfferings}">
                                <tr>
                                    <td>${tempCourseOffering.courseOfferingName}</td>
                                    <td>${tempCourseOffering.course.courseName}</td>
                                    <td>${tempCourseOffering.instructor.firstName} ${tempCourseOffering.instructor.lastName}</td>
                                    <td>${tempCourseOffering.startDate}</td>
                                    <td>${tempCourseOffering.endDate}</td>
                                    <td>${tempCourseOffering.sessionsPerWeek}</td>
                                    <td>${tempCourseOffering.daysOfWeek}</td>
                                    <td>${tempCourseOffering.sessionStartTime} - ${tempCourseOffering.sessionEndTime}</td>

                                    <!-- Only admins see edit/delete -->
									<c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
									    <td>
									        <c:url var="updateLink" value="/courseoffering/updateForm">
									            <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
									        </c:url>
									
									        <c:url var="deactivateLink" value="/courseoffering/deactivate">
									            <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
									        </c:url>
									
									        <c:url var="activateLink" value="/courseoffering/activate">
									            <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
									        </c:url>
									        
									        <c:url var="deleteLink" value="/courseoffering/delete">
											    <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
											</c:url>
									
									        <a href="${updateLink}" class="btn btn-sm btn-primary mb-1">Edit</a>
									
									        <c:choose>
									            <c:when test="${tempCourseOffering.isActive}">
									                <a href="${deactivateLink}" class="btn btn-sm btn-warning mb-1"
									                   onclick="return confirm('Deactivate this course offering?');">Deactivate</a>
									            </c:when>
									            <c:otherwise>
									                <a href="${activateLink}" class="btn btn-sm btn-success mb-1"
									                   onclick="return confirm('Reactivate this course offering?');">Activate</a>
									            </c:otherwise>
									        
									        </c:choose>
									        <!-- ✅ Delete button placed after choose block -->
											<a href="${deleteLink}" class="btn btn-sm btn-danger mb-1"
											   onclick="return confirm('⚠️ This will permanently delete the course offering. Continue?');">
											   Delete
											</a>
									    </td>
									</c:if>

                                </tr>
                            </c:forEach>

                            <c:if test="${empty courseOfferings}">
                                <tr>
                                    <td colspan="9" class="text-center text-muted">No course offerings found.</td>
                                </tr>
                            </c:if>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<jsp:include page="footer.jsp" />
</body>
</html>
