<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${game.name}</title>

<style>
    body {
        font-family: 'Comic Sans MS', Arial, sans-serif;
        background:#f9fcff;
        margin:0;
        padding:0;
    }

    h1 {
        text-align:center;
        color:#ff6f61;
        margin:20px 0 5px;
    }

    p {
        text-align:center;
        color:#666;
        margin-bottom:15px;
    }

    .game-container {
        display:flex;
        flex-wrap:wrap;
        justify-content:space-around;
        padding:20px;
    }

    .items, .categories {
        flex:1;
        min-width:300px;
        margin:10px;
        padding:20px;
        background:#fff;
        border-radius:16px;
        box-shadow:0 4px 10px rgba(0,0,0,0.15);
        text-align:center;
    }

    .items h3, .categories h3 {
        color:#1f77d0;
        margin-bottom:15px;
    }

    /* DRAG ITEMS */
    .item {
        display:inline-block;
        margin:10px;
        padding:12px;
        background:#e7f5ff;
        border-radius:12px;
        cursor:grab;
        user-select:none;
        width:160px;
    }

    .item.dragging {
        opacity:0.5;
    }

    .item img {
        max-width:90px;
        max-height:90px;
        margin-bottom:6px;
    }

    /* DROP ZONES */
    .category {
        display:inline-block;
        margin:10px;
        padding:18px;
        min-height:160px;
        width:220px;
        background:#fffbf2;
        border-radius:14px;
        border:3px dashed #fbb041;
        vertical-align:top;
    }

    .category strong {
        display:block;
        margin-bottom:10px;
        color:#444;
    }

    #result {
        text-align:center;
        font-size:1.4rem;
        margin-top:15px;
        min-height:30px;
    }

    #score {
        text-align:center;
        font-size:1.4rem;
        color:#007bff;
        margin-top:5px;
    }

    @media (max-width:768px) {
        .game-container {
            flex-direction:column;
        }
    }
</style>
</head>

<body>

<h1>${game.name}</h1>
<p>${game.description}</p>

<div class="game-container">

    <!-- ITEMS -->
    <div class="items">
        <h3>Drag These</h3>

        <c:forEach var="item" items="${items}">
            <div class="item"
                 draggable="true"
                 id="item-${item.itemId}"
                 data-correct-category="category-${item.category.categoryId}">

                <c:if test="${not empty item.imageName}">
                    <img src="${pageContext.request.contextPath}/session_materials/${courseId}/matching/${item.imageName}">
                </c:if>

                <strong>${item.itemName}</strong>
                <div>${item.matchingText}</div>
            </div>
        </c:forEach>
    </div>

    <!-- CATEGORIES -->
    <div class="categories">
        <h3>Drop Here</h3>

        <c:forEach var="category" items="${categories}">
            <div class="category" id="category-${category.categoryId}">
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
