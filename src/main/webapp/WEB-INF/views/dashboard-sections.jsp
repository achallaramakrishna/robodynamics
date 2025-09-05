<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>

<div class="accordion" id="dashboardSectionsAccordion">

    <!-- User Management Section -->
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingUserManagement">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseUserManagement" aria-expanded="false" 
                    aria-controls="collapseUserManagement">
                User Management
            </button>
        </h2>
        <div id="collapseUserManagement" class="accordion-collapse collapse" 
             aria-labelledby="headingUserManagement" data-bs-parent="#dashboardSectionsAccordion">
            <div class="accordion-body">
                <div class="row">
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Enquiries</h5>
                                <p class="card-text small">View and manage enquiries.</p>
                                <a href="${pageContext.request.contextPath}/enquiry/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Users</h5>
                                <p class="card-text small">Manage registered users.</p>
                                <a href="${pageContext.request.contextPath}/listusers" 
                                   class="btn btn-primary btn-sm">Manage</a>
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
             aria-labelledby="headingStudentManagement" data-bs-parent="#dashboardSectionsAccordion">
            <div class="accordion-body">
                <div class="row">
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Assignments</h5>
                                <p class="card-text small">View uploads, grade, and feedback.</p>
                                <a href="${pageContext.request.contextPath}/mentor/uploads" 
                                   class="btn btn-primary btn-sm">Go</a>
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
             aria-labelledby="headingContentManagement" data-bs-parent="#dashboardSectionsAccordion">
            <div class="accordion-body">
                <div class="row">
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Flashcards</h5>
                                <p class="card-text small">Manage flashcards for subjects.</p>
                                <a href="${pageContext.request.contextPath}/flashcards/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Quizzes</h5>
                                <p class="card-text small">Manage quizzes and questions.</p>
                                <a href="${pageContext.request.contextPath}/quizzes/dashboard" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
				<!-- Upload Quiz Questions (Admins & Mentors) -->
				<div class="col-6 col-md-4 mb-3">
				  <div class="card shadow-sm h-100 text-center">
				    <div class="card-header bg-success text-white">
				      <h5 class="mb-0">⬆️ Upload Quiz Questions</h5>
				    </div>
				    <div class="card-body">
				      <p class="card-text">
				        Upload a JSON file and map questions to <em>Slide</em>, <em>Quiz</em>, or <em>Question Bank</em>.
				      </p>
				      <div class="d-grid gap-2">
				        <!-- Opens uploader/list page -->
				        <a href="${pageContext.request.contextPath}/quizquestions/listQuizQuestions"
				           class="btn btn-primary">
				          Open Uploader
				        </a>
				
				        <!-- New link to manage media -->
				        <a href="${pageContext.request.contextPath}/quizquestions/manageMedia"
				           class="btn btn-warning">
				          Manage Media
				        </a>
				      </div>
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
             aria-labelledby="headingCourseManagement" data-bs-parent="#dashboardSectionsAccordion">
            <div class="accordion-body">
                <div class="row">
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Courses</h5>
                                <p class="card-text small">Manage courses and offerings.</p>
                                <a href="${pageContext.request.contextPath}/course/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Categories</h5>
                                <p class="card-text small">Manage course categories.</p>
                                <a href="${pageContext.request.contextPath}/coursecategory/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <!-- ✅ Added Offerings, Sessions, Tracking -->
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Offerings</h5>
                                <p class="card-text small">Manage course offerings.</p>
                                <a href="${pageContext.request.contextPath}/courseoffering/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Sessions</h5>
                                <p class="card-text small">Manage course sessions.</p>
                                <a href="${pageContext.request.contextPath}/courseSession/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
					    <div class="card shadow-sm">
					        <div class="card-body text-center">
					            <h5 class="card-title">Session Details</h5>
					            <p class="card-text small">Manage detailed sessions of each course.</p>
					            <a href="${pageContext.request.contextPath}/sessiondetail/list" 
					               class="btn btn-primary btn-sm">Manage</a>
					        </div>
					    </div>
					</div>
                    
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Tracking</h5>
                                <p class="card-text small">Track student course progress.</p>
                                <a href="${pageContext.request.contextPath}/courseTracking/manageCourseTracking" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
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
             aria-labelledby="headingEventManagement" data-bs-parent="#dashboardSectionsAccordion">
            <div class="accordion-body">
                <div class="row">
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Workshops</h5>
                                <p class="card-text small">Manage upcoming workshops.</p>
                                <a href="${pageContext.request.contextPath}/workshops/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <h5 class="card-title">Competitions</h5>
                                <p class="card-text small">Manage competitions and projects.</p>
                                <a href="${pageContext.request.contextPath}/competition/list" 
                                   class="btn btn-primary btn-sm">Manage</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
