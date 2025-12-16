<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <title>Complete Payment</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"/>

    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

    <style>
        .payment-box {
            max-width: 520px;
            margin: auto;
            margin-top: 40px;
            padding: 25px;
            border-radius: 8px;
            background: #f8f9fa;
            border-left: 5px solid #0d6efd;
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container">
    <div class="payment-box">

        <h4 class="mb-3 text-primary">Competition Payment</h4>

        <p><strong>Competition:</strong> ${registration.competition.title}</p>
        <p><strong>Student:</strong>
            ${registration.student.firstName}
            ${registration.student.lastName}
        </p>
        <p><strong>Amount:</strong>
            <span class="fw-bold text-success">
                ₹${registration.paymentAmount}
            </span>
        </p>

        <hr/>

        <button id="payBtn"
                class="btn btn-success btn-lg w-100">
            Pay ₹${registration.paymentAmount}
        </button>

    </div>
</div>

<script>
    console.log("🔵 Payment page loaded");

    const REGISTRATION_ID = ${registration.registrationId};
    const VERIFY_URL = "${pageContext.request.contextPath}/parent/competitions/payment/verify";

    console.log("Registration ID:", REGISTRATION_ID);
    console.log("Razorpay Order ID:", "${razorpayOrderId}");
    console.log("Amount (paise):", "${registration.paymentAmount * 100}");

    const payBtn = document.getElementById("payBtn");

    let paymentCompleted = false; // IMPORTANT FLAG

    var options = {
        key: "${razorpayKey}",
        amount: "${registration.paymentAmount * 100}",
        currency: "INR",
        name: "Robo Dynamics",
        description: "Competition Registration",
        order_id: "${razorpayOrderId}",

        handler: function (response) {

            console.log("✅ Razorpay handler called");
            console.log("Payment ID:", response.razorpay_payment_id);
            console.log("Order ID:", response.razorpay_order_id);
            console.log("Signature:", response.razorpay_signature);

            paymentCompleted = true;

            payBtn.disabled = true;
            payBtn.innerText = "Verifying Payment...";

            const payload = {
                registrationId: REGISTRATION_ID,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
            };

            console.log("➡ Sending verification payload:", payload);

            fetch(VERIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => {
                console.log("⬅ Verify response status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("⬅ Verify response body:", data);

                if (data.status === "SUCCESS") {
                    console.log("🟢 Payment verified successfully");
                    window.location.href =
                        "${pageContext.request.contextPath}/parent/competitions/payment/success?registrationId=" + REGISTRATION_ID;
                } else {
                    console.error("❌ Verification failed at backend");
                    alert("Payment verification failed. Please contact support.");
                    payBtn.disabled = false;
                    payBtn.innerText = "Pay ₹${registration.paymentAmount}";
                }
            })
            .catch(err => {
                console.error("❌ Verification request error:", err);
                alert("Payment verification error. Please contact support.");
                payBtn.disabled = false;
                payBtn.innerText = "Pay ₹${registration.paymentAmount}";
            });
        },

        modal: {
            ondismiss: function () {
                console.warn("⚠ Razorpay modal dismissed");
                if (!paymentCompleted) {
                    alert("Payment cancelled. You may retry.");
                }
            }
        },

        theme: {
            color: "#0d6efd"
        }
    };

    var rzp = new Razorpay(options);

    rzp.on("payment.failed", function (response) {
        if (paymentCompleted) {
            console.warn("⚠ Ignoring false payment.failed after success");
            return;
        }
        console.error("❌ Razorpay payment.failed event:", response.error);
        alert("Payment failed: " + response.error.description);
    });

    payBtn.onclick = function (e) {
        e.preventDefault();
        console.log("🟡 Pay button clicked");
        rzp.open();
    };
</script>

<jsp:include page="/footer.jsp"/>

</body>
</html>
