<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>ExamPrep360 | Robodynamics</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --page-bg: #f1f8f1;
            --line: #c7dec8;
            --line-soft: #dceadb;
            --panel: #ffffff;
            --text: #123122;
            --muted: #486456;
            --brand: #1d7a47;
            --brand-deep: #155d35;
            --accent: #5aa56e;
            --shadow: 0 18px 36px rgba(17, 68, 38, 0.12);
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            color: var(--text);
            font-family: "Nunito", system-ui, -apple-system, Segoe UI, sans-serif;
            background:
                radial-gradient(1200px 420px at 10% -20%, rgba(90, 165, 110, 0.2), transparent 65%),
                radial-gradient(900px 320px at 90% 0%, rgba(29, 122, 71, 0.16), transparent 70%),
                var(--page-bg);
        }

        .page {
            width: min(1140px, 94vw);
            margin: 0 auto;
            padding: 1.6rem 0 3.2rem;
        }

        .hero {
            background: linear-gradient(180deg, #f4fbf5 0%, #edf7ed 100%);
            border: 1px solid var(--line);
            border-radius: 24px;
            box-shadow: var(--shadow);
            padding: clamp(1rem, 2.4vw, 1.8rem);
        }

        .tag {
            display: inline-flex;
            width: fit-content;
            font-size: 0.76rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-weight: 800;
            color: var(--brand-deep);
            border-radius: 999px;
            border: 1px solid #c5e3cb;
            background: #dff1e2;
            padding: 0.2rem 0.55rem;
            margin: 0 0 0.55rem;
        }

        h1, h2, h3 { font-family: "Outfit", sans-serif; margin: 0; }

        .hero h1 {
            font-size: clamp(1.8rem, 3.4vw, 2.8rem);
            color: #0f3925;
        }

        .hero p {
            margin: 0.6rem 0 0;
            max-width: 64ch;
            color: var(--muted);
            line-height: 1.5;
        }

        .cta-grid {
            margin-top: 1rem;
            display: grid;
            gap: 0.9rem;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .module-card {
            background: var(--panel);
            border: 1px solid var(--line-soft);
            border-radius: 18px;
            box-shadow: 0 10px 24px rgba(16, 64, 34, 0.08);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
        }

        .module-card h3 { color: #184b2d; }

        .module-card p {
            margin: 0;
            color: var(--muted);
            line-height: 1.45;
        }

        .btn {
            margin-top: auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: 800;
            border-radius: 999px;
            border: 1px solid transparent;
            padding: 0.72rem 1.2rem;
            font-size: 0.95rem;
            transition: transform 0.2s ease;
        }

        .btn:hover { transform: translateY(-1px); }

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

        .proof {
            margin-top: 1rem;
            display: grid;
            gap: 0.9rem;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .proof-card {
            background: var(--panel);
            border: 1px solid var(--line-soft);
            border-radius: 16px;
            padding: 0.95rem;
            box-shadow: 0 8px 20px rgba(16, 64, 34, 0.07);
        }

        .proof-card strong {
            display: block;
            color: #184b2d;
            margin-bottom: 0.35rem;
        }

        .proof-card p { margin: 0; color: var(--muted); }

        .proof-card small { color: #6b8575; font-weight: 700; }

        .iframe-card {
            margin-top: 1rem;
            background: var(--panel);
            border: 1px solid var(--line-soft);
            border-radius: 18px;
            box-shadow: 0 8px 20px rgba(16, 64, 34, 0.07);
            padding: 1rem;
        }

        .iframe-card h3 {
            color: #184b2d;
            margin: 0 0 0.65rem;
        }

        .iframe-card iframe {
            width: 100%;
            height: 350px;
            border: 0;
            border-radius: 14px;
        }
    </style>
</head>
<body>
<jsp:include page="header.jsp"/>
<c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
<c:set var="isParentOrAdmin" value="${pid == 4 or pid == 1 or pid == 2}" />
<main class="page">
    <section class="hero">
        <p class="tag">Exam Prep</p>
        <h1>ExamPrep360 for final exam readiness in the next 2 weeks.</h1>
        <p>
            After the AptiPath assessment, families need a clear exam execution plan. This module turns your child's
            strengths and gaps into weekly mocks, mentor checkpoints, and steady subject confidence.
        </p>
    </section>

    <div class="cta-grid">
        <article class="module-card">
            <h3>Focused mock tests</h3>
            <p>CBSE, ICSE, and state-board aligned papers with review loops based on student performance trends.</p>
            <p><strong>ExamPrep360 Basic: Rs 1999</strong> (one-time).</p>
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">Start Basic Plan - Rs 1999</a>
            <c:if test="${isParentOrAdmin}">
                <a class="btn btn-secondary" href="${pageContext.request.contextPath}/exam-prep/create" style="margin-top:8px;">Create Exam Paper</a>
            </c:if>
        </article>
        <article class="module-card">
            <h3>Mentor-led doubt clearing</h3>
            <p>Short, high-impact sessions mapped to weak areas so preparation stays practical and measurable.</p>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/parents/demo?source=exam_prep_intro">Book Demo</a>
        </article>
    </div>

    <div class="proof">
        <div class="proof-card">
            <strong>Parent Confidence</strong>
            <p>Parents can track whether exam effort is aligned with long-term career direction.</p>
            <small>Clear weekly progress view</small>
        </div>
        <div class="proof-card">
            <strong>Exam Toolkit</strong>
            <p>Practice outcomes feed into AptiPath readiness indicators for smarter planning.</p>
            <small>Updated every 24 hours</small>
        </div>
    </div>

    <div class="iframe-card">
        <h3>See our Google rating</h3>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.446329370949!2d77.76021937324963!3d12.878996687427875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae7309ba85df81%3A0x79e9e7ac13776a2f!2sRobo%20Dynamics!5e0!3m2!1sen!2sin!4v1772063673305!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
</main>
<jsp:include page="footer.jsp"/>
</body>
</html>
