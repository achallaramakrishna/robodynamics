<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completing the Whole & Ten-Point Circle</title>
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/mathstyle.css'/>">
    
    <!-- GSAP Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
</head>
<body>
    <h2>✨ 1.1 Introduction to Completing the Whole ✨</h2>
    
    <div class="number-line" id="numberLine">
        <div class="marker" id="marker">6</div>
    </div>
    
    <div class="circle" id="circle"></div>

    <!-- Start Explanation Button -->
    <button onclick="startExplanation()">Start Explanation</button>
    
    <!-- Include speech.js before mathscript.js -->
    <script src="<c:url value='/resources/js/speech.js' />"></script>
    <script src="<c:url value='/resources/js/tenpointcircle.js' />"></script>
</body>
</html>
