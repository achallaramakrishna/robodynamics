<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Course Monitor</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
:root {
    --footer-height: 60px;
    --header-height: 60px; /* adjust if your header is taller */
    
}

/* ===== BASE ===== */
html, body {
    height: 100%;
    margin: 0;
}
body {
    font-family: Arial, sans-serif;
    background: #f8f9fa;
}

/* ===== HEADER ===== */
#rdHeaderWrap {
    z-index: 100;
}

/* ===== FOOTER (DESKTOP FIXED) ===== */
#rdFooterWrap {
    background: #fff;
    border-top: 1px solid #dee2e6;
}

/* ===== MAIN ===== */
#rdMainWrap {
    height: calc(100vh - var(--footer-height));
    overflow: hidden;
}

/* ===== LAYOUT ===== */
.main-container {
    display: flex;
    height: 100%;
}

/* ===== SIDEBAR ===== */
.sidebar {
    width: 260px;
    background: #fff;
    border-right: 1px solid #dee2e6;
    padding: 15px;
    /* ✅ FIX */
    height: calc(100vh - var(--header-height) - var(--footer-height));
    overflow-y: auto;

    transition: all 0.3s ease;
}
.sidebar-collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
}

/* ===== SESSION ITEMS ===== */
.session-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 6px;
    font-weight: 500;
}
.session-item:hover { background: #e9f2ff; }
.session-item.active { background: #007bff; color: #fff; }

/* ===== CONTENT ===== */
.content-area {
    flex: 1;
    padding: 15px;
    overflow: hidden;
}

/* ===== PLACEHOLDER ===== */
.placeholder-box {
    border: 2px dashed #ced4da;
    padding: 40px;
    text-align: center;
    border-radius: 10px;
    background: #fff;
}

/* ===== DESKTOP TOGGLE ===== */
.desktop-toggle {
    border: none;
    background: #007bff;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
}

/* ===== MOBILE FIXES ===== */
@media (max-width: 991px) {

    body {
        overflow: auto;
    }

    #rdMainWrap {
        height: auto;
        overflow: visible;
    }

    .main-container {
        height: auto;
        flex-direction: column;
    }

    .content-area {
        overflow: visible;
    }

    /* Sidebar slide-in */
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        transform: translateX(-100%);
        z-index: 1050;
        box-shadow: 4px 0 10px rgba(0,0,0,0.15);
    }
    .sidebar.show {
        transform: translateX(0);
    }

    .sidebar-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 1040;
    }
    .sidebar-overlay.show {
        display: block;
    }

    /* Footer normal flow on mobile */
    #rdFooterWrap {
        position: static;
        height: auto;
    }
}
</style>

<script>
function loadSessionDashboard(sessionId) {
    const enrollmentId = '${studentEnrollment.enrollmentId}';
    const ctx = '${pageContext.request.contextPath}';

    document.getElementById("dashboardFrame").src =
        ctx + "/course/session/" + sessionId + "/dashboard?enrollmentId=" + enrollmentId;

    document.querySelectorAll('.session-item')
        .forEach(el => el.classList.remove('active'));
    document.getElementById("session-" + sessionId).classList.add('active');

    closeSidebarMobile();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth >= 992) {
        sidebar.classList.toggle('sidebar-collapsed');
    } else {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

function closeSidebarMobile() {
    if (window.innerWidth < 992) {
        document.getElementById('sidebar').classList.remove('show');
        document.getElementById('sidebarOverlay').classList.remove('show');
    }
}
</script>
</head>

<body>

<!-- ===== HEADER ===== -->
<div id="rdHeaderWrap">
    <jsp:include page="header.jsp" />
</div>

<!-- ===== MAIN ===== -->
<div id="rdMainWrap">

<div id="sidebarOverlay" class="sidebar-overlay" onclick="closeSidebarMobile()"></div>

<div class="container-fluid p-0">
<div class="main-container">

    <!-- ===== SIDEBAR ===== -->
    <div id="sidebar" class="sidebar">

        <a href="${ctx}/studentDashboard"
           class="btn btn-sm btn-outline-secondary mb-3">
            ← Courses
        </a>

        <div class="fw-bold text-primary mb-3">
            ${course.courseName}
        </div>

        <c:forEach items="${courseSessions}" var="session">
            <div class="session-item"
                 id="session-${session.sessionId}"
                 onclick="loadSessionDashboard(${session.courseSessionId})">
                📘 ${session.sessionTitle}
            </div>
        </c:forEach>

    </div>

    <!-- ===== CONTENT ===== -->
    <div class="content-area">

        <!-- Desktop toggle -->
        <button class="desktop-toggle mb-3 d-none d-lg-inline-block"
                onclick="toggleSidebar()">
            ☰ Sessions
        </button>

        <!-- Mobile toggle -->
        <button class="desktop-toggle mb-3 d-lg-none"
                onclick="toggleSidebar()">
            ☰ Sessions
        </button>

        <div class="placeholder-box" id="placeholder">
            <h4>Select a session</h4>
            <p class="text-muted">
                Choose a session to view videos, quizzes,
                flashcards, memory maps, assignments, and more.
            </p>
        </div>

        <iframe id="dashboardFrame"
                style="width:100%; height:70vh; border:none;"
                onload="document.getElementById('placeholder').style.display='none';">
        </iframe>

    </div>

</div>
</div>
</div>

<!-- ===== FOOTER ===== -->
<div id="rdFooterWrap">
    <jsp:include page="footer.jsp" />
</div>

</body>
</html>
