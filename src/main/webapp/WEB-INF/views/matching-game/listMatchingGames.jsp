<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Manage Matching Games</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard
    </button>

    <h2>Manage Matching Games</h2>

    <!-- Flash Messages -->
    <c:if test="${not empty success}">
        <div class="alert alert-success">${success}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- Course Selection -->
    <form id="matchingGameForm">

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

    <!-- Upload JSON -->
    <form action="${pageContext.request.contextPath}/matching-game/uploadJsonWithImages"
          method="post" enctype="multipart/form-data"
          class="mt-4">

        <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId">

        <div class="mb-3">
            <label>Upload Matching Game (JSON)</label>
            <input type="file" class="form-control" name="file" accept=".json" required>
        </div>

        <div class="mb-3">
            <label>Upload Images (optional)</label>
            <input type="file" class="form-control" name="images" accept="image/*" multiple>
            <div class="form-text">
                You can upload JSON alone. Images can be uploaded later; if imageName is missing, UI will skip thumbnails.
            </div>
        </div>

        <button type="submit" class="btn btn-success">
            Upload Matching Game
        </button>
    </form>

    <!-- Game Details -->
    <div id="gameDetails" class="mt-5"></div>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
$(document).ready(function () {

    var ctx = '${pageContext.request.contextPath}';

    function resetDropdowns() {
        $('#session').prop('disabled', true)
                     .html('<option value="">-- Select Session --</option>');
        $('#sessionDetail').prop('disabled', true)
                           .html('<option value="">-- Select Session Detail --</option>');
        $('#courseSessionDetailId').val('');
        $('#gameDetails').empty();
    }

    // Reset on course change
    $('#course').on('change', function () {
        resetDropdowns();

        var courseId = $(this).val();
        if (!courseId) return;

        $.getJSON(ctx + '/matching-game/getCourseSessions', { courseId: courseId })
            .done(function (data) {
                var options = '<option value="">-- Select Session --</option>';
                if (data && data.courseSessions) {
                    $.each(data.courseSessions, function (_, s) {
                        options += '<option value="' + s.courseSessionId + '">' + (s.sessionTitle || ('Session ' + s.courseSessionId)) + '</option>';
                    });
                }
                $('#session').html(options).prop('disabled', false);
            })
            .fail(function () {
                $('#gameDetails').html('<div class="alert alert-danger">Failed to load sessions.</div>');
            });
    });

    // Session -> session details
    $('#session').on('change', function () {
        $('#sessionDetail').prop('disabled', true)
                           .html('<option value="">-- Select Session Detail --</option>');
        $('#courseSessionDetailId').val('');
        $('#gameDetails').empty();

        var sessionId = $(this).val();
        if (!sessionId) return;

        $.getJSON(ctx + '/matching-game/getCourseSessionDetails', { sessionId: sessionId })
            .done(function (data) {
                var options = '<option value="">-- Select Session Detail --</option>';
                if (data && data.sessionDetails) {
                    $.each(data.sessionDetails, function (_, d) {
                        options += '<option value="' + d.courseSessionDetailId + '">' + (d.topic || ('Detail ' + d.courseSessionDetailId)) + '</option>';
                    });
                }
                $('#sessionDetail').html(options).prop('disabled', false);
            })
            .fail(function () {
                $('#gameDetails').html('<div class="alert alert-danger">Failed to load session details.</div>');
            });
    });

    // Load game details (DTO response)
    $('#sessionDetail').on('change', function () {
        var id = $(this).val();
        $('#courseSessionDetailId').val(id);
        $('#gameDetails').empty();

        if (!id) return;

        $.getJSON(ctx + '/matching-game/getGameDetailsBySessionDetail', { sessionDetailId: id })
            .done(function (data) {

                // Your controller returns: { game: {.., categories:[..]}, categories:[..] }
                // We will support both safely.
                var game = data ? data.game : null;
                var categories = [];

                if (data && data.categories && data.categories.length) {
                    categories = data.categories;
                } else if (game && game.categories && game.categories.length) {
                    categories = game.categories;
                }

                if (!game) {
                    $('#gameDetails').html('<div class="alert alert-warning">No matching game available</div>');
                    return;
                }

                var html = '';
                html += '<div class="card">';
                html += '  <div class="card-header">';
                html += '    <h5 class="mb-1">' + escapeHtml(game.name || 'Matching Game') + '</h5>';
                html += '    <p class="mb-0 text-muted">' + escapeHtml(game.description || '') + '</p>';
                html += '  </div>';
                html += '  <div class="card-body">';

                if (!categories.length) {
                    html += '<div class="alert alert-info mb-0">Game exists, but no categories found.</div>';
                    html += '  </div></div>';
                    $('#gameDetails').html(html);
                    return;
                }

                html += '    <div class="accordion" id="categoriesAccordion">';

                $.each(categories, function (idx, c) {

                    // If JSON has no IDs (before DB save), your GET endpoint WILL have IDs from DB.
                    // Still, we create a safe fallback key.
                    var catKey = (c.categoryId ? c.categoryId : ('idx' + idx));

                    var collapsedClass = (idx === 0) ? '' : 'collapsed';
                    var showClass = (idx === 0) ? 'show' : '';

                    html += '      <div class="accordion-item">';
                    html += '        <h2 class="accordion-header" id="heading_' + catKey + '">';
                    html += '          <button class="accordion-button ' + collapsedClass + '" type="button"';
                    html += '                  data-bs-toggle="collapse"';
                    html += '                  data-bs-target="#collapse_' + catKey + '"';
                    html += '                  aria-expanded="' + (idx === 0 ? 'true' : 'false') + '"';
                    html += '                  aria-controls="collapse_' + catKey + '">';
                    html +=              escapeHtml(c.categoryName || ('Category ' + (idx + 1)));
                    html += '          </button>';
                    html += '        </h2>';

                    html += '        <div id="collapse_' + catKey + '" class="accordion-collapse collapse ' + showClass + '"';
                    html += '             aria-labelledby="heading_' + catKey + '" data-bs-parent="#categoriesAccordion">';
                    html += '          <div class="accordion-body">';

                    // Category image (optional)
                    if (c.imageName) {
                        html += '            <img src="' + ctx + '/resources/' + c.imageName + '" class="img-thumbnail mb-3" style="max-width:200px;" alt="Category">';
                    }

                    var items = c.items || [];
                    if (!items.length) {
                        html += '            <div class="alert alert-light mb-0">No items in this category.</div>';
                    } else {
                        html += '            <ul class="list-group">';
                        $.each(items, function (iidx, it) {
                            html += '              <li class="list-group-item d-flex justify-content-between align-items-center">';
                            html += '                <div>';
                            html += '                  <strong>' + escapeHtml(it.itemName || ('Item ' + (iidx + 1))) + '</strong>';
                            if (it.matchingText) {
                                html += '                  <span class="text-muted"> – ' + escapeHtml(it.matchingText) + '</span>';
                            }
                            html += '                </div>';

                            if (it.imageName) {
                                html += '                <img src="' + ctx + '/resources/' + it.imageName + '" style="max-width:80px;" alt="Item">';
                            }
                            html += '              </li>';
                        });
                        html += '            </ul>';
                    }

                    html += '          </div>';
                    html += '        </div>';
                    html += '      </div>';
                });

                html += '    </div>';
                html += '  </div>';
                html += '</div>';

                $('#gameDetails').html(html);
            })
            .fail(function (xhr) {
                $('#gameDetails').html(
                    '<div class="alert alert-danger">Failed to load game details. Check server logs.</div>'
                );
            });
    });

    // Prevent XSS / broken HTML
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

});
</script>

</body>
</html>
