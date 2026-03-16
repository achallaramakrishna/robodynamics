<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="header.jsp"/>

<%--
  MindSutra AI Tutor — Pricing Page
  Route : GET /ai-tutor/pricing
  Style : matches AptiPath360 home.jsp design language exactly
  Plans : Free (Ch1)  ·  Full ₹499/mo  ·  Annual ₹3,999/yr  ·  Founding Member ₹1,999 lifetime
--%>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">

<style>
  /* ── Design tokens (matches AptiPath360 home.jsp) ── */
  :root {
    --page-bg:    #f1f8f1;
    --panel:      #ffffff;
    --line:       #c7dec8;
    --line-soft:  #dceadb;
    --text:       #123122;
    --muted:      #486456;
    --brand:      #1d7a47;
    --brand-deep: #155d35;
    --accent:     #5aa56e;
    --warning:    #f1b956;
    --shadow:     0 18px 36px rgba(17,68,38,0.12);
    --radius-xl:  24px;
    --radius-lg:  18px;
    --radius-md:  14px;
  }
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    color: var(--text);
    background:
      radial-gradient(1200px 420px at 10% -20%, rgba(90,165,110,.2), transparent 65%),
      radial-gradient(900px 320px at 90% 0%, rgba(29,122,71,.16), transparent 70%),
      var(--page-bg);
    font-family: "Nunito", system-ui, -apple-system, Segoe UI, sans-serif;
    line-height: 1.5;
  }

  .page { width: min(1160px, 94vw); margin: 0 auto; padding: 2rem 0 4rem; }
  section { margin-top: 1.4rem; }

  /* ── Shared components (identical to home.jsp) ── */
  .eyebrow {
    display: inline-flex; width: fit-content;
    font-size: .78rem; letter-spacing: .08em; font-weight: 800;
    text-transform: uppercase; color: var(--brand-deep);
    background: #dff1e2; border: 1px solid #c5e3cb;
    border-radius: 999px; padding: .25rem .65rem;
  }

  .section-head h2 {
    margin: 0; font-family: "Outfit", sans-serif;
    font-size: clamp(1.35rem,2.4vw,2rem); color: #123922;
  }
  .section-head p { margin: .35rem 0 0; color: var(--muted); }

  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    text-decoration: none; font-weight: 800; border-radius: 999px;
    border: 1px solid transparent; padding: .72rem 1.2rem;
    font-size: .97rem; transition: transform .2s ease, box-shadow .2s ease; cursor: pointer;
  }
  .btn:hover { transform: translateY(-1px); text-decoration: none; }
  .btn-primary {
    color: #fff;
    background: linear-gradient(135deg, var(--brand), var(--accent));
    box-shadow: 0 12px 22px rgba(29,122,71,.28);
  }
  .btn-secondary { color: var(--brand-deep); border-color: #b8d7c0; background: #f8fcf8; }
  .btn-gold {
    color: #fff;
    background: linear-gradient(135deg, #d97706, #f59e0b);
    box-shadow: 0 12px 22px rgba(217,119,6,.30);
  }

  .modules {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: .9rem; margin-top: .8rem;
  }
  .card {
    background: var(--panel); border: 1px solid var(--line-soft);
    border-radius: var(--radius-lg); padding: 1.1rem;
    box-shadow: 0 10px 24px rgba(16,64,34,.08);
  }
  .card h3 { margin: 0 0 .35rem; color: #184b2d; font-family: "Outfit", sans-serif; font-size: 1.2rem; }
  .card p  { margin: 0; color: var(--muted); font-size: .96rem; }

  .module-primary {
    grid-column: 1 / -1;
    border: 1px solid #b9dfc2;
    background: linear-gradient(145deg, #ffffff 0%, #f1fbf3 100%);
    box-shadow: 0 16px 28px rgba(17,72,38,.14);
  }
  .module-secondary  { background: #fbfefb; border-color: #d9eadc; }
  .module-founding {
    background: linear-gradient(145deg, #fffbeb 0%, #fef9ee 100%);
    border: 1.5px solid #f59e0b !important;
    box-shadow: 0 16px 28px rgba(245,158,11,.15) !important;
  }

  .module-badge {
    display: inline-flex; align-items: center;
    border: 1px solid #b6dbbf; background: #e8f8ec;
    color: #145b35; border-radius: 999px;
    padding: .2rem .58rem; font-size: .76rem;
    font-weight: 800; letter-spacing: .03em;
    text-transform: uppercase; margin-bottom: .5rem;
  }
  .module-badge.badge-gold   { border-color: #fbbf24; background: #fef3c7; color: #92400e; }
  .module-badge.badge-purple { border-color: #c4b5fd; background: #ede9fe; color: #5b21b6; }

  .module-actions {
    margin-top: .75rem; display: flex; gap: .5rem; flex-wrap: wrap;
  }
  .module-primary .module-actions .btn { font-size: 1rem; padding: .78rem 1.28rem; }

  /* ── Feature checklist ── */
  .feature-list { list-style: none; padding: 0; margin: .6rem 0 .8rem; }
  .feature-list li {
    display: flex; align-items: flex-start; gap: .45rem;
    font-size: .9rem; color: var(--muted); padding: .22rem 0;
  }
  .feature-list li .tick  { color: var(--brand); font-size: .95rem; flex-shrink: 0; margin-top: 2px; }
  .feature-list li .cross { color: #d1d5db;       font-size: .95rem; flex-shrink: 0; margin-top: 2px; }

  /* ── Price display ── */
  .price-block { margin: .6rem 0 .25rem; }
  .price-main {
    font-family: "Outfit", sans-serif;
    font-size: 2rem; font-weight: 800;
    color: var(--brand-deep); line-height: 1;
  }
  .price-main.gold-price { color: #d97706; }
  .price-main.free-price { color: var(--brand); }
  .price-period { font-size: .85rem; color: var(--muted); font-weight: 600; margin-left: .15rem; }
  .price-note   { font-size: .8rem; color: var(--muted); margin-top: .2rem; }
  .price-note .savings { color: var(--brand); font-weight: 800; }

  /* ── Hero ── */
  .ms-hero {
    background: linear-gradient(145deg, #f4fbf5 0%, #edf7ed 100%);
    border: 1px solid var(--line); border-radius: var(--radius-xl);
    padding: clamp(1.2rem,2.5vw,2rem);
    box-shadow: var(--shadow); margin-bottom: 2rem;
  }
  .ms-hero h1 {
    font-family: "Outfit", sans-serif;
    font-size: clamp(1.9rem,3.5vw,2.8rem);
    font-weight: 800; line-height: 1.15; color: #0f3925;
    margin: .5rem 0 .6rem;
  }
  .ms-hero p { color: var(--muted); font-size: 1.02rem; max-width: 60ch; margin: 0 0 1rem; }
  .hero-cta  { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; }

  .founding-alert {
    display: inline-flex; align-items: center; gap: .4rem;
    background: #fef3c7; border: 1.5px solid #f59e0b;
    color: #92400e; font-weight: 800; font-size: .88rem;
    padding: .4rem 1rem; border-radius: 999px;
  }

  .trust-bar {
    display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.2rem;
  }
  .trust-item {
    background: var(--panel); border: 1px solid var(--line-soft);
    border-radius: var(--radius-md); padding: .45rem .85rem;
    font-size: .87rem; color: var(--muted);
    box-shadow: 0 4px 10px rgba(16,64,34,.06);
  }
  .trust-item strong { color: var(--brand-deep); display: block; font-size: .97rem; }

  /* ── FAQ ── */
  .faq-section { margin-top: 2.5rem; }
  .faq-section h2 {
    font-family: "Outfit", sans-serif;
    font-size: clamp(1.25rem,2vw,1.7rem); color: #123922; margin-bottom: 1rem;
  }
  .faq-list { display: flex; flex-direction: column; gap: .6rem; }
  details.faq-item {
    background: var(--panel); border: 1px solid var(--line-soft);
    border-radius: var(--radius-md); padding: .85rem 1.1rem;
    box-shadow: 0 4px 12px rgba(16,64,34,.06);
  }
  details.faq-item[open] { box-shadow: 0 8px 24px rgba(16,64,34,.10); }
  summary.faq-q {
    font-weight: 800; font-size: .96rem; color: var(--text);
    cursor: pointer; list-style: none;
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  }
  summary.faq-q::-webkit-details-marker { display: none; }
  summary.faq-q::after { content: "+"; font-size: 1.2rem; color: var(--brand); flex-shrink: 0; }
  details.faq-item[open] summary.faq-q::after { content: "−"; }
  .faq-a { font-size: .91rem; color: var(--muted); margin: .65rem 0 0; line-height: 1.75; }

  @media (max-width: 640px) {
    .modules { grid-template-columns: 1fr; }
    .module-primary { grid-column: auto; }
  }
</style>

<main class="page">

  <%-- ── Hero ── --%>
  <div class="ms-hero">
    <span class="eyebrow">🧮 MindSutra — AI Vedic Math Tutor</span>
    <h1>Help Your Child Calculate<br>10&times; Faster with AI</h1>
    <p>An AI avatar teaches all 16 Vedic Math tricks — step by step, with voice, board animations, and instant doubt resolution. Like a private tutor, always available.</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="${pageContext.request.contextPath}/ai-tutor/demo?chapter=L1_COMPLETING_WHOLE">Try Free — Chapter 1</a>
      <a class="btn btn-secondary" href="${pageContext.request.contextPath}/ai-tutor">See the Tutor in Action</a>
      <span class="founding-alert">🔥 Founding Member — &#8377;1,999 lifetime &middot; Only 100 families</span>
    </div>
    <div class="trust-bar">
      <div class="trust-item"><strong>16</strong>Vedic Math Chapters</div>
      <div class="trust-item"><strong>144+</strong>Exercise Groups</div>
      <div class="trust-item"><strong>Grades 4–10</strong>Age 9 to 16</div>
      <div class="trust-item"><strong>5</strong>AI Avatar Personalities</div>
      <div class="trust-item"><strong>Mobile</strong>Works on Phone &amp; Tablet</div>
    </div>
  </div>

  <%-- ── Pricing plans ── --%>
  <section id="mindsutara-pricing">
    <div class="section-head">
      <h2>Choose the plan that works for your family</h2>
      <p>Start free with Chapter 1. Upgrade anytime. Cancel monthly plans anytime, no questions asked.</p>
    </div>

    <div class="modules">

      <%-- Founding Member — full-width featured --%>
      <article class="card module-primary module-founding">
        <span class="module-badge badge-gold">🏅 Limited Offer — First 100 Families Only</span>
        <h3>Founding Member — Lifetime Access</h3>
        <p>Pay once. Access forever. Your child gets all 16 Vedic Math chapters for life — plus every chapter we add in the future, at no extra charge. Once 100 families join, this price is gone.</p>
        <div class="price-block">
          <span class="price-main gold-price">&#8377;1,999</span>
          <span class="price-period">one-time &middot; lifetime</span>
          <div class="price-note"><span class="savings">Free upgrades forever</span> &nbsp;&middot;&nbsp; equivalent to &lt;&#8377;10/month for 20 years</div>
        </div>
        <ul class="feature-list">
          <li><span class="tick">&#10003;</span> Lifetime access to all current &amp; future Vedic Math chapters</li>
          <li><span class="tick">&#10003;</span> AI avatar with voice narration and adaptive difficulty</li>
          <li><span class="tick">&#10003;</span> Founding Member badge on your child's profile</li>
          <li><span class="tick">&#10003;</span> Early access to MindSpark Aptitude &amp; Reasoning Tutor</li>
          <li><span class="tick">&#10003;</span> Priority parent support — forever, no expiry</li>
          <li><span class="tick">&#10003;</span> Name on Founding Families wall</li>
        </ul>
        <div class="module-actions">
          <a class="btn btn-gold" href="${pageContext.request.contextPath}/plans/checkout?plan=founding-member">Claim Lifetime Access — &#8377;1,999 + GST</a>
          <a class="btn btn-secondary" href="${pageContext.request.contextPath}/ai-tutor/demo?chapter=L1_COMPLETING_WHOLE">Try Free First</a>
        </div>
      </article>

      <%-- Full Monthly --%>
      <article class="card module-secondary">
        <span class="module-badge badge-purple">&#11088; Most Popular</span>
        <h3>Full Plan — Monthly</h3>
        <p>All 16 chapters, full AI tutoring, cancel anytime. Best for families who want flexibility before committing to annual.</p>
        <div class="price-block">
          <span class="price-main">&#8377;499</span>
          <span class="price-period">/month</span>
          <div class="price-note">&#8377;589 incl. 18% GST &nbsp;&middot;&nbsp; cancel anytime</div>
        </div>
        <ul class="feature-list">
          <li><span class="tick">&#10003;</span> All 16 Vedic Math chapters unlocked</li>
          <li><span class="tick">&#10003;</span> AI avatar — voice, animations, adaptive pace</li>
          <li><span class="tick">&#10003;</span> Doubt resolution powered by Claude AI</li>
          <li><span class="tick">&#10003;</span> XP, streaks, badges &amp; WhatsApp sharing</li>
          <li><span class="tick">&#10003;</span> Works on phone, tablet, laptop</li>
        </ul>
        <div class="module-actions">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}/plans/checkout?plan=mindsutrafull">Start Full Plan — &#8377;499/mo + GST</a>
        </div>
      </article>

      <%-- Annual --%>
      <article class="card module-secondary">
        <span class="module-badge">&#128176; Save 33%</span>
        <h3>Annual Plan</h3>
        <p>Everything in the Full plan, for 12 months straight. Save &#8377;1,989 versus paying month by month.</p>
        <div class="price-block">
          <span class="price-main">&#8377;3,999</span>
          <span class="price-period">/year</span>
          <div class="price-note"><span class="savings">Save &#8377;1,989</span> vs monthly &nbsp;&middot;&nbsp; free MindSpark access when live</div>
        </div>
        <ul class="feature-list">
          <li><span class="tick">&#10003;</span> Everything in Full plan, 12 months</li>
          <li><span class="tick">&#10003;</span> Priority parent support</li>
          <li><span class="tick">&#10003;</span> Annual progress certificate</li>
          <li><span class="tick">&#10003;</span> Early access to new AI tutor courses</li>
        </ul>
        <div class="module-actions">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}/plans/checkout?plan=mindsutraannual">Get Annual — &#8377;3,999 + GST</a>
        </div>
      </article>

      <%-- Free — spans full width --%>
      <article class="card module-secondary" style="grid-column: 1 / -1;">
        <span class="module-badge">&#127379; No Credit Card Needed</span>
        <h3>Free — Chapter 1 Forever</h3>
        <p>Your child can start learning Vedic Math right now — no payment, no signup friction. Chapter 1 (Completing the Whole) is always free.</p>
        <ul class="feature-list" style="columns:2; gap:2rem; margin-bottom:.5rem;">
          <li><span class="tick">&#10003;</span> Chapter 1 — Completing the Whole</li>
          <li><span class="tick">&#10003;</span> AI avatar with voice narration</li>
          <li><span class="tick">&#10003;</span> Interactive board animations</li>
          <li><span class="cross">&#10007;</span> Chapters 2–16 (upgrade to unlock)</li>
        </ul>
        <div class="module-actions">
          <a class="btn btn-primary" href="${pageContext.request.contextPath}/ai-tutor/demo?chapter=L1_COMPLETING_WHOLE">Start Free Now — Chapter 1</a>
          <a class="btn btn-secondary" href="${pageContext.request.contextPath}/ai-tutor">Explore All 16 Chapters</a>
        </div>
      </article>

    </div><%-- /modules --%>
  </section>

  <%-- ── FAQ ── --%>
  <div class="faq-section">
    <h2>Questions parents ask</h2>
    <div class="faq-list">

      <details class="faq-item">
        <summary class="faq-q">How is this different from YouTube Vedic Math videos?</summary>
        <p class="faq-a">YouTube is one-way — your child watches but nobody checks understanding. MindSutra is interactive: the AI teaches, asks questions, listens to answers, gives instant feedback, and adapts when your child is stuck. It&apos;s a private tutor, not a video.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">What age and grade is MindSutra for?</summary>
        <p class="faq-a">Grades 4 through 10 (ages 9&ndash;16). The AI avatar adjusts its teaching pace and explanation style based on how your child responds — slower for beginners, faster for quick learners.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">Can I cancel the monthly plan anytime?</summary>
        <p class="faq-a">Yes, absolutely. The Full plan is month-to-month. Cancel anytime from your account page — no questions asked, no hidden fees.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">What happens right after I pay?</summary>
        <p class="faq-a">You are redirected directly to the AI Tutor. Your child selects a chapter, picks an avatar, and the lesson starts immediately. Works on phone, tablet, and laptop.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">Is the Founding Member offer really lifetime?</summary>
        <p class="faq-a">Yes. &#8377;1,999 one-time gives your child lifetime access to all current and future Vedic Math chapters on MindSutra. We will never charge you again for this tutor. Limited to the first 100 families — once they are gone, this price disappears forever.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">Is GST included in the prices shown?</summary>
        <p class="faq-a">The prices shown (&#8377;499/mo, &#8377;3,999/yr, &#8377;1,999) are base prices before GST. 18% GST is added at checkout — you will see the exact full breakdown before you pay.</p>
      </details>

      <details class="faq-item">
        <summary class="faq-q">What payment methods are accepted?</summary>
        <p class="faq-a">All major options via Razorpay: UPI (PhonePe, GPay, Paytm), debit/credit cards (Visa, Mastercard, RuPay), net banking, and EMI on eligible cards.</p>
      </details>

    </div>
  </div>

</main>

<jsp:include page="footer.jsp"/>
