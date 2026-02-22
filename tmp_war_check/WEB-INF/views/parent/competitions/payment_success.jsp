<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Successful</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"/>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-5">

    <div class="card shadow-sm border-success">
        <div class="card-body text-center">

            <h2 class="text-success mb-3">Payment Successful 🎉</h2>

            <p class="fs-5">
                Your registration for
                <strong>${registration.competition.title}</strong>
                has been confirmed.
            </p>

            <hr/>

            <div class="text-start mt-3">
                <p><strong>Student:</strong>
                    ${registration.student.firstName}
                    ${registration.student.lastName}
                </p>

                <p><strong>Amount Paid:</strong>
                    ₹${registration.paymentAmount}
                </p>

                <p><strong>Payment ID:</strong>
                    ${registration.razorpayPaymentId}
                </p>

                <p><strong>Payment Date:</strong>
                    ${registration.paymentDate}
                </p>
            </div>

            <div class="mt-4">
                <a href="${pageContext.request.contextPath}/parent/competitions/my?parentUserId=${registration.parent.userID}"
                   class="btn btn-primary btn-lg">
                    View My Competitions
                </a>
            </div>

        </div>
    </div>

</div>

<jsp:include page="/footer.jsp"/>

</body>
</html>
