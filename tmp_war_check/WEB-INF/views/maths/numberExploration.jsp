<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Number Exploration</title>
    
     <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/numstyle_1.css'/>">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js"></script>
        <script src="<c:url value='/resources/js/speech.js' />"></script>
    <script src="<c:url value='/resources/js/numberExploration.js' />" defer></script>
   
</head>
<body>

    <h1>Number Exploration</h1>
    <button onclick="startExplanation()">Start Exploration</button>

    <div id="numberLineContainer">
        <h2>Number Line</h2>
        <div id="numberLine"></div>
    </div>

    <div id="circleContainer">
        <h2>Ten-Point Circle</h2>
        <div id="circle"></div>
    </div>

</body>
</html>
