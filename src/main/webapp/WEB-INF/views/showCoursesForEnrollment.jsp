<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <%@ page isELIgnored="false"%>
    <title>Robo Dynamics - Enroll Course</title>

    <!-- Bootstrap + jQuery -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <jsp:include page="header.jsp" />
<!-- 🔔 Flash Messages -->
    <c:if test="${not empty success}">
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill"></i>
            ${success}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </c:if>

    <c:if test="${not empty error}">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            ${error}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </c:if>
    
    <div class="container mt-5 mb-5">
        <h2 class="text-center mb-4">Enroll Your Child</h2>

        <div class="card shadow-sm p-4">
            <!-- Start of the form -->
            <form:form action="${pageContext.request.contextPath}/enrollment/showEnrollmentForm" 
                       method="get" modelAttribute="studentEnrollmentForm">

                <!-- Course Selection -->
                <div class="mb-3 row">
                    <label for="courseId" class="col-md-3 col-form-label fw-bold">Select Course:</label>
                    <div class="col-md-9">
                        <form:select path="courseId" id="courseId" class="form-select" onchange="updateCourseOfferings()">
                            <form:option value="" label="-- Select Course --" />
                            <c:forEach items="${availableCourses}" var="course">
                                <form:option value="${course.courseId}" label="${course.courseName}" />
                            </c:forEach>
                        </form:select>
                    </div>
                </div>

                <!-- Course Offering Selection -->
                <div class="mb-3 row">
                    <label for="courseOfferingId" class="col-md-3 col-form-label fw-bold">Select Course Offering:</label>
                    <div class="col-md-9">
                        <form:select path="courseOfferingId" id="courseOfferingId" class="form-select">
                            <form:option value="" label="-- Select Offering --" />
                        </form:select>
                    </div>
                </div>

                <!-- Student Selection -->
                <div class="mb-3 row">
                    <label for="studentId" class="col-md-3 col-form-label fw-bold">Select Student:</label>
                    <div class="col-md-9">
                        <form:select path="studentId" class="form-select">
                            <c:forEach items="${childs}" var="child">
                                <form:option value="${child.userID}" label="${child.firstName} ${child.lastName}" />
                            </c:forEach>
                        </form:select>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="text-center">
                    <button type="submit" class="btn btn-primary px-4">
                        <i class="bi bi-check-circle"></i> Submit Enrollment
                    </button>
                </div>

            </form:form>
        </div>
    </div>

    <jsp:include page="footer.jsp" />

    <!-- JavaScript Section -->
    <script>
        // Function to update course offerings dynamically
        function updateCourseOfferings() {
            var courseId = $("#courseId").val();
            var offeringSelect = $("#courseOfferingId");
            offeringSelect.empty().append('<option value="">-- Select Offering --</option>');

            if (!courseId) return;

            console.log("Fetching offerings for courseId:", courseId);

            $.get("${pageContext.request.contextPath}/enrollment/getCourseOfferings",
                { courseId: courseId },
                function(data) {
                    console.log("Received offerings:", data);

                    if (data && data.length > 0) {
                        $.each(data, function(index, offering) {
                            var start = offering.start || "N/A";
                            var end = offering.end || "N/A";
                            var mentor = offering.mentorName || "Unknown Mentor";
                            var timeRange = offering.timeRange ? " (" + offering.timeRange + ")" : "";
                            var fee = offering.feeAmount != null ? " | Fee ₹" + offering.feeAmount : "";

                            var label = start + " → " + end + " - " + mentor + timeRange + fee;

                            offeringSelect.append(
                                $('<option/>', {
                                    value: offering.courseOfferingId,
                                    text: label
                                })
                            );
                        });
                    } else {
                        offeringSelect.append('<option value="">No active offerings found</option>');
                    }
                }
            ).fail(function(xhr, textStatus, errorThrown) {
                console.error("Error loading course offerings:", textStatus, errorThrown);
                offeringSelect.append('<option value="">Error loading offerings</option>');
            });
        }
    </script>
</body>
</html>
