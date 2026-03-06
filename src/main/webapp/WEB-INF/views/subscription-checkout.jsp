<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Secure Checkout | Robo Dynamics</title>
<meta name="description" content="Complete your Robo Dynamics checkout in a few clicks."/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --rd-bg: #f4f7f4;
    --rd-card: #ffffff;
    --rd-text: #132a1f;
    --rd-muted: #5b6f64;
    --rd-primary: #0f766e;
    --rd-primary-dark: #0b5f58;
    --rd-accent: #f97316;
    --rd-border: #d3dfd8;
  }

  body.checkout-body {
    background: radial-gradient(circle at 15% 15%, #e6f5ee 0%, transparent 36%),
                radial-gradient(circle at 85% 8%, #ffe6cf 0%, transparent 32%),
                var(--rd-bg);
    color: var(--rd-text);
    font-family: "Manrope", "Segoe UI", sans-serif;
  }

  .checkout-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: 1.25rem;
  }

  .summary-card,
  .payment-card {
    background: var(--rd-card);
    border: 1px solid var(--rd-border);
    border-radius: 22px;
    box-shadow: 0 12px 34px rgba(11, 95, 88, 0.1);
  }

  .summary-card {
    padding: 2rem;
  }

  .payment-card {
    padding: 1.75rem;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: #dcfce7;
    color: #166534;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.35rem 0.7rem;
    margin-bottom: 1rem;
  }

  .summary-card h1,
  .payment-card h2 {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .summary-card h1 {
    font-size: clamp(1.8rem, 2.6vw, 2.3rem);
    margin-bottom: 0.5rem;
  }

  .description {
    color: var(--rd-muted);
    max-width: 56ch;
    margin-bottom: 1.1rem;
  }

  .price {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
    font-size: clamp(1.7rem, 2.4vw, 2.2rem);
    font-weight: 700;
    margin-bottom: 1.2rem;
  }

  .price small {
    color: var(--rd-muted);
    font-size: 0.95rem;
    font-family: "Manrope", "Segoe UI", sans-serif;
    font-weight: 600;
  }

  .feature-list {
    list-style: none;
    padding-left: 0;
    margin: 0 0 1.5rem;
  }

  .feature-list li {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    margin-bottom: 0.7rem;
    color: #1e3a2b;
  }

  .feature-list li::before {
    content: "";
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.45rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--rd-primary), #34d399);
    flex-shrink: 0;
  }

  .checkout-steps {
    margin: 0 0 1rem;
    padding-left: 1.1rem;
    color: #203a2d;
  }

  .checkout-steps li {
    margin-bottom: 0.5rem;
  }

  .pay-btn {
    width: 100%;
    border: 0;
    border-radius: 14px;
    padding: 0.85rem 1rem;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(120deg, var(--rd-primary), var(--rd-primary-dark));
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .pay-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 118, 110, 0.25);
  }

  .status {
    min-height: 1.2rem;
    font-size: 0.92rem;
    margin-top: 0.85rem;
    color: var(--rd-muted);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 1.2rem;
  }

  .outline-btn,
  .link-btn {
    border-radius: 12px;
    padding: 0.68rem 1rem;
    font-weight: 700;
    text-decoration: none;
  }

  .outline-btn {
    border: 1px solid #ffd5b2;
    background: #fff7ed;
    color: #9a3412;
  }

  .outline-btn:hover {
    color: #7c2d12;
    background: #ffedd5;
  }

  .link-btn {
    border: 1px solid transparent;
    color: #0f766e;
  }

  .link-btn:hover {
    background: #ecfdf5;
    color: #0b5f58;
  }

  .secure-note {
    font-size: 0.82rem;
    color: var(--rd-muted);
    margin-top: 0.9rem;
  }

  @media (max-width: 991px) {
    .checkout-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
</head>
<body class="checkout-body">

<jsp:include page="header.jsp"/>

<main class="container py-4 py-lg-5">
  <div class="checkout-grid">
    <section class="summary-card">
      <c:choose>
        <c:when test="${planType eq 'career'}">
          <span class="eyebrow">Career Discovery</span>
        </c:when>
        <c:when test="${planType eq 'tuition'}">
          <span class="eyebrow">Online Tuition</span>
        </c:when>
        <c:otherwise>
          <span class="eyebrow">Next Exam Prep</span>
        </c:otherwise>
      </c:choose>
      <h1>${planName}</h1>
      <p class="description">${planDescription}</p>
      <div class="price">
        Rs ${planBaseAmount} <small>(base fee)</small>
        <small>
          <c:choose>
            <c:when test="${billingLabel eq 'month'}">/ month</c:when>
            <c:otherwise>one-time</c:otherwise>
          </c:choose>
        </small>
      </div>

      <p class="description mb-2">
        GST (${gstPercentLabel}%) : <strong>Rs ${planGstAmount}</strong><br>
        Total payable : <strong>Rs ${planTotalPayable}</strong>
      </p>

      <ul class="feature-list">
        <c:forEach var="feature" items="${planFeatures}">
          <li>${feature}</li>
        </c:forEach>
      </ul>

      <div class="actions">
        <c:choose>
          <c:when test="${planType eq 'career'}">
            <a class="outline-btn"
               href="${pageContext.request.contextPath}/parents/demo?source=career_intelligence_checkout&selectedPlan=${planKey}">
              Book career counselling session
            </a>
          </c:when>
          <c:when test="${planType eq 'tuition'}">
            <a class="outline-btn"
               href="${pageContext.request.contextPath}/parents/demo?source=tuition_checkout&selectedPlan=${planKey}">
              Book tuition counselling session
            </a>
          </c:when>
          <c:otherwise>
            <a class="outline-btn"
               href="${pageContext.request.contextPath}/parents/demo?source=exam_prep_checkout&selectedPlan=${planKey}">
              Book doubt-clearing session
            </a>
            <a class="link-btn"
               href="${pageContext.request.contextPath}/parents/demo?source=exam_checkout_tuition_quote">
              Get tuition pricing quote
            </a>
          </c:otherwise>
        </c:choose>
        <a class="link-btn" href="${pageContext.request.contextPath}/">Back to home</a>
      </div>
    </section>

    <aside class="payment-card">
      <h2 class="h4 mb-3">Complete in under 2 minutes</h2>
      <c:choose>
        <c:when test="${planType eq 'career'}">
          <ol class="checkout-steps">
            <li>Click pay now.</li>
            <li>Complete secure Razorpay payment.</li>
            <li>Take the AI test and get your report.</li>
          </ol>
        </c:when>
        <c:when test="${planType eq 'tuition'}">
          <ol class="checkout-steps">
            <li>Click pay now.</li>
            <li>Complete secure Razorpay payment.</li>
            <li>Get mapped to your online tuition batch and mentor.</li>
          </ol>
        </c:when>
        <c:otherwise>
          <ol class="checkout-steps">
            <li>Click pay now.</li>
            <li>Complete secure Razorpay payment.</li>
            <li>Start prep, book mentor sessions, and reserve next-year tuition seat.</li>
          </ol>
        </c:otherwise>
      </c:choose>

      <c:choose>
        <c:when test="${paymentEnabled}">
          <button id="payNowBtn" class="pay-btn" type="button">
            Pay Now - Rs ${planTotalPayable} (incl. GST)
          </button>
          <c:if test="${bypassEnabled}">
            <form action="${pageContext.request.contextPath}/plans/bypass" method="post" class="mt-2">
              <input type="hidden" name="plan" value="${planKey}">
              <c:if test="${courseId ne null}">
                <input type="hidden" name="courseId" value="${courseId}">
              </c:if>
              <c:if test="${studentId ne null}">
                <input type="hidden" name="studentId" value="${studentId}">
              </c:if>
              <button type="submit" class="outline-btn" style="width:100%;">
                Dummy Flow: Skip Razorpay (Test Mode)
              </button>
            </form>
          </c:if>
          <div id="paymentStatus" class="status"></div>
          <p class="secure-note">
            Payment gateway: Razorpay. GST is included in the payable amount shown above.
          </p>
        </c:when>
        <c:otherwise>
          <c:if test="${bypassEnabled}">
            <form action="${pageContext.request.contextPath}/plans/bypass" method="post" class="mb-3">
              <input type="hidden" name="plan" value="${planKey}">
              <c:if test="${courseId ne null}">
                <input type="hidden" name="courseId" value="${courseId}">
              </c:if>
              <c:if test="${studentId ne null}">
                <input type="hidden" name="studentId" value="${studentId}">
              </c:if>
              <button type="submit" class="outline-btn" style="width:100%;">
                Dummy Flow: Skip Razorpay (Test Mode)
              </button>
            </form>
          </c:if>
          <div class="alert alert-warning mb-0">
            ${paymentError}
          </div>
        </c:otherwise>
      </c:choose>
    </aside>
  </div>
</main>

<jsp:include page="footer.jsp"/>

<c:if test="${paymentEnabled}">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    (function () {
      const contextPath = "${pageContext.request.contextPath}";
      const payBtn = document.getElementById("payNowBtn");
      const statusEl = document.getElementById("paymentStatus");
      if (!payBtn || !statusEl) {
        return;
      }

      let verifying = false;

      const options = {
        key: "${razorpayKey}",
        amount: "${planTotalPayable * 100}",
        currency: "INR",
        name: "Robo Dynamics",
        description: "${planName} Subscription",
        order_id: "${razorpayOrderId}",
        handler: function (response) {
          if (verifying) {
            return;
          }

          verifying = true;
          payBtn.disabled = true;
          statusEl.textContent = "Verifying payment...";

          fetch(contextPath + "/plans/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.status === "SUCCESS") {
              statusEl.textContent = "Payment verified. Redirecting...";
              window.location.href = contextPath + (data.redirectUrl || "/plans/success");
              return;
            }

            statusEl.textContent = "Verification failed. Please retry or contact support.";
            verifying = false;
            payBtn.disabled = false;
          })
          .catch(function () {
            statusEl.textContent = "Verification error. Please retry.";
            verifying = false;
            payBtn.disabled = false;
          });
        },
        modal: {
          ondismiss: function () {
            if (!verifying) {
              statusEl.textContent = "Payment was cancelled. You can retry now.";
            }
          }
        },
        theme: { color: "#0f766e" }
      };

      const razorpay = new Razorpay(options);

      razorpay.on("payment.failed", function () {
        if (!verifying) {
          statusEl.textContent = "Payment failed. Please retry.";
        }
      });

      payBtn.addEventListener("click", function () {
        statusEl.textContent = "Opening secure checkout...";
        razorpay.open();
      });
    })();
  </script>
</c:if>

</body>
</html>
