<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>

    <style>
        body {
            font-family: 'Comic Sans MS', Arial, sans-serif;
            background-color: #f9fcff;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
            color: #ff6f61;
            font-size: 3em;
            margin: 20px 0;
            text-shadow: 2px 2px #ffe4e1;
        }
        p {
            text-align: center;
            color: #888;
            font-size: 1.2em;
        }
        .game-container {
            display: flex;
            justify-content: space-around;
            padding: 30px;
            flex-wrap: wrap;
        }
        .items, .categories {
            flex: 1;
            margin: 15px;
            padding: 20px;
            border-radius: 15px;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .items h3, .categories h3 {
            color: #1f77d0;
            font-size: 1.8em;
            margin-bottom: 20px;
        }
        .item {
            display: inline-block;
            margin: 15px;
            padding: 10px;
            border-radius: 10px;
            background-color: #e7f5ff;
            cursor: grab;
            text-align: center;
        }
        .item img {
            display: block;
            margin: 0 auto 10px;
            max-width: 100px;
            max-height: 100px;
            border-radius: 50%;
        }
        .category {
            display: inline-block;
            margin: 15px;
            padding: 20px;
            border-radius: 10px;
            background-color: #fffbf2;
            border: 3px dashed #fbb041;
            text-align: center;
        }
        .category img {
            display: block;
            margin: 0 auto 10px;
            max-width: 120px;
            max-height: 120px;
        }
        #result {
            text-align: center;
            font-size: 1.5em;
            color: green;
            margin-top: 20px;
        }
        #score {
            text-align: center;
            font-size: 1.5em;
            color: #007bff;
            margin-top: 10px;
        }
    </style>
</head>

<body>

<h1>${game.name}</h1>
<p>${game.description}</p>

<div class="game-container">

    <!-- ITEMS -->
    <div class="items">
        <h3>Items</h3>
        <c:forEach var="item" items="${items}">
            <div class="item"
                 draggable="true"
                 id="item-${item.itemId}"
                 data-correct-category="category-${item.category.categoryId}">

                <img src="${pageContext.request.contextPath}/session_materials/${courseId}/matching/${item.imageName}"
                     alt="${item.itemName}">

                <strong>${item.itemName}</strong>
                <p class="hint">${item.matchingText}</p>
            </div>
        </c:forEach>
    </div>

    <!-- CATEGORIES -->
    <div class="categories">
        <h3>Categories</h3>
        <c:forEach var="category" items="${categories}">
            <div class="category" id="category-${category.categoryId}">

                <%-- <img src="${pageContext.request.contextPath}/session_materials/${courseId}/matching/${category.imageName}"
                     alt="${category.categoryName}"> --%>

                <strong>${category.categoryName}</strong>
            </div>
        </c:forEach>
    </div>

</div>

<div id="result"></div>
<div id="score">Score: 0</div>

<script src="${pageContext.request.contextPath}/js/matching-game.js"></script>

</body>
</html>
