<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <title>Manage Flashcard Sets</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-4">
        <!-- Success and Error Messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">${error}</div>
        </c:if>

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h1 class="text-center mb-4">Manage Flashcard Sets</h1>

        <!-- Course Selection -->
        <form id="flashcardSetForm">
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

        <!-- Button to trigger Add Flashcard Set form -->
        <button class="btn btn-primary mt-4" id="addFlashcardSetBtn" disabled>Add New Flashcard Set</button>

        <!-- Flashcard Sets Table -->
        <div class="mt-5">
            <h3>Flashcard Sets</h3>
            <table class="table table-striped mt-5" id="flashcardSetsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Set Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="flashcardSet" items="${flashcardSets}">
                        <tr>
                            <td>${flashcardSet.flashcardSetId}</td>
                            <td>${flashcardSet.setName}</td>
                            <td>${flashcardSet.setDescription}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-btn" data-id="${flashcardSet.flashcardSetId}" data-name="${flashcardSet.setName}" data-description="${flashcardSet.setDescription}">Edit</button>
                                <a href="${pageContext.request.contextPath}/flashcardsets/delete/${flashcardSet.flashcardSetId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this flashcard set?');">Delete</a>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </div>

        <!-- Add Flashcard Set Form (Modal) -->
        <div class="modal fade" id="addFlashcardSetModal" tabindex="-1" role="dialog" aria-labelledby="addFlashcardSetLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form action="<c:url value='/flashcardsets/save' />" method="post">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addFlashcardSetLabel">Add New Flashcard Set</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="courseSessionDetailIdInput" name="courseSessionDetailId" value="">

                            <!-- Flashcard Set Name -->
                            <div class="form-group">
                                <label for="setName">Flashcard Set Name</label>
                                <input type="text" class="form-control" id="setName" name="setName" placeholder="Enter set name" required>
                            </div>

                            <!-- Flashcard Set Description -->
                            <div class="form-group mt-3">
                                <label for="setDescription">Description</label>
                                <textarea class="form-control" id="setDescription" name="setDescription" rows="3" placeholder="Enter description"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Flashcard Set</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Edit Flashcard Set Form (Modal) -->
        <div class="modal fade" id="editFlashcardSetModal" tabindex="-1" role="dialog" aria-labelledby="editFlashcardSetLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form action="<c:url value='/flashcardsets/update' />" method="post">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editFlashcardSetLabel">Edit Flashcard Set</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="editFlashcardSetId" name="flashcardSetId" value="">

                            <!-- Flashcard Set Name -->
                            <div class="form-group">
                                <label for="editSetName">Flashcard Set Name</label>
                                <input type="text" class="form-control" id="editSetName" name="setName" required>
                            </div>

                            <!-- Flashcard Set Description -->
                            <div class="form-group mt-3">
                                <label for="editSetDescription">Description</label>
                                <textarea class="form-control" id="editSetDescription" name="setDescription" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Flashcard Set</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Script for dynamically loading sessions and enabling modals -->
    <script>
        $(document).ready(function () {
        	   $('#course').change(function () {
                   let courseId = $(this).val();
                   $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                   $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);

                   if (courseId) {
                       $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessions', {courseId: courseId}, function (data) {
                           let sessionOptions = '<option value="">-- Select Session --</option>';
                           $.each(data.courseSessions, function (index, session) {
                               sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                           });
                           $('#session').html(sessionOptions).prop('disabled', false);
                       });
                   }
               });

               // Load Session Details when Session is selected
               $('#session').change(function () {
                   let courseSessionId = $(this).val();
                   $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);

                   if (courseSessionId) {
                       $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessionDetails', {courseSessionId: courseSessionId}, function (data) {
                           let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                           $.each(data.sessionDetails, function (index, detail) {
                               sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                           });
                           $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                       });
                   }
               });

               // Enable "Add Flashcard Set" button and open modal
               $('#sessionDetail').change(function () {
                   let courseSessionDetailId = $(this).val();
                   if (courseSessionDetailId) {
                       $('#courseSessionDetailIdInput').val(courseSessionDetailId);
                       $('#addFlashcardSetBtn').prop('disabled', false).click(function () {
                           $('#addFlashcardSetModal').modal('show');
                       });
                   } else {
                       $('#addFlashcardSetBtn').prop('disabled', true);
                   }
               });

            // Show Add Flashcard Set Modal
            $('#addFlashcardSetBtn').click(function () {
                $('#addFlashcardSetModal').modal('show');
            });

            // Show Edit Flashcard Set Modal with populated data
            $('.edit-btn').click(function () {
                let flashcardSetId = $(this).data('id');
                let setName = $(this).data('name');
                let setDescription = $(this).data('description');

                $('#editFlashcardSetId').val(flashcardSetId);
                $('#editSetName').val(setName);
                $('#editSetDescription').val(setDescription);
                
                $('#editFlashcardSetModal').modal('show');
            });
        });
    </script>

    <!-- Include footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
