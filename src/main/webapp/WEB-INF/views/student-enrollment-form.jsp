<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
    crossorigin="anonymous">
<script
    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
    integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
    crossorigin="anonymous"></script>
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Welcome</title>

</head>
<body>
    <jsp:include page="header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
                <br>
                <h2>Enroll for a Course</h2>
                <hr />

                <br />

                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h2>Course Offerings List</h2>
                    </div>
                    <div class="panel-body">
                        <!-- Create a row of cards -->
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            <!-- loop over and print course offerings using cards -->
                            <c:forEach var="tempCourseOffering" items="${courseOfferings}">

                                <!-- construct an "enroll" link -->
                                <c:url var="enrollLink" value="/enrollment/showEnrollmentForm">
                                    <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
                                </c:url>

                                <div class="col">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">${tempCourseOffering.course.courseName}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">Instructor: 
                                                ${tempCourseOffering.instructor.firstName} ${tempCourseOffering.instructor.lastName}
                                            </h6>
                                            <p class="card-text">
                                                <strong>Start Date:</strong> ${tempCourseOffering.startDate}<br />
                                                <strong>End Date:</strong> ${tempCourseOffering.endDate}
                                            </p>
                                            <a href="${enrollLink}" class="btn btn-primary">Enroll</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </c:forEach>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
	<!-- Include footer JSP -->
	<jsp:include page="footer.jsp" />
</body>
</html>

