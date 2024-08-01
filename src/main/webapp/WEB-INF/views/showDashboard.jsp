<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
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
<meta charset="ISO-8859-1">
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
    // Set the value of the hidden input
 //   document.getElementById('attendanceData').value = 'present'; // Set your desired value here
    
    // Optionally, submit the form if needed
    
    document.getElementById('attendanceForm').submit();
}

document.addEventListener('DOMContentLoaded', function() {
    const courseListItems = document.querySelectorAll('#course-list li');

    courseListItems.forEach(item => {
    	item.addEventListener('click', (event) => {
            // Prevent default action if any (like anchor tag default)
            event.preventDefault();
            // Stop the event from propagating
            event.stopPropagation();
            
            console.log('Event Target:', event.target);
    	        const type = item.getAttribute('data-type');
            const file = item.getAttribute('data-file');
            const quiz = item.getAttribute('data-quiz');
            const details = item.getAttribute('data-details');
            const qa = item.getAttribute('data-qa');
            const coursesSessionDetailId = item.getAttribute('data-coursesessiondetail-id');
            
			console.log('Type - ' + type);
			console.log('File - ' + file);
			console.log('Quiz - ' + quiz);
			console.log('Details - ' + details);
			console.log('qa - ' + qa);
			console.log('coursesSessionDetailId - ' + coursesSessionDetailId);

			
		
			
			 // Prevent double handling
            if (!type && !file && !quiz && !details && !qa) {
                return; // No data to handle
            }
			
            if (type === 'video') {
                document.getElementById('course-video').style.display = 'block';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('video-source').src = `${pageContext.request.contextPath}/assets/videos/`+ file;
                document.getElementById('course-video').load();
            } else if (type === 'pdf') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'block';
                document.getElementById('course-quiz').style.display = 'none';
                document.getElementById('course-pdf').src = `${pageContext.request.contextPath}/assets/pdfs/` + file;
            } else if (type === 'quiz') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('course-quiz').style.display = 'block';

                document.getElementById('course-quiz').src = `${pageContext.request.contextPath}/quiz/take?quiz_id=` + quiz;
                
            } 

            if (details && details !== 'null') {
                document.getElementById('course-details-content').textContent = details;
            } else {
                document.getElementById('course-details-content').textContent = 'No details available';
            }
            
            // Display Q&A content
            if (qa && qa !== 'null') {
                document.getElementById('course-qa-content').textContent = qa;
            } else {
                document.getElementById('course-qa-content').textContent = 'No Q&A available';
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
				<div class="video-container">
					<video id="course-video" controls style="display: none;">
						<source id="video-source" type="video/mp4">
						Your browser does not support the video tag.
					</video>
					<iframe id="course-pdf" style="display: none;" src="" width="1200"
						height="700"></iframe>
					<iframe id="course-quiz" style="display: none;" src="" width="1200"
						height="700"></iframe>
					<h2>Q&A</h2>
					<div id="course-qa-content">
						<!-- Add Mark Attendance Button and Hidden Input -->
						<div class="mark-attendance">
							<form id="attendanceForm" action="${pageContext.request.contextPath}/courseTracking/markAttendance"
								method="post">
								<input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId"
									value="">
								<input type="hidden" id="enrollmentId" name="enrollmentId"
									value="">
								<button type="button" class="btn btn-primary"
									onclick="markAttendance()">Mark Attendance</button>
							</form>
						</div>

					</div>
				</div>


				<div class="course-contents">
					<h2>Course Contents</h2>
					<ul id="course-list">
						<c:forEach items="${courseSessions}" var="courseSession">
							<li>${courseSession.sessionTitle}<script> console.log('${courseSession.sessionTitle}');</script>

								<c:forEach items="${courseSession.courseSessionDetails}"
									var="courseSessionDetail">
									<ul>
										<li data-type="${courseSessionDetail.type}"
											data-file="${courseSessionDetail.file}"
											data-quiz="${courseSessionDetail.quiz.quiz_id}"
											data-details="${courseSessionDetail.topic}"
											data-qa="${courseSessionDetail.topic}"
											onclick="setAttendanceDetails(${courseSessionDetail.courseSessionDetailId},${studentEnrollment.enrollmentId})">
											${courseSessionDetail.topic}</li>
									</ul>
								</c:forEach>
							</li>
						</c:forEach>
					</ul>


				</div>

			</div>



		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>