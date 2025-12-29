<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register Parent & Child | Robo Dynamics</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <style>
        body {
            background: #f4f6f9;
        }
        .registration-card {
            border-radius: 16px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.12);
            background: #ffffff;
            padding: 2rem;
        }
        .form-section h4 {
            border-bottom: 2px solid #0d6efd;
            padding-bottom: .5rem;
            margin-bottom: 1.25rem;
        }
        .btn-primary {
            border-radius: 10px;
            padding: .6rem 2.5rem;
        }
    </style>

    <script>
        function validatePasswords() {
            if (parentPassword.value !== parentConfirmPassword.value) {
                alert("Parent passwords do not match");
                return false;
            }
            if (childPassword.value !== childConfirmPassword.value) {
                alert("Child passwords do not match");
                return false;
            }
            return true;
        }
    </script>
</head>

<body>

<!-- ✅ STANDARD ROBO DYNAMICS HEADER -->
<jsp:include page="header.jsp" />

<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-10">

            <div class="registration-card">
                <h2 class="text-center text-primary mb-4">
                    Parent & Child Registration
                </h2>

                <!-- Messages -->
                <c:if test="${not empty errorMessage}">
                    <div class="alert alert-danger">${errorMessage}</div>
                </c:if>
                <c:if test="${not empty successMessage}">
                    <div class="alert alert-success">${successMessage}</div>
                </c:if>

                <form:form action="${pageContext.request.contextPath}/registerParentChild"
                           modelAttribute="registrationForm"
                           method="post"
                           onsubmit="return validatePasswords()">

                    <input type="hidden" name="courseId" value="${courseId}" />

                    <div class="row g-4">

                        <!-- Parent -->
                        <div class="col-md-6 form-section">
                            <h4>Parent Information</h4>

                            <form:input path="parent.firstName" class="form-control mb-2" placeholder="First Name"/>
                            <form:input path="parent.lastName" class="form-control mb-2" placeholder="Last Name"/>
                            <form:input path="parent.email" class="form-control mb-2" placeholder="Email"/>
                            <form:input path="parent.phone" class="form-control mb-2" placeholder="Phone"/>
                            <form:input path="parent.address" class="form-control mb-2" placeholder="Address"/>
                            <form:input path="parent.city" class="form-control mb-2" placeholder="City"/>
                            <form:input path="parent.state" class="form-control mb-2" placeholder="State"/>
                            <form:input path="parent.userName" class="form-control mb-2" placeholder="Username"/>
                            <form:password path="parent.password" id="parentPassword" class="form-control mb-2" placeholder="Password"/>
                            <input type="password" id="parentConfirmPassword" class="form-control"
                                   placeholder="Confirm Password"/>
                        </div>

                        <!-- Child -->
                        <div class="col-md-6 form-section">
                            <h4>Child Information</h4>

                            <form:input path="child.firstName" class="form-control mb-2" placeholder="First Name"/>
                            <form:input path="child.lastName" class="form-control mb-2" placeholder="Last Name"/>
                            <form:input path="child.age" class="form-control mb-2" placeholder="Age"/>
                            <form:input path="child.school" class="form-control mb-2" placeholder="School"/>
                            <form:input path="child.userName" class="form-control mb-2" placeholder="Username"/>
                            <form:password path="child.password" id="childPassword" class="form-control mb-2" placeholder="Password"/>
                            <input type="password" id="childConfirmPassword" class="form-control"
                                   placeholder="Confirm Password"/>
                        </div>
                    </div>

                    <div class="text-center mt-4">
                        <button type="submit" class="btn btn-primary">
                            Register
                        </button>
                    </div>

                </form:form>
            </div>

        </div>
    </div>
</div>

<!-- ✅ STANDARD ROBO DYNAMICS FOOTER -->
<jsp:include page="footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
