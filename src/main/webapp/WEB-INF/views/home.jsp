<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>RoboDynamics | AptiPath360 and AI Tutor Products</title>
  <meta name="description" content="Explore AptiPath360, MindSutra, MindSpark, and MoneyMind from one clean RoboDynamics product home."/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f6f8fb;
      --ink: #102033;
      --muted: #5b6b7c;
      --line: #d9e3ee;
      --panel: #ffffff;
      --shadow: 0 18px 46px rgba(16, 32, 51, 0.09);
      --blue: #2563eb;
      --blue-soft: #dbeafe;
      --green: #15803d;
      --green-soft: #dcfce7;
      --orange: #ea580c;
      --orange-soft: #ffedd5;
      --amber: #b45309;
      --amber-soft: #fef3c7;
      --slate: #0f172a;
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      background:
        radial-gradient(900px 380px at 8% -10%, rgba(37,99,235,.10), transparent 65%),
        radial-gradient(720px 300px at 92% 0%, rgba(234,88,12,.08), transparent 62%),
        var(--bg);
      color: var(--ink);
      font-family: "Manrope", system-ui, sans-serif;
    }

    a { text-decoration: none; }

    .shell {
      width: min(1160px, 94vw);
      margin: 0 auto;
      padding: 22px 0 72px;
    }

    .hero {
      background: linear-gradient(135deg, #0f172a 0%, #13263c 52%, #1f4065 100%);
      color: #f8fafc;
      border-radius: var(--radius-xl);
      padding: clamp(28px, 5vw, 52px);
      box-shadow: var(--shadow);
      overflow: hidden;
      position: relative;
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: auto -90px -120px auto;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(96,165,250,.24), rgba(96,165,250,0));
      pointer-events: none;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(96,165,250,.12);
      color: #93c5fd;
      border: 1px solid rgba(147,197,253,.24);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr .85fr;
      gap: 28px;
      align-items: stretch;
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
      color: #cbd5e1;
      font-size: 16px;
      line-height: 1.75;
      max-width: 62ch;
    }

    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 26px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 13px 18px;
      font-size: 14px;
      font-weight: 800;
      border: 1px solid transparent;
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
    }

    .btn:hover { transform: translateY(-1px); }
    .btn-primary { background: #fff; color: #0f172a; box-shadow: 0 12px 24px rgba(15,23,42,.25); }
    .btn-secondary { background: transparent; color: #e2e8f0; border-color: rgba(226,232,240,.22); }

    .hero-panel {
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 22px;
      padding: 20px;
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hero-panel h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: #f8fafc;
    }

    .signal-list {
      display: grid;
      gap: 12px;
    }

    .signal-item {
      background: rgba(15,23,42,.42);
      border-radius: 16px;
      padding: 14px 14px;
      border: 1px solid rgba(255,255,255,.08);
    }

    .signal-item strong {
      display: block;
      color: #f8fafc;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .signal-item span {
      display: block;
      color: #cbd5e1;
      font-size: 13px;
      line-height: 1.55;
    }

    .section {
      margin-top: 28px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: clamp(24px, 4vw, 36px);
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .section h2 {
      margin: 0 0 8px;
      font-family: "Outfit", sans-serif;
      font-size: clamp(24px, 3.2vw, 34px);
      letter-spacing: -.03em;
    }

    .section p.lead {
      margin: 0 0 26px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.7;
      max-width: 72ch;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }

    .product-card {
      border-radius: 22px;
      padding: 22px;
      background: #fff;
      border: 1px solid var(--line);
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: 0 8px 22px rgba(15,23,42,.04);
      position: relative;
      min-height: 280px;
    }

    .product-card.live { border-width: 2px; }
    .product-card.mindsutra.live { border-color: #bfdbfe; }
    .product-card.aptipath.live { border-color: #bbf7d0; }
    .product-card.mindspark { border-color: #d1fae5; }
    .product-card.moneymind { border-color: #fde68a; }

    .product-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex: 0 0 52px;
    }

    .mindsutra .product-icon { background: var(--blue-soft); }
    .aptipath .product-icon { background: var(--green-soft); }
    .mindspark .product-icon { background: #d1fae5; }
    .moneymind .product-icon { background: var(--amber-soft); }

    .product-title {
      margin: 0;
      font-size: 20px;
      font-weight: 900;
    }

    .product-sub {
      margin: 2px 0 0;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .product-card p {
      margin: 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.7;
    }

    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 800;
      border: 1px solid;
    }

    .mindsutra .pill { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    .aptipath .pill { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .mindspark .pill { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .moneymind .pill { background: #fffbeb; border-color: #fde68a; color: #a16207; }

    .status-badge {
      position: absolute;
      top: 18px;
      right: 18px;
      border-radius: 999px;
      padding: 4px 9px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .status-live { background: #dcfce7; color: #15803d; }
    .status-soon { background: #f1f5f9; color: #64748b; }

    .card-actions {
      margin-top: auto;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .card-link {
      flex: 1 1 160px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 800;
      border: 1px solid transparent;
    }

    .mindsutra .card-link.primary { background: var(--blue); color: #fff; }
    .aptipath .card-link.primary { background: var(--green); color: #fff; }
    .mindspark .card-link.primary { background: #0f766e; color: #fff; }
    .moneymind .card-link.primary { background: var(--amber); color: #fff; }

    .card-link.secondary {
      background: #f8fafc;
      color: #334155;
      border-color: #dbe5ef;
    }

    .flow-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .flow-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: #fbfdff;
    }

    .flow-card strong {
      display: block;
      font-size: 12px;
      color: var(--blue);
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .flow-card h4 {
      margin: 0 0 8px;
      font-size: 17px;
      font-weight: 800;
    }

    .flow-card p {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.65;
    }

    .wireframe-note {
      margin-top: 18px;
      padding: 18px;
      border-radius: 18px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      color: #475569;
      font-size: 14px;
      line-height: 1.75;
    }

    .wireframe-note strong { color: #0f172a; }

    @media (max-width: 920px) {
      .hero-grid { grid-template-columns: 1fr; }
      .flow-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <jsp:include page="header.jsp" />

  <c:url var="newParentStartUrl" value="/registerParentChild">
    <c:param name="plan" value="career-basic" />
    <c:param name="redirect" value="/plans/checkout?plan=career-basic" />
  </c:url>

  <main class="shell">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Products for parents and students</div>
          <h1>Start with the right product.<br/>Then move into the right learning path.</h1>
          <p>
            Explore AptiPath360 for career discovery and the AI tutor families for guided learning.
            Pick the product first, then go deeper into grade, curriculum, demo, pricing, and progress.
            The homepage stays clean so the next action is always clear.
          </p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#products">Explore Products</a>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath360">View AptiPath360</a>
          </div>
        </div>
        <aside class="hero-panel">
          <h3>How families can start</h3>
          <div class="signal-list">
            <div class="signal-item">
              <strong>Choose the need first</strong>
              <span>Pick career discovery, guided AI tutoring, reasoning practice, or financial learning.</span>
            </div>
            <div class="signal-item">
              <strong>See the product details</strong>
              <span>Each product page should show the right path, lesson coverage, outcomes, demo, and pricing.</span>
            </div>
            <div class="signal-item">
              <strong>Begin and track progress</strong>
              <span>Student starts from the right page, and parents should be able to see progress clearly after that.</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section id="products" class="section">
      <h2>Products</h2>
      <p class="lead">The homepage should show only the main product families. Parents decide the program first. Course depth, grade choice, demo, and enrollment happen inside each product experience.</p>

      <div class="product-grid">
        <article id="aptipath" class="product-card aptipath live">
          <span class="status-badge status-live">Live</span>
          <div class="product-top">
            <div class="product-icon">🧭</div>
            <div>
              <h3 class="product-title">AptiPath360</h3>
              <p class="product-sub">Career Discovery · Grade 8 to College</p>
            </div>
          </div>
          <p>Career discovery for families who want clarity before choosing a stream, coaching path, or exam direction for the student.</p>
          <div class="pill-row">
            <span class="pill">46–72 questions</span>
            <span class="pill">Career roadmap</span>
            <span class="pill">Parent visibility</span>
            <span class="pill">₹799 + GST</span>
          </div>
          <div class="card-actions">
            <a class="card-link primary" href="${pageContext.request.contextPath}/aptipath360">Explore AptiPath360</a>
            <a class="card-link secondary" href="${pageContext.request.contextPath}${newParentStartUrl}">Start AptiPath360</a>
          </div>
        </article>

        <article id="mindsutra" class="product-card mindsutra live">
          <span class="status-badge status-live">Live</span>
          <div class="product-top">
            <div class="product-icon">🧮</div>
            <div>
              <h3 class="product-title">MindSutra</h3>
              <p class="product-sub">Vedic Maths AI Tutor · Grade 4 to 8</p>
            </div>
          </div>
          <p>AI tutor for Vedic Maths that teaches step by step, checks understanding, and helps the child build speed with confidence.</p>
          <div class="pill-row">
            <span class="pill">Grades 4–8</span>
            <span class="pill">Demo available</span>
            <span class="pill">Parent dashboard</span>
            <span class="pill">Lifetime pricing</span>
          </div>
          <div class="card-actions">
            <a class="card-link primary" href="${pageContext.request.contextPath}/mindsutra">Explore MindSutra</a>
            <a class="card-link secondary" href="${pageContext.request.contextPath}/vedic-math/grade-4">Start with Grade 4</a>
          </div>
        </article>

        <article id="mindspark" class="product-card mindspark">
          <span class="status-badge status-soon">Coming Soon</span>
          <div class="product-top">
            <div class="product-icon">🧠</div>
            <div>
              <h3 class="product-title">MindSpark</h3>
              <p class="product-sub">Aptitude &amp; Reasoning AI Tutor · Grade 4 to 8</p>
            </div>
          </div>
          <p>AI tutor for reasoning, logic, and aptitude practice, designed to build thinking skills through guided problem solving.</p>
          <div class="pill-row">
            <span class="pill">Grades 4–8</span>
            <span class="pill">Reasoning</span>
            <span class="pill">Same tutor engine</span>
          </div>
          <div class="card-actions">
            <span class="card-link primary" style="opacity:.72; cursor:default;">MindSpark Landing Next</span>
            <a class="card-link secondary" href="#products">Keep homepage simple</a>
          </div>
        </article>

        <article id="moneymind" class="product-card moneymind">
          <span class="status-badge status-soon">Coming Soon</span>
          <div class="product-top">
            <div class="product-icon">💰</div>
            <div>
              <h3 class="product-title">MoneyMind</h3>
              <p class="product-sub">Financial Literacy AI Tutor</p>
            </div>
          </div>
          <p>Financial literacy for children through guided lessons on money basics, choices, habits, and real-world understanding.</p>
          <div class="pill-row">
            <span class="pill">Money basics</span>
            <span class="pill">Story-led learning</span>
            <span class="pill">Future product page</span>
          </div>
          <div class="card-actions">
            <span class="card-link primary" style="opacity:.72; cursor:default;">MoneyMind Landing Next</span>
            <a class="card-link secondary" href="#products">Product family first</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <h2>What Parents Can Expect</h2>
      <p class="lead">Every product should give parents a clear picture of what it offers, how the student will start, and what happens after enrolment.</p>
      <div class="flow-grid">
        <div class="flow-card">
          <strong>AptiPath360</strong>
          <h4>Career direction with clarity</h4>
          <p>Parents can understand aptitude, interests, and likely-fit paths before choosing the wrong stream, coaching spend, or exam direction.</p>
        </div>
        <div class="flow-card">
          <strong>MindSutra & MindSpark</strong>
          <h4>Guided AI tutoring by level</h4>
          <p>Families can explore the right grade or learning level, see lesson coverage, try a demo, and understand how the tutor teaches step by step.</p>
        </div>
        <div class="flow-card">
          <strong>Progress & Visibility</strong>
          <h4>Parents and students should see growth</h4>
          <p>Each product should make progress visible through lesson tracking, milestones, results, and the next recommended action.</p>
        </div>
      </div>
      <div class="wireframe-note">
        <strong>Simple rule:</strong> start with the product that matches the family need, then go deeper into grade, curriculum, demo, pricing, and progress inside that product experience.
      </div>
    </section>
  </main>

  <jsp:include page="footer.jsp"/>
</body>
</html>
