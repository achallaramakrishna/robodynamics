<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Manage Past Question Papers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
</head>
<body>
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Manage Past Question Papers</h1>
        <hr />

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
                        <c:forEach var="exam" items="${exams}">
                            <option value="${exam.examId}">${exam.examName}</option>
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
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="paper" items="${pastExamPapers}">
                    <tr>
                        <td>${paper.examYear}</td>
                        <td>${paper.examName}</td>
                        <td>${paper.totalMarks}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/managePastExamPapers/view?examPaperId=${paper.examPaperId}" class="btn btn-info btn-sm">
                                View
                            </a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <jsp:include page="/footer.jsp" />
</body>
</html>
