<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>

<%
    request.setAttribute("pageTitle", "Dashboard");
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossorigin="anonymous">

    <!-- jQuery (Optional, only if used elsewhere) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap Bundle JS (includes Bootstrap and Popper.js) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" 
        crossorigin="anonymous"></script>

</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container-fluid my-4">
        <h2 class="text-center">Admin Dashboard</h2>

<div class="accordion" id="dashboardAccordion">
    <!-- Daily Activity Section -->
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingDailyActivity">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseDailyActivity" aria-expanded="false"
                    aria-controls="collapseDailyActivity">
                Today's Course Offerings & Attendance
            </button>
        </h2>
        <div id="collapseDailyActivity" class="accordion-collapse collapse"
             aria-labelledby="headingDailyActivity" data-bs-parent="#dashboardAccordion">
            <div class="accordion-body">

                <c:if test="${not empty todayOfferings}">
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Course Offering</th>
                                    <th>Time</th>
                                    <th>Mentor</th>
                                    <th>Enrolled Students</th>
                                    <th>Status</th>
                                    <th>Mark Attendance</th>
                                    <th>Track Course</th>
                                </tr>
                            </thead>
							<tbody>
							    <c:forEach var="offering" items="${todayOfferings}">
							        <c:forEach var="student" items="${enrolledStudentsMap[offering.courseOfferingId]}">
							            <tr>
							                <td>${offering.course.courseName}</td>
							                <td>${offering.sessionStartTime} - ${offering.sessionEndTime}</td>
							                <td>${offering.instructor.firstName}</td>
							                <td>${student.firstName}</td>
							                <td>
							                    <c:choose>
							                       <c:when test="${student.attendanceStatus eq 'Present'}">
													    <span class="badge bg-success">🟢 Present</span>
													</c:when>
													<c:when test="${student.attendanceStatus eq 'Absent'}">
													    <span class="badge bg-warning text-dark">🟡 Absent</span>
													</c:when>
													<c:otherwise>
													    <span class="badge bg-danger">🔴 Not Marked</span>
													</c:otherwise>

							                    </c:choose>
							                </td>
							                <td>
												<form method="post" action="${pageContext.request.contextPath}/attendance/mark">
												    <input type="hidden" name="offeringId" value="${offering.courseOfferingId}" />
												    <input type="hidden" name="studentId" value="${student.userID}" />
												   	<input type="hidden" name="status" value="1" />
													<button type="submit" class="btn btn-sm btn-success">Mark Present</button>
												</form>
												
												<form method="post" action="${pageContext.request.contextPath}/attendance/mark">
												    <input type="hidden" name="offeringId" value="${offering.courseOfferingId}" />
												    <input type="hidden" name="studentId" value="${student.userID}" />
												    <input type="hidden" name="status" value="0" />
												    <button type="submit" class="btn btn-sm btn-danger">Mark Absent</button>
												</form>
							                </td>
							                <td>
							                 <!-- ✅ Add Course Tracking Button -->
												<button type="button" 
												    class="btn btn-sm btn-primary mt-1"
												    data-bs-toggle="modal" 
												    data-bs-target="#courseTrackingModal"
												    data-enrollment-id="${student.enrollmentId}" 
												    data-class-session-id="${student.classSessionId}"
												    data-offering-id="${offering.courseOfferingId}">
												    Add Tracking
												</button>


											</td>
							            </tr>
							        </c:forEach>
							    </c:forEach>
							</tbody>
                        </table>
                    </div>
                </c:if>

                <c:if test="${empty todayOfferings}">
                    <div class="alert alert-warning text-center">
                        No course offerings scheduled for today.
                    </div>
                </c:if>

            </div>
        </div>
    </div>
