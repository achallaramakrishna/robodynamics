<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${goal.id == 0 ? 'Add Goal' : 'Edit Goal'}</title>
</head>
<body>
    <jsp:include page="/header.jsp" />
    <div class="container mt-5">
        <h2>${goal.id == 0 ? 'Add Goal' : 'Edit Goal'}</h2>
        <hr />
        <form action="${pageContext.request.contextPath}/goals/save" method="post">
            <input type="hidden" name="id" value="${goal.id}" />
            <input type="hidden" name="learningPathId" value="${goal.learningPathId}" />

            <div class="mb-3">
                <label for="goalDescription" class="form-label">Description</label>
                <textarea id="goalDescription" name="goalDescription" class="form-control" rows="3" required>${goal.goalDescription}</textarea>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select id="status" name="status" class="form-control">
                    <option value="Pending" ${goal.status == 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Completed" ${goal.status == 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="dueDate" class="form-label">Due Date</label>
                <input type="date" id="dueDate" name="dueDate" value="${goal.dueDate}" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-success">${goal.id == 0 ? 'Add Goal' : 'Save Changes'}</button>
            <button type="button" class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/goals/list/${goal.learningPathId}'">
                Cancel
            </button>
        </form>
    </div>
    <jsp:include page="/footer.jsp" />
</body>
</html>
