<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
         pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <title>Manage Matching Games</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <style>
        body {
            background-color: #f4f8fc;
        }
        h2 {
            color: #1f77d0;
        }
        .form-section {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            margin-bottom: 25px;
        }
    </style>
</head>

<body>

<!-- ===== HEADER ===== -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Messages -->
    <c:if test="${not empty message}">
        <div class="alert alert-success">${message}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- Back -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        ← Back to Dashboard
    </button>

    <h2 class="mb-4">Manage Matching Games</h2>

    <!-- =========================
         COURSE / SESSION SELECT
         ========================= -->
    <div class="form-section">
        <form>

            <div class="form-group">
                <label>Select Course</label>
                <select id="course" class="form-control">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">
                            ${course.courseName}
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-group mt-3">
                <label>Select Course Session</label>
                <select id="session" class="form-control" disabled>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <div class="form-group mt-3">
                <label>Select Session Detail</label>
                <select id="sessionDetail" class="form-control" disabled>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>

        </form>
    </div>

    <!-- =========================
         JSON UPLOAD
         ========================= -->
    <div class="form-section">
        <h5 class="mb-3">Upload Matching Game (JSON)</h5>

        <form action="${pageContext.request.contextPath}/matching-game/uploadJsonWithImages"
              method="post"
              enctype="multipart/form-data">

            <input type="hidden" id="courseSessionDetailId"
                   name="courseSessionDetailId"/>

            <div class="form-group">
                <label>JSON File</label>
                <input type="file"
                       name="file"
                       class="form-control"
                       accept=".json"
                       required>
            </div>

            <div class="form-group">
                <label>Images (optional)</label>
                <input type="file"
                       name="images"
                       class="form-control"
                       accept="image/*"
                       multiple>
            </div>

            <button type="submit" class="btn btn-success">
                Upload & Create Game
            </button>
        </form>
    </div>

    <!-- =========================
         ACTION BUTTONS
         ========================= -->
    <div id="matchingActions"
         class="d-flex align-items-center gap-2 mb-3"
         style="display:none;">
    </div>

    <!-- =========================
         GAME DETAILS
         ========================= -->
    <div id="gameDetails"></div>

</div>

<!-- ===== FOOTER ===== -->
<jsp:include page="/footer.jsp" />

<!-- Bootstrap JS -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script>
$(document).ready(function () {

    $('#course').change(function () {
        let courseId = $(this).val();
        $('#session').prop('disabled', true);
        $('#sessionDetail').prop('disabled', true);
        $('#matchingActions').hide();
        $('#gameDetails').html('');

        if (!courseId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matching-game/getCourseSessions',
            { courseId: courseId },
            function (data) {
                let options = '<option value="">-- Select Session --</option>';
                $.each(data.courseSessions, function (_, s) {
                    options += `<option value="${s.courseSessionId}">
                                    ${s.sessionTitle}
                               </option>`;
                });
                $('#session').html(options).prop('disabled', false);
            }
        );
    });

    $('#session').change(function () {
        let sessionId = $(this).val();
        $('#sessionDetail').prop('disabled', true);
        $('#matchingActions').hide();
        $('#gameDetails').html('');

        if (!sessionId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matching-game/getCourseSessionDetails',
            { sessionId: sessionId },
            function (data) {
                let options = '<option value="">-- Select Session Detail --</option>';
                $.each(data.sessionDetails, function (_, d) {
                    options += `<option value="${d.courseSessionDetailId}">
                                    ${d.topic}
                               </option>`;
                });
                $('#sessionDetail').html(options).prop('disabled', false);
            }
        );
    });

    $('#sessionDetail').change(function () {
        let id = $(this).val();
        $('#courseSessionDetailId').val(id);
        $('#matchingActions').hide().html('');
        $('#gameDetails').html('');

        if (!id) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matching-game/getGameDetailsBySessionDetail',
            { sessionDetailId: id },
            function (data) {

                if (!data.game) {
                    $('#gameDetails').html(
                        '<div class="alert alert-warning">' +
                        'No matching game found. Upload a JSON to create one.' +
                        '</div>'
                    );
                    return;
                }

                /* ===== ACTION BUTTONS ===== */
                let actionsHtml = `
                    <a href="${pageContext.request.contextPath}/matching-game/${data.game.gameId}"
                       class="btn btn-primary btn-sm">
                       🛠 Open Editor
                    </a>

                    <a href="${pageContext.request.contextPath}/matching-game/start/${id}"
                       class="btn btn-success btn-sm">
                       ▶ Preview Game
                    </a>

                    <span class="text-muted small ml-2">
                        (Upload JSON again to replace this game)
                    </span>
                `;

                $('#matchingActions').html(actionsHtml).show();

                /* ===== GAME SUMMARY ===== */
                let html = `
                    <div class="card">
                        <div class="card-header">
                            <h5>${data.game.name}</h5>
                            <small>${data.game.description}</small>
                        </div>
                        <div class="card-body">
                            <h6>Categories</h6>
                            <ul class="list-group">
                `;

                $.each(data.categories, function (_, category) {
                    html += `
                        <li class="list-group-item d-flex justify-content-between">
                            <strong>${category.categoryName}</strong>
                            <span class="badge badge-secondary">
                                ${category.items.length} items
                            </span>
                        </li>
                    `;
                });

                html += `
                            </ul>
                        </div>
                    </div>
                `;

                $('#gameDetails').html(html);
            }
        );
    });

});
</script>

</body>
</html>
