<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Math Explorer Max</title>

    <!-- Link to CSS file using JSTL for URL resolution -->
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">

    <!-- Include GSAP library for animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
</head>
<body>
    <!-- Math Explorer Max character element -->
    <div id="math-explorer-max">
        <p id="max-speech">Hi! I'm Max, your math guide!</p>
    </div>

    <!-- Button to trigger interaction with Max -->
    <button id="next-button">Next</button>
    
    

    <!-- Link to JavaScript file using JSTL for URL resolution -->
    <script src="<c:url value='/js/script.js'/>"></script>
</body>
</html>
