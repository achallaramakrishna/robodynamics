<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <title>My Competition Registrations</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>

    <style>
        .pay-btn {
            padding: 5px 10px;
            font-size: 14px;
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <h2 class="mb-4">My Competition Registrations</h2>

    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/parent/competitions/list?parentUserId=${parentUserId}'">
        Back
    </button>

    <c:if test="${empty registrations}">
        <div class="alert alert-info">No registrations found.</div>
    </c:if>

    <c:if test="${not empty registrations}">
        <table class="table table-bordered table-striped">
            <thead>
                <tr class="table-dark">
                    <th>Competition</th>
                    <th>Child</th>
                    <th>Event Date</th>
                    <th>Mode</th>
                    <th>Fee (₹)</th>
                    <th>Payment Status</th>
                    <th>Payment Date</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
            <c:forEach var="r" items="${registrations}">
                <tr>
                    <!-- Competition Title -->
                    <td>${r.competition.title}</td>

                    <!-- Child Name -->
                    <td>${r.student.firstName} ${r.student.lastName}</td>

                    <!-- Competition Date -->
                    <td>
                        <fmt:formatDate value="${r.competition.date}" pattern="dd MMM yyyy"/>
                    </td>

                    <!-- Participation Mode -->
                    <td>${r.mode}</td>

                    <!-- Fee -->
                    <td><strong>₹${r.paymentAmount}</strong></td>

                    <!-- Payment Status -->
                    <td>
                        <c:choose>
                            <c:when test="${r.paymentStatus == 'PAID'}">
                                <span class="badge bg-success">PAID</span>
                            </c:when>
                            <c:otherwise>
                                <span class="badge bg-warning text-dark">PENDING</span>
                            </c:otherwise>
                        </c:choose>
                    </td>

                    <!-- Payment Date -->
                    <td>
                        <c:if test="${not empty r.paymentDate}">
                            <fmt:formatDate value="${r.paymentDate}" pattern="dd MMM yyyy, hh:mm a"/>
                        </c:if>
                        <c:if test="${empty r.paymentDate}">
                            <span class="text-muted">-</span>
                        </c:if>
                    </td>

                    <!-- ACTION COLUMN (PAY NOW) -->
                    <td>
                        <c:choose>

                            <!-- If already paid -->
                            <c:when test="${r.paymentStatus == 'PAID'}">
                                <span class="badge bg-success">✔ Payment Complete</span>
                            </c:when>

                            <!-- If pending → show Pay Now button -->
                            <c:otherwise>
                                <!-- PAY NOW BUTTON -->
                                <button class="btn btn-primary btn-sm pay-btn"
                                        onclick="openPayment('${r.registrationId}', '${r.paymentAmount}')">
                                    Pay Now
                                </button>
                            </c:otherwise>

                        </c:choose>
                    </td>

                </tr>
            </c:forEach>
            </tbody>

        </table>
    </c:if>

</div>

<!-- Footer -->
<jsp:include page="/footer.jsp" />

<!-- Placeholder Razorpay (fill backend later) -->
<script>
    function openPayment(registrationId, amount) {

        alert("Razorpay integration pending.\n\nRegistration ID: " + registrationId +
              "\nAmount: ₹" + amount + 
              "\n\nOnce your Razorpay keys are ready, I will integrate the full popup.");

        // ⭐ LATER YOU WILL REPLACE THIS ALERT WITH:
        //   1. Create Razorpay order via Spring Boot
        //   2. Call checkout.js with returned orderId
        //   3. On payment success → call your Spring endpoint to update paymentStatus + paymentDate
    }
</script>

</body>
</html>
