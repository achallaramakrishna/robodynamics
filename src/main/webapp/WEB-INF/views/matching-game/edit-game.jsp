<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Game</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
</head>
<body class="container">

<h2 class="my-4">Edit Game</h2>

<form:form modelAttribute="game" action="${pageContext.request.contextPath}/matching-game/update" method="post">

    <!-- Hidden input for game ID -->
    <form:hidden path="gameId" />

    <!-- Game Name -->
    <div class="form-group">
        <form:label path="name">Game Name:</form:label>
        <form:input path="name" cssClass="form-control" required="true" />
    </div>

    <!-- Game Description -->
    <div class="form-group">
        <form:label path="description">Description:</form:label>
        <form:textarea path="description" cssClass="form-control" rows="4" required="true"></form:textarea>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="btn btn-success mt-3">Update Game</button>
</form:form>

</body>
</html>
