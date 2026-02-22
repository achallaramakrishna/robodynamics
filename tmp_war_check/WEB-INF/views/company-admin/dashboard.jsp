<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Admin Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/rd-platform-shell.css">
  <style>
    .rd-company-grid .card {
      border: 1px solid var(--rd-line);
      border-radius: 16px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      height: 100%;
    }

    .rd-kv {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 6px 10px;
      font-size: 14px;
    }

    .rd-kv .k {
      color: var(--rd-ink-500);
      font-weight: 600;
    }

    .rd-chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
    }

    .rd-chip-on {
      background: #dcfce7;
      color: #166534;
    }

    .rd-chip-off {
      background: #e2e8f0;
      color: #64748b;
    }

    .rd-color {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .rd-color .dot {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      border: 1px solid #cbd5e1;
    }
  </style>
</head>
<body class="rd-shell-page">
  <jsp:include page="/WEB-INF/views/header.jsp" />

  <div class="rd-shell">
    <section class="rd-hero">
      <div>
        <p class="rd-eyebrow">Tenant Operations</p>
        <h1 class="rd-hero-title">Company Admin Dashboard</h1>
        <p class="rd-hero-sub">
          Tenant-level workspace for module readiness, branding context, and company operations.
        </p>
      </div>
      <div class="rd-hero-meta">
        <div class="rd-meta-card">
          <div class="rd-meta-label">Role</div>
          <div class="rd-meta-value">Company Admin</div>
        </div>
        <div class="rd-meta-card">
          <div class="rd-meta-label">Company</div>
          <div class="rd-meta-value"><c:out value="${companyCode}" /></div>
        </div>
      </div>
    </section>

    <div class="rd-content">
      <c:if test="${empty company}">
        <div class="alert alert-warning">
          Active company context was not found for this session. Showing fallback tenant scope.
        </div>
      </c:if>

      <div class="row g-3 rd-company-grid">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">Company Context</h5>
              <div class="rd-kv">
                <div class="k">Code</div>
                <div><c:out value="${company.companyCode}" default="-" /></div>
                <div class="k">Name</div>
                <div><c:out value="${company.companyName}" default="-" /></div>
                <div class="k">Type</div>
                <div><c:out value="${company.companyType}" default="-" /></div>
                <div class="k">Status</div>
                <div><c:out value="${company.status}" default="-" /></div>
                <div class="k">Website</div>
                <div><c:out value="${company.websiteDomain}" default="-" /></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">Branding Context</h5>
              <div class="rd-kv">
                <div class="k">Brand Name</div>
                <div><c:out value="${branding.brandingName}" default="-" /></div>
                <div class="k">Primary Color</div>
                <div class="rd-color">
                  <span class="dot" style="background:<c:out value='${branding.primaryColor}' default='#0f766e' />;"></span>
                  <span><c:out value="${branding.primaryColor}" default="#0f766e" /></span>
                </div>
                <div class="k">Secondary Color</div>
                <div class="rd-color">
                  <span class="dot" style="background:<c:out value='${branding.secondaryColor}' default='#0b1f3a' />;"></span>
                  <span><c:out value="${branding.secondaryColor}" default="#0b1f3a" /></span>
                </div>
                <div class="k">Powered By</div>
                <div><c:out value="${branding.poweredByLabel}" default="Robo Dynamics" /></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">Module Access (Current User)</h5>
              <div class="d-flex flex-wrap gap-2">
                <c:forEach var="entry" items="${moduleAccess}">
                  <span class="rd-chip ${entry.value ? 'rd-chip-on' : 'rd-chip-off'}">
                    <c:out value="${entry.key}" />: <c:out value="${entry.value ? 'Enabled' : 'Disabled'}" />
                  </span>
                </c:forEach>
                <c:if test="${empty moduleAccess}">
                  <span class="text-muted">No modules configured.</span>
                </c:if>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title mb-2">Quick Actions</h5>
              <p class="text-muted mb-3">
                Use the tenant module hub and support workflows while company-level controls are phased in.
              </p>
              <div class="d-flex flex-wrap gap-2 mt-auto">
                <a class="btn btn-primary btn-sm" href="${pageContext.request.contextPath}/platform/modules">Open Module Hub</a>
                <a class="btn btn-outline-primary btn-sm" href="${pageContext.request.contextPath}/tickets">View Tickets</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
