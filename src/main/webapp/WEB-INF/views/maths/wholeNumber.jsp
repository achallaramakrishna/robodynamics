<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whole Numbers and Integers</title>
    <style>
        body { display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; }
        .number-box { display: flex; gap: 10px; margin: 20px 0; }
        .number { width: 50px; height: 50px; background: lightblue; display: flex; align-items: center; justify-content: center; font-size: 1.5em; border-radius: 5px; }
        #description { max-width: 600px; text-align: center; font-size: 1.2em; }
    </style>
</head>
<body>
    <h1>Whole Numbers and Integers</h1>
    <div id="description"></div>
    <div class="number-box" id="whole-numbers">
        <div class="number">0</div>
        <div class="number">1</div>
        <div class="number">2</div>
        <div class="number">3</div>
        <div class="number">4</div>
    </div>
    <button onclick="startExplanation()">Start Explanation</button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
    <script src="<c:url value='/js/wholenumberscript.js'/>"></script>
</body>
</html>
