<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Add Flashcard Set</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add New Flashcard Set</h1>
        
        <form action="<c:url value='/flashcardsets/save' />" method="post">
        
        
            <!-- Course Selection -->
            <div class="form-group">
                <label for="course">Select Course</label>
                <select id="course" name="courseId" class="form-control">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>

            <!-- Course Session Selection -->
            <div class="form-group mt-3">
                <label for="session">Select Course Session</label>
                <select id="session" name="courseSessionId" class="form-control" disabled>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <!-- Course Session Detail Selection -->
            <div class="form-group mt-3">
                <label for="sessionDetail">Select Session Detail</label>
                <select id="sessionDetail" name="courseSessionDetailId" class="form-control" disabled>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>

            <!-- Flashcard Set Information -->
            <div class="form-group mt-3">
                <label for="setName">Flashcard Set Name</label>
                <input type="text" class="form-control" id="setName" name="setName" placeholder="Enter set name" required>
            </div>
            <div class="form-group mt-3">
                <label for="setDescription">Description</label>
                <textarea class="form-control" id="setDescription" name="setDescription" rows="3" placeholder="Enter description"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block mt-4">Save Flashcard Set</button>
        </form>
    </div>

    <!-- Bootstrap JS and jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    
    <!-- Dynamic Dropdown Script -->
    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            $('#course').change(function () {
                let courseId = $(this).val();
                $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);

                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let courseSessionId = $(this).val();
                $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);

                if (courseSessionId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessionDetails', {courseSessionId: courseSessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                }
            });
        });
    </script>
</body>
</html>
