<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Game</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Game Details</h2>

<!-- Game Details -->
<div class="card mb-4">
    <div class="card-body">
        <h5 class="card-title">Game Name: ${game.name}</h5>
        <p class="card-text"><strong>Description:</strong> ${game.description}</p>
        <a href="${pageContext.request.contextPath}/matching-game/edit/${game.gameId}" class="btn btn-info">Edit Game</a>
    </div>
</div>

<a href="${pageContext.request.contextPath}/matching-game/category/add/${game.gameId}" 
   class="btn btn-primary mb-3">
    Add New Category
</a>

<!-- Iterate through Categories -->
<c:forEach var="category" items="${categories}">
    <div class="card mb-3">
        <div class="card-header">
            <h5 class="mb-0">
                <span>Category: ${category.categoryName}</span>
                <div class="float-end">
                    <!-- Edit Category -->
                    <a href="${pageContext.request.contextPath}/matching-game/category/edit/${category.categoryId}" 
                       class="btn btn-info btn-sm">Edit</a>

                    <!-- Delete Category -->
                    <form action="${pageContext.request.contextPath}/matching-game/category/delete/${category.categoryId}" 
                          method="post" style="display:inline;">
                        <button type="submit" class="btn btn-danger btn-sm" 
                                onclick="return confirm('Are you sure you want to delete this category?');">
                            Delete
                        </button>
                    </form>
                </div>
            </h5>
        </div>
        <div class="card-body">
            <!-- Category Image -->
            <c:if test="${not empty category.imageName}">
                <div class="mb-3">
                    <img src="${pageContext.request.contextPath}/resources/${category.imageName}" 
                         alt="${category.categoryName}" class="img-thumbnail" style="max-height: 150px;">
                </div>
            </c:if>

            <a href="${pageContext.request.contextPath}/matching-game/category/${category.categoryId}/item/add" 
               class="btn btn-success btn-sm mb-3">Add New Item</a>

            <!-- Items Table -->
            <table class="table table-striped table-hover table-bordered align-middle">
                <thead class="table-dark text-center">
                    <tr>
                        <th scope="col">Item ID</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">Matching Text</th>
                        <th scope="col">Image</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="item" items="${category.items}">
                        <tr>
                            <td class="text-center">${item.itemId}</td>
                            <td>${item.itemName}</td>
                            <td>${item.matchingText}</td>
                            <!-- Item Image -->
                            <td>
                                <c:if test="${not empty item.imageName}">
                                    <img src="${pageContext.request.contextPath}/resources/${item.imageName}" 
                                         alt="${item.itemName}" class="img-thumbnail" style="max-height: 100px;">
                                </c:if>
                            </td>
                            <td class="text-center">
                                <!-- Edit Item -->
                                <a href="${pageContext.request.contextPath}/matching-game/category/${category.categoryId}/item/edit/${item.itemId}" 
                                   class="btn btn-info btn-sm">Edit</a>

                                <!-- Delete Item -->
                                <form action="${pageContext.request.contextPath}/matching-game/item/delete/${item.itemId}" 
                                      method="post" style="display:inline;">
                                    <button type="submit" class="btn btn-danger btn-sm" 
                                            onclick="return confirm('Are you sure you want to delete this item?');">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <!-- No Items Message -->
            <c:if test="${empty category.items}">
                <div class="alert alert-warning text-center mt-3">
                    No items found in this category. Add a new item to get started!
                </div>
            </c:if>
        </div>
    </div>
</c:forEach>

<!-- No Categories Message -->
<c:if test="${empty categories}">
    <div class="alert alert-warning">No categories found for this game. Add a new category to get started.</div>
</c:if>

<!-- Back to All Games -->
<a href="${pageContext.request.contextPath}/matching-game/all" class="btn btn-secondary mt-3">Back to All Games</a>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
