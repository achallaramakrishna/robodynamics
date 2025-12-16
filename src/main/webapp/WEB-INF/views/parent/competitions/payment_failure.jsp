<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Failed</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"/>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-5">

    <div class="card shadow-sm border-danger">
        <div class="card-body text-center">

            <h2 class="text-danger mb-3">Payment Failed ❌</h2>

            <p class="fs-5">
                Unfortunately, your payment for
                <strong>${registration.competition.title}</strong>
                was not successful.
            </p>

            <p class="text-muted">
                Don’t worry — your registration is saved.
                You can retry the payment safely.
            </p>

            <hr/>

            <div class="mt-4 d-grid gap-2 col-6 mx-auto">

                <a href="${pageContext.request.contextPath}/parent/competitions/payment/initiate?registrationId=${registration.registrationId}"
                   class="btn btn-warning btn-lg">
                    Retry Payment
                </a>

                <a href="${pageContext.request.contextPath}/parent/competitions/my?parentUserId=${registration.parent.userID}"
                   class="btn btn-secondary">
                    Go to My Competitions
                </a>

            </div>

        </div>
    </div>

</div>

<jsp:include page="/footer.jsp"/>

</body>
</html>
