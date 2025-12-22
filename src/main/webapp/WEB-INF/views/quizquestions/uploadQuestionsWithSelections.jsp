<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta charset="UTF-8">
    <title>Upload Questions with Selection</title>
</head>
<body>
    <!-- Include Header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Upload Questions with Selection</h1>
        <hr />

		<!-- Back to Dashboard Button -->
		<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
			Back to Dashboard
		</button>
		<br><br>

        <!-- Display Success Message -->
        <c:if test="${not empty success}">
            <div class="alert alert-success" role="alert">
                ${success}
            </div>
        </c:if>

        <!-- Display Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">
                ${error}
            </div>
        </c:if>
        

        <!-- Course, Session, Session Detail, and Association Type Dropdowns -->
        <form id="uploadJsonForm" method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/quizquestions/uploadJson">
           
            <div class="form-group mb-3">
			    <label for="associationType">Choose Association Type</label>
			    <select id="associationType" name="associationType" class="form-control" required>
			        <option value="">-- Select Association Type --</option>
			        <option value="slide">Slide</option>
			        <option value="quiz">Quiz</option>
			        <option value="questionBank">Question Bank</option> <!-- Renamed Option -->
			    </select>
			</div>
			
			<!-- Sample JSON Button -->
            <div class="form-group mb-3">
                <button type="button" class="btn btn-info" id="showSampleJson">Show Sample JSON</button>
            </div>

            <!-- Modal for Sample JSON -->
            <div class="modal fade" id="sampleJsonModal" tabindex="-1" aria-labelledby="sampleJsonLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="sampleJsonLabel">Sample JSON</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <pre id="jsonPreview" style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; border-radius: 5px; white-space: pre-wrap;">
                            </pre>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="copyJsonToClipboard">Copy to Clipboard</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
           
           <div class="form-group mb-3">
			    <label for="category">Select Course Category</label>
			    <select id="category" class="form-control" required>
			        <option value="">-- Select Category --</option>
			        <c:forEach var="cat" items="${categories}">
			            <option value="${cat.courseCategoryId}">
			                ${cat.courseCategoryName}
			            </option>
			        </c:forEach>
			    </select>
			</div>
			           
            <!-- Course Dropdown -->
			<div class="form-group mb-3">
			    <label for="course">Select Course</label>
			    <select id="course" name="courseId" class="form-control" required disabled>
			        <option value="">-- Select Course --</option>
			    </select>
			</div>

            <div class="form-group mb-3">
                <label for="session">Select Session</label>
                <select id="session" name="sessionId" class="form-control" disabled required>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <div class="form-group mb-3">
                <label for="sessionDetail">Select Session Detail</label>
                <select id="sessionDetail" name="sessionDetailId" class="form-control" disabled required>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>

<%-- 			<div class="form-group mb-3" id="quizSelection" style="display: none;">
                <label for="quiz">Select Quiz</label>
                <select id="quiz" name="quizId" class="form-control">
                    <option value="">-- Select Quiz --</option>
                    <c:forEach var="quiz" items="${quizzes}">
                        <option value="${quiz.quizId}">${quiz.quizName}</option>
                    </c:forEach>
                </select>
            </div> --%>
				
            <!-- Upload JSON Form -->
            <div class="form-group mb-3">
                <label for="jsonFile" class="form-label">Upload JSON File</label>
                <input type="file" id="jsonFile" name="file" class="form-control" accept=".json" required />
                <!-- Hidden Field for course_session_id -->
				<input type="hidden" id="courseSessionId" name="courseSessionId" value="">
		
            	<input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
            	
            </div>

            <button type="submit" class="btn btn-primary">Upload Questions</button>
        </form>

        <br />
        <div id="response" class="alert" style="display:none;"></div>

        <!-- Questions Table -->
        <h4 class="mt-5">All Questions</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Question ID</th>
                    <th>Question Text</th>
                    <th>Type</th>
                    <th>Difficulty Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="question" items="${questions}">
                    <tr>
                        <td>${question.questionId}</td>
                        <td>${question.questionText}</td>
                        <td>${question.questionType}</td>
                        <td>${question.difficultyLevel}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/questions/edit?questionId=${question.questionId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/questions/delete?questionId=${question.questionId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this question?');">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <!-- Pagination Controls -->
       <!-- Improved Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <!-- First Page Button -->
                <c:if test="${currentPage > 0}">
                    <li class="page-item">
                        <a class="page-link" href="?page=0&size=${size}" aria-label="First">
                            <span aria-hidden="true">&laquo;&laquo;</span>
                        </a>
                    </li>
                </c:if>

                <!-- Previous Page Button -->
                <c:if test="${currentPage > 0}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage - 1}&size=${size}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                </c:if>

                <!-- Page Number Links with Ellipses -->
                <c:choose>
                    <c:when test="${totalPages <= 7}">
                        <c:forEach var="i" begin="0" end="${totalPages - 1}">
                            <li class="page-item ${i == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${i}&size=${size}">${i + 1}</a>
                            </li>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <!-- Always show first 2 pages -->
                        <c:forEach var="i" begin="0" end="1">
                            <li class="page-item ${i == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${i}&size=${size}">${i + 1}</a>
                            </li>
                        </c:forEach>

                        <!-- Ellipsis if currentPage > 3 -->
                        <c:if test="${currentPage > 3}">
                            <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
                        </c:if>

                        <!-- Middle Pages: currentPage-1, currentPage, currentPage+1 -->
                        <c:if test="${currentPage > 1 and currentPage < totalPages - 2}">
                            <li class="page-item ${currentPage - 1 == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${currentPage - 1}&size=${size}">${currentPage}</a>
                            </li>
                            <li class="page-item ${currentPage == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${currentPage}&size=${size}">${currentPage + 1}</a>
                            </li>
                            <li class="page-item ${currentPage + 1 == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${currentPage + 1}&size=${size}">${currentPage + 2}</a>
                            </li>
                        </c:if>

                        <!-- Ellipsis if currentPage < totalPages - 3 -->
                        <c:if test="${currentPage < totalPages - 3}">
                            <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
                        </c:if>

                        <!-- Always show last 2 pages -->
                        <c:forEach var="i" begin="${totalPages - 2}" end="${totalPages - 1}">
                            <li class="page-item ${i == currentPage ? 'active' : ''}">
                                <a class="page-link" href="?page=${i}&size=${size}">${i + 1}</a>
                            </li>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>

                <!-- Next Page Button -->
                <c:if test="${currentPage < totalPages - 1}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage + 1}&size=${size}" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </c:if>

                <!-- Last Page Button -->
                <c:if test="${currentPage < totalPages - 1}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${totalPages - 1}&size=${size}" aria-label="Last">
                            <span aria-hidden="true">&raquo;&raquo;</span>
                        </a>
                    </li>
                </c:if>
            </ul>
        </nav>
    </div>

    <!-- Include Footer JSP -->
    <jsp:include page="/footer.jsp" />

    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            
            const sampleJson = {
                slide: {
                    questions: [
                        {
                            question_text: "What is 2 + 2?",
                            question_type: "multiple_choice",
                            correct_answer: "4",
                            difficulty_level: "Easy",
                            points: 2,
                            max_marks: 1,
                            options: [
                                { option_text: "3", is_correct: false },
                                { option_text: "4", is_correct: true }
                            ]
                        }
                    ]
                },
                quiz: {
                    questions: [
                        {
                            question_text: "What is the capital of France?",
                            question_type: "multiple_choice",
                            correct_answer: "Paris",
                            difficulty_level: "Medium",
                            points: 3,
                            max_marks: 2,
                            options: [
                                { option_text: "Berlin", is_correct: false },
                                { option_text: "Paris", is_correct: true }
                            ]
                        }
                    ]
                },
                questionBank: {
                    questions: [
                        {
                            question_text: "Explain Newton's first law.",
                            question_type: "short_answer",
                            correct_answer: "Law of inertia",
                            difficulty_level: "Hard",
                            points: 10,
                            max_marks: 5
                        }
                    ]
                }
            };

            $('#showSampleJson').click(function () {
                const selectedType = $('#associationType').val();
                if (selectedType && sampleJson[selectedType]) {
                    $('#jsonPreview').text(JSON.stringify(sampleJson[selectedType], null, 4));
                    $('#sampleJsonModal').modal('show');
                } else {
                    alert('Please select an association type to view the sample JSON.');
                }
            });

            $('#copyJsonToClipboard').click(function () {
                const jsonText = $('#jsonPreview').text();
                navigator.clipboard.writeText(jsonText).then(() => {
                    alert('Sample JSON copied to clipboard!');
                }).catch(err => {
                    console.error('Error copying JSON:', err);
                });
            });

            
            $('#associationType').change(function () {
			    let selectedType = $(this).val();
			    if (selectedType === 'quiz') {
			        $('#quizSelection').show(); // Show quiz dropdown only for quiz type
			    } else {
			        $('#quizSelection').hide(); // Hide quiz dropdown for all other types
			    }
			});
			

         // When Category Changes → Load Courses
            $('#category').change(function () {
                let categoryId = $(this).val();

                $('#course').html('<option value="">-- Select Course --</option>').prop('disabled', true);
                $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);

                $('#courseSessionId').val('');
                $('#courseSessionDetailId').val('');

                if (!categoryId) return;

                $.getJSON(
                    '${pageContext.request.contextPath}/quizquestions/getCoursesByCategory',
                    { categoryId: categoryId },
                    function (data) {
                        let options = '<option value="">-- Select Course --</option>';

                        $.each(data.courses, function (i, course) {
                            options += '<option value="' + course.courseId + '">' + course.courseName + '</option>';
                        });

                        $('#course').html(options).prop('disabled', false);
                    }
                );
            });

            $('#course').change(function () {
                let courseId = $(this).val();
                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/quizquestions/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let sessionId = $(this).val();
                if (sessionId) {
                    $('#courseSessionId').val(sessionId); // Set the hidden courseSessionId

                    $.getJSON('${pageContext.request.contextPath}/quizquestions/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#courseSessionId').val(''); // Clear the hidden field if no session is selected

                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#uploadJsonForm').hide();
                }
            });

            // Set the hidden courseSessionDetailId field when Session Detail is selected
            $('#sessionDetail').change(function () {
                let sessionDetailId = $(this).val();
                if (sessionDetailId) {
                    $('#courseSessionDetailId').val(sessionDetailId);
                }
            });

            // Show/Hide Quiz selection based on Association Type
            $('#associationType').change(function () {
                let selectedType = $(this).val();
                if (selectedType === 'questionBank') {
                    // Hide the Session Detail dropdown for Question Bank
                    $('#sessionDetail').closest('.form-group').hide();
                    $('#sessionDetail').prop('required', false); // Remove required

                } else {
                    // Show the Session Detail dropdown for other types
                    $('#sessionDetail').closest('.form-group').show();
                    $('#sessionDetail').prop('required', true); // Reapply required

                }

                if (selectedType === 'quiz') {
                    $('#quizSelection').show(); // Show quiz dropdown for quiz type
                } else {
                    $('#quizSelection').hide(); // Hide quiz dropdown for other types
                }
            }).trigger('change'); // Trigger change on page load to initialize the state

        });
    </script>
</body>
</html>
