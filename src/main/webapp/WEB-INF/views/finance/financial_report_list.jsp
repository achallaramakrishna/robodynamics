<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">📊 Monthly Financial Reports</h3>

  <!-- ✅ Generate Report Form -->
  <form action="${pageContext.request.contextPath}/finance/reports/generate" method="post" class="card p-3 shadow-sm mb-4">
    <div class="row g-3 align-items-end">
      <div class="col-md-4">
        <label class="form-label fw-bold">Month (YYYY-MM)</label>
        <input type="text" name="month" class="form-control" placeholder="2025-10" required />
      </div>
      <div class="col-md-2">
        <button type="submit" class="btn btn-success w-100">Generate</button>
      </div>
      <div class="col-md-6 text-end">
        <!-- ✅ Export Buttons -->
        <a href="${pageContext.request.contextPath}/finance/reports/export/excel" class="btn btn-outline-success btn-sm me-2">
          <i class="bi bi-file-earmark-excel"></i> Export Excel
        </a>
        <a href="${pageContext.request.contextPath}/finance/reports/export/pdf" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-file-earmark-pdf"></i> Export PDF
        </a>
      </div>
    </div>
  </form>

  <!-- ✅ Chart Section -->
  <div class="card shadow-sm mb-4">
    <div class="card-header bg-primary text-white">📈 Income vs Expense vs Profit</div>
    <div class="card-body">
      <canvas id="financeChart" height="120"></canvas>
    </div>
  </div>

  <!-- ✅ Report Table -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-dark text-center">
      <tr>
        <th>Month</th>
        <th>Total Income (₹)</th>
        <th>Total Expense (₹)</th>
        <th>Net Profit (₹)</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="r" items="${reports}">
        <tr>
          <td class="text-center">${r.reportMonth}</td>
          <td class="text-end text-success"><fmt:formatNumber value="${r.totalIncome}" pattern="#,##0.00"/></td>
          <td class="text-end text-danger"><fmt:formatNumber value="${r.totalExpense}" pattern="#,##0.00"/></td>
          <td class="text-end fw-bold">
            <c:choose>
              <c:when test="${r.netProfit >= 0}">
                <span class="text-success">+<fmt:formatNumber value="${r.netProfit}" pattern="#,##0.00"/></span>
              </c:when>
              <c:otherwise>
                <span class="text-danger"><fmt:formatNumber value="${r.netProfit}" pattern="#,##0.00"/></span>
              </c:otherwise>
            </c:choose>
          </td>
          <td class="text-center">
            <c:choose>
              <c:when test="${r.netProfit >= 0}"><span class="badge bg-success">Profit</span></c:when>
              <c:otherwise><span class="badge bg-danger">Loss</span></c:otherwise>
            </c:choose>
          </td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/reports/delete?id=${r.reportId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this report?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<!-- ✅ Chart.js CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  const ctx = document.getElementById('financeChart').getContext('2d');
  const reportData = {
    labels: [
      <c:forEach var="r" items="${reports}" varStatus="loop">
        "${r.reportMonth}"<c:if test="${!loop.last}">,</c:if>
      </c:forEach>
    ],
    datasets: [
      {
        label: 'Total Income',
        backgroundColor: 'rgba(25, 135, 84, 0.8)',
        data: [
          <c:forEach var="r" items="${reports}" varStatus="loop">
            ${r.totalIncome}<c:if test="${!loop.last}">,</c:if>
          </c:forEach>
        ]
      },
      {
        label: 'Total Expense',
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        data: [
          <c:forEach var="r" items="${reports}" varStatus="loop">
            ${r.totalExpense}<c:if test="${!loop.last}">,</c:if>
          </c:forEach>
        ]
      },
      {
        label: 'Net Profit',
        backgroundColor: 'rgba(13, 110, 253, 0.8)',
        data: [
          <c:forEach var="r" items="${reports}" varStatus="loop">
            ${r.netProfit}<c:if test="${!loop.last}">,</c:if>
          </c:forEach>
        ]
      }
    ]
  };

  new Chart(ctx, {
    type: 'bar',
    data: reportData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Monthly Financial Overview'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Amount (₹)' }
        }
      }
    }
  });
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />
