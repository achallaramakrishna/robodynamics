<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>Robo Dynamics - Quizzes</title>
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
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

</head>
<body>
<jsp:include page="/header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
            
                    <!-- Success Message -->
	        <c:if test="${not empty message}">
	            <div class="alert alert-success">${message}</div>
	        </c:if>
	        
	        <!-- Error Message -->
	        <c:if test="${not empty error}">
	            <div class="alert alert-danger">${error}</div>
	        </c:if>
	            
                <br>
                <!-- Back button to go back to the dashboard -->
                <button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                    Back to Dashboard
                </button>
                <br><br>
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <br>
                        <h2>Add Quiz</h2>
                    </div>
                    <div class="panel-body">
                        <form:form action="saveQuiz" cssClass="form-horizontal"
                            method="post" modelAttribute="quiz">

                            <!-- Hidden field for quiz ID -->
                            <form:hidden path="quizId" />

                            <!-- Quiz Name -->
                            <div class="form-group">
                                <label for="quizName" class="col-md-3 control-label">Quiz Name</label>
                                <div class="col-md-9">
                                    <form:input path="quizName" cssClass="form-control" />
                                </div>
                            </div>

                            <!-- Dropdown for Courses -->
                            <div class="form-group">
                                <label for="course" class="col-md-3 control-label">Select Course</label>
                                <div class="col-md-9">
                                    <select id="course" name="courseId" class="form-control">
                                        <option value="">-- Select Course --</option>
                                        <c:forEach var="course" items="${courses}">
                                            <option value="${course.courseId}">${course.courseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <!-- Dropdown for Course Sessions -->
                            <div class="form-group">
                                <label for="courseSession" class="col-md-3 control-label">Select Course Session</label>
                                <div class="col-md-9">
                                    <select id="courseSession" name="courseSessionId"  class="form-control" disabled>
                                        <option value="">-- Select Session --</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Dropdown for Course Session Details -->
                            <div class="form-group">
                                <label for="courseSessionDetail" class="col-md-3 control-label">Select Session Detail</label>
                                <div class="col-md-9">
                                    <select id="courseSessionDetail"  name="courseSessionDetailId" class="form-control" disabled>
                                        <option value="">-- Select Session Detail --</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Quiz Category -->
                            <div class="mb-3">
                                <label for="category" class="form-label">Category</label>
                                <form:select path="category" cssClass="form-control">
                                    <form:option value="Programming">Programming</form:option>
                                    <form:option value="Math">Math</form:option>
                                    <form:option value="Physics">Physics</form:option>
                                    <form:option value="Robotics">Robotics</form:option>
                                    <form:option value="Drones">Drones</form:option>
                                </form:select>
                            </div>

                            <!-- Difficulty Level -->
                            <div class="mb-3">
                                <label for="difficulty" class="form-label">Difficulty Level</label>
                                <form:select path="difficultyLevel" cssClass="form-control">
                                    <form:option value="Beginner">Beginner</form:option>
                                    <form:option value="Intermediate">Intermediate</form:option>
                                    <form:option value="Advanced">Advanced</form:option>
                                </form:select>
                            </div>

                            <!-- Grade Range -->
                            <div class="mb-3">
                                <label for="gradeRange" class="form-label">Grade Range</label>
                                <form:select path="gradeRange" cssClass="form-control">
                                    <form:option value="ALL_GRADES">ALL GRADES</form:option>
                                    <form:option value="LOWER_PRIMARY_1_3">LOWER PRIMARY (1-3)</form:option>
                                    <form:option value="UPPER_PRIMARY_4_6">UPPER PRIMARY (4-6)</form:option>
                                    <form:option value="MIDDLE_SCHOOL_7_9">MIDDLE SCHOOL (7-9)</form:option>
                                    <form:option value="HIGH_SCHOOL_10_12">HIGH SCHOOL (10-12)</form:option>
                                </form:select>
                            </div>

                            <br>
                            <center>
                                <button type="submit" class="btn btn-primary">Submit</button>
                             </center>

                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="/WEB-INF/views/footer.jsp" />

<script>
    $(document).ready(function () {
        // Populate Course Sessions based on Course selection
        $('#course').change(function () {
            let courseId = $(this).val();
            if (courseId) {
                $.getJSON('${pageContext.request.contextPath}/quizzes/getSessionByCourse', {courseId: courseId}, function (data) {
                    let options = '<option value="">-- Select Session --</option>';
                    $.each(data, function (index, session) {
                        options += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                    });
                    $('#courseSession').html(options).prop('disabled', false);
                });
            } else {
                $('#courseSession').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                $('#courseSessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
            }
        });

        // Populate Session Details based on Session selection
        $('#courseSession').change(function () {
            let sessionId = $(this).val();
            if (sessionId) {
                $.getJSON('${pageContext.request.contextPath}/quizzes/getSessionDetailsBySession', {sessionId: sessionId}, function (data) {
                    let options = '<option value="">-- Select Session Detail --</option>';
                    $.each(data, function (index, detail) {
                        options += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                    });
                    $('#courseSessionDetail').html(options).prop('disabled', false);
                });
            } else {
                $('#courseSessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
            }
        });
    });
</script>

</body>
</html>
