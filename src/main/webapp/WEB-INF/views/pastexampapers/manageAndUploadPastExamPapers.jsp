<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Manage and Upload Past Exam Papers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Manage and Upload Past Exam Papers</h1>
        <hr />

        <!-- Success and Error Messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Upload Section -->
        <div class="card mb-5">
            <div class="card-header">
                <h5>Upload New Past Exam Paper</h5>
            </div>
            <div class="card-body">
            <form id="uploadPastExamPaperForm" method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/pastexampapers/upload">
                    <div class="mb-3">
                        <label for="jsonFile" class="form-label">Select JSON File</label>
                        <input type="file" id="jsonFile" name="jsonFile" class="form-control" accept=".json" required />
                    </div>
                    <button type="submit" class="btn btn-primary">Upload Exam Paper</button>
                </form>
            </div>
        </div>

        <!-- Manage Section -->
        <div class="card">
            <div class="card-header">
                <h5>Manage Past Exam Papers</h5>
            </div>
            <div class="card-body">
                <!-- Filter Form -->
                <form method="get" action="${pageContext.request.contextPath}/managePastExamPapers">
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="year">Year</label>
                            <select id="year" name="year" class="form-control">
                                <option value="">-- Select Year --</option>
                                <c:forEach var="yr" items="${years}">
                                    <option value="${yr}">${yr}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="exam">Exam</label>
                            <select id="exam" name="exam" class="form-control">
							    <option value="">-- Select Exam --</option>
							    <c:forEach var="examName" items="${exams}">
							        <option value="${examName}">${examName}</option>
							    </c:forEach>
							</select>
                        </div>
                        <div class="col-md-4 mt-4">
                            <button type="submit" class="btn btn-primary">Filter</button>
                        </div>
                    </div>
                </form>

                <!-- Display Exam Papers -->
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Exam Name</th>
                            <th>Total Marks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="paper" items="${pastExamPapers}">
                            <tr>
                                <td>${paper.examYear}</td>
                                <td>${paper.examName}</td>
                                <td>${paper.totalMarks}</td>
                                <td>
                                    <a href="${pageContext.request.contextPath}/pastexampapers/view?examPaperId=${paper.pastExamId}" class="btn btn-info btn-sm">View</a>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <jsp:include page="/footer.jsp" />
</body>
</html>
