<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <%@ page isELIgnored="false"%>

    <title>Robo Dynamics - Edit Enrollment</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        rel="stylesheet" crossorigin="anonymous">
</head>

<body>
<jsp:include page="header.jsp" />

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h3 class="card-title text-center">Edit Enrollment Details</h3>
                </div>
                <div class="card-body">

                    <!-- Form starts -->
                    <form:form action="update" method="post" modelAttribute="studentEnrollmentForm">

                        <!-- Hidden fields -->
                        <form:hidden path="enrollmentId" />
                        <form:hidden path="courseOfferingId" />
                        <form:hidden path="studentId" />

                        <!-- Course Name -->
                        <div class="mb-3 row">
                            <label class="col-md-4 col-form-label fw-bold">Course Name:</label>
                            <div class="col-md-8">
                                <p class="form-control-plaintext">${courseOffering.course.courseName}</p>
                            </div>
                        </div>

                        <!-- Instructor -->
                        <div class="mb-3 row">
                            <label class="col-md-4 col-form-label fw-bold">Instructor:</label>
                            <div class="col-md
