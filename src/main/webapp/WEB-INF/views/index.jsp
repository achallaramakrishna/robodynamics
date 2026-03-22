<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>RoboDynamics — AI Tutors &amp; Learning for India</title>
  <meta name="description" content="RoboDynamics builds AI tutors for Indian students. MindSutra (Vedic Maths), AptiPath360 (Career Discovery), Tuition on Demand."/>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; }
    a { text-decoration: none; }

    /* ── Hero ── */
    .rd-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f2d1e 100%);
      color: #f1f5f9;
      padding: clamp(48px, 7vw, 88px) 24px clamp(56px, 8vw, 96px);
      text-align: center;
    }
    .rd-hero-eyebrow {
      display: inline-block;
      background: rgba(59,130,246,.18); border: 1px solid rgba(59,130,246,.35);
      color: #93c5fd; font-size: 12px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; padding: 4px 14px; border-radius: 20px;
      margin-bottom: 22px;
    }
    .rd-hero h1 {
      font-size: clamp(28px, 5vw, 54px); font-weight: 900; line-height: 1.12;
      letter-spacing: -.02em; margin: 0 0 18px;
    }
    .rd-hero h1 span { color: #60a5fa; }
    .rd-hero p { color: #94a3b8; font-size: clamp(15px, 2vw, 18px); max-width: 580px; margin: 0 auto 36px; line-height: 1.65; }
    .rd-hero-badges { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
    .rd-hero-badge { color: #64748b; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .rd-hero-badge::before { content: "●"; color: #22c55e; font-size: 8px; }

    /* ── Section chrome ── */
    .rd-section { padding: clamp(48px, 6vw, 72px) 24px; }
    .rd-section-title { font-size: clamp(22px, 3vw, 32px); font-weight: 900; letter-spacing: -.03em; margin: 0 0 8px; }
    .rd-section-sub { color: #64748b; font-size: 15px; margin: 0 0 40px; }

    /* ── Product cards ── */
    .rd-products { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
    .rd-product-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,.07);
      padding: 32px 28px; display: flex; flex-direction: column; gap: 14px;
      border: 1px solid #e2e8f0; transition: transform .18s, box-shadow .18s;
      position: relative; overflow: hidden;
    }
    .rd-product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.12); }
    .rd-product-card .card-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; flex-shrink: 0;
    }
    .rd-product-card .card-title { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0; }
    .rd-product-card .card-tag { font-size: 12px; font-weight: 700; color: #6b7280; margin: -4px 0 0; }
    .rd-product-card .card-desc { color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0; }
    .rd-product-card .card-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .rd-product-card .card-chip { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; border: 1px solid; }
    .rd-product-card .card-cta { margin-top: auto; display: block; text-align: center; padding: 11px 16px; border-radius: 9px; font-weight: 700; font-size: 14px; }
    .rd-product-card .card-sublinks { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .rd-product-card .card-sublink { font-size: 13px; font-weight: 600; }

    /* card colour themes */
    .card-mindsutra .card-icon { background: linear-gradient(135deg,#dbeafe,#ede9fe); }
    .card-mindsutra .card-chip { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    .card-mindsutra .card-cta { background: #2563eb; color: #fff; }
    .card-aptipath  .card-icon { background: linear-gradient(135deg,#dcfce7,#d1fae5); }
    .card-aptipath  .card-chip { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .card-aptipath  .card-cta { background: #16a34a; color: #fff; }
    .card-tuition   .card-icon { background: linear-gradient(135deg,#fff7ed,#fef3c7); }
    .card-tuition   .card-chip { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
    .card-tuition   .card-cta { background: #ea580c; color: #fff; }

    .rd-live-badge {
      position: absolute; top: 16px; right: 16px;
      background: #dcfce7; border: 1px solid #86efac; color: #15803d;
      font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 20px;
    }
    .rd-soon-badge {
      position: absolute; top: 16px; right: 16px;
      background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b;
      font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 20px;
    }

    /* ── How it works ── */
    .rd-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 24px; }
    .rd-step { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; }
    .rd-step-num { font-size: 11px; font-weight: 800; color: #2563eb; letter-spacing: .1em; margin-bottom: 10px; }
    .rd-step h6 { font-weight: 800; font-size: 15px; margin: 0 0 6px; }
    .rd-step p  { color: #64748b; font-size: 13px; line-height: 1.7; margin: 0; }

    /* ── Tutors (Tuition on demand section) ── */
    .rd-mentor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 16px; }
    .rd-mentor-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:20px 16px; text-align:center; transition: transform .15s; }
    .rd-mentor-card:hover { transform: translateY(-2px); }
    .rd-mentor-avatar { width:64px; height:64px; border-radius:50%; object-fit:cover; border: 2px solid #e2e8f0; margin-bottom: 10px; }
    .rd-mentor-name { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
    .rd-mentor-exp  { color: #64748b; font-size: 12px; }

    /* ── Trust strip ── */
    .rd-trust { background: #0f172a; color: #f1f5f9; padding: 40px 24px; text-align: center; }
    .rd-trust-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; }
    .rd-trust-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .rd-trust-num { font-size: 28px; font-weight: 900; color: #60a5fa; }
    .rd-trust-label { font-size: 13px; color: #94a3b8; }

    /* ── Footer ── */
    .rd-footer { background: #020a12; color: #475569; padding: 36px 24px; font-size: 13px; }
    .rd-footer a { color: #64748b; text-decoration: none; }
    .rd-footer a:hover { color: #f1f5f9; }
    .rd-footer-grid { display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; max-width: 1100px; margin: 0 auto 24px; }
    .rd-footer-col h6 { color: #f1f5f9; font-weight: 700; font-size: 13px; margin-bottom: 12px; letter-spacing: .05em; text-transform: uppercase; }
    .rd-footer-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .rd-footer-bottom { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; max-width: 1100px; margin: 0 auto; color: #334155; font-size: 12px; }

    @media (max-width: 640px) {
      .rd-products { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <jsp:include page="header.jsp" />

  <%-- ══ HERO ══════════════════════════════════════════════════════════════ --%>
  <section class="rd-hero">
    <div class="rd-hero-eyebrow">🇮🇳 AI-powered learning for Indian students</div>
    <h1>Learn Smarter.<br><span>Achieve More.</span></h1>
    <p>Specialist AI tutors, adaptive career discovery, and on-demand mentors — all built for the Indian curriculum and exam system.</p>
    <div class="rd-hero-badges">
      <span class="rd-hero-badge">CBSE &amp; NCERT aligned</span>
      <span class="rd-hero-badge">Indian English voice</span>
      <span class="rd-hero-badge">Works on any phone</span>
      <span class="rd-hero-badge">No annual renewals</span>
    </div>
  </section>

  <%-- ══ PRODUCTS ══════════════════════════════════════════════════════════ --%>
  <section class="rd-section" style="background:#f8fafc;">
    <div style="max-width:1100px; margin:0 auto;">
      <p class="rd-section-title text-center">Our Products</p>
      <p class="rd-section-sub text-center">Three ways we help your child succeed — pick what fits your goal right now.</p>

      <div class="rd-products">

        <%-- MindSutra --%>
        <div class="rd-product-card card-mindsutra">
          <span class="rd-live-badge">● Live</span>
          <div class="d-flex align-items-center gap-3">
            <div class="card-icon">🧮</div>
            <div>
              <div class="card-title">MindSutra</div>
              <div class="card-tag">Vedic Maths AI Tutor · Grade 4–8</div>
            </div>
          </div>
          <p class="card-desc">An AI tutor that teaches Vedic Maths interactively. It detects when your child is stuck, re-explains in a different way, and adapts to their learning speed. Available 24/7 on any phone.</p>
          <div class="card-chips">
            <span class="card-chip">CBSE Grade 4–8</span>
            <span class="card-chip">8 chapters/grade</span>
            <span class="card-chip">Parent dashboard</span>
            <span class="card-chip">₹1,499 lifetime</span>
          </div>
          <a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-5" class="card-cta">Explore MindSutra →</a>
          <div class="card-sublinks">
            <a href="${pageContext.request.contextPath}/robodynamics/ai-tutor/demo?grade=5&chapter=VM_G5_L1_NIKHILAM_NEAR100&fresh=1" class="card-sublink" style="color:#2563eb;">▶ Free demo (no login)</a>
            <a href="${pageContext.request.contextPath}/robodynamics/mindsutra" class="card-sublink" style="color:#94a3b8;">All grades →</a>
          </div>
        </div>

        <%-- AptiPath360 --%>
        <div class="rd-product-card card-aptipath" id="aptipath">
          <span class="rd-live-badge">● Live</span>
          <div class="d-flex align-items-center gap-3">
            <div class="card-icon">🧭</div>
            <div>
              <div class="card-title">AptiPath360</div>
              <div class="card-tag">Career Discovery · Grade 8 to College</div>
            </div>
          </div>
          <p class="card-desc">Adaptive career discovery that maps your child's aptitude, interests, and learning style to the right career path. 46–72 intelligent questions. Output: Career Horizon Map + Action Roadmap.</p>
          <div class="card-chips">
            <span class="card-chip">Grade 8–12 &amp; College</span>
            <span class="card-chip">46–72 questions</span>
            <span class="card-chip">Career Horizon Map</span>
            <span class="card-chip">₹799 + GST</span>
          </div>
          <a href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic" class="card-cta">Start Career Discovery →</a>
          <div class="card-sublinks">
            <a href="${pageContext.request.contextPath}/home" class="card-sublink" style="color:#16a34a;">View sample report</a>
            <a href="${pageContext.request.contextPath}/resources/manuals/AptiPath_Basic_Parent_Flow_Manual.html" target="_blank" class="card-sublink" style="color:#94a3b8;">Parent guide →</a>
          </div>
        </div>

        <%-- Tuition on Demand --%>
        <div class="rd-product-card card-tuition">
          <span class="rd-live-badge">● Live</span>
          <div class="d-flex align-items-center gap-3">
            <div class="card-icon">🧑‍🏫</div>
            <div>
              <div class="card-title">Tuition on Demand</div>
              <div class="card-tag">Live Mentor Booking · All Subjects</div>
            </div>
          </div>
          <p class="card-desc">Book verified mentors for any subject within hours. Progress trackers, session recordings, and parent check-ins included. Maths, Science, Coding, Robotics, Olympiad prep.</p>
          <div class="card-chips">
            <span class="card-chip">All subjects</span>
            <span class="card-chip">Verified mentors</span>
            <span class="card-chip">Progress tracking</span>
            <span class="card-chip">Flexible schedule</span>
          </div>
          <a href="${pageContext.request.contextPath}/tuition-on-demand" class="card-cta">Book a Mentor →</a>
          <div class="card-sublinks">
            <a href="${pageContext.request.contextPath}/parents/demo?source=home_tuition_card" class="card-sublink" style="color:#ea580c;">Request free demo</a>
            <a href="${pageContext.request.contextPath}/mentors" class="card-sublink" style="color:#94a3b8;">Browse mentors →</a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <%-- ══ HOW IT WORKS ══════════════════════════════════════════════════════ --%>
  <section class="rd-section" style="background:#fff; border-top: 1px solid #e2e8f0;">
    <div style="max-width:1100px; margin:0 auto;">
      <p class="rd-section-title text-center">How it works</p>
      <p class="rd-section-sub text-center">From first visit to measurable results in 3 simple steps.</p>
      <div class="rd-steps">
        <div class="rd-step">
          <div class="rd-step-num">STEP 01</div>
          <div style="font-size:26px; margin-bottom:10px;">🎯</div>
          <h6>Pick your goal</h6>
          <p>Improve Maths marks → MindSutra. Find the right career → AptiPath360. Need a tutor fast → Tuition on Demand.</p>
        </div>
        <div class="rd-step">
          <div class="rd-step-num">STEP 02</div>
          <div style="font-size:26px; margin-bottom:10px;">▶️</div>
          <h6>Try free — no login needed</h6>
          <p>Every product has a free demo. See the AI tutor in action, take a sample assessment, or meet a mentor before committing.</p>
        </div>
        <div class="rd-step">
          <div class="rd-step-num">STEP 03</div>
          <div style="font-size:26px; margin-bottom:10px;">📈</div>
          <h6>Track progress, see results</h6>
          <p>Every session is tracked. Parents get dashboards showing XP, accuracy, completion, and weak areas — updated in real time.</p>
        </div>
      </div>
    </div>
  </section>

  <%-- ══ FEATURED MENTORS ══════════════════════════════════════════════════ --%>
  <c:if test="${not empty featuredTeachers}">
  <section class="rd-section" style="background:#f8fafc; border-top: 1px solid #e2e8f0;">
    <div style="max-width:1100px; margin:0 auto;">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <p class="rd-section-title mb-0">🌟 Our Mentors</p>
        <a href="${pageContext.request.contextPath}/mentors" style="color:#2563eb; font-weight:600; font-size:14px;">See all →</a>
      </div>
      <p class="rd-section-sub">Verified teachers for live tuition sessions, Olympiad prep, and coding.</p>
      <div class="rd-mentor-grid">
        <c:forEach var="m" items="${featuredTeachers}">
          <div class="rd-mentor-card">
            <c:choose>
              <c:when test="${not empty m.photoUrl}">
                <c:choose>
                  <c:when test="${fn:startsWith(m.photoUrl,'http')}">
                    <img class="rd-mentor-avatar mx-auto d-block" src="${m.photoUrl}" alt="${m.name}">
                  </c:when>
                  <c:otherwise>
                    <img class="rd-mentor-avatar mx-auto d-block" src="${pageContext.request.contextPath}${m.photoUrl}" alt="${m.name}">
                  </c:otherwise>
                </c:choose>
              </c:when>
              <c:otherwise>
                <div class="rd-mentor-avatar mx-auto d-flex align-items-center justify-content-center" style="background:#e2e8f0; font-size:24px;">👤</div>
              </c:otherwise>
            </c:choose>
            <div class="rd-mentor-name">${m.name}</div>
            <div class="rd-mentor-exp">${m.expertise}</div>
            <a href="${pageContext.request.contextPath}/teacher/${m.id}" class="btn btn-outline-primary btn-sm w-100 mt-2" style="font-size:12px;">View Profile</a>
          </div>
        </c:forEach>
      </div>
    </div>
  </section>
  </c:if>

  <%-- ══ TRUST STRIP ═══════════════════════════════════════════════════════ --%>
  <div class="rd-trust">
    <div class="rd-trust-grid">
      <div class="rd-trust-item"><span class="rd-trust-num">5,000+</span><span class="rd-trust-label">Students learning</span></div>
      <div class="rd-trust-item"><span class="rd-trust-num">16</span><span class="rd-trust-label">Vedic Maths chapters</span></div>
      <div class="rd-trust-item"><span class="rd-trust-num">G4–G8</span><span class="rd-trust-label">CBSE grades covered</span></div>
      <div class="rd-trust-item"><span class="rd-trust-num">₹1,499</span><span class="rd-trust-label">Once. No renewals.</span></div>
      <div class="rd-trust-item"><span class="rd-trust-num">30-day</span><span class="rd-trust-label">Money-back guarantee</span></div>
    </div>
  </div>

  <%-- ══ FOOTER ══════════════════════════════════════════════════════════════ --%>
  <footer class="rd-footer">
    <div class="rd-footer-grid">
      <div class="rd-footer-col">
        <h6>RoboDynamics</h6>
        <ul>
          <li><a href="${pageContext.request.contextPath}/about">About us</a></li>
          <li><a href="${pageContext.request.contextPath}/contact-us">Contact</a></li>
          <li><a href="${pageContext.request.contextPath}/login">Login</a></li>
          <li><a href="${pageContext.request.contextPath}/registerParentChild">Sign Up</a></li>
        </ul>
      </div>
      <div class="rd-footer-col">
        <h6>MindSutra — Vedic Maths</h6>
        <ul>
          <li><a href="${pageContext.request.contextPath}/robodynamics/mindsutra">Product overview</a></li>
          <li><a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-4">Grade 4</a></li>
          <li><a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-5">Grade 5</a></li>
          <li><a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-6">Grade 6</a></li>
          <li><a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-7">Grade 7</a></li>
          <li><a href="${pageContext.request.contextPath}/robodynamics/vedic-math/grade-8">Grade 8</a></li>
        </ul>
      </div>
      <div class="rd-footer-col">
        <h6>AptiPath360</h6>
        <ul>
          <li><a href="${pageContext.request.contextPath}/#aptipath">Career Discovery</a></li>
          <li><a href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic">Start ₹799</a></li>
          <li><a href="${pageContext.request.contextPath}/resources/manuals/AptiPath_Basic_Parent_Flow_Manual.html" target="_blank">Parent guide</a></li>
        </ul>
      </div>
      <div class="rd-footer-col">
        <h6>Tuition on Demand</h6>
        <ul>
          <li><a href="${pageContext.request.contextPath}/tuition-on-demand">How it works</a></li>
          <li><a href="${pageContext.request.contextPath}/mentors">Browse mentors</a></li>
          <li><a href="${pageContext.request.contextPath}/parents/demo?source=footer">Request demo</a></li>
        </ul>
      </div>
      <div class="rd-footer-col">
        <h6>Legal</h6>
        <ul>
          <li><a href="${pageContext.request.contextPath}/privacy-policy">Privacy Policy</a></li>
          <li><a href="${pageContext.request.contextPath}/terms">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>
    <div class="rd-footer-bottom">
      © 2026 RoboDynamics Pvt Ltd · Bengaluru, India ·
      <a href="mailto:hello@robodynamics.in">hello@robodynamics.in</a>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
