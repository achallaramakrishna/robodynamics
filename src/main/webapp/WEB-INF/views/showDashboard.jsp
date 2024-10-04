<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
        integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
        integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
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
    padding: 0 20px; /* Increased padding for better spacing */
    gap: 20px; /* Gap between video and course contents */
    max-width: 100%; /* Ensure the main container does not overflow */
}

.video-container {
    flex-grow: 1; /* Allow the video container to grow and take up available space */
    position: relative; /* Needed for aspect ratio technique */
    padding-top: 56.25%; /* 16:9 Aspect Ratio for rectangular shape */
    height: 0;
    margin-right: 0;
    max-width: 100%;
}

.video-container iframe,
.video-container video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px; /* Optional: Rounding corners of video */
}

.course-contents {
    flex-basis: 25%; /* Keep course contents compact on the right */
    overflow-y: auto;
    padding: 10px;
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

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }

    .video-container,
    .course-contents {
        width: 100%; /* Full width on mobile */
    }
}
    </style>

    <script type="text/javascript">
    function loadContent(courseSessionDetailId, enrollmentId) {
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

        // Hide all containers and display the required one based on contentType
        document.getElementById('course-video').style.display = 'none';
        document.getElementById('course-pdf').style.display = 'none';
        document.getElementById('course-quiz').style.display = 'none';
        document.getElementById('course-fib').style.display = 'none';
        document.getElementById('course-flashcard').style.display = 'none';
        document.getElementById('course-assignment').style.display = 'none';

        if (contentType === 'video') {
            document.getElementById('course-video').style.display = 'block';
            document.getElementById('video-source').src = `${pageContext.request.contextPath}/assets/videos/` + file;
            document.getElementById('course-video').load();
        } else if (contentType === 'pdf') {
            document.getElementById('course-pdf').style.display = 'block';
            document.getElementById('course-pdf').src = `${pageContext.request.contextPath}/assets/pdfs/` + file;
        } else if (contentType === 'slide') {
            document.getElementById('course-fib').style.display = 'block';
            document.getElementById('course-fib').src = `${pageContext.request.contextPath}/sessiondetail/start/` + id + `?enrollmentId=` + enrollmentId;
        } else if (contentType === 'quiz') {
            document.getElementById('course-quiz').style.display = 'block';
            document.getElementById('course-quiz').src = `${pageContext.request.contextPath}/quiztest/start?quiz_id=` + quiz;
        } else if (contentType === 'flashcard') {
            document.getElementById('course-flashcard').style.display = 'block';
            document.getElementById('course-flashcard').src = `${pageContext.request.contextPath}/flashcard-sets/session/` + id;
        } else if (contentType === 'assignment') {
            document.getElementById('course-assignment').style.display = 'block';
            document.getElementById('course-assignment').src = `${pageContext.request.contextPath}/sessiondetail/assignment/start/` + id;
        }

        if (details && details !== 'null') {
            document.getElementById('course-details-content').textContent = details;
        } else {
            document.getElementById('course-details-content').textContent = 'No details available';
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
            <div class="main-container">
                <div class="video-container">
                    <video id="course-video" class="embed-responsive-item" controls style="display: none;">
                        <source id="video-source" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <iframe id="course-pdf" style="display: none;" src="" width="1400" height="850"></iframe>
                    <iframe id="course-quiz" style="display: none;" src="" width="1400" height="850"></iframe>
                    <iframe id="course-fib" style="display: none;" src="" width="1400" height="850"></iframe>
                    <iframe id="course-flashcard" style="display: none;" src="" width="1400" height="850"></iframe>
                    <iframe id="course-assignment" style="display: none;" src="" width="1400" height="850"></iframe>
                </div>

                <div class="container course-contents mt-4">
                    <h2 class="text-center" style="color: #FF5733; font-family: 'Comic Sans MS', cursive, sans-serif;">
                        🎨📚 Fun Course Contents 🎨📚
                    </h2>
                    <ul id="course-list" class="list-group mt-4">
                        <c:forEach items="${courseSessions}" var="courseSession">
                            <li class="list-group-item bg-info text-white mb-3" style="font-size: 20px; font-weight: bold;">
                                <i class="fas fa-book-reader"></i> ${courseSession.sessionTitle}
                                <ul class="list-group mt-2">
                                    <c:forEach items="${courseSession.courseSessionDetails}" var="courseSessionDetail">
                                        <li class="list-group-item list-group-item-action bg-light mb-2"
                                            style="font-size: 18px; color: #34495E;"
                                            data-type="${courseSessionDetail.type}"
                                            data-file="${courseSessionDetail.file}"
                                            data-quiz="${courseSessionDetail.quiz.quiz_id}"
                                            data-details="${courseSessionDetail.topic}"
                                            data-qa="${courseSessionDetail.topic}"
                                            data-id="${courseSessionDetail.courseSessionDetailId}">
                                            🧮 ${courseSessionDetail.topic}
                                        </li>
                                    </c:forEach>
                                </ul>
                            </li>
                        </c:forEach>
                    </ul>
                </div>

                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
            </div>
        </div>
    </div>
    <jsp:include page="footer.jsp" />
</body>
</html>
