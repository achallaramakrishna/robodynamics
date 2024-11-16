<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>All Matching Games</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">All Matching Games</h2>

<!-- Add New Game Button -->
<a href="${pageContext.request.contextPath}/matching-game/new" class="btn btn-primary mb-3">Add New Game</a>

<table class="table table-bordered table-striped">
    <thead class="thead-dark">
        <tr>
            <th>Game ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach var="game" items="${games}">
            <tr>
                <td>${game.gameId}</td>
                <td>${game.name}</td>
                <td>${game.description}</td>
                <td>
                    <a href="${pageContext.request.contextPath}/matching-game/${game.gameId}" class="btn btn-info btn-sm">View</a>
                </td>
            </tr>
        </c:forEach>
    </tbody>
</table>

</body>
</html>
