<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>

<div class="accordion mt-3" id="parentSectionsAccordion">

  <!-- Learning & Practice -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingLearning">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseLearning" aria-expanded="false" aria-controls="collapseLearning">
        Learning & Practice
      </button>
    </h2>
    <div id="collapseLearning" class="accordion-collapse collapse" aria-labelledby="headingLearning"
         data-bs-parent="#parentSectionsAccordion">
      <div class="accordion-body">
        <div class="row">
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Flashcards</h5>
                <p class="card-text small">Practice key concepts by subject.</p>
                <a href="${pageContext.request.contextPath}/flashcards/list" class="btn btn-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Quizzes</h5>
                <p class="card-text small">Start quizzes and track scores.</p>
                <a href="${pageContext.request.contextPath}/quizzes/dashboard" class="btn btn-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Assignments</h5>
                <p class="card-text small">View uploads, grades, and feedback.</p>
                <a href="${pageContext.request.contextPath}/mentor/uploads" class="btn btn-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Optional: render learning paths list if provided -->
        <c:if test="${not empty learningPaths}">
          <div class="mt-3">
            <h6 class="fw-semibold">Learning Paths</h6>
            <ul class="mb-0">
              <c:forEach var="path" items="${learningPaths}">
                <li class="mb-1">
                  <strong>${path.name}</strong> — ${path.description}
                  <a href="${pageContext.request.contextPath}/exam-prep/view?pathId=${path.id}"
                     class="btn btn-outline-info btn-sm ms-2">View</a>
                </li>
              </c:forEach>
            </ul>
          </div>
        </c:if>
      </div>
    </div>
  </div>

  <!-- School Tests & Scores -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTests">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseTests" aria-expanded="false" aria-controls="collapseTests">
        School Tests & Scores
      </button>
    </h2>
    <div id="collapseTests" class="accordion-collapse collapse" aria-labelledby="headingTests"
         data-bs-parent="#parentSectionsAccordion">
      <div class="accordion-body">
        <div class="row">
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Add Upcoming Test</h5>
                <p class="card-text small">Create a test and map chapters.</p>
                <a href="${pageContext.request.contextPath}/parent/school-tests" class="btn btn-primary btn-sm">Go</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Upcoming Tests</h5>
                <p class="card-text small">See tests in the next 60 days.</p>
                <a href="${pageContext.request.contextPath}/parent/school-tests?view=upcoming" class="btn btn-success btn-sm">Open</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Past Scores</h5>
                <p class="card-text small">View marks and weak topics.</p>
                <a href="${pageContext.request.contextPath}/parent/reports" class="btn btn-warning btn-sm">Open</a>
              </div>
            </div>
          </div>
        </div>

        <!-- (Optional) Mini table for last created quizzes/tests -->
        <c:if test="${not empty createdTests}">
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead class="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="test" items="${createdTests}">
                  <tr>
                    <td>${test.quizName}</td>
                    <td>${test.course.courseName}</td>
                    <td>${test.totalQuestions}</td>
                    <td>${test.durationMinutes}</td>
                    <td class="d-flex gap-1">
                      <a href="${pageContext.request.contextPath}/quizzes/start/${test.quizId}?showHeaderFooter=true" class="btn btn-success btn-sm">Take</a>
                      <a href="${pageContext.request.contextPath}/quizzes/edit/${test.quizId}" class="btn btn-warning btn-sm">Edit</a>
                      <a href="${pageContext.request.contextPath}/quizzes/delete/${test.quizId}" class="btn btn-danger btn-sm"
                         onclick="return confirm('Delete this test?');">Delete</a>
                    </td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>
          </div>
        </c:if>
      </div>
    </div>
  </div>

  <!-- Support & Payments (optional quick links) -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingSupport">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseSupport" aria-expanded="false" aria-controls="collapseSupport">
        Support & Payments
      </button>
    </h2>
    <div id="collapseSupport" class="accordion-collapse collapse" aria-labelledby="headingSupport"
         data-bs-parent="#parentSectionsAccordion">
      <div class="accordion-body">
        <div class="row">
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Help & Support</h5>
                <p class="card-text small">Contact Robo Dynamics.</p>
                <a href="${pageContext.request.contextPath}/support" class="btn btn-outline-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Payments</h5>
                <p class="card-text small">View invoices & payment history.</p>
                <a href="${pageContext.request.contextPath}/payments" class="btn btn-outline-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">Notices</h5>
                <p class="card-text small">Announcements & updates.</p>
                <a href="${pageContext.request.contextPath}/notices" class="btn btn-outline-primary btn-sm">Open</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
