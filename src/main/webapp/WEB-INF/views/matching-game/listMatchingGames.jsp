<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-4">
        <!-- Success/Error Messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">${error}</div>
        </c:if>

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3"
                onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h2>Manage Matching Games</h2>

        <!-- Course Selection -->
        <form id="matchingGameForm">
            <div class="form-group">
                <label for="course">Select Course</label>
                <select id="course" class="form-control">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>

            <!-- Course Session Selection -->
            <div class="form-group mt-3">
                <label for="session">Select Course Session</label>
                <select id="session" class="form-control" disabled>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <!-- Course Session Detail Selection -->
            <div class="form-group mt-3">
                <label for="sessionDetail">Select Session Detail</label>
                <select id="sessionDetail" class="form-control" disabled>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>
        </form>

        <!-- Upload JSON Form -->
        <form
            action="${pageContext.request.contextPath}/matching-game/uploadJsonWithImages"
            method="post" enctype="multipart/form-data" id="uploadJsonForm">
            <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
            <div class="mb-3">
                <label for="file" class="form-label">Upload Matching Game (JSON)</label>
                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
            </div>
            <div class="mb-3">
                <label for="images" class="form-label">Upload Images</label>
                <input type="file" class="form-control" id="images" name="images" accept="image/*" multiple>
            </div>
            <button type="submit" class="btn btn-success">Upload</button>
        </form>

        <!-- Game Details Section -->
        <div class="mt-5" id="gameDetails"></div>
    </div>

    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            $('#course').change(function () {
                let courseId = $(this).val();
                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/matching-game/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#gameDetails').html('');
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let sessionId = $(this).val();
                if (sessionId) {
                    $.getJSON('${pageContext.request.contextPath}/matching-game/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#gameDetails').html('');
                }
            });

            // Load Game Details when Session Detail is selected
            $('#sessionDetail').change(function () {
                let sessionDetailId = $(this).val();
                $('#courseSessionDetailId').val(sessionDetailId); // Set the sessionDetailId in the hidden input field

                if (sessionDetailId) {
                    $.getJSON('${pageContext.request.contextPath}/matching-game/getGameDetailsBySessionDetail', {sessionDetailId: sessionDetailId}, function (data) {
                        if (data.game) {
                            let gameDetails = `
                                <div class="card">
                                    <div class="card-header">
                                        <h5>${data.game.name}</h5>
                                        <p>${data.game.description}</p>
                                    </div>
                                    <div class="card-body">
                                        <h6>Categories</h6>
                                        <div class="accordion" id="categoriesAccordion">`;

                            // Iterate through categories
                            $.each(data.categories, function (index, category) {
                                gameDetails += `
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="heading${category.categoryId}">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${category.categoryId}" aria-expanded="true" aria-controls="collapse${category.categoryId}">
                                                ${category.categoryName}
                                            </button>
                                        </h2>
                                        <div id="collapse${category.categoryId}" class="accordion-collapse collapse show" aria-labelledby="heading${category.categoryId}" data-bs-parent="#categoriesAccordion">
                                            <div class="accordion-body">
                                                <img src="${pageContext.request.contextPath}/assets/images/${category.imageName}" alt="${category.categoryName}" class="img-thumbnail mb-3" style="max-width: 200px;">
                                                <h6>Items</h6>
                                                <ul class="list-group">`;

                                // Iterate through items of the category
                                $.each(category.items, function (itemIndex, item) {
                                    gameDetails += `
                                                    <li class="list-group-item">
                                                        <strong>${item.itemName}</strong> - ${item.matchingText}
                                                        <img src="${pageContext.request.contextPath}/assets/images/${item.imageName}" alt="${item.itemName}" class="img-thumbnail float-end" style="max-width: 100px;">
                                                    </li>`;
                                });

                                gameDetails += `
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`;
                            });

                            gameDetails += `
                                        </div>
                                    </div>
                                </div>`;
                            
                            $('#gameDetails').html(gameDetails);
                            $('#addGameBtn').show();
                        } else {
                            $('#gameDetails').html('<div class="alert alert-warning">No game available for the selected session detail.</div>');
                            $('#addGameBtn').hide();
                        }
                    });
                } else {
                    $('#gameDetails').html('');
                    $('#addGameBtn').hide();
                }
            });
        });
    </script>

    <jsp:include page="/footer.jsp" />
</body>
</html>
