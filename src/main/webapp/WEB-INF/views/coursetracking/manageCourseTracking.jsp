<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Course Tracking</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>

    <script type="text/javascript">
        var selectedCourse, selectedCourseOffering, selectedStudent;
        
        console.log("Profile ID:", ${sessionScope.rdUser.profile_id});


        function onCourseChange() {
            var courseId = $('#courseId').val();
            selectedCourse = $('#courseId option:selected').text();
            $('#addTrackingButton').prop('disabled', true);
            $.getJSON('${pageContext.request.contextPath}/courseTracking/getCourseOfferings', { courseId: courseId }, function (data) {
                $('#courseOfferingId').empty().append('<option value="">-- Select Course Offering --</option>'	);
                $.each(data.courseOfferings, function (index, offering) {
                    $('#courseOfferingId').append($('<option>', {
                        value: offering.courseOfferingId,
                        text: offering.courseOfferingName
                    }));
                });
                $('#studentEnrollmentId').empty().append('<option value="">-- Select Student --</option>');
                $('#courseTrackingTable tbody').empty();
            });
        }

        function onCourseOfferingChange() {
            var courseOfferingId = $('#courseOfferingId').val();
            selectedCourseOffering = $('#courseOfferingId option:selected').text();
            $('#addTrackingButton').prop('disabled', true);
            $.getJSON('${pageContext.request.contextPath}/courseTracking/getStudentsEnrolled', { courseOfferingId: courseOfferingId }, function (data) {
                $('#studentEnrollmentId').empty().append('<option value="">-- Select Student --</option>');
                $.each(data.students, function (index, student) {
                    $('#studentEnrollmentId').append($('<option>', {
                        value: student.enrollmentId,
                        text: student.studentName
                    }));
                });
            });
        }

        function onStudentChange() {
            var studentEnrollmentId = $('#studentEnrollmentId').val();
            selectedStudent = $('#studentEnrollmentId option:selected').text();
            if (studentEnrollmentId) {
                $('#addTrackingButton').prop('disabled', false);
                $.getJSON('${pageContext.request.contextPath}/courseTracking/getTrackingEntries', { studentEnrollmentId: studentEnrollmentId }, function (data) {
                    var tableBody = $('#courseTrackingTable tbody');
                    tableBody.empty();
                    $.each(data.courseTrackingEntries, function (index, tracking) {
                        var row = $('<tr>');
                        row.append($('<td>').text(tracking.trackingId));
                        row.append($('<td>').text(tracking.courseSession.sessionTitle));
                        row.append($('<td>').text(tracking.feedback));
                        row.append($('<td>').html(tracking.filePaths.split(',').map(function (filePath) {
                            return '<a href="' + filePath + '" target="_blank">View File</a><br>';
                        }).join('')));
                        row.append($('<td>').text(tracking.createdAt));
                     // Get the profile ID from session
                        var profileId = ${sessionScope.rdUser.profile_id};

                        row.append($('<td>').html(
                            (profileId !== 4 && profileId !== 5 ? // Show Edit/Delete for Admins/Mentors
                                '<button class="btn btn-sm btn-warning" onclick="showCourseTrackingModal(\'edit\', ' + tracking.trackingId + ')">Edit</button> ' +
                                '<button class="btn btn-sm btn-danger" onclick="confirmDelete(' + tracking.trackingId + ')">Delete</button> '
                                : '') + // Hide Edit/Delete for Parents/Students
                            '<button class="btn btn-sm btn-info" onclick="showCourseTrackingModal(\'view\', ' + tracking.trackingId + ')">View</button>'
                        ));                 tableBody.append(row);
                    });
                    $('#courseTrackingTable').show();
                });

                loadCourseSessions(); // Load course sessions when a student is selected
            } else {
                $('#addTrackingButton').prop('disabled', true);
            }
        }

        function loadCourseSessions() {
            var courseId = $('#courseId').val();
            $.getJSON('${pageContext.request.contextPath}/courseTracking/getCourseSessions', { courseId: courseId }, function (data) {
                $('#courseSessionId').empty().append('<option value="">-- Select Course Session --</option>');
                $.each(data.courseSessions, function (index, session) {
                    $('#courseSessionId').append($('<option>', {
                        value: session.courseSessionId,
                        text: session.sessionTitle
                    }));
                });
            });
        }

        function showCourseTrackingModal(mode, trackingId = null) {
        	
            console.log('showCourseTrackingModal called with mode:', mode, 'and trackingId:', trackingId);

        	
            $('#courseTrackingForm')[0].reset();
            $('#fileNames').empty();
            $('#trackingId').val(trackingId);
            $('#studentEnrollmentIdField').val($('#studentEnrollmentId').val()); // Set the student enrollment ID


            if (mode === 'add') {
                $('#courseTrackingModalLabel').text('Add Course Tracking');
                $('#saveButton').text('Save').off('click').on('click', submitCourseTracking).show();
                $('#feedback, #courseSessionId, #trackingDate, #files').prop('disabled', false);
                loadCourseSessions();
            } else if (mode === 'edit') {
                $('#courseTrackingModalLabel').text('Edit Course Tracking');
                $('#saveButton').text('Update').off('click').on('click', updateCourseTracking).show();
                $('#feedback, #courseSessionId, #trackingDate, #files').prop('disabled', false);
                loadTrackingData(trackingId);
            } else if (mode === 'view') {
                $('#courseTrackingModalLabel').text('View Course Tracking');
                $('#saveButton').hide();
                $('#feedback, #courseSessionId, #trackingDate, #files').prop('disabled', true);
                loadTrackingData(trackingId);
            }

            $('#courseTrackingModal').modal('show');
        }

        function loadTrackingData(trackingId) {
            $.getJSON('${pageContext.request.contextPath}/courseTracking/view', { trackingId: trackingId }, function (data) {
                $('#courseSessionId').val(data.courseSession.courseSessionId);
                $('#feedback').val(data.feedback);
                $('#trackingDate').val(data.trackingDate);
                $('#fileNames').html(data.filePaths.split(',').map(function (filePath) {
                    return '<a href="' + filePath + '" target="_blank">' + filePath.split('/').pop() + '</a><br>';
                }).join(''));
            });
        }

        function updateCourseTracking() {
            var formData = new FormData($('#courseTrackingForm')[0]);
            $.ajax({
                url: '${pageContext.request.contextPath}/courseTracking/update',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    $('#courseTrackingModal').modal('hide');
                    onStudentChange();
                },
                error: function () {
                    alert('Failed to update course tracking entry.');
                }
            });
        }

        function submitCourseTracking() {
            var formData = new FormData($('#courseTrackingForm')[0]);
            $.ajax({
                url: '${pageContext.request.contextPath}/courseTracking/save',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    $('#courseTrackingModal').modal('hide');
                    onStudentChange();
                },
                error: function () {
                    alert('Failed to save course tracking entry.');
                }
            });
        }

        function confirmDelete(trackingId) {
            if (confirm('Are you sure you want to delete this tracking entry?')) {
                window.location.href = '${pageContext.request.contextPath}/courseTracking/delete?trackingId=' + trackingId;
            }
        }
    </script>
