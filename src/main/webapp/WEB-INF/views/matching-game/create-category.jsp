<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create New Category</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Create New Category</h2>

<form action="<c:url value='/matching-game/category/save'/>" method="post">
    <input type="hidden" name="game.gameId" value="${game.gameId}">

    <div class="form-group">
        <label for="categoryName">Category Name:</label>
        <input type="text" id="categoryName" name="categoryName" class="form-control" required>
    </div>

    <button type="submit" class="btn btn-success mt-3">Save Category</button>
</form>

</body>
</html>
