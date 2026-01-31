<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
    crossorigin="anonymous">
<script
    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
    integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
    crossorigin="anonymous"></script>
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Onboarding: Manage Learning Path</title>
<script>

function reloadForChild() {
    const childId = document.getElementById('selectedChildId').value;
    if (childId) {
        const baseUrl = window.location.pathname; // Get current path

        let query = new URLSearchParams(window.location.search || ''); // Safely capture query params

        query.set('childId', childId); // Set or update childId param

        const newQuery = query.toString();
       const newUrl = baseUrl + "?" + newQuery;


        window.location.href = newUrl; // Reload with updated query string
    }
}



    // Function to update the exam date based on selected exam
    function updateExamDate() {
        const examSelect = document.getElementById('examId');
        const selectedOption = examSelect.options[examSelect.selectedIndex];
        const examDate = selectedOption.getAttribute('data-exam-date');
        document.getElementById('examDate').value = examDate;
        document.getElementById('hiddenExamDate').value = examDate;
    }

    // Function to toggle the form visibility
    document.addEventListener("DOMContentLoaded", function () {
        const toggleButton = document.getElementById('toggleFormButton');
        const formSection = document.getElementById('createLearningPathForm');
        const cancelButton = document.getElementById('cancelFormButton');

        toggleButton.addEventListener('click', function () {
            if (formSection.style.display === 'none') {
                formSection.style.display = 'block';
                toggleButton.textContent = 'Hide Form';
            } else {
                formSection.style.display = 'none';
                toggleButton.textContent = 'Create Learning Path';
            }
        });

        cancelButton.addEventListener('click', function () {
            formSection.style.display = 'none';
            toggleButton.textContent = 'Create Learning Path';
        });
    });
</script>
</head>
<body>
    <jsp:include page="/header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
                <br>

                <!-- Back to Dashboard Button -->
                <button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                    Back to Dashboard
                </button>
                <br><br>

                <h2>Manage Learning Path</h2>
                <hr />

                <c:if test="${not empty errorMessage}">
                    <div class="alert alert-danger">${errorMessage}</div>
                </c:if>

                <!-- Child Selection -->
                <c:if test="${user.profile_id == 4}">
                    <div class="mb-3">
                        <label for="selectedChildId" class="form-label">Select Child</label>
                        <select id="selectedChildId" class="form-select" onchange="reloadForChild()">
                            <option value="" disabled ${empty param.childId ? 'selected' : ''}>Select a child</option>
                            <c:forEach var="child" items="${children}">
                                <option value="${child.userID}" ${child.userID == param.childId ? 'selected' : ''}>
                                    ${child.firstName} ${child.lastName}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                </c:if>

                <!-- Existing Learning Path -->
                <c:if test="${not empty existingLearningPaths}">
                    <h3>Existing Learning Path</h3>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Exam Year</th>
                                <th>Target Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="learningPath" items="${existingLearningPaths}">
                                <tr>
                                    <td>${learningPath.exam.examName}</td>
                                    <td>${learningPath.exam.examYear}</td>
                                    <td>${learningPath.targetDate}</td>
                                    <td>${learningPath.status}</td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </c:if>

                <!-- Button to Toggle Form -->
                <button id="toggleFormButton" class="btn btn-primary" ${not empty existingLearningPaths ? 'disabled' : ''}>
                    Create Learning Path
                </button>

                <!-- Inline Form Section -->
                <div id="createLearningPathForm" style="display: none; margin-top: 20px;">
                    <form action="${pageContext.request.contextPath}/exam-prep/onboarding" method="post">
                        <input type="hidden" name="selectedChildId" value="${param.childId}" />

                        <div class="mb-3">
                            <label for="examId" class="form-label">Select Exam</label>
                            <select name="examId" id="examId" class="form-select" required onchange="updateExamDate()">
                                <option value="" disabled selected>Select an exam</option>
                                <c:forEach var="exam" items="${exams}">
                                    <option value="${exam.id}" data-exam-date="${exam.examDate}">
                                        ${exam.examName} (${exam.examYear})
                                    </option>
                                </c:forEach>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="examDate" class="form-label">Exam Date</label>
                            <input type="text" id="examDate" class="form-control" readonly>
                            <input type="hidden" name="targetDate" id="hiddenExamDate">
                        </div>

                        <div class="d-flex justify-content-start">
                            <button type="submit" class="btn btn-primary">Create</button>
                            <button type="button" id="cancelFormButton" class="btn btn-secondary ms-2">Cancel</button>
                        </div>
                    </form>
                </div>

                <c:if test="${not empty successMessage}">
                    <div class="alert alert-success">${successMessage}</div>
                </c:if>

            </div>
        </div>
    </div>
    <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
