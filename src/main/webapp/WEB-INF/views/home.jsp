<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>AptiPath360 Career Discovery | Robodynamics</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --page-bg: #f1f8f1;
      --bg-soft: #e6f2e7;
      --panel: #ffffff;
      --panel-soft: #f7fcf7;
      --line: #c7dec8;
      --line-soft: #dceadb;
      --text: #123122;
      --muted: #486456;
      --brand: #1d7a47;
      --brand-deep: #155d35;
      --accent: #5aa56e;
      --warning: #f1b956;
      --shadow: 0 18px 36px rgba(17, 68, 38, 0.12);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 14px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: var(--text);
      background:
        radial-gradient(1200px 420px at 10% -20%, rgba(90, 165, 110, 0.2), transparent 65%),
        radial-gradient(900px 320px at 90% 0%, rgba(29, 122, 71, 0.16), transparent 70%),
        var(--page-bg);
      font-family: "Nunito", system-ui, -apple-system, Segoe UI, sans-serif;
      line-height: 1.5;
    }

    .page {
      width: min(1160px, 94vw);
      margin: 0 auto;
      padding: 1.6rem 0 3.6rem;
    }

    section {
      margin-top: 1.4rem;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.08fr 0.92fr;
      gap: 1.2rem;
      align-items: stretch;
      background: linear-gradient(180deg, #f4fbf5 0%, #edf7ed 100%);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: clamp(1rem, 2.2vw, 1.8rem);
      box-shadow: var(--shadow);
    }

    .hero-text {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      justify-content: center;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--brand-deep);
      background: #dff1e2;
      border: 1px solid #c5e3cb;
      border-radius: 999px;
      padding: 0.25rem 0.65rem;
    }

    .hero h1 {
      margin: 0;
      font-family: "Outfit", sans-serif;
      font-size: clamp(1.9rem, 3.8vw, 3rem);
      line-height: 1.12;
      color: #0f3925;
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      font-size: 1.02rem;
      max-width: 56ch;
    }

    .hero-meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.65rem;
      margin-top: 0.1rem;
    }

    .hero-meta-item {
      background: #ffffff;
      border: 1px solid var(--line-soft);
      border-radius: 12px;
      padding: 0.55rem 0.7rem;
      font-size: 0.9rem;
      color: var(--muted);
    }

    .hero-meta-item strong {
      display: block;
      color: var(--brand-deep);
      font-size: 1rem;
      font-weight: 800;
      margin-bottom: 0.05rem;
    }

    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      margin-top: 0.35rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-weight: 800;
      border-radius: 999px;
      border: 1px solid transparent;
      padding: 0.72rem 1.2rem;
      font-size: 0.97rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-primary {
      color: #fff;
      background: linear-gradient(135deg, var(--brand), var(--accent));
      box-shadow: 0 12px 22px rgba(29, 122, 71, 0.28);
    }

    .btn-secondary {
      color: var(--brand-deep);
      border-color: #b8d7c0;
      background: #f8fcf8;
    }

    .hero-media {
      background: #fff;
      border: 1px solid var(--line-soft);
      border-radius: 18px;
      padding: 0.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .hero-media img {
      width: 100%;
      height: 100%;
      min-height: 300px;
      max-height: 420px;
      object-fit: cover;
      border-radius: 14px;
      border: 1px solid #deebdf;
    }

    .media-caption {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .section-head h2 {
      margin: 0;
      font-family: "Outfit", sans-serif;
      font-size: clamp(1.35rem, 2.4vw, 2rem);
      color: #123922;
    }

    .section-head p {
      margin: 0.35rem 0 0;
      color: var(--muted);
    }

    .insight-grid,
    .steps,
    .modules,
    .careers {
      display: grid;
      gap: 0.9rem;
      margin-top: 0.8rem;
    }

    .insight-grid {
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    }

    .modules,
    .careers {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .modules {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .module-primary {
      grid-column: 1 / -1;
      border: 1px solid #b9dfc2;
      background: linear-gradient(145deg, #ffffff 0%, #f1fbf3 100%);
      box-shadow: 0 16px 28px rgba(17, 72, 38, 0.14);
    }

    .module-secondary {
      background: #fbfefb;
      border-color: #d9eadc;
    }

    .module-badge {
      display: inline-flex;
      align-items: center;
      border: 1px solid #b6dbbf;
      background: #e8f8ec;
      color: #145b35;
      border-radius: 999px;
      padding: 0.2rem 0.58rem;
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .steps {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--line-soft);
      border-radius: var(--radius-lg);
      padding: 1rem;
      box-shadow: 0 10px 24px rgba(16, 64, 34, 0.08);
    }

    .card h3,
    .card h4 {
      margin: 0 0 0.35rem;
      color: #184b2d;
    }

    .card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.96rem;
    }

    .insight-value {
      display: inline-block;
      font-weight: 800;
      color: #0f4f2b;
      background: #ebf8ee;
      border: 1px solid #cbe6d2;
      border-radius: 999px;
      padding: 0.18rem 0.55rem;
      font-size: 0.82rem;
      margin-bottom: 0.42rem;
    }

    .highlight-note {
      margin-top: 0.8rem;
      background: #fffdf6;
      border: 1px solid #eedfbf;
      border-left: 6px solid var(--warning);
      border-radius: var(--radius-md);
      padding: 0.8rem 0.95rem;
      color: #6d5328;
      font-size: 0.95rem;
    }

    .link-panel {
      margin-top: 0.8rem;
      background: #f8fcf8;
      border: 1px dashed #a8cdaf;
      border-radius: var(--radius-md);
      padding: 0.8rem 0.95rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }

    .link-panel code {
      background: #e8f5eb;
      border-radius: 8px;
      padding: 0.18rem 0.48rem;
      color: #145b35;
      font-size: 0.92rem;
    }

    .copy-btn {
      border: none;
      border-radius: 8px;
      padding: 0.45rem 0.85rem;
      background: var(--brand);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    .module-actions {
      margin-top: 0.7rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .module-primary .module-actions .btn-primary {
      font-size: 1rem;
      padding: 0.78rem 1.28rem;
    }

    @media (max-width: 980px) {
      .hero {
        grid-template-columns: 1fr;
      }
      .hero-media img {
        min-height: 260px;
      }
      .modules {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .page {
        width: 95vw;
      }
      .hero-meta {
        grid-template-columns: 1fr;
      }
      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body class="aptipath-home">
  <jsp:include page="header.jsp"/>

  <main class="page">
    <c:url var="newParentStartUrl" value="/registerParentChild">
      <c:param name="plan" value="career-basic" />
      <c:param name="redirect" value="/plans/checkout?plan=career-basic" />
    </c:url>
    <c:url var="existingParentLoginUrl" value="/login">
      <c:param name="intent" value="aptipath360" />
      <c:param name="redirect" value="/aptipath/parent/home" />
    </c:url>
    <c:url var="studentPortalLoginUrl" value="/login">
      <c:param name="redirect" value="/aptipath/student/home" />
    </c:url>

    <section id="career-discover" class="hero">
      <div class="hero-text">
        <span class="eyebrow">AptiPath360 Career Discovery</span>
        <h1>Give your child clear career direction from Grade 8 to College.</h1>
        <p>
          Parents do not pay for tests. They pay for confidence. AptiPath360 helps you understand your child&apos;s strengths early,
          explore the right career paths, and take clear academic steps at every stage from Grade 8, Grade 11-12, and Post-12 college years.
        </p>

        <div class="hero-meta">
          <div class="hero-meta-item">
            <strong>46-72 questions answered</strong>
            per learner, based on stage
          </div>
          <div class="hero-meta-item">
            <strong>1094-question base</strong>
            adaptive bank mapped by section depth
          </div>
          <div class="hero-meta-item">
            <strong>&#8377;799</strong>
            single launch price (Grade 8 to College)
          </div>
        </div>

        <div class="hero-cta">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Pay &#8377;799 - Start AptiPath360</a>
        </div>
        <p class="media-caption">
          Already registered? <a href="${pageContext.request.contextPath}${existingParentLoginUrl}">Login and continue</a>.
        </p>
      </div>

      <figure class="hero-media">
        <img src="/resources/images/hero_parents.jpg" alt="Parent and daughter discussing future career plans"/>
        <figcaption class="media-caption">
          One shared family decision: map your child strengths first, then invest in the right path.
        </figcaption>
      </figure>
    </section>

    <section>
      <div class="section-head">
        <h2>Preview insights before you pay</h2>
        <p>Parents can view what type of output they will receive after the test.</p>
      </div>
      <div class="insight-grid">
        <article class="card">
          <span class="insight-value">Interest Heatmap</span>
          <h4>What your child naturally enjoys</h4>
          <p>AI/Tech, Green Careers, Healthcare, or Data decision patterns from actual responses.</p>
        </article>
        <article class="card">
          <span class="insight-value">Learning Behavior</span>
          <h4>How your child solves problems</h4>
          <p>Analytical vs creative style, confidence level, and support style recommended for parents.</p>
        </article>
        <article class="card">
          <span class="insight-value">Career Match Score</span>
          <h4>Top 3 future-ready paths</h4>
          <p>Practical mapping to roles like AI Engineer, Health AI Builder, Green Systems Designer.</p>
        </article>
        <article class="card">
          <span class="insight-value">Action Roadmap</span>
          <h4>What to do in next 90 days</h4>
          <p>Subject focus, project ideas, and skill-building actions by grade and board.</p>
        </article>
      </div>
      <p class="highlight-note">
        You get a clear report card, not generic motivation text. This is why parents find value before buying coaching.
      </p>
    </section>

    <section>
      <div class="section-head">
        <h2>Simple parent flow</h2>
        <p>Designed for busy parents: quick setup, clear output, and easy follow-through.</p>
      </div>
      <div class="steps">
        <article class="card">
          <h4>1. Parent registers first</h4>
          <p>Create parent and student accounts together in one registration flow.</p>
        </article>
        <article class="card">
          <h4>2. Parent makes payment</h4>
          <p>Pay once using Razorpay: <strong>&#8377;799</strong> single launch price for Grade 8 to College/Post-12 learners.</p>
        </article>
        <article class="card">
          <h4>3. Existing parent path</h4>
          <p>Already registered parents login, finish payment if pending, then continue in parent workspace.</p>
        </article>
        <article class="card">
          <h4>4. Parent shares student link</h4>
          <p>From parent workspace, generate/share student login link. Student logs in and starts AptiPath360 Career Discovery.</p>
        </article>
      </div>
      <div class="link-panel">
        <span>Student access link:</span>
        <code id="studentLink">${pageContext.request.scheme}://${pageContext.request.serverName}${pageContext.request.contextPath}${studentPortalLoginUrl}</code>
        <button class="copy-btn" id="copyLink">Copy</button>
      </div>
    </section>

    <section id="career-pricing">
      <div class="section-head">
        <h2>Modules your family can choose</h2>
        <p>Start with AptiPath360 Career Discovery for Grade 8 to College, then add targeted support only where needed.</p>
      </div>
      <div class="modules">
        <article class="card module-primary">
          <span class="module-badge">Recommended First Step</span>
          <h3>AptiPath360 Career Discovery</h3>
          <p>Adaptive assessment + career signal report + action roadmap for Grade 8, Grade 11-12, and Post-12 students. Start here before spending on classes, so you invest only where needed.</p>
          <div class="module-actions">
            <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Pay &#8377;799 and Start</a>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}${existingParentLoginUrl}">Open Parent Dashboard</a>
          </div>
        </article>
        <article id="exam-courses" class="card module-secondary">
          <span class="module-badge">After Discovery</span>
          <h3>ExamPrep360</h3>
          <p>Board-focused practice, model answers, and final-exam readiness support.</p>
          <p><strong>Basic Plan: Rs 1999</strong> one-time.</p>
          <div class="module-actions">
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">Start ExamPrep360 - Rs 1999</a>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/exam-prep">Explore Exam Prep</a>
          </div>
        </article>
        <article id="tuition-info" class="card module-secondary">
          <span class="module-badge">After Discovery</span>
          <h3>Tuition on Demand</h3>
          <p>One-to-one help only in weak areas identified through the assessment report.</p>
          <div class="module-actions">
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/tuition-on-demand">Explore Tuition</a>
          </div>
        </article>
      </div>
    </section>

    <section>
      <div class="section-head">
        <h2>Future career clusters we map</h2>
      </div>
      <div class="careers">
        <article class="card">
          <h4>AI Engineer Track</h4>
          <p>Logic, coding comfort, and systems thinking patterns.</p>
        </article>
        <article class="card">
          <h4>Green Energy Track</h4>
          <p>Sustainability mindset, science curiosity, and design choices.</p>
        </article>
        <article class="card">
          <h4>Health Innovation Track</h4>
          <p>Empathy, biology interest, and tech-for-people orientation.</p>
        </article>
        <article class="card">
          <h4>Data Strategy Track</h4>
          <p>Pattern recognition, structured thinking, and decision logic.</p>
        </article>
      </div>
    </section>
  </main>

  <jsp:include page="footer.jsp"/>
  <script>
    document.getElementById("copyLink").addEventListener("click", function () {
      const text = document.getElementById("studentLink").textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.textContent = "Copied";
        setTimeout(() => {
          this.textContent = "Copy";
        }, 1200);
      });
    });
  </script>
</body>
</html>
