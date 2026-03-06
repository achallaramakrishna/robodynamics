<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
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

    .hero-signal {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      min-height: 100%;
    }

    .hero-signal h3 {
      margin: 0;
      font-size: 1.18rem;
      color: #143f27;
      line-height: 1.28;
      font-family: "Outfit", sans-serif;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .hero-signal p {
      margin: 0;
      color: #4f6759;
      font-size: 0.92rem;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .hero-signal .awareness-relevance {
      font-size: 0.86rem;
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

    .awareness-board {
      margin-top: 1rem;
      border: 1px solid #cfe1d1;
      border-radius: var(--radius-lg);
      background: linear-gradient(180deg, #f7fcf8 0%, #edf6ef 100%);
      padding: 1rem;
      box-shadow: 0 12px 22px rgba(17, 68, 38, 0.1);
    }

    .awareness-board,
    .awareness-board * {
      box-sizing: border-box;
    }

    .awareness-topline {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.52rem 0.7rem;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #d9e9dc;
      color: #18492d;
      font-weight: 800;
      margin-bottom: 0.8rem;
    }

    .awareness-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1d7a47;
      box-shadow: 0 0 0 6px rgba(29, 122, 71, 0.14);
      animation: pulseDot 1.6s ease-in-out infinite;
      flex: 0 0 10px;
    }

    @keyframes pulseDot {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.65; }
      100% { transform: scale(1); opacity: 1; }
    }

    .awareness-audience-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
      margin-top: 0.75rem;
    }

    .awareness-audience-grid > *,
    .india-focus-grid > * {
      min-width: 0;
    }

    .audience-panel {
      border: 1px solid #d5e6d8;
      border-radius: 14px;
      background: #ffffff;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .audience-head h3 {
      margin: 0;
      font-family: "Outfit", sans-serif;
      color: #154229;
      font-size: 1.08rem;
    }

    .audience-head p {
      margin: 0.2rem 0 0;
      color: #4f6759;
      font-size: 0.86rem;
    }

    .awareness-card {
      background: #fff;
      border: 1px solid #dceadb;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: auto;
    }

    .awareness-hero-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-bottom: 1px solid #e4efe5;
    }

    .awareness-hero-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.9rem;
      min-width: 0;
    }

    .awareness-hero-content h3 {
      margin: 0;
      color: #133d26;
      font-size: 1.28rem;
      line-height: 1.25;
      font-family: "Outfit", sans-serif;
    }

    .awareness-hero-content p {
      margin: 0;
      color: #4f6759;
      font-size: 0.95rem;
    }

    .awareness-side-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .awareness-side-item {
      border: 1px solid #dceadb;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.7rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .awareness-side-item h4 {
      margin: 0;
      color: #184b2d;
      font-size: 1rem;
      line-height: 1.28;
    }

    .awareness-side-item p {
      margin: 0;
      color: #4f6759;
      font-size: 0.9rem;
    }

    .awareness-side-row {
      display: grid;
      grid-template-columns: 84px 1fr;
      gap: 0.55rem;
      align-items: start;
    }

    .awareness-side-thumb {
      width: 84px;
      height: 84px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid #deebdf;
    }

    .awareness-side-copy {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
    }

    .awareness-meta {
      display: flex;
      gap: 0.45rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .awareness-type {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      border: 1px solid #bfe0c7;
      background: #eaf8ee;
      color: #145b35;
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.16rem 0.5rem;
    }

    .awareness-readtime {
      display: inline-flex;
      font-size: 0.75rem;
      font-weight: 700;
      color: #3f5b4c;
      background: #eef6ef;
      border: 1px solid #d7e8da;
      border-radius: 999px;
      padding: 0.14rem 0.45rem;
    }

    .awareness-origin {
      display: inline-flex;
      width: fit-content;
      font-size: 0.72rem;
      font-weight: 800;
      color: #0a4a80;
      background: #e8f3ff;
      border: 1px solid #c7ddf6;
      border-radius: 999px;
      padding: 0.14rem 0.44rem;
    }

    .awareness-relevance {
      margin: 0;
      font-size: 0.83rem;
      color: #2a5d3e;
      font-weight: 700;
    }

    .awareness-link {
      margin-top: auto;
      font-weight: 800;
      color: #155d35;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .awareness-link:hover {
      text-decoration: underline;
    }

    .startup-desk-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin-top: 0.9rem;
    }

    .startup-desk-card img {
      width: 100%;
      height: 190px;
      object-fit: cover;
      border-bottom: 1px solid #e4efe5;
    }

    .startup-desk-content {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      padding: 0.72rem;
      min-width: 0;
    }

    .startup-desk-content h3 {
      margin: 0;
      font-size: 1.08rem;
      color: #164428;
      line-height: 1.26;
      font-family: "Outfit", sans-serif;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .startup-desk-content p {
      margin: 0;
      color: #4f6759;
      font-size: 0.89rem;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .india-focus-strip {
      border: 1px solid #cfe1d3;
      border-radius: 13px;
      background: #f8fcf8;
      padding: 0.75rem;
    }

    .india-focus-strip h3 {
      margin: 0;
      font-family: "Outfit", sans-serif;
      font-size: 1.06rem;
      color: #164328;
    }

    .india-focus-strip p {
      margin: 0.2rem 0 0.55rem;
      font-size: 0.86rem;
      color: #4e6658;
    }

    .india-focus-layout {
      display: grid;
      grid-template-columns: 1.35fr 0.9fr;
      gap: 0.72rem;
      align-items: stretch;
    }

    .india-lead-card img {
      width: 100%;
      height: 230px;
      object-fit: cover;
      border-bottom: 1px solid #e4efe5;
    }

    .india-quick-list {
      display: flex;
      flex-direction: column;
      gap: 0.58rem;
    }

    .india-quick-item {
      padding: 0.58rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .india-quick-row {
      display: grid;
      grid-template-columns: 78px 1fr;
      gap: 0.52rem;
      align-items: start;
    }

    .india-quick-thumb {
      width: 78px;
      height: 78px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid #deebdf;
    }

    .india-quick-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .india-focus-content {
      padding: 0.62rem 0.64rem 0.68rem;
      display: flex;
      flex-direction: column;
      gap: 0.38rem;
      min-width: 0;
    }

    .awareness-hero-content h3,
    .awareness-side-item h4,
    .india-focus-content h4,
    .awareness-relevance,
    .awareness-link {
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .india-focus-content h4 {
      margin: 0;
      font-size: 0.96rem;
      line-height: 1.25;
      color: #17452b;
    }

    .india-focus-content p {
      margin: 0;
      color: #4f6759;
      font-size: 0.84rem;
    }

    .india-builder-strip {
      margin-top: 0.72rem;
      border: 1px solid #d6e6d8;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.65rem;
    }

    .india-builder-head h4 {
      margin: 0;
      color: #154129;
      font-size: 1rem;
      font-family: "Outfit", sans-serif;
    }

    .india-builder-head p {
      margin: 0.18rem 0 0.55rem;
      color: #4d6658;
      font-size: 0.84rem;
    }

    .india-builder-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.58rem;
    }

    .india-builder-card {
      padding: 0.52rem;
      display: flex;
      flex-direction: column;
      gap: 0.36rem;
    }

    .india-builder-card h5 {
      margin: 0;
      color: #17452b;
      font-size: 0.93rem;
      line-height: 1.25;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .india-builder-card p {
      margin: 0;
      color: #4f6759;
      font-size: 0.82rem;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    #indiaLeadTitle,
    #indiaLeadExcerpt,
    #indiaLeadBenefit {
      transition: opacity 0.28s ease;
    }

    .product-rail {
      border: 1px solid #cde1d1;
      border-radius: 12px;
      background: #fff;
      padding: 0.72rem;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      height: fit-content;
      margin-top: 0.8rem;
    }

    .product-rail h4 {
      margin: 0;
      color: #123d25;
      font-size: 1.02rem;
    }

    .product-rail p {
      margin: 0;
      color: #4f6759;
      font-size: 0.86rem;
    }

    .product-rail .btn {
      padding: 0.56rem 0.8rem;
      font-size: 0.85rem;
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
      .awareness-audience-grid {
        grid-template-columns: 1fr;
      }
      .startup-desk-grid {
        grid-template-columns: 1fr;
      }
      .india-focus-layout {
        grid-template-columns: 1fr;
      }
      .india-builder-grid {
        grid-template-columns: 1fr;
      }
      .india-quick-row {
        grid-template-columns: 70px 1fr;
      }
      .india-quick-thumb {
        width: 70px;
        height: 70px;
      }
      .awareness-side-row {
        grid-template-columns: 70px 1fr;
      }
      .awareness-side-thumb {
        width: 70px;
        height: 70px;
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
    <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
    <c:set var="isParentOrAdmin" value="${pid == 4 or pid == 1 or pid == 2}" />

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
            base fee (+ GST at checkout)
          </div>
        </div>

        <div class="hero-cta">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Pay &#8377;799 + GST - Start AptiPath360</a>
        </div>
        <p class="media-caption">Final payable amount is shown transparently on the secure checkout page.</p>
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

    <section id="awareness-updates">
      <div class="section-head">
        <h2>India Startup Career Desk (2026-2036)</h2>
        <p>Each card opens a shareable compiled brief with company-level signals and student skill mapping. Source links are optional references.</p>
      </div>
      <div class="startup-desk-grid">
        <c:forEach var="u" items="${startupCareerUpdates}" varStatus="st">
          <article class="startup-desk-card awareness-card" data-headline="${fn:escapeXml(u.title)}">
            <c:choose>
              <c:when test="${fn:startsWith(u.imageUrl, 'http')}">
                <img src="${u.imageUrl}" alt="${u.title}" />
              </c:when>
              <c:otherwise>
                <img src="${pageContext.request.contextPath}${u.imageUrl}" alt="${u.title}" />
              </c:otherwise>
            </c:choose>
            <div class="startup-desk-content">
              <div class="awareness-meta">
                <span class="awareness-type">India Startup</span>
                <span class="awareness-readtime">${u.readTime}</span>
              </div>
              <h3>${u.title}</h3>
              <p>${u.fullInfo}</p>
              <p class="awareness-relevance">Career Track: ${u.careerTrack}</p>
              <p class="awareness-relevance">Skill Focus: ${u.skillFocus}</p>
              <p class="awareness-relevance">${u.parentAction}</p>
              <a class="awareness-link" href="${pageContext.request.contextPath}${u.href}">${u.ctaLabel} &rarr;</a>
              <c:if test="${not empty u.sourceUrl}">
                <a class="awareness-link" href="${u.sourceUrl}" target="_blank" rel="noopener">Reference Source (${u.sourceLabel}) &rarr;</a>
              </c:if>
              <a class="awareness-link" href="${pageContext.request.contextPath}${u.productCtaHref}">${u.productCtaLabel} &rarr;</a>
            </div>
          </article>
        </c:forEach>
      </div>

      <aside class="product-rail">
        <h4>Convert Insight to Revenue</h4>
        <p>Keep AptiPath360 as the first action after every story.</p>
        <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Start AptiPath360</a>
        <a class="btn btn-secondary" href="${pageContext.request.contextPath}/exam-prep">ExamPrep360</a>
        <a class="btn btn-secondary" href="${pageContext.request.contextPath}/tuition-on-demand">Tuition on Demand</a>
      </aside>
    </section>

    <section id="career-horizon">
      <div class="section-head">
        <h2>Career Horizon Map (2026-2036)</h2>
        <p>Map startup activity to real career tracks and child skill development.</p>
      </div>
      <div class="careers">
        <article class="card">
          <h4>SpaceTech & ISRO Tracks</h4>
          <p>Math, physics, satellite systems, mission planning.</p>
        </article>
        <article class="card">
          <h4>EV & ClimateTech Tracks</h4>
          <p>Battery systems, product engineering, mobility design.</p>
        </article>
        <article class="card">
          <h4>AI & Data Tracks</h4>
          <p>Coding, data literacy, responsible AI problem solving.</p>
        </article>
        <article class="card">
          <h4>Startup Product Tracks</h4>
          <p>Creativity, product thinking, execution, communication.</p>
        </article>
      </div>
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
          <p>Pay once using Razorpay: <strong>&#8377;799 base</strong> + GST for Grade 8 to College/Post-12 learners.</p>
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
            <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Pay &#8377;799 + GST and Start</a>
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
            <c:if test="${isParentOrAdmin}">
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/exam-prep/create">Create Exam Paper</a>
            </c:if>
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
    (function () {
      const copyBtn = document.getElementById("copyLink");
      const linkEl = document.getElementById("studentLink");
      if (copyBtn && linkEl) {
        copyBtn.addEventListener("click", function () {
          navigator.clipboard.writeText(linkEl.textContent).then(() => {
            this.textContent = "Copied";
            setTimeout(() => {
              this.textContent = "Copy";
            }, 1200);
          });
        });
      }
    })();
  </script>
</body>
</html>
