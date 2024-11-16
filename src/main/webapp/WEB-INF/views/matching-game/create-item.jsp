<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create New Item</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Create New Item</h2>

<form action="<c:url value='/matching-game/item/save'/>" method="post">
    <input type="hidden" name="category.categoryId" value="${category.categoryId}">

    <div class="form-group">
        <label for="itemName">Item Name:</label>
        <input type="text" id="itemName" name="itemName" class="form-control" required>
    </div>

    <button type="submit" class="btn btn-success mt-3">Save Item</button>
</form>

</body>
</html>