</div>

           
            <!-- User Management Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingUserManagement">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapseUserManagement" aria-expanded="true" 
                            aria-controls="collapseUserManagement">
                        User Management
                    </button>
                </h2>
                <div id="collapseUserManagement" class="accordion-collapse collapse show" 
                     aria-labelledby="headingUserManagement" data-bs-parent="#dashboardAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            <!-- Enquiries Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Enquiries</h5>
                                        <p class="card-text">View and manage enquiries from users.</p>
                                        <a href="${pageContext.request.contextPath}/enquiry/list" class="btn btn-primary">Manage Enquiries</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Users Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Users</h5>
                                        <p class="card-text">View and manage registered users.</p>
                                        <a href="${pageContext.request.contextPath}/listusers" class="btn btn-primary">Manage Users</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			<!-- Student Management Section -->
			<div class="accordion-item">
			    <h2 class="accordion-header" id="headingStudentManagement">
			        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
			                data-bs-target="#collapseStudentManagement" aria-expanded="false" 
			                aria-controls="collapseStudentManagement">
			            Student Management
			        </button>
			    </h2>
			    <div id="collapseStudentManagement" class="accordion-collapse collapse" 
			         aria-labelledby="headingStudentManagement" data-bs-parent="#dashboardAccordion">
			        <div class="accordion-body">
			            <div class="row">
			                <!-- Manage Assignments Card -->
			                <div class="col-md-4 mb-4">
			                    <div class="card">
			                        <div class="card-body">
			                            <h5 class="card-title">Manage Assignments</h5>
			                            <p class="card-text">View student uploads, grade assignments, and provide feedback.</p>
			                            <a href="${pageContext.request.contextPath}/mentor/uploads" class="btn btn-primary">Go to Assignments</a>
			                        </div>
			                    </div>
			                </div>
			
			                <!-- Optional: Add more student-related tools here -->
			            </div>
			        </div>
			    </div>
			</div>

            <!-- Content Management Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingContentManagement">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapseContentManagement" aria-expanded="false" 
                            aria-controls="collapseContentManagement">
                        Content Management
                    </button>
                </h2>
                <div id="collapseContentManagement" class="accordion-collapse collapse" 
                     aria-labelledby="headingContentManagement" data-bs-parent="#dashboardAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            <!-- Matching Games Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Matching Games</h5>
                                        <p class="card-text">View and manage matching games, categories, and items.</p>
                                        <a href="${pageContext.request.contextPath}/matching-game/all" class="btn btn-primary">Manage Games</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Flashcards Card Sets -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Flashcard Sets</h5>
                                        <p class="card-text">View and manage flashcard Sets for different subjects.</p>
                                        <a href="${pageContext.request.contextPath}/flashcardsets/flashcard-set-list" class="btn btn-primary">Manage Flashcard Sets</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Flashcards Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Flashcards</h5>
                                        <p class="card-text">View and manage flashcards for different subjects.</p>
                                        <a href="${pageContext.request.contextPath}/flashcards/list" class="btn btn-primary">Manage Flashcards</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Slides Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Slides</h5>
                                        <p class="card-text">View and manage all slides for sessions.</p>
                                        <a href="${pageContext.request.contextPath}/slides/list" class="btn btn-primary">Manage Slides</a>
                                    </div>
                                </div>
                            </div>
                            
                                                        <!-- Quizzes Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Quizzes</h5>
                                        <p class="card-text">View and manage all quizzes.</p>
                                        <a href="${pageContext.request.contextPath}/quizzes/dashboard" class="btn btn-primary">Manage Quizzes</a>
                                    </div>
                                </div>
                            </div>

							<!-- Create Test Card -->
							<div class="col-md-4 mb-4">
							    <div class="card">
							        <div class="card-body">
							            <h5 class="card-title">Create Test</h5>
							            <p class="card-text">Design and customize tests for students with specific courses and sessions.</p>
							            <a href="${pageContext.request.contextPath}/tests/create" class="btn btn-primary">Create Test</a>
							        </div>
							    </div>
							</div>

                            <!-- Quiz Questions Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Quiz Questions</h5>
                                        <p class="card-text">View and manage quiz questions.</p>
                                        <a href="${pageContext.request.contextPath}/quizquestions/listQuizQuestions" class="btn btn-primary">Manage Quiz Questions</a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <!-- Course Management Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingCourseManagement">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapseCourseManagement" aria-expanded="false" 
                            aria-controls="collapseCourseManagement">
                        Course Management
                    </button>
                </h2>
                <div id="collapseCourseManagement" class="accordion-collapse collapse" 
                     aria-labelledby="headingCourseManagement" data-bs-parent="#dashboardAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            <!-- Course Categories Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Course Categories</h5>
                                        <p class="card-text">View and manage course categories.</p>
                                        <a href="${pageContext.request.contextPath}/coursecategory/list" class="btn btn-primary">Manage Categories</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Courses Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Courses</h5>
                                        <p class="card-text">View and manage available courses.</p>
                                        <a href="${pageContext.request.contextPath}/course/list" class="btn btn-primary">Manage Courses</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Course Offerings Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Course Offerings</h5>
                                        <p class="card-text">View and manage course offerings.</p>
                                        <a href="${pageContext.request.contextPath}/courseoffering/list" class="btn btn-primary">Manage Offerings</a>
                                    </div>
                                </div>
                            </div>
                            

                            <!-- Course Sessions Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Course Sessions</h5>
                                        <p class="card-text">View and manage sessions for each course.</p>
                                        <a href="${pageContext.request.contextPath}/courseSession/list" class="btn btn-primary">Manage Sessions</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Course Session Details Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Course Session Details</h5>
                                        <p class="card-text">View and manage detailed sessions of each course.</p>
                                        <a href="${pageContext.request.contextPath}/sessiondetail/list" class="btn btn-primary">Manage Session Details</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Course Tracking Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Course Tracking</h5>
                                        <p class="card-text">View and manage course progress and feedback for students.</p>
                                        <a href="${pageContext.request.contextPath}/courseTracking/manageCourseTracking" class="btn btn-primary">Manage Course Tracking</a>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
                
                 <!-- Event Management Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingEventManagement">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapseEventManagement" aria-expanded="false" 
                            aria-controls="collapseEventManagement">
                        Event Management
                    </button>
                </h2>
                <div id="collapseEventManagement" class="accordion-collapse collapse" 
                     aria-labelledby="headingEventManagement" data-bs-parent="#dashboardAccordion">
                    <div class="accordion-body">
                        <div class="row">
                            <!-- Workshops Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Workshops</h5>
                                        <p class="card-text">View and manage upcoming workshops.</p>
                                        <a href="${pageContext.request.contextPath}/workshops/list" class="btn btn-primary">Manage Workshops</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Competitions Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Competitions</h5>
                                        <p class="card-text">View and manage competitions.</p>
                                        <a href="${pageContext.request.contextPath}/competition/list" class="btn btn-primary">Manage Competitions</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Projects Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Projects</h5>
                                        <p class="card-text">View and manage projects.</p>
                                        <a href="${pageContext.request.contextPath}/projects/list" class="btn btn-primary">Manage Projects</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Past Exam Papers Card -->
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Past Exam Papers</h5>
                                        <p class="card-text">Upload, view, and manage past exam papers.</p>
                                        <a href="${pageContext.request.contextPath}/pastexampapers/managePastExamPapers" class="btn btn-primary">Manage Past Exam Papers</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
			  <!-- Learning Path Management Section -->
			<div class="accordion-item">
			    <h2 class="accordion-header" id="headingLearningPathManagement">
			        <button class="accordion-button" type="button" data-bs-toggle="collapse" 
			                data-bs-target="#collapseLearningPathManagement" aria-expanded="true" 
			                aria-controls="collapseLearningPathManagement">
			            Learning Path Management
			        </button>
			    </h2>
			    <div id="collapseLearningPathManagement" class="accordion-collapse collapse show" 
			         aria-labelledby="headingLearningPathManagement" data-bs-parent="#dashboardAccordion">
			        <div class="accordion-body">
			            <div class="row">
			                <!-- Learning Path Templates Card -->
			                <div class="col-md-4 mb-4">
			                    <div class="card">
			                        <div class="card-body">
			                            <h5 class="card-title">Learning Path Templates</h5>
			                            <p class="card-text">Create, view, and manage learning path templates.</p>
			                            <a href="${pageContext.request.contextPath}/learningpathtemplates/list" class="btn btn-primary">Manage Templates</a>
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>

			<!-- Apps Management Section -->
				<div class="accordion-item">
					<h2 class="accordion-header" id="headingAppsManagement">
						<button class="accordion-button collapsed" type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseAppsManagement" aria-expanded="false"
							aria-controls="collapseAppsManagement">Apps Management</button>
					</h2>
					<div id="collapseAppsManagement"
						class="accordion-collapse collapse"
						aria-labelledby="headingAppsManagement"
						data-bs-parent="#dashboardAccordion">
						<div class="accordion-body">
							<div class="row">
								<!-- Matching Games Card -->
								<div class="col-md-4 mb-4">
									<div class="card">
										<div class="card-body">
											<h5 class="card-title">Matching Games</h5>
											<p class="card-text">View and manage matching games,
												categories, and items.</p>
											<a
												href="${pageContext.request.contextPath}/matching-game/list"
												class="btn btn-primary">Manage Games</a>
										</div>
									</div>
								</div>

								<!-- Additional Apps can be added here -->
								<!-- Example: Vocabulary Builder -->
								<div class="col-md-4 mb-4">
									<div class="card">
										<div class="card-body">
											<h5 class="card-title">Vocabulary Builder</h5>
											<p class="card-text">An interactive app for enhancing
												vocabulary.</p>
											<a
												href="${pageContext.request.contextPath}/vocabulary-builder"
												class="btn btn-primary">Explore Vocabulary Builder</a>
										</div>
									</div>
								</div>

								<!-- Example: Quiz Timer -->
								<div class="col-md-4 mb-4">
									<div class="card">
										<div class="card-body">
											<h5 class="card	-title">Quiz Timer</h5>
											<p class="card-text">A timer app to assist students
												during quizzes.</p>
											<a href="${pageContext.request.contextPath}/quiz-timer"
												class="btn btn-primary">Use Quiz Timer</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>




			</div>
        </div>
        
        <!-- Course Tracking Modal -->
		<div class="modal fade" id="courseTrackingModal" tabindex="-1" aria-labelledby="courseTrackingModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-lg">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title" id="courseTrackingModalLabel">Add Course Tracking</h5>
		                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		            </div>
		            <div class="modal-body">
		                <form id="courseTrackingForm" enctype="multipart/form-data" method="post">
		                    <input type="hidden" name="studentEnrollmentId" id="trackingStudentId">
		                    <input type="hidden" name="classSessionId" id="trackingClassSessionId">
		                    
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
		        
		<script>
		$('#courseTrackingModal').on('show.bs.modal', function (event) {
		    var button = $(event.relatedTarget);
		    var enrollmentId = button.data('enrollment-id');

		    $('#trackingStudentId').val(enrollmentId);
		    $('#trackingClassSessionId').val(button.data('class-session-id')); // ✅ now populated


		    $.getJSON('${pageContext.request.contextPath}/courseTracking/getCourseSessionsFromOffering', 
		        { offeringId: button.data('offering-id') }, function(data) {
		            $('#courseSessionId').empty().append('<option value="">-- Select Course Session --</option>');
		            $.each(data.courseSessions, function(index, session) {
		                $('#courseSessionId').append('<option value="'+session.courseSessionId+'">'+session.sessionTitle+'</option>');
		            });
		    });
		});


		
		$('#saveButton').click(function(e) {
		    e.preventDefault();
		    console.log("EnrollmentID:", $('#trackingStudentId').val());
		    console.log("SessionID:", $('#courseSessionId').val());
		    console.log("Feedback:", $('#feedback').val());

		    var formData = new FormData($('#courseTrackingForm')[0]);

		    $.ajax({
		        url: '${pageContext.request.contextPath}/courseTracking/save',
		        type: 'POST',
		        data: formData,
		        processData: false,
		        contentType: false,
		        success: function(response) {
		            $('#courseTrackingModal').modal('hide');
		            alert(response);
		        },
		        error: function(xhr) {
		            alert('Failed to save course tracking: ' + xhr.responseText);
		        }
		    });
		});




		</script>

    <!-- Include footer JSP -->
    <jsp:include page="footer.jsp" />
</body>
</html> 