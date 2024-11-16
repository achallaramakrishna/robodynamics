<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Items</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Items in Category</h2>
<a href="<c:url value='/matching-game/category/${categoryId}/item/new'/>" class="btn btn-primary mb-3">Add New Item</a>

<table class="table table-bordered table-striped">
    <thead class="thead-dark">
        <tr>
            <th>Item ID</th>
            <th>Item Name</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach var="item" items="${items}">
            <tr>
                <td>${item.itemId}</td>
                <td>${item.itemName}</td>
            </tr>
        </c:forEach>
    </tbody>
</table>

</body>
</html>
