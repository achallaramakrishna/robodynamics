<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
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
	    <meta charset="UTF-8">

<title>Welcome</title>
<style>
body {
	font-family: Arial, sans-serif;
	margin: 0;
	padding: 0;
}

header {
	background-color: #333;
	color: #fff;
	padding: 10px 0;
	text-align: center;
}

footer {
	background-color: #333;
	color: #fff;
	padding: 10px 0;
	text-align: center;
}

.main-container {
	display: flex;
	padding: 20px;
}

.video-container {
	flex: 2;
	margin-right: 20px;
}

.course-contents {
	flex: 1;
	margin-right: 20px;
}

.course-details {
	flex: 1;
}

.course-contents ul {
	list-style-type: none;
	padding: 0;
}

.course-contents li {
	cursor: pointer;
	margin-bottom: 10px;
	padding: 10px;
	background-color: #f4f4f4;
	border-radius: 5px;
}

.course-contents li:hover {
	background-color: #e4e4e4;
}
</style>


<script type="text/javascript">

function setAttendanceDetails(courseSessionDetailId,enrollmentId) {
    document.getElementById('courseSessionDetailId').value = courseSessionDetailId;
    document.getElementById('enrollmentId').value = enrollmentId;
}

function markAttendance() {
    document.getElementById('attendanceForm').submit();
}

document.addEventListener('DOMContentLoaded', function() {
    const courseListItems = document.querySelectorAll('#course-list li');

    courseListItems.forEach(item => {
    	item.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const type = item.getAttribute('data-type');
            const file = item.getAttribute('data-file');
            const quiz = item.getAttribute('data-quiz');
            const details = item.getAttribute('data-details');
            const id = item.getAttribute('data-id');
            //const assignmentId = item.getAttribute('data-assignment');
            
			console.log('Type - ' + type);
			console.log('File - ' + file);
			console.log('Quiz - ' + quiz);
			console.log('Details - ' + details);
			console.log('id - ' + id);
			// console.log('assignmentId - ' + assignmentId);
		
            if (!type && !file && !quiz && !details) {
                return;
            }
            
            if (type === 'video') {
                document.getElementById('course-video').style.display = 'block';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-flashcard').style.display = 'none';
                document.getElementById('course-fib').style.display = 'none';
                document.getElementById('course-assignment').style.display = 'none';
                document.getElementById('video-source').src = `${pageContext.request.contextPath}/assets/videos/`+ file;
                document.getElementById('course-video').load();
            } else if (type === 'pdf') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'block';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-fib').style.display = 'none';
                document.getElementById('course-assignment').style.display = 'none';
                document.getElementById('course-pdf').src = `${pageContext.request.contextPath}/assets/pdfs/` + file;
            } else if (type === 'slide') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-fib').style.display = 'block';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-flashcard').style.display = 'none';
                document.getElementById('course-assignment').style.display = 'none';
                document.getElementById('course-fib').src = `${pageContext.request.contextPath}/sessiondetail/start/` + id;
            } else if (type === 'quiz') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-fib').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'block';
                document.getElementById('course-flashcard').style.display = 'none';
                document.getElementById('course-assignment').style.display = 'none';
                document.getElementById('course-quiz').src = `${pageContext.request.contextPath}/quiztest/start?quiz_id=` + quiz;
            } else if (type == 'flashcard') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-fib').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-flashcard').style.display = 'block';
                document.getElementById('course-assignment').style.display = 'none';
                document.getElementById('course-flashcard').src = `${pageContext.request.contextPath}/flashcard-sets/session/` + id;
            } else if (type == 'assignment') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-fib').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-flashcard').style.display = 'none';
                document.getElementById('course-assignment').style.display = 'block';
                document.getElementById('course-assignment').src = `${pageContext.request.contextPath}/sessiondetail/assignment/start/` + id;
            }

            if (details && details !== 'null') {
                document.getElementById('course-details-content').textContent = details;
            } else {
                document.getElementById('course-details-content').textContent = 'No details available';
            }
        });
    });
});
</script>
</head>
<body>
	<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="main-container">
				<div class="video-container" width="640" height="850" embed-responsive embed-responsive-16by9">
					<video id="course-video" class="embed-responsive-item" controls style="display: none;">
					    <source id="video-source" type="video/mp4">
					    Your browser does not support the video tag.
					</video>
					<iframe id="course-pdf" style="display: none;" src="" width="1000" height="850"></iframe>
					<iframe id="course-quiz" style="display: none;" src="" width="1000" height="850"></iframe>
					<iframe id="course-fib" style="display: none;" src="" width="1000" height="850"></iframe>
					<iframe id="course-flashcard" style="display: none;" src="" width="1000" height="850"></iframe>
					<iframe id="course-assignment" style="display: none;" src="" width="1000" height="850"></iframe>
				</div>

				<div class="container course-contents mt-4">
				    <h2 class="text-center" style="color: #FF5733; font-family: 'Comic Sans MS', cursive, sans-serif;">
				        🎨📚 Fun Course Contents 🎨📚
				    </h2>
				    <ul id="course-list" class="list-group mt-4">
				        <!-- Loop through the list of course sessions -->
				        <c:forEach items="${courseSessions}" var="courseSession">
				            <li class="list-group-item bg-info text-white mb-3" style="font-size: 20px; font-weight: bold;">
				                <i class="fas fa-book-reader"></i> ${courseSession.sessionTitle}
				                
				                <!-- Nested list for course session details -->
				                <ul class="list-group mt-2">
				                    <!-- Loop through the course session details -->
				                    <c:forEach items="${courseSession.courseSessionDetails}" var="courseSessionDetail">
				                        <li class="list-group-item list-group-item-action bg-light mb-2" 
				                            style="font-size: 18px; color: #34495E;"
				                            data-type="${courseSessionDetail.type}"
				                            data-file="${courseSessionDetail.file}"
				                            data-quiz="${courseSessionDetail.quiz.quiz_id}"
				                            data-details="${courseSessionDetail.topic}"
				                            data-qa="${courseSessionDetail.topic}"
				                            data-id="${courseSessionDetail.courseSessionDetailId}"
				                            onclick="setAttendanceDetails(${courseSessionDetail.courseSessionDetailId}, ${studentEnrollment.enrollmentId})">
				                            🧮 ${courseSessionDetail.topic}
				                        </li>
				                    </c:forEach>
				                </ul>
				            </li>
				        </c:forEach>
				    </ul>
				</div>

				<!-- Bootstrap CSS and FontAwesome for icons -->
				<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
			</div>
		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>
