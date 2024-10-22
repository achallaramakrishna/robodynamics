<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
    crossorigin="anonymous">
<script
    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
    integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
    crossorigin="anonymous"></script>
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Quiz Result</title>
 </head>
<body class="container">

    <h2 class="mt-5">Quiz Result</h2>

    <!-- Show a success or failure message based on the evaluation -->
    <c:choose>
        <c:when test="${passed}">
            <div class="alert alert-success mt-4">
                <strong>Congratulations!</strong> ${message}
            </div>
        </c:when>
        <c:otherwise>
            <div class="alert alert-danger mt-4">
                <strong>Sorry!</strong> ${message}
            </div>
        </c:otherwise>
    </c:choose>

    <!-- Show total points -->
    <div class="mt-4">
        <h4>Total Points: ${pointsEarned}</h4>
    </div>

</body>
</html>
