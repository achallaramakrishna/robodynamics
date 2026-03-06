<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/chat.css">

<c:set var="rdCtx" value="${pageContext.request.contextPath}" />
<c:set var="rdUri" value="${pageContext.request.requestURI}" />
<c:set var="rdIsBrandHome"
       value="${rdUri == rdCtx or rdUri == '/' or fn:endsWith(rdUri, '/public/home')}" />

<style>
  .rd-nav {
    border-bottom: 1px solid #dbe7df;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(6px);
  }

  .rd-logo {
    max-height: 46px;
    width: auto;
  }

  .rd-brand-text {
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #0f2d21;
  }

  .rd-sub-text {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #4a6358;
    margin-top: -2px;
  }

  .rd-nav .nav-link {
    color: #244336;
    font-weight: 700;
  }

  .rd-nav .nav-link:hover {
    color: #0f766e;
  }

  .rd-nav .btn {
    white-space: nowrap;
  }

  .rd-pill {
    border: 1px solid #cde8dc;
    background: #ecfdf5;
    color: #065f46;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 9px;
    margin-left: 8px;
  }
</style>

<nav class="navbar navbar-expand-lg sticky-top rd-nav">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="${pageContext.request.contextPath}/" aria-label="Robo Dynamics home">
      <img src="${pageContext.request.contextPath}/images/logo.jpg"
           alt="Robo Dynamics"
           class="me-2 rd-logo"
           onerror="this.onerror=null; this.replaceWith(document.createTextNode('Robo Dynamics'));"/>
      <div>
        <span class="rd-brand-text">
          <c:choose>
            <c:when test="${rdIsBrandHome}">AptiPath360 Career Discovery</c:when>
            <c:otherwise>Robo Dynamics</c:otherwise>
          </c:choose>
        </span>
        <span class="rd-sub-text">
          <c:choose>
            <c:when test="${rdIsBrandHome}">Grade 8 to College discovery flow</c:when>
            <c:otherwise>Learning platform</c:otherwise>
          </c:choose>
        </span>
      </div>
      <c:if test="${rdIsBrandHome}">
        <span class="rd-pill">Start Discovery Flow</span>
      </c:if>
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#rdNav"
            aria-controls="rdNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="rdNav">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">

        <c:choose>
          <c:when test="${rdIsBrandHome}">
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/#career-discover">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/#career-discover">AptiPath360</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/#exam-courses">ExamPrep360</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/#tuition-info">Tuition on Demand</a></li>
            <li class="nav-item">
              <a class="nav-link" href="${pageContext.request.contextPath}/resources/manuals/AptiPath_Basic_Parent_Flow_Manual.html" target="_blank">Manual</a>
            </li>
          </c:when>
          <c:otherwise>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/">AptiPath360</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/exam-prep">ExamPrep360</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/tuition-on-demand">Tuition on Demand</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/about">About</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/contact-us">Contact</a></li>
          </c:otherwise>
        </c:choose>

        <li class="nav-item d-flex gap-2 ms-lg-3 mt-2 mt-lg-0">
          <c:choose>
            <c:when test="${empty sessionScope.rdUser}">
              <a class="btn btn-success btn-sm" href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic">Pay &#8377;799 + GST</a>
              <a class="btn btn-outline-dark btn-sm" href="${pageContext.request.contextPath}/registerParentChild">Parent Sign Up</a>
              <a class="btn btn-outline-primary btn-sm" href="${pageContext.request.contextPath}/login">Sign In</a>
            </c:when>
            <c:otherwise>
              <c:choose>
                <c:when test="${sessionScope.rdUser.profile_id == 1 or sessionScope.rdUser.profile_id == 2}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/home">Admin Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 3}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/mentor/dashboard">Mentor Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 4}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/platform/modules">Parent Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 5}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/studentDashboard">Student Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 7}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/company-admin/dashboard">Company Admin</a>
                </c:when>
                <c:otherwise>
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/home">Dashboard</a>
                </c:otherwise>
              </c:choose>
              <a class="btn btn-outline-danger btn-sm" href="${pageContext.request.contextPath}/logout">Log Out</a>
            </c:otherwise>
          </c:choose>
        </li>
      </ul>
    </div>
  </div>
</nav>

<c:if test="${rdIsBrandHome}">
  <div class="container">
    <div class="header-modules">
      <article class="header-module career">
        <div class="module-icon">🧭</div>
        <p><strong>AptiPath360 Career Discovery</strong></p>
        <p>Adaptive discovery for Grade 8 to College/Post-12.</p>
        <a class="btn btn-sm btn-success" href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic">Pay &#8377;799 + GST</a>
      </article>
      <article class="header-module exam">
        <div class="module-icon">📘</div>
        <p><strong>ExamPrep360</strong></p>
        <p>Final-exam paper generation with answer keys and model answers.</p>
        <a class="btn btn-sm btn-outline-success" href="${pageContext.request.contextPath}/plans/checkout?plan=exam-basic">Start Rs 1999</a>
      </article>
      <article class="header-module tuition">
        <div class="module-icon">🧑‍🏫</div>
        <p><strong>Tuition on Demand</strong></p>
        <p>Rapid mentor booking, progress trackers, and check-ins.</p>
        <a class="btn btn-sm btn-outline-warning" href="${pageContext.request.contextPath}/parents/demo?source=header_tuition_card">Request quote</a>
      </article>
    </div>
  </div>
</c:if>

<style>
  .header-modules {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem 0 1.2rem;
  }

  .header-module {
    border-radius: 18px;
    border: 1px solid rgba(15, 118, 110, 0.4);
    background: rgba(15, 118, 110, 0.08);
    padding: 1rem;
    color: #fff;
  }

  .header-module.career {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(14, 165, 233, 0.08));
  }

  .header-module.exam {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.25), rgba(79, 70, 229, 0.08));
  }

  .header-module.tuition {
    background: linear-gradient(135deg, rgba(251, 113, 133, 0.25), rgba(251, 113, 133, 0.08));
  }

  .header-module .module-icon {
    font-size: 1.6rem;
  }

  .header-module p {
    margin: 0.2rem 0;
    color: #f8fafc;
  }

  .header-module a.btn {
    margin-top: 0.4rem;
  }
</style>
