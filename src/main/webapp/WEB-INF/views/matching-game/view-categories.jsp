<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Categories</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Categories for Game</h2>

<!-- Back to All Games -->
<a href="${pageContext.request.contextPath}/matching-game/all" class="btn btn-secondary mb-3">Back to All Games</a>

<!-- Add New Category Button -->
<a href="${pageContext.request.contextPath}/matching-game/${gameId}/category/new" class="btn btn-primary mb-3">Add New Category</a>

<!-- Categories Table -->
<table class="table table-bordered table-hover">
    <thead class="table-dark">
        <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach var="category" items="${categories}">
            <tr>
                <td>${category.categoryId}</td>
                <td>${category.categoryName}</td>
                <td>
                    <!-- View Items in Category -->
                    <a href="${pageContext.request.contextPath}/matching-game/category/${category.categoryId}/items" class="btn btn-info btn-sm">View Items</a>

                    <!-- Delete Category -->
                    <form action="${pageContext.request.contextPath}/matching-game/category/delete/${category.categoryId}" method="post" style="display:inline;">
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this category?');">Delete</button>
                    </form>
                </td>
            </tr>
        </c:forEach>
    </tbody>
</table>

<!-- No Categories Found -->
<c:if test="${empty categories}">
    <div class="alert alert-warning text-center">
        No categories found for this game. Click "Add New Category" to create one.
    </div>
</c:if>

</body>
</html>
