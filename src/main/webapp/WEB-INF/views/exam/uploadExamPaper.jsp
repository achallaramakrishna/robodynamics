<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Exam Paper Management</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <h2 class="mb-4">📄 Exam Paper Management</h2>

    <div class="row">

        <!-- ================= LEFT: UPLOAD ================= -->
        <div class="col-md-5">
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-success text-white">
                    Upload Exam Paper (JSON)
                </div>

                <div class="card-body">
                    <form method="post"
                          action="${pageContext.request.contextPath}/exam/uploadJson"
                          enctype="multipart/form-data">

                        <div class="mb-3">
                            <label class="form-label">Course</label>
                            <select id="course" name="courseId" class="form-control" required>
                                <option value="">-- Select Course --</option>
                                <c:forEach var="course" items="${courses}">
                                    <option value="${course.courseId}">
                                        ${course.courseName}
                                    </option>
                                </c:forEach>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Course Session</label>
                            <select id="courseSession" name="courseSessionId" class="form-control" disabled required>
                                <option value="">-- Select Session --</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Session Detail</label>
                            <select id="courseSessionDetail"
                                    name="courseSessionDetailId"
                                    class="form-control"
                                    disabled required>
                                <option value="">-- Select Session Detail --</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Exam Paper JSON</label>
                            <input type="file" name="file" class="form-control" accept=".json" required>
                        </div>

                        <button type="submit" class="btn btn-success w-100">
                            ⬆ Upload Exam Paper
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- ================= RIGHT: SEARCH + TABLE ================= -->
        <div class="col-md-7">
            <div class="card shadow-sm">

                <div class="card-header bg-primary text-white">
                    Uploaded Exam Papers
                </div>

                <!-- 🔍 SEARCH -->
                <div class="card-body border-bottom">
                    <input type="text"
                           id="examSearch"
                           class="form-control"
                           placeholder="🔍 Search by title, subject, status or year">
                </div>

                <!-- 📋 TABLE -->
                <div class="card-body p-0">
                    <table class="table table-bordered table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Year</th>
                                <th style="width:240px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="examPaperTableBody">
                            <tr>
                                <td colspan="5" class="text-center text-muted">
                                    Select Session Detail to view exam papers
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

    </div>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<script>
const ctx = '${pageContext.request.contextPath}';
let allExamPapers = [];

$(function () {

    function resetList() {
        $('#examPaperTableBody').html(
            '<tr>' +
            '<td colspan="5" class="text-center text-muted">' +
            'Select Session Detail to view exam papers' +
            '</td>' +
            '</tr>'
        );
    }

    function renderTable(papers) {

        if (!papers || papers.length === 0) {
            resetList();
            return;
        }

        let rows = '';

        papers.forEach(function (p) {

            let badgeClass = 'secondary';
            if (p.paperStatus === 'PUBLISHED') badgeClass = 'success';
            else if (p.paperStatus === 'ARCHIVED') badgeClass = 'dark';

            rows +=
                '<tr>' +
                '<td>' + (p.paperTitle || '-') + '</td>' +
                '<td>' + (p.paperSubject || '-') + '</td>' +
                '<td><span class="badge bg-' + badgeClass + '">' + p.paperStatus + '</span></td>' +
                '<td>' + (p.paperYear || '-') + '</td>' +
                '<td>' +
                    '<a class="btn btn-info btn-sm me-1" href="' + ctx + '/exam/view?examPaperId=' + p.examPaperId + '">View</a>' +
                    '<a class="btn btn-primary btn-sm me-1" href="' + ctx + '/exam/downloadPdf?examPaperId=' + p.examPaperId + '">PDF</a>' +
                    '<a class="btn btn-danger btn-sm" href="' + ctx + '/exam/delete?examPaperId=' + p.examPaperId + '" onclick="return confirm(\'Delete this exam paper?\');">Delete</a>' +
                '</td>' +
                '</tr>';
        });

        $('#examPaperTableBody').html(rows);
    }

    // COURSE → SESSIONS
    $('#course').change(function () {

        const id = $(this).val();
        $('#courseSession').prop('disabled', true);
        $('#courseSessionDetail').prop('disabled', true);
        resetList();

        if (!id) return;

        $.getJSON(ctx + '/exam/getCourseSessions', { courseId: id }, function (data) {

            let opt = '<option value="">-- Select Session --</option>';
            data.forEach(s =>
                opt += '<option value="' + s.courseSessionId + '">' + s.sessionTitle + '</option>'
            );

            $('#courseSession').html(opt).prop('disabled', false);
        });
    });

    // SESSION → SESSION DETAILS
    $('#courseSession').change(function () {

        const id = $(this).val();
        $('#courseSessionDetail').prop('disabled', true);
        resetList();

        if (!id) return;

        $.getJSON(ctx + '/exam/getSessionDetails', { sessionId: id }, function (data) {

            let opt = '<option value="">-- Select Session Detail --</option>';
            data.forEach(d =>
                opt += '<option value="' + d.courseSessionDetailId + '">' + d.topic + '</option>'
            );

            $('#courseSessionDetail').html(opt).prop('disabled', false);
        });
    });

    // SESSION DETAIL → PAPERS
    $('#courseSessionDetail').change(function () {

        const id = $(this).val();
        if (!id) return;

        $.getJSON(ctx + '/exam/getExamPapersBySessionDetail',
            { sessionDetailId: id },
            function (papers) {

                allExamPapers = papers;
                renderTable(papers);
            }
        );
    });

    // 🔍 SEARCH FILTER
    $('#examSearch').on('keyup', function () {

        const keyword = $(this).val().toLowerCase();

        const filtered = allExamPapers.filter(p =>
            (p.paperTitle || '').toLowerCase().includes(keyword) ||
            (p.paperSubject || '').toLowerCase().includes(keyword) ||
            (p.paperStatus || '').toLowerCase().includes(keyword) ||
            String(p.paperYear || '').includes(keyword)
        );

        renderTable(filtered);
    });

});
</script>

</body>
</html>
