<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AptiPath Awareness Feed Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    .type-pill { font-size: 12px; font-weight: 700; border-radius: 999px; padding: 4px 8px; display: inline-block; }
    .type-article { background: #e8f5ff; color: #0f4c81; border: 1px solid #bfdff8; }
    .type-blog { background: #e9f8ee; color: #14532d; border: 1px solid #c4e9cf; }
    .type-newsletter { background: #fff7e9; color: #7c4a03; border: 1px solid #f5dcad; }
    .mono { font-family: Consolas, Monaco, monospace; font-size: 12px; }
  </style>
</head>
<body>
  <jsp:include page="/header.jsp" />

  <div class="container mt-4 mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">AptiPath Awareness Feed Manager</h2>
      <div class="d-flex gap-2">
        <a href="${pageContext.request.contextPath}/admin/content-radar" class="btn btn-outline-success btn-sm">Content Radar</a>
        <a href="${pageContext.request.contextPath}/admin/dashboard" class="btn btn-outline-secondary btn-sm">Back to Admin</a>
      </div>
    </div>

    <c:if test="${saved == 'created'}">
      <div class="alert alert-success">Post created successfully.</div>
    </c:if>
    <c:if test="${saved == 'updated'}">
      <div class="alert alert-success">Post updated successfully.</div>
    </c:if>
    <c:if test="${saved == 'deleted'}">
      <div class="alert alert-success">Post deleted successfully.</div>
    </c:if>
    <c:if test="${saved == 'publish'}">
      <div class="alert alert-success">Publish status updated.</div>
    </c:if>

    <div class="card mb-4">
      <div class="card-header">
        <strong><c:choose><c:when test="${editPost.id > 0}">Edit Post #${editPost.id}</c:when><c:otherwise>Create New Post</c:otherwise></c:choose></strong>
      </div>
      <div class="card-body">
        <form method="post" action="${pageContext.request.contextPath}/admin/awareness/save">
          <input type="hidden" name="postId" value="${editPost.id}" />
          <div class="row g-3">
            <div class="col-md-8">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" name="title" value="${fn:escapeXml(editPost.title)}" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">Published</label>
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" value="1" id="isPublished" name="isPublished" <c:if test="${editPost.published}">checked</c:if> />
                <label class="form-check-label" for="isPublished">Show on home awareness feed</label>
              </div>
            </div>
            <div class="col-md-12">
              <label class="form-label">Excerpt</label>
              <textarea class="form-control" rows="3" name="excerpt">${fn:escapeXml(editPost.excerpt)}</textarea>
            </div>
            <div class="col-md-8">
              <label class="form-label">Link (internal `/...` or full `https://...`)</label>
              <input type="text" class="form-control mono" name="href" value="${fn:escapeXml(editPost.href)}" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Image URL</label>
              <input type="text" class="form-control mono" name="imageUrl" value="${fn:escapeXml(editPost.imageUrl)}" />
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary">Save Post</button>
            <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/admin/awareness">Reset Form</a>
          </div>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <strong>Existing Posts (${fn:length(posts)})</strong>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Published</th>
              <th>Link</th>
              <th style="min-width: 260px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <c:forEach var="p" items="${posts}">
              <c:set var="searchable" value="${fn:toLowerCase(p.title)} ${fn:toLowerCase(p.excerpt)} ${fn:toLowerCase(p.href)}" />
              <tr>
                <td>${p.id}</td>
                <td>
                  <strong>${p.title}</strong>
                  <c:if test="${not empty p.excerpt}">
                    <div class="text-muted small">${p.excerpt}</div>
                  </c:if>
                </td>
                <td>
                  <c:choose>
                    <c:when test="${fn:contains(searchable, 'newsletter')}">
                      <span class="type-pill type-newsletter">Newsletter</span>
                    </c:when>
                    <c:when test="${fn:contains(searchable, 'article')}">
                      <span class="type-pill type-article">Article</span>
                    </c:when>
                    <c:otherwise>
                      <span class="type-pill type-blog">Blog</span>
                    </c:otherwise>
                  </c:choose>
                </td>
                <td>
                  <c:choose>
                    <c:when test="${p.published}">
                      <span class="badge bg-success">Published</span>
                    </c:when>
                    <c:otherwise>
                      <span class="badge bg-secondary">Draft</span>
                    </c:otherwise>
                  </c:choose>
                </td>
                <td class="mono">${p.href}</td>
                <td>
                  <c:set var="nextPublishValue" value="1" />
                  <c:if test="${p.published}">
                    <c:set var="nextPublishValue" value="0" />
                  </c:if>
                  <a href="${pageContext.request.contextPath}/admin/awareness?editId=${p.id}" class="btn btn-sm btn-warning">Edit</a>
                  <form method="post" action="${pageContext.request.contextPath}/admin/awareness/toggle-publish" class="d-inline">
                    <input type="hidden" name="postId" value="${p.id}" />
                    <input type="hidden" name="publish" value="${nextPublishValue}" />
                    <button type="submit" class="btn btn-sm btn-info">
                      <c:choose>
                        <c:when test="${p.published}">Unpublish</c:when>
                        <c:otherwise>Publish</c:otherwise>
                      </c:choose>
                    </button>
                  </form>
                  <form method="post" action="${pageContext.request.contextPath}/admin/awareness/delete" class="d-inline" onsubmit="return confirm('Delete this post permanently?');">
                    <input type="hidden" name="postId" value="${p.id}" />
                    <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                  </form>
                </td>
              </tr>
            </c:forEach>
            <c:if test="${empty posts}">
              <tr>
                <td colspan="6" class="text-center text-muted py-4">No awareness posts found. Create your first post above.</td>
              </tr>
            </c:if>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
