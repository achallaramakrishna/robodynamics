<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register Parent and Child | Robo Dynamics</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- ✅ Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: #f8f9fa;
        }
        .registration-card {
            border: 0;
            border-radius: 16px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.1);
            background: #fff;
            padding: 2rem;
        }
        .form-section h4 {
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .btn-primary {
            border-radius: 10px;
            padding: 0.6rem 2rem;
        }
    </style>

    <script type="text/javascript">
        function validatePasswords() {
            var parentPassword = document.getElementById("parentPassword").value;
            var parentConfirmPassword = document.getElementById("parentConfirmPassword").value;
            var childPassword = document.getElementById("childPassword").value;
            var childConfirmPassword = document.getElementById("childConfirmPassword").value;

            if (parentPassword !== parentConfirmPassword) {
                alert("Parent passwords do not match!");
                return false;
            }

            if (childPassword !== childConfirmPassword) {
                alert("Child passwords do not match!");
                return false;
            }

            return true;
        }
    </script>
</head>

<body>
<jsp:include page="header.jsp" />

<div class="container my-5">
    <div class="registration-card mx-auto col-md-10">
        <h2 class="text-center text-primary mb-4">Parent & Child Registration</h2>

        <!-- ✅ Display Error / Success -->
        <c:if test="${not empty errorMessage}">
            <div class="alert alert-danger">${errorMessage}</div>
        </c:if>
        <c:if test="${not empty successMessage}">
            <div class="alert alert-success">${successMessage}</div>
        </c:if>

        <!-- ✅ Spring Form -->
        <form:form action="registerParentChild" modelAttribute="registrationForm" method="post" onsubmit="return validatePasswords()">
            <input type="hidden" name="courseId" value="${courseId}" />

            <div class="row">
                <!-- 🧑‍💼 Parent Section -->
                <div class="col-md-6 form-section">
                    <h4>Parent Information</h4>

                    <div class="mb-3">
                        <label for="parentFirstName" class="form-label">First Name</label>
                        <form:input path="parent.firstName" id="parentFirstName" class="form-control" placeholder="Enter first name"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentLastName" class="form-label">Last Name</label>
                        <form:input path="parent.lastName" id="parentLastName" class="form-control" placeholder="Enter last name"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentEmail" class="form-label">Email</label>
                        <form:input path="parent.email" id="parentEmail" class="form-control" placeholder="example@email.com"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentPhone" class="form-label">Phone</label>
                        <form:input path="parent.phone" id="parentPhone" class="form-control" placeholder="10-digit number"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentAddress" class="form-label">Address</label>
                        <form:input path="parent.address" id="parentAddress" class="form-control" placeholder="Enter address"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentCity" class="form-label">City</label>
                        <form:input path="parent.city" id="parentCity" class="form-control" placeholder="Enter city"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentState" class="form-label">State</label>
                        <form:input path="parent.state" id="parentState" class="form-control" placeholder="Enter state"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentUserName" class="form-label">Username</label>
                        <form:input path="parent.userName" id="parentUserName" class="form-control" placeholder="Choose a username"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentPassword" class="form-label">Password</label>
                        <form:password path="parent.password" id="parentPassword" class="form-control" placeholder="Enter password"/>
                    </div>

                    <div class="mb-3">
                        <label for="parentConfirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="parentConfirmPassword" class="form-control" placeholder="Re-enter password"/>
                    </div>
                </div>

                <!-- 👧 Child Section -->
                <div class="col-md-6 form-section">
                    <h4>Child Information</h4>

                    <div class="mb-3">
                        <label for="childFirstName" class="form-label">First Name</label>
                        <form:input path="child.firstName" id="childFirstName" class="form-control" placeholder="Enter first name"/>
                    </div>

                    <div class="mb-3">
                        <label for="childLastName" class="form-label">Last Name</label>
                        <form:input path="child.lastName" id="childLastName" class="form-control" placeholder="Enter last name"/>
                    </div>

                    <div class="mb-3">
                        <label for="childAge" class="form-label">Age</label>
                        <form:input path="child.age" id="childAge" class="form-control" placeholder="Enter age"/>
                    </div>

                    <div class="mb-3">
                        <label for="childSchool" class="form-label">School</label>
                        <form:input path="child.school" id="childSchool" class="form-control" placeholder="Enter school name"/>
                    </div>

                    <div class="mb-3">
                        <label for="childUserName" class="form-label">Username</label>
                        <form:input path="child.userName" id="childUserName" class="form-control" placeholder="Choose a username"/>
                    </div>

                    <div class="mb-3">
                        <label for="childPassword" class="form-label">Password</label>
                        <form:password path="child.password" id="childPassword" class="form-control" placeholder="Enter password"/>
                    </div>

                    <div class="mb-3">
                        <label for="childConfirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="childConfirmPassword" class="form-control" placeholder="Re-enter password"/>
                    </div>
                </div>
            </div>

            <!-- ✅ Submit -->
            <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary px-4">Register</button>
            </div>
        </form:form>
    </div>
</div>

<jsp:include page="footer.jsp" />

<!-- ✅ Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
