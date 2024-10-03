<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <%@ page isELIgnored="false"%>

    <title>Robo Dynamics - Enroll Course</title>
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

    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-info text-white">
                        <h3 class="card-title text-center">Enroll for a Course</h3>
                    </div>
                    <div class="card-body">
                        <form:form action="saveStudentEnrollment" method="post" 
                            modelAttribute="studentEnrollmentForm" enctype="multipart/form-data">

                            <!-- Hidden field for course offering ID -->
                            <form:hidden path="courseOfferingId" />

                            <!-- Course Name -->
                            <div class="mb-3 row">
                                <label class="col-md-3 col-form-label fw-bold">Course Name:</label>
                                <div class="col-md-9">
                                    <p class="form-control-plaintext">${courseOffering.course.courseName}</p>
                                </div>
                            </div>

                            <!-- Instructor Name -->
                            <div class="mb-3 row">
                                <label class="col-md-3 col-form-label fw-bold">Instructor:</label>
                                <div class="col-md-9">
                                    <p class="form-control-plaintext">
                                        ${courseOffering.instructor.firstName} ${courseOffering.instructor.lastName}
                                    </p>
                                </div>
                            </div>

                            <!-- Start Date -->
                            <div class="mb-3 row">
                                <label class="col-md-3 col-form-label fw-bold">Start Date:</label>
                                <div class="col-md-9">
                                    <p class="form-control-plaintext">${courseOffering.startDate}</p>
                                </div>
                            </div>

                            <!-- End Date -->
                            <div class="mb-3 row">
                                <label class="col-md-3 col-form-label fw-bold">End Date:</label>
                                <div class="col-md-9">
                                    <p class="form-control-plaintext">${courseOffering.endDate}</p>
                                </div>
                            </div>

                            <!-- Student Selection -->
                            <div class="mb-3 row">
                                <label for="studentId" class="col-md-3 col-form-label fw-bold">Select Student:</label>
                                <div class="col-md-9">
                                    <form:select path="studentId" cssClass="form-select">
                                        <c:forEach items="${childs}" var="child">
                                            <form:option value="${child.userID}" label="${child.firstName} ${child.lastName}" />
                                        </c:forEach>
                                    </form:select>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>

                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
	<!-- Include footer JSP -->
	<jsp:include page="footer.jsp" />
</body>
</html>
