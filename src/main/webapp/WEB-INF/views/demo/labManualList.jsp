<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <title>Lab Manuals</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>

<body class="container py-4">

<h3 class="mb-4">Lab Manuals</h3>

<a class="btn btn-primary mb-3"
   href="${pageContext.request.contextPath}/admin/labmanual/upload?sessionDetailId=${sessionDetailId}">
    + Add Lab Manual
</a>

<table class="table table-bordered table-hover align-middle">
    <thead class="table-light">
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Difficulty</th>
        <th>Version</th>
        <th>Estimated Time</th>
        <th>Actions</th>
    </tr>
    </thead>

    <tbody>
    <c:forEach var="m" items="${manuals}">
        <tr>
            <td>${m.labManualId}</td>
            <td>${m.title}</td>
            <td>${m.difficultyLevel}</td>
            <td>v${m.version}</td>
            <td>${m.estimatedMinutes} mins</td>
            <td>
                <a class="btn btn-sm btn-info"
                   href="${pageContext.request.contextPath}/admin/labmanual/view?labManualId=${m.labManualId}">
                    View
                </a>

                <form method="post"
                      action="${pageContext.request.contextPath}/admin/labmanual/delete"
                      style="display:inline;">
                    <input type="hidden" name="labManualId" value="${m.labManualId}"/>
                    <input type="hidden" name="sessionDetailId" value="${sessionDetailId}"/>
                    <button class="btn btn-sm btn-danger"
                            onclick="return confirm('Delete this lab manual?');">
                        Delete
                    </button>
                </form>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

</body>
</html>
