<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>

<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top" style="z-index:1030;">
  <style>
    .nav-cta .btn { margin-left:.4rem; }
    .rd-logo { max-height:50px; height:auto; }
    @media (max-width: 991px){
      .nav-cta .btn{ margin:.4rem 0 0 0; width:100%; }
    }

    .rd-mega{min-width:980px; border:0; border-radius:16px; box-shadow:0 16px 48px rgba(0,0,0,.12);}
    @media (max-width: 991px){ .rd-mega{min-width:100%;} }

    .rd-mega .rd-card{
      border:0; border-radius:14px; overflow:hidden; background:#fff;
      box-shadow:0 8px 24px rgba(0,0,0,.08);
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .rd-mega .rd-card:hover{
      transform:translateY(-3px);
      box-shadow:0 12px 34px rgba(0,0,0,.12);
    }
    .rd-mega .rd-thumb{ position:relative; aspect-ratio:16/9; background:#f3f5f8; overflow:hidden; }
    .rd-mega .rd-thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
    .rd-mega .rd-thumb::after{ content:""; position:absolute; inset:0;
      background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.18));
    }
    .rd-mega .rd-body{ padding:12px 14px 14px; }
    .rd-mega .rd-kicker{ font-size:.72rem; letter-spacing:.06em; text-transform:uppercase; color:#6c757d; margin-bottom:4px; }
    .rd-mega .rd-title{ font-weight:700; margin:0 0 4px; color:#1f2937; }
    .rd-mega .rd-section-title{ font-size:.74rem; text-transform:uppercase; letter-spacing:.08em; color:#6c757d; margin:4px 0 6px; }
    .rd-mega .dropdown-item{ border-radius:8px; padding:.4rem .6rem; }
    .rd-mega .dropdown-item:hover{ background:rgba(0,0,0,.05); }

    @media (min-width: 992px){
      .navbar .dropdown:hover > .dropdown-menu { display:block; }
    }
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
      <span>Robo Dynamics</span>
    </a>

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#rdNav"
            aria-controls="rdNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Links -->
    <div class="collapse navbar-collapse" id="rdNav">
      <ul class="navbar-nav ms-auto align-items-lg-center">

        <!-- Courses -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="coursesMega" role="button"
             data-bs-toggle="dropdown" aria-expanded="false">Courses</a>
          <div class="dropdown-menu p-3 rd-mega" aria-labelledby="coursesMega">
            <!-- Your existing mega menu code remains here -->
          </div>
        </li>

        <!-- Extra Trust-Building Links -->
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/testimonials">Testimonials</a></li>
        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/mentors/apply">Mentors</a></li>
<%--         <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/pricing/plans">Pricing</a></li>
 --%>        <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/contact-us">Contact</a></li>

        <!-- Notification Bell (for Admin/Mentor) -->
        <c:choose>
          <c:when test="${rdUser.profile_id == 1 or rdUser.profile_id == 2 or rdUser.profile_id == 3}">
            <li class="nav-item ms-2">
              <a class="nav-link position-relative" href="${pageContext.request.contextPath}/manager/notifications">
                <i class="bi bi-bell" style="font-size: 1.5rem;"></i>
                <c:if test="${unreadNotifications > 0}">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    ${unreadNotifications}
                  </span>
                </c:if>
              </a>
            </li>
          </c:when>
        </c:choose>

		<!-- CTA Buttons -->
		<c:choose>
		  <c:when test="${empty sessionScope.rdUser}">
		    <li class="nav-item nav-cta ms-lg-3">
		      <a class="btn btn-success btn-sm" href="${pageContext.request.contextPath}/parents">
		        <i class="bi bi-calendar2-check"></i> Free Demo
		      </a>
		      <a class="btn btn-outline-dark btn-sm ms-2" href="${pageContext.request.contextPath}/mentors/apply">
		        <i class="bi bi-person-plus"></i> Become a Mentor
		      </a>
		    </li>
		  </c:when>
		</c:choose>
		
		<!-- Auth Buttons -->
		<li class="nav-item nav-cta ms-lg-2">
		  <c:choose>
		    <c:when test="${not empty sessionScope.rdUser}">
		      <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/dashboard">Dashboard</a>
		      <a class="btn btn-outline-danger btn-sm ms-2" href="${pageContext.request.contextPath}/logout">Log Out</a>
		    </c:when>
		    <c:otherwise>
		      <a class="btn btn-outline-primary btn-sm" href="${pageContext.request.contextPath}/login">Sign In</a>
		    </c:otherwise>
		  </c:choose>
		</li>

      </ul>
    </div>
  </div>
</nav>
