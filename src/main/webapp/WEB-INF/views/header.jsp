<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/chat.css">

<style>
  .rd-nav {
    background: rgba(255,255,255,.96);
    border-bottom: 1px solid #e8edf2;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
    backdrop-filter: blur(10px);
  }
  .rd-logo { max-height: 42px; width: auto; }
  .rd-brand-name { font-size: 17px; font-weight: 900; color: #0f172a; letter-spacing: -0.3px; line-height: 1.1; }
  .rd-brand-sub  { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
  .rd-nav .nav-link { color: #334155; font-weight: 700; font-size: 14px; padding: 6px 10px; border-radius: 8px; transition: background .15s, color .15s; }
  .rd-nav .nav-link:hover { background: #f8fafc; color: #0f172a; }
  .rd-nav .nav-link.product-link { display: inline-flex; align-items: center; gap: 6px; }
  .rd-nav .nav-link.product-link.coming { color: #64748b; }
  .rd-mini-badge {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; border-radius: 999px; padding: 1px 7px;
    letter-spacing: .03em; text-transform: uppercase;
  }
  .badge-live { background: #dcfce7; color: #15803d; }
  .badge-soon { background: #f1f5f9; color: #64748b; }
</style>

<nav class="navbar navbar-expand-lg sticky-top rd-nav">
  <div class="container">

    <a class="navbar-brand d-flex align-items-center gap-2" href="${pageContext.request.contextPath}/" aria-label="RoboDynamics home">
      <img src="${pageContext.request.contextPath}/images/logo.jpg"
           alt="RoboDynamics" class="rd-logo"
           onerror="this.style.display='none'"/>
      <div>
        <div class="rd-brand-name">RoboDynamics</div>
        <div class="rd-brand-sub">Product-first learning platform</div>
      </div>
    </a>

    <button class="navbar-toggler border-0" type="button"
            data-bs-toggle="collapse" data-bs-target="#rdNav"
            aria-controls="rdNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="rdNav">
      <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-1">
        <li class="nav-item">
          <a class="nav-link" href="${pageContext.request.contextPath}/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link product-link" href="${pageContext.request.contextPath}/aptipath360">
            <span>🧭</span><span>AptiPath360</span>
            <span class="rd-mini-badge badge-live">Live</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link product-link" href="${pageContext.request.contextPath}/mindsutra">
            <span>🧮</span><span>MindSutra</span>
            <span class="rd-mini-badge badge-live">Live</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link product-link coming" href="${pageContext.request.contextPath}/#mindspark">
            <span>🧠</span><span>MindSpark</span>
            <span class="rd-mini-badge badge-soon">Soon</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link product-link coming" href="${pageContext.request.contextPath}/#moneymind">
            <span>💰</span><span>MoneyMind</span>
            <span class="rd-mini-badge badge-soon">Soon</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${pageContext.request.contextPath}/contact-us">Contact</a>
        </li>
      </ul>

      <div class="d-flex gap-2 mt-2 mt-lg-0 ms-lg-3">
        <c:choose>
          <c:when test="${empty sessionScope.rdUser}">
            <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/registerParentChild">Sign Up</a>
            <a class="btn btn-outline-secondary btn-sm" href="${pageContext.request.contextPath}/login">Sign In</a>
          </c:when>
          <c:otherwise>
            <c:choose>
              <c:when test="${sessionScope.rdUser.profile_id == 1 or sessionScope.rdUser.profile_id == 2}">
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/home">Admin</a>
              </c:when>
              <c:when test="${sessionScope.rdUser.profile_id == 3}">
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/mentor/dashboard">Mentor Dashboard</a>
              </c:when>
              <c:when test="${sessionScope.rdUser.profile_id == 4}">
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/platform/modules">My Dashboard</a>
              </c:when>
              <c:when test="${sessionScope.rdUser.profile_id == 5}">
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/studentDashboard">My Dashboard</a>
              </c:when>
              <c:otherwise>
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/home">Dashboard</a>
              </c:otherwise>
            </c:choose>
            <a class="btn btn-outline-danger btn-sm" href="${pageContext.request.contextPath}/logout">Log Out</a>
          </c:otherwise>
        </c:choose>
      </div>
    </div>
  </div>
</nav>
