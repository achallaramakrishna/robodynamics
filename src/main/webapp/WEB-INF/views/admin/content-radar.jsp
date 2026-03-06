<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AptiPath360 Content Radar Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    .mono { font-family: Consolas, Monaco, monospace; font-size: 12px; }
    .small-note { font-size: 12px; color: #6b7280; }
    .limit-cell { max-width: 320px; }
    .limit-cell p { margin: 0; }
    .pill-score {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      background: #ebf5ff;
      border: 1px solid #b7dafd;
      color: #0a4a80;
      font-weight: 700;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <jsp:include page="/header.jsp" />

  <div class="container mt-4 mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">AptiPath360 Content Radar</h2>
      <a href="${pageContext.request.contextPath}/admin/awareness" class="btn btn-outline-secondary btn-sm">Awareness Feed Admin</a>
    </div>

    <c:if test="${not empty message}">
      <div class="alert alert-success">${message}</div>
    </c:if>

    <div class="row g-3 mb-4">
      <div class="col-lg-5">
        <div class="card h-100">
          <div class="card-header">
            <strong>
              <c:choose>
                <c:when test="${sourceForm.sourceId != null}">Edit Trusted Source #${sourceForm.sourceId}</c:when>
                <c:otherwise>Add Trusted Source</c:otherwise>
              </c:choose>
            </strong>
          </div>
          <div class="card-body">
            <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/source/save">
              <input type="hidden" name="sourceId" value="${sourceForm.sourceId}" />
              <div class="mb-2">
                <label class="form-label">Source Name</label>
                <input class="form-control" type="text" name="sourceName" value="${fn:escapeXml(sourceForm.sourceName)}" required />
              </div>
              <div class="mb-2">
                <label class="form-label">Source Type</label>
                <input class="form-control" type="text" name="sourceType" value="${fn:escapeXml(sourceForm.sourceType)}" placeholder="RSS" />
              </div>
              <div class="mb-2">
                <label class="form-label">Feed URL</label>
                <input class="form-control mono" type="text" name="feedUrl" value="${fn:escapeXml(sourceForm.feedUrl)}" required />
              </div>
              <div class="mb-2">
                <label class="form-label">Base URL</label>
                <input class="form-control mono" type="text" name="baseUrl" value="${fn:escapeXml(sourceForm.baseUrl)}" />
              </div>
              <div class="mb-2">
                <label class="form-label">Authority Weight (0-100)</label>
                <input class="form-control" type="number" min="0" max="100" name="authorityWeight" value="${sourceForm.authorityWeight}" />
              </div>
              <div class="mb-2 form-check">
                <input class="form-check-input" type="checkbox" value="1" id="sourceActive" name="active" <c:if test="${sourceForm.active}">checked</c:if> />
                <label class="form-check-label" for="sourceActive">Active source for scheduled fetch</label>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" rows="2" name="notes">${fn:escapeXml(sourceForm.notes)}</textarea>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-primary" type="submit">Save Source</button>
                <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/admin/content-radar">Reset</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <strong>Trusted Source Library (${fn:length(sources)})</strong>
            <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/refresh" class="d-inline">
              <button type="submit" class="btn btn-sm btn-success">Fetch Latest Now</button>
            </form>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Weight</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="s" items="${sources}">
                  <tr>
                    <td>${s.sourceId}</td>
                    <td>
                      <div><strong>${s.sourceName}</strong></div>
                      <div class="small-note mono">${s.feedUrl}</div>
                    </td>
                    <td>${s.authorityWeight}</td>
                    <td>
                      <c:choose>
                        <c:when test="${s.active}"><span class="badge bg-success">Active</span></c:when>
                        <c:otherwise><span class="badge bg-secondary">Paused</span></c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <a class="btn btn-sm btn-warning" href="${pageContext.request.contextPath}/admin/content-radar?sourceEditId=${s.sourceId}&status=${selectedStatus}">Edit</a>
                      <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/source/delete" class="d-inline" onsubmit="return confirm('Delete this source and keep already fetched items?');">
                        <input type="hidden" name="sourceId" value="${s.sourceId}" />
                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                      </form>
                    </td>
                  </tr>
                </c:forEach>
                <c:if test="${empty sources}">
                  <tr>
                    <td colspan="5" class="text-center text-muted py-3">No trusted sources configured yet.</td>
                  </tr>
                </c:if>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Discovered Content Items (${fn:length(items)})</strong>
        <form method="get" action="${pageContext.request.contextPath}/admin/content-radar" class="d-flex align-items-center gap-2">
          <label class="small-note mb-0">Status</label>
          <select class="form-select form-select-sm" name="status">
            <c:forEach var="st" items="${itemStatuses}">
              <option value="${st}" <c:if test="${st == selectedStatus}">selected</c:if>>${st}</option>
            </c:forEach>
          </select>
          <button type="submit" class="btn btn-sm btn-primary">Filter</button>
        </form>
      </div>
      <div class="table-responsive">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Score</th>
              <th>Status</th>
              <th>Type</th>
              <th>Title & Source</th>
              <th>Attribution Link</th>
              <th style="min-width:340px;">Controls</th>
            </tr>
          </thead>
          <tbody>
            <c:forEach var="i" items="${items}">
              <tr>
                <td>${i.itemId}</td>
                <td><span class="pill-score">${i.totalScore}</span></td>
                <td><span class="badge bg-secondary">${i.status}</span></td>
                <td>${i.contentType}</td>
                <td class="limit-cell">
                  <div><strong>${i.title}</strong></div>
                  <div class="small-note">Source: ${i.sourceName}</div>
                  <c:if test="${not empty i.draftExcerpt}">
                    <p class="small-note mt-1">${i.draftExcerpt}</p>
                  </c:if>
                </td>
                <td class="mono">
                  <a href="${i.canonicalUrl}" target="_blank" rel="noopener">Open Original</a>
                </td>
                <td>
                  <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/item/status" class="d-flex gap-2 mb-2">
                    <input type="hidden" name="itemId" value="${i.itemId}" />
                    <select class="form-select form-select-sm" name="status">
                      <option value="REVIEW" <c:if test="${i.status == 'REVIEW'}">selected</c:if>>REVIEW</option>
                      <option value="APPROVED" <c:if test="${i.status == 'APPROVED'}">selected</c:if>>APPROVED</option>
                      <option value="DRAFTED" <c:if test="${i.status == 'DRAFTED'}">selected</c:if>>DRAFTED</option>
                      <option value="PUBLISHED" <c:if test="${i.status == 'PUBLISHED'}">selected</c:if>>PUBLISHED</option>
                      <option value="REJECTED" <c:if test="${i.status == 'REJECTED'}">selected</c:if>>REJECTED</option>
                    </select>
                    <input class="form-control form-control-sm" type="text" name="editorNotes" placeholder="Reviewer notes" value="${fn:escapeXml(i.editorNotes)}" />
                    <button type="submit" class="btn btn-sm btn-outline-primary">Save</button>
                  </form>
                  <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/item/draft" class="d-inline">
                    <input type="hidden" name="itemId" value="${i.itemId}" />
                    <button type="submit" class="btn btn-sm btn-outline-secondary">Build Draft</button>
                  </form>
                  <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/item/publish" class="d-inline">
                    <input type="hidden" name="itemId" value="${i.itemId}" />
                    <input type="hidden" name="publishNow" value="1" />
                    <button type="submit" class="btn btn-sm btn-success">Publish to Home Feed</button>
                  </form>
                </td>
              </tr>
            </c:forEach>
            <c:if test="${empty items}">
              <tr>
                <td colspan="7" class="text-center text-muted py-4">No content items found for selected status.</td>
              </tr>
            </c:if>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Weekly Newsletter</strong>
        <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/newsletter/generate" class="d-flex align-items-center gap-2">
          <label class="small-note mb-0">Week Start</label>
          <input type="date" class="form-control form-control-sm" name="weekStart" value="${weekStart}" />
          <button type="submit" class="btn btn-sm btn-primary">Generate Draft</button>
        </form>
      </div>
      <div class="card-body">
        <c:if test="${issueForm.issueId != null}">
          <h6>Edit Newsletter #${issueForm.issueId}</h6>
          <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/newsletter/save">
            <input type="hidden" name="issueId" value="${issueForm.issueId}" />
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Title</label>
                <input class="form-control" type="text" name="title" value="${fn:escapeXml(issueForm.title)}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Subject Line</label>
                <input class="form-control" type="text" name="subjectLine" value="${fn:escapeXml(issueForm.subjectLine)}" required />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" name="status">
                  <option value="DRAFT" <c:if test="${issueForm.status == 'DRAFT'}">selected</c:if>>DRAFT</option>
                  <option value="APPROVED" <c:if test="${issueForm.status == 'APPROVED'}">selected</c:if>>APPROVED</option>
                </select>
              </div>
              <div class="col-md-9">
                <label class="form-label">Source Item IDs</label>
                <input class="form-control mono" type="text" value="${fn:escapeXml(issueForm.sourceItemIds)}" disabled />
              </div>
              <div class="col-12">
                <label class="form-label">HTML Body (must keep source links)</label>
                <textarea class="form-control mono" rows="8" name="bodyHtml">${fn:escapeXml(issueForm.bodyHtml)}</textarea>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button type="submit" class="btn btn-primary">Save Newsletter Draft</button>
              <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/newsletter/issue/${issueForm.issueId}" target="_blank" rel="noopener">Preview Public Page</a>
            </div>
          </form>
          <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/newsletter/publish" class="d-inline">
            <input type="hidden" name="issueId" value="${issueForm.issueId}" />
            <button type="submit" class="btn btn-success">Publish to Home Feed</button>
          </form>
          <hr />
        </c:if>

        <h6 class="mb-2">Recent Issues (${fn:length(issues)})</h6>
        <div class="table-responsive">
          <table class="table table-striped table-sm mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Week</th>
                <th>Title</th>
                <th>Status</th>
                <th>Awareness Post</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <c:forEach var="n" items="${issues}">
                <tr>
                  <td>${n.issueId}</td>
                  <td>${n.weekStart} to ${n.weekEnd}</td>
                  <td>${n.title}</td>
                  <td><span class="badge bg-secondary">${n.status}</span></td>
                  <td>${n.awarenessPostId}</td>
                  <td>
                    <a class="btn btn-sm btn-warning" href="${pageContext.request.contextPath}/admin/content-radar?issueEditId=${n.issueId}&status=${selectedStatus}">Edit</a>
                    <form method="post" action="${pageContext.request.contextPath}/admin/content-radar/newsletter/publish" class="d-inline">
                      <input type="hidden" name="issueId" value="${n.issueId}" />
                      <button type="submit" class="btn btn-sm btn-success">Publish</button>
                    </form>
                    <a class="btn btn-sm btn-outline-secondary" href="${pageContext.request.contextPath}/newsletter/issue/${n.issueId}" target="_blank" rel="noopener">Open</a>
                  </td>
                </tr>
              </c:forEach>
              <c:if test="${empty issues}">
                <tr>
                  <td colspan="6" class="text-center text-muted py-3">No weekly newsletter drafts yet.</td>
                </tr>
              </c:if>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
