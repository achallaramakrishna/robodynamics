<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Manage Goals</title>
</head>
<body>
    <jsp:include page="/header.jsp" />
    <div class="container mt-5">
        <h2>Goals for Learning Path: ${learningPath.id}</h2>
        <h4>Exam ID: ${learningPath.examId}, Target Date: ${learningPath.targetDate}</h4>
        <hr />

        <button class="btn btn-primary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/goals/add/${learningPath.id}'">
            Add Goal
        </button>

        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="goal" items="${goals}">
                    <tr>
                        <td>${goal.id}</td>
                        <td>${goal.goalDescription}</td>
                        <td>
                            <span class="badge ${goal.status == 'Pending' ? 'bg-warning' : goal.status == 'Completed' ? 'bg-success' : 'bg-secondary'}">
                                ${goal.status}
                            </span>
                        </td>
                        <td>${goal.dueDate}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/goals/edit/${goal.id}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/goals/delete/${goal.id}" class="btn btn-danger btn-sm"
                               onclick="return confirm('Are you sure you want to delete this goal?');">
                                Delete
                            </a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <button class="btn btn-secondary mt-3" onclick="window.location.href='${pageContext.request.contextPath}/learning-path/view/${learningPath.id}'">
            Back to Learning Path
        </button>
    </div>
    <jsp:include page="/footer.jsp" />
</body>
</html>
