<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>All Matching Games</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

    <h2 class="my-4 text-center">All Matching Games</h2>

    <!-- Add New Game Button -->
    <div class="d-flex justify-content-end mb-3">
        <a href="${pageContext.request.contextPath}/matching-game/new" class="btn btn-primary">Add New Game</a>
    </div>

    <!-- Games Table -->
    <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
                <th scope="col">Game ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="game" items="${games}">
                <tr>
                    <td>${game.gameId}</td>
                    <td>${game.name}</td>
                    <td>${game.description}</td>
                    <td>
                        <!-- View Game -->
                        <a href="${pageContext.request.contextPath}/matching-game/${game.gameId}" class="btn btn-info btn-sm me-1">View</a>
                        
                        <!-- Edit Game -->
                        <a href="${pageContext.request.contextPath}/matching-game/edit/${game.gameId}" class="btn btn-warning btn-sm me-1">Edit</a>
                        
                        <!-- Delete Game -->
                        <form action="${pageContext.request.contextPath}/matching-game/delete/${game.gameId}" method="post" style="display: inline;">
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this game?');">Delete</button>
                        </form>
                    </td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <!-- No Games Found -->
    <c:if test="${empty games}">
        <div class="alert alert-warning text-center">
            No matching games found. Click "Add New Game" to create one.
        </div>
    </c:if>

</body>
</html>
