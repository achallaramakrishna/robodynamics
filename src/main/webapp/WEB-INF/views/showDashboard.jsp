	<%@ page language="java" contentType="text/html; charset=UTF-8"%>
	<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
	<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
	<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
	<html>
	<head>
	<%@ page isELIgnored="false"%>
	
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
        }
        .accordion-button {
            background-color: #007bff;
            color: white;
        }
        .accordion-button:not(.collapsed) {
            background-color: #0056b3;
            color: white;
        }
        .video-container {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .accordion-body {
            background-color: #f1f1f1;
            padding: 20px;
        }
        .list-group-item {
            border: none;
            padding: 10px 20px;
        }
        .list-group-item:hover {
            background-color: #e2e6ea;
            cursor: pointer;
        }
    </style>
        <script type="text/javascript">
        
        document.addEventListener('DOMContentLoaded', function () {
            const courseListItems = document.querySelectorAll('#basicAccordion .list-group-item');
            courseListItems.forEach(item => {
                item.addEventListener('click', function () {
                    document.querySelector('.video-container').style.display = 'block';
                });
            });
        });
    function loadContent(courseSessionDetailId, enrollmentId) {
    	console.log('loadContentCalled');
        const contentType = event.target.getAttribute('data-type');
        const file = event.target.getAttribute('data-file');
       const quiz = event.target.getAttribute('data-quiz');
        const details = event.target.getAttribute('data-details');
        const id = event.target.getAttribute('data-id');

        // Log debug information
        console.log('Type - ' + contentType);
        console.log('File - ' + file);
       console.log('Quiz - ' + quiz);
        console.log('Details - ' + details);
        console.log('ID - ' + id);

        if (!contentType) return;
        console.log('hello ....1');

        // Hide all containers and display the required one based on contentType
        document.getElementById('course-video').style.display = 'none';
        document.getElementById('course-pdf').style.display = 'none';
        document.getElementById('course-quiz').style.display = 'none';
        document.getElementById('course-fib').style.display = 'none';
        document.getElementById('course-flashcard').style.display = 'none';
        document.getElementById('course-assignment').style.display = 'none';

        console.log('hello ....2');

        if (contentType === 'video') {
            document.getElementById('course-video').style.display = 'block';
            document.getElementById('video-source').src = `${pageContext.request.contextPath}/assets/videos/` + file;
            document.getElementById('course-video').load();
        } else if (contentType === 'pdf') {
            document.getElementById('course-pdf').style.display = 'block';
            document.getElementById('course-pdf').src = `${pageContext.request.contextPath}/assets/pdfs/` + file;
        } else if (contentType === 'slide') {
        	
            console.log('hello ....3 slide');

            document.getElementById('course-fib').style.display = 'block';
            document.getElementById('course-fib').src = `${pageContext.request.contextPath}/sessiondetail/start/` + id + `?enrollmentId=` + enrollmentId;
        } else if (contentType === 'quiz') {
            document.getElementById('course-quiz').style.display = 'block';
            document.getElementById('course-quiz').src = `${pageContext.request.contextPath}/quizzes/start/` + quiz;
        }
        else if (contentType === 'flashcard') {
            document.getElementById('course-flashcard').style.display = 'block';
            document.getElementById('course-flashcard').src = `${pageContext.request.contextPath}/flashcards/start/` + id;
        } else if (contentType === 'assignment') {
            document.getElementById('course-assignment').style.display = 'block';
            document.getElementById('course-assignment').src = `${pageContext.request.contextPath}/sessiondetail/assignment/start/` + id;
        }

    }

    document.addEventListener('DOMContentLoaded', function () {
        const courseListItems = document.querySelectorAll('#course-list li');

        courseListItems.forEach(item => {
            item.addEventListener('click', function (event) {
                const courseSessionDetailId = event.target.getAttribute('data-id');
                const enrollmentId = '${studentEnrollment.enrollmentId}'; // Assuming you already have enrollmentId from the backend
                loadContent(courseSessionDetailId, enrollmentId);
            });
        });
    });
    </script>
    
</head>
<body>
    <jsp:include page="header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="main-container d-flex flex-column flex-md-row">
            
                <div class="accordion mt-4 col-md-4" id="basicAccordion">
                    <h2 class="text-center" style="color: #007bff; font-weight: bold;">Course Content</h2>
                    
                    <ul id="course-list" class="list-group">
                    <c:forEach items="${courseSessions}" var="courseSession">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading-${courseSession.sessionId}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${courseSession.sessionId}" aria-expanded="false" aria-controls="collapse-${courseSession.sessionId}">
                                    ${courseSession.sessionTitle}
                                </button>
                            </h2>
                            <div id="collapse-${courseSession.sessionId}" class="accordion-collapse collapse" aria-labelledby="heading-${courseSession.sessionId}" data-bs-parent="#basicAccordion">
                                <div class="accordion-body">
                                    <ul class="list-group">
                                        <c:forEach items="${courseSession.courseSessionDetails}" var="courseSessionDetail">
                                            <li class="list-group-item list-group-item-action bg-light mb-2" style="font-size: 18px; color: #34495E;"
                                            data-type="${courseSessionDetail.type}"
                                            data-file="${courseSessionDetail.file}"
                                            data-quiz="${courseSessionDetail.quiz.quizId}"
                                            data-details="${courseSessionDetail.topic}"
                                            data-qa="${courseSessionDetail.topic}"
                                            data-id="${courseSessionDetail.courseSessionDetailId}">
                                                🧮 ${courseSessionDetail.topic}
                                            </li>
                                        </c:forEach>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    </ul>
                </div>
                <div class="video-container mt-4 col-md-8" style="display: block;">
                    <video id="course-video" class="embed-responsive-item" controls style="width: 100%; height: auto;">
                        <source id="video-source" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <iframe id="course-pdf" style="width: 100%; height: 800px;" src=""></iframe>
                    <iframe id="course-quiz" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                    <iframe id="course-fib" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                    <iframe id="course-flashcard" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                    <iframe id="course-assignment" style="display: none; width: 100%; height: 800px;" src=""></iframe>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="footer.jsp" />
</body>
</html>
