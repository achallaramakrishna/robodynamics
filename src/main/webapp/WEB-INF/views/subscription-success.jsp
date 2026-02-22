<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Payment Success | Robo Dynamics</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --rd-bg: #f2f8f4;
    --rd-card: #ffffff;
    --rd-text: #143227;
    --rd-muted: #4f6a5e;
    --rd-primary: #0f766e;
    --rd-accent: #f97316;
    --rd-border: #cce0d4;
  }

  body {
    background: radial-gradient(circle at 80% 10%, #ffe8d0 0%, transparent 30%),
                radial-gradient(circle at 12% 12%, #dff4e8 0%, transparent 34%),
                var(--rd-bg);
    color: var(--rd-text);
    font-family: "Manrope", "Segoe UI", sans-serif;
  }

  .success-shell {
    max-width: 760px;
  }

  .success-card {
    background: var(--rd-card);
    border: 1px solid var(--rd-border);
    border-radius: 24px;
    box-shadow: 0 14px 34px rgba(15, 118, 110, 0.13);
    padding: clamp(1.5rem, 3vw, 2.2rem);
  }

  .badge-ok {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: #dcfce7;
    color: #166534;
    padding: 0.4rem 0.75rem;
    font-size: 0.84rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h1 {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  .summary {
    margin: 1.1rem 0 0.2rem;
    border: 1px solid #d8e8df;
    border-radius: 16px;
    overflow: hidden;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #e7f1eb;
  }

  .summary-row:last-child {
    border-bottom: 0;
  }

  .summary-key {
    color: var(--rd-muted);
    font-weight: 700;
  }

  .summary-value {
    font-weight: 700;
    text-align: right;
  }

  .action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin-top: 1.3rem;
  }

  .btn-main,
  .btn-alt {
    border: 0;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    text-decoration: none;
    font-weight: 800;
  }

  .btn-main {
    background: linear-gradient(130deg, var(--rd-primary), #0b5f58);
    color: #fff;
  }

  .btn-main:hover {
    color: #fff;
    filter: brightness(1.03);
  }

  .btn-alt {
    background: #fff7ed;
    color: #9a3412;
    border: 1px solid #fed7aa;
  }

  .btn-alt:hover {
    color: #7c2d12;
    background: #ffedd5;
  }

  .subtle {
    color: var(--rd-muted);
  }
</style>
</head>
<body>

<jsp:include page="header.jsp"/>

<main class="container py-4 py-lg-5 success-shell">
  <section class="success-card">
    <div class="badge-ok">Payment received</div>
    <h1>Your subscription is active</h1>
    <c:choose>
      <c:when test="${planType eq 'career'}">
        <p class="subtle mb-0">
          Thanks for choosing Career Intelligence. You can now begin the AI test flow and unlock your report roadmap.
        </p>
      </c:when>
      <c:when test="${planType eq 'tuition'}">
        <p class="subtle mb-0">
          Thanks for choosing Online Tuition. Your onboarding call can lock batch, mentor mapping, and weekly class schedule.
        </p>
      </c:when>
      <c:otherwise>
        <p class="subtle mb-0">
          Thanks for subscribing to Robo Dynamics. You can now start exam prep, book mentor-led doubt-clearing sessions,
          and reserve online tuition for the next academic year.
        </p>
      </c:otherwise>
    </c:choose>

    <div class="summary">
      <div class="summary-row">
        <span class="summary-key">Plan</span>
        <span class="summary-value">${planName}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Base Fee</span>
        <span class="summary-value">Rs ${baseAmount}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">GST (${gstPercentLabel}%)</span>
        <span class="summary-value">Rs ${gstAmount}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Total Paid (incl. GST)</span>
        <span class="summary-value">Rs ${totalAmount}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Payment ID</span>
        <span class="summary-value">${paymentId}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">Order ID</span>
        <span class="summary-value">${orderId}</span>
      </div>
    </div>

    <div class="action-row">
      <c:choose>
        <c:when test="${planType eq 'career'}">
          <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=career_discovery_paid">
            Book career roadmap session
          </a>
          <a class="btn-alt" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">
            Continue to exam prep plans
          </a>
        </c:when>
        <c:when test="${planType eq 'tuition'}">
          <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=tuition_onboarding_paid">
            Book tuition onboarding session
          </a>
          <a class="btn-alt" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic&source=tuition_cross_sell_exam">
            Add exam prep support
          </a>
        </c:when>
        <c:otherwise>
          <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=paid_subscriber_doubt_session">
            Book first doubt-clearing session
          </a>
          <a class="btn-alt" href="${pageContext.request.contextPath}/parents/demo?source=exam_prep_next_year_tuition_quote">
            Get tuition pricing quote
          </a>
          <a class="btn-alt" href="${pageContext.request.contextPath}/plans/checkout?plan=career-basic&source=exam_prep_cross_sell_career">
            Add career discovery
          </a>
        </c:otherwise>
      </c:choose>
      <c:url var="registerParentUrl" value="/registerParentChild">
        <c:if test="${not empty planKey}">
          <c:param name="plan" value="${planKey}" />
        </c:if>
        <c:if test="${courseId ne null}">
          <c:param name="courseId" value="${courseId}" />
        </c:if>
      </c:url>
      <a class="btn-alt" href="${registerParentUrl}">
        Create parent account
      </a>
      <a class="btn-alt" href="${pageContext.request.contextPath}/">
        Go to homepage
      </a>
    </div>
  </section>
</main>

<jsp:include page="footer.jsp"/>

</body>
</html>
