<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Flashcard Sets</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Flashcard Sets for Vedic Mathematics</h1>
        
        <div class="row">
            <c:forEach var="set" items="${flashCardSets}">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">${set.setName}</h5>
                            <p class="card-text">${set.setDescription}</p>
                            <a href="<c:url value='/flashcards/set/${set.flashcardSetId}' />" class="btn btn-primary">View Flashcards</a>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>

        <div class="text-center mt-4">
<%--             <a href="<c:url value='/flashcard-sets/add' />" class="btn btn-success">Add New Flashcard Set</a>
 --%>        </div>
    </div>

    <!-- Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
