<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Items</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body class="container">

<h2 class="my-4">Items in Category: ${category.categoryName}</h2>

<!-- Add New Item Button -->
<a href="${pageContext.request.contextPath}/matching-game/category/${category.categoryId}/item/form" class="btn btn-primary mb-3">
    <i class="bi bi-plus-circle"></i> Add New Item
</a>

<!-- Table of Items -->
<table class="table table-striped table-hover table-bordered align-middle">
    <thead class="table-dark text-center">
        <tr>
            <th scope="col">Item ID</th>
            <th scope="col">Item Name</th>
            <th scope="col">Matching Text</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach var="item" items="${items}">
            <tr>
                <td class="text-center">${item.itemId}</td>
                <td>${item.itemName}</td>
                <td>${item.matchingText}</td>
                <td class="text-center">
                    <!-- Action Buttons -->
                    <div class="btn-group" role="group" aria-label="Actions">
                        <!-- Edit Item -->
                        <a href="${pageContext.request.contextPath}/matching-game/category/${category.categoryId}/item/form?itemId=${item.itemId}" 
                           class="btn btn-info btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Item">
                            <i class="bi bi-pencil"></i> Edit
                        </a>

                        <!-- Delete Item -->
                        <form action="${pageContext.request.contextPath}/matching-game/item/delete/${item.itemId}" method="post" style="display:inline;">
                            <button type="submit" class="btn btn-danger btn-sm" 
                                    onclick="return confirm('Are you sure you want to delete this item?');" 
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Item">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </form>
                    </div>
                </td>
            </tr>
        </c:forEach>
    </tbody>
</table>

<!-- No Items Message -->
<c:if test="${empty items}">
    <div class="alert alert-warning text-center mt-4">No items found in this category. Add a new item to get started!</div>
</c:if>

<!-- Back to Categories Button -->
<a href="${pageContext.request.contextPath}/matching-game/${category.game.gameId}/categories" class="btn btn-secondary mt-3">
    <i class="bi bi-arrow-left-circle"></i> Back to Categories
</a>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    // Enable tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
</script>

</body>
</html>
