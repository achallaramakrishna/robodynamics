<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Robo Dynamics | Parent Learning Pathways</title>
<meta name="description" content="Parent-first learning pathways with structured assessment, mentor guidance, and transparent progress tracking for Career Discovery and Exam Prep."/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --rd-bg: #f6f8f4;
    --rd-ink: #13261d;
    --rd-muted: #5c7168;
    --rd-primary: #0f766e;
    --rd-primary-dark: #0b5f58;
    --rd-accent: #f97316;
    --rd-card: #ffffff;
    --rd-border: #d7e2db;
    --rd-soft-orange: #fff7ed;
    --rd-soft-green: #ecfdf5;
  }

  body {
    background: radial-gradient(circle at 8% 10%, #e8f7ed 0%, transparent 36%),
                radial-gradient(circle at 92% 6%, #ffe8d1 0%, transparent 30%),
                var(--rd-bg);
    color: var(--rd-ink);
    font-family: "Manrope", "Segoe UI", sans-serif;
  }

  h1, h2, h3 {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
    letter-spacing: -0.02em;
  }

  .hero {
    padding: clamp(2.2rem, 4vw, 3.8rem) 0 1.8rem;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: 1rem;
  }

  .hero-main,
  .hero-side {
    border: 1px solid var(--rd-border);
    border-radius: 24px;
    background: var(--rd-card);
    box-shadow: 0 14px 30px rgba(15, 118, 110, 0.09);
  }

  .hero-main {
    padding: clamp(1.5rem, 3.5vw, 2.6rem);
  }

  .hero-side {
    padding: 1.35rem;
    background: linear-gradient(170deg, #ffffff 0%, #effcf5 100%);
  }

  .tag {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: #dcfce7;
    color: #166534;
    text-transform: uppercase;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    padding: 0.35rem 0.7rem;
    margin-bottom: 0.8rem;
  }

  .hero-main h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 0.75rem;
  }

  .hero-main p {
    color: var(--rd-muted);
    max-width: 62ch;
    margin-bottom: 1rem;
  }

  .hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .btn-main,
  .btn-alt,
  .btn-ghost {
    border: 0;
    border-radius: 12px;
    padding: 0.75rem 0.95rem;
    text-decoration: none;
    font-weight: 800;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .btn-main {
    color: #fff;
    background: linear-gradient(130deg, var(--rd-primary), var(--rd-primary-dark));
  }

  .btn-main:hover {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 11px 22px rgba(15, 118, 110, 0.22);
  }

  .btn-alt {
    color: #7c2d12;
    border: 1px solid #fed7aa;
    background: var(--rd-soft-orange);
  }

  .btn-alt:hover {
    color: #7c2d12;
    background: #ffedd5;
  }

  .btn-ghost {
    color: #0b5f58;
    border: 1px solid #a7f3d0;
    background: var(--rd-soft-green);
  }

  .btn-ghost:hover {
    color: #0b5f58;
    background: #dcfce7;
  }

  .hero-stats {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.6rem;
  }

  .stat {
    border: 1px solid #e2ece5;
    border-radius: 12px;
    background: #f9fefb;
    padding: 0.65rem;
  }

  .stat strong {
    display: block;
    font-size: 1.04rem;
  }

  .stat span {
    font-size: 0.8rem;
    color: var(--rd-muted);
  }

  .mini-title {
    margin-bottom: 0.6rem;
    font-size: 1.02rem;
  }

  .flow-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .flow-list li {
    border: 1px solid #d4eee2;
    border-radius: 12px;
    background: #fff;
    padding: 0.7rem;
    margin-bottom: 0.55rem;
  }

  .flow-list strong {
    display: block;
    font-size: 0.92rem;
  }

  .section {
    padding: 0.45rem 0 2rem;
  }

  .section-head {
    margin-bottom: 0.95rem;
  }

  .section-head p {
    color: var(--rd-muted);
    margin: 0;
  }

  .track-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    gap: 0.95rem;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .plan-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--rd-border);
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 10px 24px rgba(7, 28, 19, 0.07);
    padding: 1.15rem;
  }

  .plan-card::after {
    content: "";
    position: absolute;
    right: -52px;
    bottom: -62px;
    width: 190px;
    height: 190px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(15, 118, 110, 0.14), rgba(15, 118, 110, 0));
    pointer-events: none;
  }

  .plan-badge {
    display: inline-block;
    border-radius: 999px;
    padding: 0.28rem 0.62rem;
    font-size: 0.74rem;
    font-weight: 800;
    margin-bottom: 0.55rem;
  }

  .plan-career .plan-badge {
    background: #ede9fe;
    color: #5b21b6;
  }

  .plan-exam .plan-badge {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .plan-tuition .plan-badge {
    background: #dcfce7;
    color: #166534;
  }

  .plan-title {
    margin: 0;
    font-size: 1.28rem;
  }

  .plan-price {
    font-size: 1.62rem;
    font-weight: 800;
    margin: 0.45rem 0 0.75rem;
  }

  .plan-price span {
    font-size: 0.82rem;
    color: var(--rd-muted);
    font-weight: 700;
  }

  .tax-line {
    margin: -0.3rem 0 0.75rem;
    font-size: 0.83rem;
    color: #4b665b;
    font-weight: 700;
  }

  .features {
    margin: 0 0 0.9rem;
    padding-left: 1rem;
    color: #1c3a2c;
  }

  .features li {
    margin-bottom: 0.4rem;
  }

  .plan-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .side-note {
    border: 1px dashed #c6d8ce;
    border-radius: 16px;
    background: #fcfefc;
    padding: 1rem;
  }

  .side-note h3 {
    font-size: 1.02rem;
    margin-bottom: 0.5rem;
  }

  .side-note p,
  .side-note li {
    color: #415b50;
    font-size: 0.92rem;
  }

  .phase2 {
    border: 1px solid #fed7aa;
    border-radius: 18px;
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
    padding: 1.1rem;
    margin-bottom: 2rem;
  }

  .phase2 p {
    color: #7c2d12;
    margin-bottom: 0.8rem;
  }

  .doubt-zone {
    border: 1px solid #bbf7d0;
    border-radius: 18px;
    background: linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%);
    padding: 1.1rem;
    margin-bottom: 2rem;
  }

  .doubt-zone p {
    color: #14532d;
    margin-bottom: 0.8rem;
  }

  .chip-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.42rem;
    margin-top: 0.35rem;
  }

  .chip {
    border: 1px solid #cbe2d6;
    border-radius: 999px;
    background: #f4fbf7;
    padding: 0.28rem 0.62rem;
    font-size: 0.77rem;
    font-weight: 700;
    color: #214033;
  }

  .exam-catalog {
    margin-bottom: 1rem;
  }

  .exam-catalog h3 {
    font-size: 1.08rem;
    margin-bottom: 0.65rem;
  }

  .udemy-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.9rem;
    margin-bottom: 1.1rem;
  }

  .course-card {
    border: 1px solid #dce8e1;
    border-radius: 16px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(7, 28, 19, 0.07);
    display: flex;
    flex-direction: column;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px rgba(7, 28, 19, 0.12);
  }

  .course-thumb {
    width: 100%;
    height: 148px;
    object-fit: cover;
    background: #ecf2ee;
  }

  .course-body {
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.42rem;
    height: 100%;
  }

  .course-title {
    font-size: 0.95rem;
    line-height: 1.35;
    font-weight: 800;
    min-height: 2.5rem;
    margin: 0;
  }

  .course-instructor {
    color: #3f5a4f;
    font-size: 0.82rem;
  }

  .course-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    color: #5c7168;
    font-size: 0.78rem;
  }

  .course-price {
    font-size: 0.96rem;
    font-weight: 800;
    color: #13261d;
  }

  .course-actions {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .btn-mini {
    padding: 0.48rem 0.64rem;
    font-size: 0.78rem;
    border-radius: 10px;
  }

  .mobile-cta {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 12px;
    width: min(94vw, 520px);
    z-index: 1100;
    display: none;
  }

  .mobile-cta a {
    display: block;
    text-align: center;
    border-radius: 14px;
    padding: 0.82rem 0.9rem;
    text-decoration: none;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(130deg, var(--rd-primary), var(--rd-primary-dark));
    box-shadow: 0 14px 24px rgba(15, 118, 110, 0.23);
  }

  @media (max-width: 991px) {
    .hero-grid,
    .track-layout,
    .plans-grid {
      grid-template-columns: 1fr;
    }

    .udemy-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .hero-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mobile-cta {
      display: block;
    }
  }

  @media (max-width: 1199px) and (min-width: 992px) {
    .udemy-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
</head>
<body>

<jsp:include page="header.jsp"/>

<main class="container">
  <section class="hero">
    <div class="hero-grid">
      <div class="hero-main">
        <span class="tag">Parent-first learning</span>
        <h1>Structured learning pathways for your child</h1>
        <p>
          Families can choose between <strong>Career Discovery</strong> and <strong>Next Exam Prep</strong>.
          Each pathway follows a clear pedagogy: baseline assessment, guided practice, mentor feedback, and parent review.
        </p>
        <div class="hero-buttons">
          <a class="btn-main" href="${pageContext.request.contextPath}/plans/checkout?plan=career-basic">
            Pay Now - Career Discovery Rs 299 + GST
          </a>
          <a class="btn-alt" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">
            Pay Now - Exam Prep Rs 999 + GST
          </a>
          <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=home_doubt_or_career_call">
            Book parent guidance call
          </a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>2 pathways</strong>
            <span>Career discovery + Exam prep</span>
          </div>
          <div class="stat">
            <strong>4 learning plans</strong>
            <span>Basic and Pro in each pathway</span>
          </div>
          <div class="stat">
            <strong>Evidence-based</strong>
            <span>Assessment reports with clear next steps</span>
          </div>
        </div>
      </div>

      <aside class="hero-side">
        <h2 class="mini-title">Learning process</h2>
        <ul class="flow-list">
          <li><strong>1. Identify need</strong>Choose Career Discovery or Next Exam Prep based on your child's current stage.</li>
          <li><strong>2. Select plan</strong>Basic for starter guidance, Pro for deeper mentoring and analysis.</li>
          <li><strong>3. Start learning</strong>Begin assessment, practice, and structured mentor review.</li>
        </ul>
      </aside>
    </div>
  </section>

  <section class="section" id="career-intelligence">
    <div class="section-head">
      <h2>Path 1: Career Discovery (Class 8 to 10)</h2>
      <p>
        For students who need clarity on strengths, academic direction, and long-term choices.
        The program combines assessment insights with practical guidance for both student and parent.
        Pricing below shows base + GST (18%).
      </p>
    </div>

    <div class="track-layout">
      <div class="plans-grid">
        <article class="plan-card plan-career">
          <span class="plan-badge">Foundation assessment</span>
          <h3 class="plan-title">Career Discovery Basic</h3>
          <div class="plan-price">Rs 299 <span>/ one-time</span></div>
          <p class="tax-line">GST Rs 54 | Total Rs 353</p>
          <ul class="features">
            <li>Career aptitude and interest assessment</li>
            <li>Concise report with key observations</li>
            <li>Strength and support-area snapshot</li>
            <li>Recommended next academic direction</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/plans/checkout?plan=career-basic">
              Pay Now - Rs 299 + GST
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=career_intelligence_basic">
              Talk to academic advisor
            </a>
          </div>
        </article>

        <article class="plan-card plan-career">
          <span class="plan-badge">Comprehensive guidance report</span>
          <h3 class="plan-title">Career Discovery Pro</h3>
          <div class="plan-price">Rs 999 <span>/ one-time</span></div>
          <p class="tax-line">GST Rs 180 | Total Rs 1179</p>
          <ul class="features">
            <li>Detailed assessment report with deeper analysis</li>
            <li>Subject-wise strengths and support needs</li>
            <li>Skill roadmap and study strategy</li>
            <li>Parent action summary with next steps</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/plans/checkout?plan=career-pro">
              Pay Now - Rs 999 + GST
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=career_intelligence_pro">
              Talk to academic advisor
            </a>
          </div>
        </article>
      </div>

      <aside class="side-note">
        <h3>Why parents choose this path</h3>
        <ul>
          <li>Structured starting point through guided assessment.</li>
          <li>Natural progression from Basic to Pro for deeper guidance.</li>
          <li>Clear report supports parent-child academic decisions.</li>
          <li>Creates strong foundation before exam prep or tuition.</li>
        </ul>
      </aside>
    </div>
  </section>

  <section class="phase2">
    <h2 class="h4">Career Discovery Phase 2 (Advanced Planning)</h2>
    <p>
      After the initial assessment, Phase 2 adds a full planning layer:
      state and national exam options, suitable college ranges by expected score,
      fee bands, last-year cutoff references, and education financing points.
    </p>
    <a class="btn-alt" href="${pageContext.request.contextPath}/parents/demo?source=career_phase2_consult">
      Book Phase 2 academic planning session
    </a>
  </section>

  <section class="section" id="exam-prep">
    <div class="section-head">
      <h2>Path 2: Next Exam Prep</h2>
      <p>
        Structured exam preparation with papers, quizzes, flashcards, and mentor-led doubt support.
        Designed to build consistency, revision discipline, and exam confidence.
        Pricing below shows base + GST (18%).
      </p>
    </div>

    <div class="exam-catalog">
      <h3>CBSE / ICSE Course Catalog</h3>
      <div class="udemy-grid">
        <c:choose>
          <c:when test="${not empty examPrepCourses}">
            <c:forEach var="course" items="${examPrepCourses}">
              <article class="course-card">
                <c:choose>
                  <c:when test="${not empty course.courseImageUrl}">
                    <c:choose>
                      <c:when test="${fn:startsWith(course.courseImageUrl, 'http')}">
                        <img class="course-thumb" src="${course.courseImageUrl}" alt="${course.courseName}"/>
                      </c:when>
                      <c:otherwise>
                        <img class="course-thumb" src="${pageContext.request.contextPath}${course.courseImageUrl}" alt="${course.courseName}"/>
                      </c:otherwise>
                    </c:choose>
                  </c:when>
                  <c:otherwise>
                    <img class="course-thumb" src="${pageContext.request.contextPath}/resources/images/tuition-maths.jpg" alt="${course.courseName}"/>
                  </c:otherwise>
                </c:choose>
                <div class="course-body">
                  <h4 class="course-title">${course.courseName}</h4>
                  <div class="course-instructor">
                    <c:choose>
                      <c:when test="${not empty course.courseInstructor}">By ${course.courseInstructor}</c:when>
                      <c:otherwise>By Robo Dynamics mentors</c:otherwise>
                    </c:choose>
                  </div>
                  <div class="course-meta">
                    <span>
                      <c:choose>
                        <c:when test="${not empty course.courseAgeGroup}">${course.courseAgeGroup}</c:when>
                        <c:otherwise>Grades 6-12</c:otherwise>
                      </c:choose>
                    </span>
                    <span>${course.reviewsCount} reviews</span>
                  </div>
                  <div class="course-price">
                    <c:choose>
                      <c:when test="${course.coursePrice ne null}">
                        Rs <fmt:formatNumber value="${course.coursePrice}" maxFractionDigits="0"/>
                      </c:when>
                      <c:otherwise>Contact for pricing</c:otherwise>
                    </c:choose>
                  </div>
                  <div class="course-actions">
                    <a class="btn-ghost btn-mini" href="${pageContext.request.contextPath}/course/details?courseId=${course.courseId}">
                      View Course
                    </a>
                    <c:choose>
                      <c:when test="${not empty course.registrationLink}">
                        <c:choose>
                          <c:when test="${fn:startsWith(course.registrationLink, 'http')}">
                            <a class="btn-main btn-mini" href="${course.registrationLink}">Pay Now</a>
                          </c:when>
                          <c:otherwise>
                            <a class="btn-main btn-mini" href="${pageContext.request.contextPath}${course.registrationLink}">Pay Now</a>
                          </c:otherwise>
                        </c:choose>
                      </c:when>
                      <c:otherwise>
                        <a class="btn-main btn-mini" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic&courseId=${course.courseId}&source=home_exam_course_${course.courseId}">
                          Pay Now
                        </a>
                      </c:otherwise>
                    </c:choose>
                  </div>
                </div>
              </article>
            </c:forEach>
          </c:when>
          <c:otherwise>
            <article class="course-card">
              <img class="course-thumb" src="${pageContext.request.contextPath}/resources/images/tuition-science.jpg" alt="CBSE and ICSE courses"/>
              <div class="course-body">
                <h4 class="course-title">CBSE / ICSE Exam Prep Courses</h4>
                <div class="course-instructor">A curated list from your course management panel will appear here.</div>
                <div class="course-actions">
                  <a class="btn-main btn-mini" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">Pay Now</a>
                </div>
              </div>
            </article>
          </c:otherwise>
        </c:choose>
      </div>
    </div>

    <div class="track-layout">
      <div class="plans-grid">
        <article class="plan-card plan-exam">
          <span class="plan-badge">Consistent foundation</span>
          <h3 class="plan-title">Next Exam Prep Basic</h3>
          <div class="plan-price">Rs 999 <span>/ month</span></div>
          <p class="tax-line">GST Rs 180 | Total Rs 1179</p>
          <ul class="features">
            <li>2 full exam papers each month</li>
            <li>50 revision flashcards</li>
            <li>4 chapter quizzes</li>
            <li>2 mentor doubt-clearing sessions</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">
              Pay Now - Rs 999 + GST
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=exam_prep_basic">
              Talk to subject mentor
            </a>
          </div>
        </article>

        <article class="plan-card plan-exam">
          <span class="plan-badge">Intensive preparation</span>
          <h3 class="plan-title">Next Exam Prep Pro</h3>
          <div class="plan-price">Rs 1799 <span>/ month</span></div>
          <p class="tax-line">GST Rs 324 | Total Rs 2123</p>
          <ul class="features">
            <li>6 full exam papers each month</li>
            <li>200 revision flashcards</li>
            <li>12 chapter quizzes</li>
            <li>6 mentor doubt-clearing sessions</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-pro">
              Pay Now - Rs 1799 + GST
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=exam_prep_pro">
              Talk to subject mentor
            </a>
          </div>
        </article>
      </div>

      <aside class="side-note">
        <h3>Tracks available</h3>
        <div class="chip-wrap">
          <c:choose>
            <c:when test="${not empty categories}">
              <c:forEach var="category" items="${categories}">
                <span class="chip">${category.courseCategoryName}</span>
              </c:forEach>
            </c:when>
            <c:otherwise>
              <span class="chip">School academics</span>
              <span class="chip">Coding foundation</span>
              <span class="chip">Olympiad prep</span>
              <span class="chip">NEET/JEE orientation</span>
            </c:otherwise>
          </c:choose>
        </div>
        <hr>
        <h3>Progression to next academic year</h3>
        <p>
          Students who complete Exam Prep can move into full Online Tuition for consistent year-long guidance.
        </p>
        <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=home_exam_to_tuition_quote">
          Get next-year tuition quote
        </a>
      </aside>
    </div>
  </section>

  <section class="section" id="tuition-upgrade">
    <div class="section-head">
      <h2>Online Tuition (Next Academic Year)</h2>
      <p>
        For students who need continuous live teaching, practice monitoring, and monthly academic review after Exam Prep.
        Tuition pricing varies by grade and subjects selected. Final quote is shared after counselling.
      </p>
    </div>

    <div class="track-layout">
      <div class="plans-grid">
        <article class="plan-card plan-tuition">
          <span class="plan-badge">For steady guidance</span>
          <h3 class="plan-title">Online Tuition Basic</h3>
          <div class="plan-price">Custom quote <span>/ month</span></div>
          <p class="tax-line">Pricing depends on grade, subject count, and class frequency.</p>
          <ul class="features">
            <li>Small-batch live classes</li>
            <li>Weekly homework and revision plan</li>
            <li>Mentor-led doubt support</li>
            <li>Monthly parent performance review</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=tuition_quote_basic">
              Get Price Quote
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=tuition_basic_home">
              Book parent counselling
            </a>
          </div>
        </article>

        <article class="plan-card plan-tuition">
          <span class="plan-badge">For higher support needs</span>
          <h3 class="plan-title">Online Tuition Pro</h3>
          <div class="plan-price">Custom quote <span>/ month</span></div>
          <p class="tax-line">Pricing depends on grade, subject count, and personalized support level.</p>
          <ul class="features">
            <li>Everything in Tuition Basic</li>
            <li>Higher intensity mentor support</li>
            <li>Weak-topic remediation plan</li>
            <li>Priority interventions and parent strategy calls</li>
          </ul>
          <div class="plan-actions">
            <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=tuition_quote_pro">
              Get Price Quote
            </a>
            <a class="btn-ghost" href="${pageContext.request.contextPath}/parents/demo?source=tuition_pro_home">
              Book parent counselling
            </a>
          </div>
        </article>
      </div>

      <aside class="side-note">
        <h3>Pedagogical framework</h3>
        <ul>
          <li>Career Discovery and Exam Prep provide diagnostic and revision foundation.</li>
          <li>Online Tuition adds ongoing teaching, practice, and correction cycle.</li>
          <li>Next-year planning starts early to avoid transition gaps.</li>
          <li>Parent counselling aligns home support with classroom goals.</li>
        </ul>
      </aside>
    </div>
  </section>

  <section class="doubt-zone">
    <h2 class="h4">Mentor doubt-clearing sessions are available as a focused support option</h2>
    <p>
      Parents can begin with mentor support to address immediate learning gaps.
      Based on the child's needs, the team then recommends Career Discovery or Next Exam Prep.
    </p>
    <a class="btn-main" href="${pageContext.request.contextPath}/parents/demo?source=doubt_session_home">
      Book doubt-clearing session
    </a>
  </section>
</main>

<div class="mobile-cta">
  <a href="${pageContext.request.contextPath}/plans/checkout?plan=career-basic">
    Pay Now - Career Discovery Basic Rs 299 + GST
  </a>
</div>

<jsp:include page="footer.jsp"/>

</body>
</html>
