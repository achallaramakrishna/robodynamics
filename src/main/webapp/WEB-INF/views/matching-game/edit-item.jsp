<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Item</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Edit Item</h2>

<form:form action="${pageContext.request.contextPath}/matching-game/item/save" 
           method="post" modelAttribute="matchingItemForm" enctype="multipart/form-data">
    <form:hidden path="itemId" value="${matchingItemForm.itemId}" />
    <form:hidden path="categoryId" value="${matchingItemForm.categoryId}" />

    <div class="mb-3">
        <label for="itemName" class="form-label">Item Name</label>
        <form:input path="itemName" class="form-control" id="itemName" />
    </div>

    <div class="mb-3">
        <label for="matchingText" class="form-label">Matching Text</label>
        <form:input path="matchingText" class="form-control" id="matchingText" />
    </div>

    <div class="mb-3">
        <label for="imageFile" class="form-label">Item Image</label>
        <form:input path="imageFile" type="file" class="form-control" id="imageFile" />
        <c:if test="${matchingItemForm.imageName != null}">
            <div class="mt-2">
                <img src="${pageContext.request.contextPath}/resources/${matchingItemForm.imageName}" 
                     alt="Current Image" class="img-thumbnail" style="max-width: 100px; max-height: 100px;">
                <small class="text-muted">Current Image</small>
            </div>
        </c:if>
    </div>

    <button type="submit" class="btn btn-primary">Save Changes</button>
    <a href="${pageContext.request.contextPath}/matching-game/${matchingItemForm.gameId}" 
       class="btn btn-secondary">Back to Game</a>
</form:form>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
