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
document.addEventListener('DOMContentLoaded', function() {
    const courseListItems = document.querySelectorAll('#course-list li');

    courseListItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const file = item.getAttribute('data-file');
            const details = item.getAttribute('data-details');
            const qa = item.getAttribute('data-qa');
			console.log('Type - ' + type);
			console.log('File - ' + file);
			console.log('Details - ' + details);
			console.log('qa - ' + qa);
			
            if (type === 'video') {
                document.getElementById('course-video').style.display = 'block';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('video-source').src = `${pageContext.request.contextPath}/assets/videos/`+ + file;
                document.getElementById('course-video').load();
            } else if (type === 'pdf') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'block';
                document.getElementById('course-pdf').src = `${pageContext.request.contextPath}/assets/pdfs/` + file;
            }

            document.getElementById('course-details-content').textContent = details;
            document.getElementById('course-qa-content').textContent = qa;
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
        <iframe id="course-pdf" style="display:none;" src="" width="600" height="400"></iframe>
    </div>
    <div class="course-contents">
        <h2>Course Contents</h2>
        <ul id="course-list">
            <c:forEach items="${courseSessionDetails}" var="courseSessionDetail">
                <li data-type="${courseSessionDetail.type}" data-file="${courseSessionDetail.file}" data-details="${courseSessionDetail.topic}" data-qa="${courseSessionDetail.topic}">
                    ${courseSessionDetail.topic}
                </li>
            </c:forEach>
        </ul>
    </div>
    <div class="course-details">
        <h2>Course Details</h2>
        <div id="course-details-content">
           <c:forEach items="${courseSessions}" var="courseSession">
                <li >
                    ${courseSession.sessionTitle}
               </li>
            </c:forEach>
        
        </div>
        <h2>Q&A</h2>
        <div id="course-qa-content"></div>
    </div>
</div>

<%@ include file="footer.jsp" %>


		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>
