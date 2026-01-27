<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>

<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top" style="z-index:1030;">
  <style>
    .rd-logo { max-height:50px; height:auto; }
    .navbar-nav.gap-2 > li { display:flex; align-items:center; }
    .nav-item .btn { white-space:nowrap; }
    .nav-cta { display:flex; align-items:center; gap:0.5rem; flex-wrap:nowrap; }
    @media (max-width: 991px){
      .nav-cta { flex-wrap:wrap; }
      .nav-cta .btn { width:100%; margin-bottom:0.4rem; }
    }
    .rd-mega{min-width:980px; border:0; border-radius:16px; box-shadow:0 16px 48px rgba(0,0,0,.12);}
    @media (max-width:991px){.rd-mega{min-width:100%;}}
    .rd-mega .rd-card{border:0;border-radius:14px;overflow:hidden;background:#fff;
      box-shadow:0 8px 24px rgba(0,0,0,.08);
      transition:transform .18s ease, box-shadow .18s ease;}
    .rd-mega .rd-card:hover{transform:translateY(-3px);
      box-shadow:0 12px 34px rgba(0,0,0,.12);}
    .rd-mega .rd-thumb{position:relative;aspect-ratio:16/9;background:#f3f5f8;overflow:hidden;}
    .rd-mega .rd-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
    .rd-mega .rd-thumb::after{content:"";position:absolute;inset:0;
      background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.18));}
    .rd-mega .rd-body{padding:12px 14px 14px;}
    .rd-mega .rd-kicker{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#6c757d;margin-bottom:4px;}
    .rd-mega .rd-title{font-weight:700;margin:0 0 4px;color:#1f2937;}
    .rd-mega .dropdown-item{border-radius:8px;padding:.4rem .6rem;}
    .rd-mega .dropdown-item:hover{background:rgba(0,0,0,.05);}
    @media (min-width:992px){.navbar .dropdown:hover>.dropdown-menu{display:block;}}
  </style>

  <div class="container">
    <!-- Logo -->
    <a class="navbar-brand fw-bold d-flex align-items-center"
       href="${pageContext.request.contextPath}/"
       aria-label="Robo Dynamics home">
      <img src="${pageContext.request.contextPath}/images/logo.jpg"
           alt="Robo Dynamics"
           class="me-2 rd-logo"
           onerror="this.onerror=null; this.replaceWith(document.createTextNode('Image not available'));"/>
    </a>

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#rdNav"
            aria-controls="rdNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar Links -->
    <div class="collapse navbar-collapse" id="rdNav">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-2">

        <!-- Courses -->
              <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/courses">Courses</a></li>
		<!-- Competitions -->
		<li class="nav-item">
		  <a class="nav-link" href="${pageContext.request.contextPath}/contests">Contests</a>
		</li>

        <!-- Other Links -->
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/testimonials">Testimonials</a></li>
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/mentors/apply">Mentors</a></li>
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/contact-us">Contact</a></li>

        <!-- Notification Bell -->
        <c:if test="${rdUser.profile_id == 1 or rdUser.profile_id == 2 or rdUser.profile_id == 3}">
          <li class="nav-item">
            <a class="nav-link position-relative" href="${pageContext.request.contextPath}/manager/notifications">
              <i class="bi bi-bell fs-5"></i>
              <c:if test="${unreadNotifications > 0}">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  ${unreadNotifications}
                </span>
              </c:if>
            </a>
          </li>
        </c:if>

        <!-- CTA + Auth Buttons -->
        <li class="nav-item nav-cta ms-lg-3">
          <c:choose>
            <c:when test="${empty sessionScope.rdUser}">
              <a class="btn btn-success btn-sm" href="${pageContext.request.contextPath}/parents">
                <i class="bi bi-calendar2-check"></i> Free Demo
              </a>
              <a class="btn btn-outline-dark btn-sm" href="${pageContext.request.contextPath}/mentors/apply">
                <i class="bi bi-person-plus"></i> Become a Mentor
              </a>
              <a class="btn btn-success btn-sm" href="${pageContext.request.contextPath}/registerParentChild">
                <i class="bi bi-person-plus"></i> Sign Up as Parent
              </a>
              <a class="btn btn-outline-primary btn-sm" href="${pageContext.request.contextPath}/login">
                Sign In
              </a>
            </c:when>

            <c:otherwise>
              <c:choose>
                <c:when test="${sessionScope.rdUser.profile_id == 1 or sessionScope.rdUser.profile_id == 2}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/admin/dashboard">🧭 Admin Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 3}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/mentor/dashboard">🎓 Mentor Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 4}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/parent/dashboard">👨‍👩‍👧 Parent Dashboard</a>
                </c:when>
                <c:when test="${sessionScope.rdUser.profile_id == 5}">
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/student/dashboard">🎒 Student Dashboard</a>
                </c:when>
                <c:otherwise>
                  <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/dashboard">Dashboard</a>
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
