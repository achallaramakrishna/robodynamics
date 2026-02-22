<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossorigin="anonymous">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <title>Register Parent and Child</title>
    
    <style>
        .form-section {
            margin-bottom: 20px;
        }
    </style>

    <script type="text/javascript">
        function validatePasswords() {
            var parentPassword = document.getElementById("parentPassword").value;
            var parentConfirmPassword = document.getElementById("parentConfirmPassword").value;
            var childPassword = document.getElementById("childPassword").value;
            var childConfirmPassword = document.getElementById("childConfirmPassword").value;

            // Parent password validation
            if (parentPassword !== parentConfirmPassword) {
                alert("Parent passwords do not match!");
                return false;
            }

            // Child password validation
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

<div class="container">
    <h2 class="my-4 text-center">Parent & Child Registration</h2>

  <!-- Display error message if it exists -->
    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger" role="alert">
            ${errorMessage}
        </div>
    </c:if>
    
    <!-- Start of Form -->
    <f:form action="registerParentChild" modelAttribute="registrationForm" method="post" onsubmit="return validatePasswords()">
        <input type="hidden" name="courseId" value="${courseId}" />
        
        <div class="row">
            <!-- Parent Section -->
            <div class="col-md-6 form-section">
                <h3>Parent Information</h3>
                
                <div class="form-group">
                    <label for="parentEmail">Email</label>
                    <f:input type="text" path="parent.email" class="form-control" id="parentEmail" />
                </div>
                
                <div class="form-group">
                    <label for="parentPhone">Phone</label>
                    <f:input type="text" path="parent.phone" class="form-control" id="parentPhone" />
                </div>

                <div class="form-group">
                    <label for="parentFirstName">First Name</label>
                    <f:input type="text" path="parent.firstName" class="form-control" id="parentFirstName" />
                </div>
                
                <div class="form-group">
                    <label for="parentLastName">Last Name</label>
                    <f:input type="text" path="parent.lastName" class="form-control" id="parentLastName" />
                </div>
                
                <div class="form-group">
                    <label for="parentAddress">Address</label>
                    <f:input type="text" path="parent.address" class="form-control" id="parentAddress" />
                </div>

                <div class="form-group">
                    <label for="parentCity">City</label>
                    <f:input type="text" path="parent.city" class="form-control" id="parentCity" />
                </div>
                
                <div class="form-group">
                    <label for="parentState">State</label>
                    <f:input type="text" path="parent.state" class="form-control" id="parentState" />
                </div>

                <!-- Parent Username and Password -->
                <div class="form-group">
                    <label for="parentUserName">Username</label>
                    <f:input type="text" path="parent.userName" class="form-control" id="parentUserName" />
                </div>

                <div class="form-group">
                    <label for="parentPassword">Password</label>
                    <f:input type="password" path="parent.password" class="form-control" id="parentPassword" />
                </div>

                <div class="form-group">
                    <label for="parentConfirmPassword">Confirm Password</label>
                    <input type="password"  name="parentConfirmPassword" class="form-control" id="parentConfirmPassword" />
                </div>
            </div>

            <!-- Child Section -->
            <div class="col-md-6 form-section">
                <h3>Child Information</h3>
                
                <div class="form-group">
                    <label for="childFirstName">First Name</label>
                    <f:input type="text" path="child.firstName" class="form-control" id="childFirstName" />
                </div>
                
                <div class="form-group">
                    <label for="childLastName">Last Name</label>
                    <f:input type="text" path="child.lastName" class="form-control" id="childLastName" />
                </div>
                
                <div class="form-group">
                    <label for="childAge">Age</label>
                    <f:input type="text" path="child.age" class="form-control" id="childAge" />
                </div>
                
                <div class="form-group">
                    <label for="childSchool">School</label>
                    <f:input type="text" path="child.school" class="form-control" id="childSchool" />
                </div>

                <!-- Child Username and Password -->
                <div class="form-group">
                    <label for="childUserName">Username</label>
                    <f:input type="text" path="child.userName" class="form-control" id="childUserName" />
                </div>

                <div class="form-group">
                    <label for="childPassword">Password</label>
                    <f:input type="password" path="child.password" class="form-control" id="childPassword" />
                </div>

                <div class="form-group">
                    <label for="childConfirmPassword">Confirm Password</label>
                    <input type="password" name="childConfirmPassword" class="form-control" id="childConfirmPassword" />
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
            <button type="submit" id="submitBtn" class="btn btn-primary">Submit</button>
        </div>
    </f:form>
    <!-- End of Form -->
<!-- You can add a script to check if courseId is present -->
<script>
    console.log('Course ID:', document.querySelector('input[name="courseId"]').value);
</script>
    <hr>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
</body>
</html>
