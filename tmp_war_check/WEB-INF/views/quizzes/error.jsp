<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Quiz Not Available</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
    body { background: linear-gradient(135deg, #EEF2FF, #F0FDFA); min-height: 100vh; display: flex; align-items: center; }
</style>
</head>
<body>
<div class="container text-center py-5">
    <div class="alert alert-warning d-inline-block px-5 py-4 rounded-4 shadow">
        <h2 class="mb-3">Quiz Not Available</h2>
        <p class="mb-4">${not empty message ? message : 'This quiz is not available or has no questions.'}</p>
        <a href="${pageContext.request.contextPath}/home" class="btn btn-primary">Back to Dashboard</a>
    </div>
</div>
</body>
</html>
