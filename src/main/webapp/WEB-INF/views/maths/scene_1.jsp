<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vedic Math Numbers</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
        
    <link rel="stylesheet" href="<c:url value='/resources/css/scene_1.css'/>">
</head>
<body>
    <div id="container">
        <div id="narration"></div>
        <div id="scene">
            <div id="max" class="character">👦 Max</div>
            <div id="student" class="character">👩 Student</div>
        </div>
        <div id="numbers"></div>
        <button id="startButton">Start</button>
    </div>

    
     <!-- Include speech.js before mathscript.js -->
    <script src="<c:url value='/resources/js/speak_scene_1.js' />"></script>
    <script src="<c:url value='/resources/js/scene_1_script.js' />"></script>
</body>
</html>
