<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Lab Manuals</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
<style>
body { background: #0f172a; color: #e2e8f0; min-height: 100vh; }
.lab-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    transition: transform 0.2s, border-color 0.2s;
}
.lab-card:hover {
    transform: translateY(-4px);
    border-color: #3b82f6;
}
.badge-difficulty {
    font-size: 0.72rem;
    padding: 4px 8px;
    border-radius: 6px;
}
.badge-beginner  { background: #166534; color: #bbf7d0; }
.badge-intermediate { background: #854d0e; color: #fef08a; }
.badge-advanced  { background: #7f1d1d; color: #fecaca; }
.meta-pill {
    background: #334155;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 0.75rem;
    color: #94a3b8;
}
.empty-state { text-align: center; padding: 80px 20px; color: #64748b; }
.page-header { border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 28px; }
</style>
</head>
<body>

<div class="container py-5">

    <div class="d-flex justify-content-between align-items-center page-header flex-wrap gap-2">
        <div>
            <h4 class="mb-1 fw-bold"><i class="bi bi-journal-code me-2 text-primary"></i>Lab Manuals</h4>
            <div class="text-muted small">Hands-on coding guides for this session</div>
        </div>
        <a href="javascript:history.back()" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left me-1"></i>Back
        </a>
    </div>

    <c:choose>
        <c:when test="${empty manuals}">
            <div class="empty-state">
                <i class="bi bi-journal-x" style="font-size:3rem; color:#475569;"></i>
                <h5 class="mt-3" style="color:#94a3b8;">No lab manuals available yet</h5>
                <p class="text-muted small">Check back later — your instructor hasn't uploaded lab manuals for this session.</p>
            </div>
        </c:when>
        <c:otherwise>
            <div class="row g-4">
                <c:forEach items="${manuals}" var="m">
                    <div class="col-md-6 col-lg-4">
                        <div class="lab-card p-4 h-100 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge-difficulty
                                    <c:choose>
                                        <c:when test="${fn:toLowerCase(m.difficultyLevel) == 'beginner'}">badge-beginner</c:when>
                                        <c:when test="${fn:toLowerCase(m.difficultyLevel) == 'advanced'}">badge-advanced</c:when>
                                        <c:otherwise>badge-intermediate</c:otherwise>
                                    </c:choose>">
                                    ${fn:escapeXml(m.difficultyLevel)}
                                </span>
                                <span class="meta-pill"><i class="bi bi-tag me-1"></i>v${fn:escapeXml(m.version)}</span>
                            </div>

                            <h6 class="fw-semibold mb-2" style="color:#f1f5f9;">${fn:escapeXml(m.title)}</h6>

                            <p class="small mb-3" style="color:#94a3b8; flex-grow:1;">
                                ${fn:escapeXml(m.objective)}
                            </p>

                            <div class="d-flex gap-2 mb-3 flex-wrap">
                                <span class="meta-pill"><i class="bi bi-clock me-1"></i>${m.estimatedTimeMinutes} min</span>
                                <span class="meta-pill"><i class="bi bi-layers me-1"></i>${fn:length(m.sections)} sections</span>
                            </div>

                            <a href="${pageContext.request.contextPath}/student/labmanual/${m.labManualId}<c:if test="${not empty enrollmentId}">?enrollmentId=${enrollmentId}</c:if>"
                               class="btn btn-primary btn-sm w-100 mt-auto">
                                <i class="bi bi-play-circle me-1"></i>Start Lab
                            </a>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </c:otherwise>
    </c:choose>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
