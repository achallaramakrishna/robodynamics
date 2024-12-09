<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
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
    </div>

    <!-- Include footer JSP -->
    <jsp:include page="footer.jsp" />
</body>
</html>
