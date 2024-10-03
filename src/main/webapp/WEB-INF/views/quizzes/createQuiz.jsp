<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html lang="en">
<head>
<%@ page isELIgnored="false"%>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Quiz</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>

    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // Fetch sessions based on course selection

        document.getElementById('course').addEventListener('change', function() {
		    var courseId = this.value;
		    console.log('Selected courseId:', courseId);  // Log the selected course ID
		
		    if (courseId) {
		        console.log('Fetching sessions for course:', courseId);
		
		        fetch(`${pageContext.request.contextPath}/quizzes/getSessionByCourse?courseId=` + courseId)
		            .then(response => response.json())
		            .then(data => {
		                console.log('Response data:', data);  // Log the full response data
		                
		                var sessionSelect = document.getElementById('session');
		                sessionSelect.innerHTML = '<option value="">Select a session</option>';  // Clear existing options
		                
		                // Populate the session dropdown with the response
		                data.forEach(function(session) {
		                    console.log('Session:', session);  // Log each session for debugging
		
		                    var option = document.createElement('option');
		                    option.value = session.courseSessionId;   // Use sessionId for value
		                    option.text = session.sessionTitle;  // Use sessionTitle for display text
		                    
		                    sessionSelect.appendChild(option);  // Append the new option to the dropdown
		                });
		            })
		            .catch(error => console.error('Error fetching sessions:', error));
		    } else {
		        console.log('No course selected');
		    }
		});



        // Fetch session details based on session selection
        document.getElementById('session').addEventListener('change', function() {
            var sessionId = this.value;
            console.log('Selected sessionId:', sessionId);  // Debug to check sessionId

            if (sessionId) {
                fetch(`${pageContext.request.contextPath}/quizzes/getSessionDetailsBySession?sessionId=` + sessionId)
                .then(response => response.json())
                .then(data => {
    				console.log('Response data:', data);  // Log the full response data

                    var sessionDetailSelect = document.getElementById('sessionDetail');
                    sessionDetailSelect.innerHTML = '';
                    data.forEach(function(detail) {
                        var option = document.createElement('option');
                        option.value = detail.courseSessionDetailId;
                        option.text = detail.topic;
                        sessionDetailSelect.add(option);
                    });
                })
                .catch(error => console.error('Error fetching session details:', error));
            }
        });
    });
    </script>
</head>
<body>

<!-- Include header JSP -->
<jsp:include page="/header.jsp" />

<div class="container-fluid">
    <div class="row flex-nowrap">
        <div class="col-md-offset-1 col-md-10">
            <!-- Back button to go back to the quiz list -->
            <button class="btn btn-secondary mt-3" onclick="window.location.href='${pageContext.request.contextPath}/quizzes';">
                Back to Quiz List
            </button>
            <br><br>
            <h2 class="mt-4">Create a New Quiz</h2>
            <hr/>

            <!-- Quiz Creation Form -->
            <f:form method="post" action="${pageContext.request.contextPath}/quizzes/create" modelAttribute="quizForm" class="form-horizontal">
                
                <div class="mb-3">
                    <label for="quizName" class="form-label">Quiz Name</label>
                    <f:input path="quizName" cssClass="form-control" id="quizName" placeholder="Enter quiz name" required="true"/>
                </div>

                <div class="row">
                    <!-- Course Selection Dropdown -->
                    <div class="col-md-4">
                        <label for="course" class="form-label">Course</label>
                        <f:select path="courseId" id="course" cssClass="form-control">
                            <f:option value="">Select Course</f:option>
                            <f:options items="${courses}" itemValue="courseId" itemLabel="courseName"/>
                        </f:select>
                    </div>

                    <!-- Session Selection Dropdown -->
                    <div class="col-md-4">
                        <label for="session" class="form-label">Session</label>
                        <select id="session" name="sessionId" class="form-control">
                            <option value="">Select Session</option>
                        </select>
                    </div>

                    <!-- Session Detail Selection Dropdown -->
                    <div class="col-md-4">
                        <label for="sessionDetail" class="form-label">Session Detail</label>
                        <select id="sessionDetail" name="sessionDetailId" class="form-control">
                            <option value="">Select Session Detail</option>
                        </select>
                    </div>
                </div>

                <!-- Difficulty Level Multi-Select -->
                <div class="mb-3 mt-3">
                    <label for="difficulty" class="form-label">Difficulty Level</label>
                    <select id="difficulty" name="difficultyLevels" class="form-control" multiple="true">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                        <option value="Master">Master</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="questionLimit" class="form-label">Number of Questions</label>
                    <f:input path="questionLimit" cssClass="form-control" id="questionLimit" type="number" placeholder="Enter question limit" required="true"/>
                </div>

                <button type="submit" class="btn btn-success">Create Quiz</button>
            </f:form>

        </div>
    </div>
</div>

<!-- Include footer JSP -->
<jsp:include page="/footer.jsp" />

</body>
</html>