</head>
<body>
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Manage Course Tracking</h1>

        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

		<c:if test="${sessionScope.rdUser.profile_id != 4 && sessionScope.rdUser.profile_id != 5}">
		    <button id="addTrackingButton" class="btn btn-primary mb-3" onclick="showCourseTrackingModal('add')" disabled>
		        Add Course Tracking
		    </button>
		</c:if>

        <form id="manageCourseTrackingForm">
            <div class="mb-3">
                <label for="courseId" class="form-label">Select Course</label>
                <select class="form-control" id="courseId" onchange="onCourseChange()">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>
            <div class="mb-3">
                <label for="courseOfferingId" class="form-label">Select Course Offering</label>
                <select class="form-control" id="courseOfferingId" onchange="onCourseOfferingChange()">
                    <option value="">-- Select Course Offering --</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="studentEnrollmentId" class="form-label">Select Student</label>
                <select class="form-control" id="studentEnrollmentId" onchange="onStudentChange()">
                    <option value="">-- Select Student --</option>
                </select>
            </div>
        </form>

        <table class="table table-striped mt-5" id="courseTrackingTable" style="display:none;">
            <thead>
                <tr>
                    <th>Tracking ID</th>
                    <th>Course Session</th>
                    <th>Feedback</th>
                    <th>Files</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated dynamically by JavaScript -->
            </tbody>
        </table>
    </div>

    <!-- Add/Edit/View Modal -->
    <div class="modal fade" id="courseTrackingModal" tabindex="-1" aria-labelledby="courseTrackingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="courseTrackingModalLabel">Add Course Tracking</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="courseTrackingForm" enctype="multipart/form-data">
                        <input type="hidden" name="trackingId" id="trackingId">
                        <input type="hidden" name="studentEnrollmentId" id="studentEnrollmentIdField">
                        <div class="mb-3">
                            <label for="courseSessionId" class="form-label">Course Session</label>
                            <select class="form-control" id="courseSessionId" name="courseSessionId" required>
                                <option value="">-- Select Course Session --</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="feedback" class="form-label">Feedback</label>
                            <textarea class="form-control" id="feedback" name="feedback" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="trackingDate" class="form-label">Date (Optional)</label>
                            <input type="date" class="form-control" id="trackingDate" name="trackingDate">
                        </div>
                        <div class="mb-3">
                            <label for="files" class="form-label">Files</label>
                            <input type="file" class="form-control" id="files" name="files" multiple>
                            <div id="fileNames" class="mt-2"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="saveButton" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>

    <jsp:include page="/footer.jsp" />
</body>
</html>
