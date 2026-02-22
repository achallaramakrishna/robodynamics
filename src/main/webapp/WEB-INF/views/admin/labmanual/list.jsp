<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Lab Manuals | Admin</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
</head>
<body class="bg-light">

<jsp:include page="../fragments/header.jsp"/>

<div class="container-fluid py-4 px-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h4 class="mb-0"><i class="bi bi-journal-code me-2 text-primary"></i>Lab Manuals</h4>
            <div class="text-muted small">Session Detail ID: <strong>${sessionDetailId}</strong></div>
        </div>
        <a href="${pageContext.request.contextPath}/admin/labmanual/upload-form?sessionDetailId=${sessionDetailId}"
           class="btn btn-primary btn-sm">
            <i class="bi bi-upload me-1"></i>Upload New
        </a>
    </div>

    <c:choose>
        <c:when test="${empty manuals}">
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>No lab manuals uploaded for this session detail yet.
                <a href="${pageContext.request.contextPath}/admin/labmanual/upload-form?sessionDetailId=${sessionDetailId}"
                   class="alert-link">Upload one now</a>.
            </div>
        </c:when>
        <c:otherwise>
            <div class="card shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Level</th>
                                <th>Est. Time</th>
                                <th>Version</th>
                                <th>Sections</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        <c:forEach items="${manuals}" var="m" varStatus="s">
                            <tr>
                                <td class="text-muted small">${m.labManualId}</td>
                                <td>
                                    <div class="fw-semibold">${fn:escapeXml(m.title)}</div>
                                    <div class="text-muted small text-truncate" style="max-width:350px;">
                                        ${fn:escapeXml(m.objective)}
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-secondary">${fn:escapeXml(m.difficultyLevel)}</span>
                                </td>
                                <td>${m.estimatedTimeMinutes} min</td>
                                <td>v${fn:escapeXml(m.version)}</td>
                                <td>${fn:length(m.sections)}</td>
                                <td>
                                    <a href="${pageContext.request.contextPath}/admin/labmanual/view?labManualId=${m.labManualId}"
                                       class="btn btn-sm btn-outline-primary me-1">
                                        <i class="bi bi-eye"></i> View
                                    </a>
                                    <a href="${pageContext.request.contextPath}/student/labmanual/${m.labManualId}"
                                       class="btn btn-sm btn-outline-success me-1" target="_blank">
                                        <i class="bi bi-person-video3"></i> Preview
                                    </a>
                                    <form method="post"
                                          action="${pageContext.request.contextPath}/admin/labmanual/delete"
                                          class="d-inline"
                                          onsubmit="return confirm('Delete this lab manual? This cannot be undone.')">
                                        <input type="hidden" name="labManualId" value="${m.labManualId}"/>
                                        <input type="hidden" name="sessionDetailId" value="${sessionDetailId}"/>
                                        <button type="submit" class="btn btn-sm btn-outline-danger">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                        </tbody>
                    </table>
                </div>
            </div>
        </c:otherwise>
    </c:choose>
</div>

<jsp:include page="../fragments/footer.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
