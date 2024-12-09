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
            text-shadow: 1px 1px #f1f9ff;
        }
        .item {
            display: inline-block;
            margin: 15px;
            padding: 10px;
            border-radius: 10px;
            background-color: #e7f5ff;
            cursor: grab;
            transition: transform 0.3s, background-color 0.3s;
            text-align: center;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }
        .item:hover {
            transform: scale(1.1);
            background-color: #d1ecfc;
        }
        .item img {
            display: block;
            margin: 0 auto 10px auto;
            max-width: 100px;
            max-height: 100px;
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }
        .item strong {
            display: block;
            font-size: 1.3em;
            color: #0073b1;
            margin-bottom: 5px;
        }
        .item .hint {
            font-size: 1em;
            color: #888;
            transition: color 0.3s;
        }
        .item .hint:hover {
            color: #ff6f61;
            font-style: italic;
        }
        .category {
            display: inline-block;
            margin: 15px;
            padding: 20px;
            border-radius: 10px;
            background-color: #fffbf2;
            border: 3px dashed #fbb041;
            transition: transform 0.3s, background-color 0.3s;
            text-align: center;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }
        .category:hover {
            transform: scale(1.05);
            background-color: #fff4e0;
        }
        .category img {
            display: block;
            margin: 0 auto 10px auto;
            max-width: 120px;
            max-height: 120px;
            border-radius: 10%;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }
        .category strong {
            display: block;
            font-size: 1.5em;
            color: #f37b20;
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
        <!-- Items Section -->
        <div class="items">
            <h3>Items</h3>
            <c:forEach var="item" items="${items}">
                <div class="item" draggable="true" id="item-${item.itemId}" data-correct-category="category-${item.category.categoryId}">
                    <img src="<c:url value='/resources/${item.imageName}'/>" alt="${item.itemName}">
                    <strong>${item.itemName}</strong>
                    <p class="hint">${item.matchingText}</p>
                </div>
            </c:forEach>
        </div>

        <!-- Categories Section -->
        <div class="categories">
            <h3>Categories</h3>
            <c:forEach var="category" items="${categories}">
                <div class="category" id="category-${category.categoryId}">
                    <img src="<c:url value='/resources/${category.imageName}'/>" alt="${category.categoryName}">
                    <strong>${category.categoryName}</strong>
                </div>
            </c:forEach>
        </div>
    </div>

    <!-- Score and Feedback -->
    <div id="result"></div>
    <div id="score">Score: 0</div>

    <script src="<c:url value='/js/matching-game.js'/>"></script>
</body>
</html>
