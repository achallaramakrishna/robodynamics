<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <link rel="stylesheet" href="<c:url value='/css/styles.css'/>">
</head>
<body>

<h2>${game.name}</h2>
<p>${game.description}</p>

<div class="game-container">
    <!-- Dynamic Items Section -->
    <div class="items">
        <h3>Items</h3>
        <c:forEach var="item" items="${items}">
            <div class="item" draggable="true" id="item-${item.id}" data-correct-category="category-${item.correctCategoryId}">
                ${item.itemName}
            </div>
        </c:forEach>
    </div>

    <!-- Dynamic Categories Section -->
    <div class="categories">
        <h3>Categories</h3>
        <c:forEach var="category" items="${categories}">
            <div class="category" id="category-${category.id}">${category.categoryName}</div>
        </c:forEach>
    </div>
</div>

<div id="result"></div>
<div id="score">Score: 0</div>

<script src="<c:url value='/js/matching-game.js'/>"></script>
</body>
</html>
