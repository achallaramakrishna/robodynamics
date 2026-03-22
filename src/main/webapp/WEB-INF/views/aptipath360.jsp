<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>AptiPath360 | Career Discovery for Students and Parents</title>
  <meta name="description" content="AptiPath360 helps families discover the right career direction through aptitude, interest, and learning-behavior signals before spending on the wrong path."/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f7fbf7;
      --ink: #12261a;
      --muted: #587063;
      --line: #d6e7d8;
      --panel: #ffffff;
      --brand: #17803d;
      --brand-deep: #0f5e2c;
      --brand-soft: #dcfce7;
      --gold: #b7791f;
      --shadow: 0 22px 48px rgba(16, 64, 34, 0.10);
      --radius-xl: 30px;
      --radius-lg: 22px;
      --radius-md: 16px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      font-family: "Manrope", system-ui, sans-serif;
      background:
        radial-gradient(900px 380px at 0% -12%, rgba(34,197,94,.12), transparent 65%),
        radial-gradient(780px 320px at 100% 0%, rgba(22,163,74,.10), transparent 62%),
        var(--bg);
    }
    a { text-decoration: none; }
    .shell {
      width: min(1160px, 94vw);
      margin: 0 auto;
      padding: 22px 0 72px;
    }
    .hero {
      background: linear-gradient(135deg, #0f2d1f 0%, #16532f 56%, #1f7a46 100%);
      color: #f7fff9;
      border-radius: var(--radius-xl);
      padding: clamp(24px, 4vw, 40px);
      box-shadow: var(--shadow);
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 28px;
      align-items: center;
      overflow: hidden;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(220,252,231,.12);
      border: 1px solid rgba(220,252,231,.22);
      color: #bbf7d0;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero h1 {
      margin: 0 0 14px;
      font-family: "Outfit", sans-serif;
      font-size: clamp(32px, 5vw, 54px);
      line-height: 1.04;
      letter-spacing: -.03em;
    }
    .hero p {
      margin: 0;
      color: #def7e5;
      font-size: 16px;
      line-height: 1.75;
      max-width: 60ch;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 13px 18px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 14px;
      border: 1px solid transparent;
      transition: transform .16s ease, box-shadow .16s ease;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn-primary {
      background: #fff;
      color: #12321f;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.22);
    }
    .btn-secondary {
      background: transparent;
      color: #f0fdf4;
      border-color: rgba(240,253,244,.26);
    }
    .hero-media {
      position: relative;
    }
    .hero-media img {
      width: 100%;
      display: block;
      border-radius: 24px;
      object-fit: cover;
      min-height: 420px;
      box-shadow: 0 18px 34px rgba(15, 23, 42, 0.24);
    }
    .hero-note {
      position: absolute;
      left: 18px;
      bottom: 18px;
      right: 18px;
      background: rgba(255,255,255,.92);
      color: #12321f;
      border-radius: 18px;
      padding: 14px 16px;
      box-shadow: 0 12px 24px rgba(15,23,42,.12);
    }
    .hero-note strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .hero-note span {
      display: block;
      color: #486456;
      font-size: 13px;
      line-height: 1.55;
    }
    .band {
      margin-top: 26px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: clamp(22px, 3.4vw, 34px);
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }
    .band h2 {
      margin: 0 0 8px;
      font-family: "Outfit", sans-serif;
      font-size: clamp(24px, 3vw, 34px);
      letter-spacing: -.03em;
    }
    .lead {
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.72;
      max-width: 72ch;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: 0 8px 20px rgba(15,23,42,.04);
    }
    .card strong {
      display: block;
      font-size: 16px;
      margin-bottom: 8px;
      color: #13311f;
    }
    .card p, .card li {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.68;
    }
    .card p { margin: 0; }
    .card ul {
      margin: 0;
      padding-left: 18px;
    }
    .signal {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 5px 10px;
      background: var(--brand-soft);
      color: var(--brand-deep);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .04em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .pricing {
      display: flex;
      align-items: end;
      gap: 10px;
      margin: 10px 0 12px;
    }
    .pricing strong {
      margin: 0;
      font-size: 30px;
      font-family: "Outfit", sans-serif;
      color: var(--brand-deep);
    }
    .pricing span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }
    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }
    .mini {
      font-size: 12px;
      color: #6a7f73;
      line-height: 1.6;
      margin-top: 10px;
    }
    @media (max-width: 960px) {
      .hero,
      .grid-3,
      .grid-2 { grid-template-columns: 1fr; }
      .hero-media img { min-height: 320px; }
    }
  </style>
</head>
<body>
<jsp:include page="header.jsp"/>
<c:url var="aptiStartUrl" value="/registerParentChild">
  <c:param name="plan" value="career-basic" />
  <c:param name="redirect" value="/plans/checkout?plan=career-basic" />
</c:url>

<main class="shell">
  <section class="hero">
    <div>
      <div class="eyebrow">AptiPath360 Career Discovery</div>
      <h1>Keep AptiPath360 exactly recognizable. Make the parent decision easier.</h1>
      <p>
        AptiPath360 helps families understand a student before they choose the wrong stream, coaching spend,
        or exam direction. It combines aptitude, interests, learning behavior, and motivation into one
        practical career map with clear next steps.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${pageContext.request.contextPath}${aptiStartUrl}">Start AptiPath360</a>
        <a class="btn btn-secondary" href="${pageContext.request.contextPath}/resources/manuals/AptiPath_Basic_Parent_Flow_Manual.html" target="_blank">View Parent Guide</a>
      </div>
    </div>
    <div class="hero-media">
      <img src="${pageContext.request.contextPath}/resources/images/hero_parents.jpg" alt="AptiPath360 student hero"/>
      <div class="hero-note">
        <strong>Retained visual identity</strong>
        <span>The current AptiPath360 girl photo and product branding stay intact on this landing page.</span>
      </div>
    </div>
  </section>

  <section class="band">
    <h2>What parents are buying</h2>
    <p class="lead">AptiPath360 is not a random quiz. It is a structured career-discovery flow designed to help families understand where the student shows fit, where confusion exists, and what action should happen next.</p>
    <div class="grid-3">
      <article class="card">
        <span class="signal">Assessment</span>
        <strong>46 to 72 intelligent questions</strong>
        <p>The journey checks aptitude, interests, values, learning style, and readiness signals so the result is more useful than a one-dimensional test.</p>
      </article>
      <article class="card">
        <span class="signal">Output</span>
        <strong>Career Horizon Map</strong>
        <p>Parents get a practical picture of likely-fit domains, strong signals, weak signals, and the next learning actions to validate direction.</p>
      </article>
      <article class="card">
        <span class="signal">Decision support</span>
        <strong>Before coaching spend</strong>
        <p>Use the result before locking the child into the wrong tuition, exam lane, or peer-driven choice.</p>
      </article>
    </div>
  </section>

  <section class="band">
    <h2>What the flow covers</h2>
    <p class="lead">The AptiPath360 landing page should give parents a clear picture of the delivery, not just a price button.</p>
    <div class="grid-2">
      <article class="card">
        <strong>Signals captured</strong>
        <ul>
          <li>Core aptitude and problem-solving comfort</li>
          <li>Interest orientation and preferred work themes</li>
          <li>Learning behavior and effort consistency</li>
          <li>Motivation, values, and decision maturity</li>
          <li>Readiness for AI, tech, design, business, and applied tracks</li>
        </ul>
      </article>
      <article class="card">
        <strong>What the family sees after completion</strong>
        <ul>
          <li>Top-fit direction bands and confidence levels</li>
          <li>Strength summary in simple English</li>
          <li>Possible mismatch areas to discuss early</li>
          <li>90-day action roadmap for subject and skill exposure</li>
          <li>Clear next step instead of generic motivational advice</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="band">
    <h2>Pricing and next step</h2>
    <p class="lead">Keep the call to action simple. Parent should know the price, what is included, and where the flow starts.</p>
    <div class="grid-2">
      <article class="card">
        <span class="signal">Current plan</span>
        <strong>AptiPath360 Basic</strong>
        <div class="pricing">
          <strong>Rs 799 + GST</strong>
          <span>one-time</span>
        </div>
        <p>Recommended for first-time parents who want clarity on a student’s likely direction before making academic or coaching decisions.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}${aptiStartUrl}">Start Career Discovery</a>
        </div>
        <div class="mini">Checkout continues through the existing registration and plan flow. No AptiPath360 creative is replaced here.</div>
      </article>
      <article class="card">
        <span class="signal">Best for</span>
        <strong>Grade 8 to College</strong>
        <p>Useful when the family is asking questions like:</p>
        <ul>
          <li>What path actually fits my child?</li>
          <li>Should we push JEE, NEET, commerce, coding, design, or something else?</li>
          <li>Is this child interested, capable, both, or neither?</li>
          <li>What should we do in the next 90 days to test the direction?</li>
        </ul>
      </article>
    </div>
  </section>
</main>

<jsp:include page="footer.jsp"/>
</body>
</html>
