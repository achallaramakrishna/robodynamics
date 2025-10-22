<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Finance Dashboard</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    .accordion-button::after {
      filter: brightness(0.5);
    }
    .accordion-button:not(.collapsed) {
      background-color: #f8f9fa;
      color: #0d6efd;
      font-weight: 600;
    }
  </style>
</head>

<body>
<div class="container my-5">
  <h2 class="text-center mb-5 fw-bold text-primary">💼 Finance Dashboard</h2>

  <!-- === Summary Cards === -->
  <div class="row text-center mb-4 g-4">
    <div class="col-md-3 col-sm-6">
      <div class="card shadow-sm border-success h-100">
        <div class="card-body">
          <h6 class="text-success">Total Income</h6>
          <h3 class="fw-bold text-success">₹<fmt:formatNumber value="${summary.totalIncome}" pattern="#,##0.00"/></h3>
        </div>
      </div>
    </div>

    <div class="col-md-3 col-sm-6">
      <div class="card shadow-sm border-danger h-100">
        <div class="card-body">
          <h6 class="text-danger">Total Expense</h6>
          <h3 class="fw-bold text-danger">₹<fmt:formatNumber value="${summary.totalExpense}" pattern="#,##0.00"/></h3>
        </div>
      </div>
    </div>

    <div class="col-md-3 col-sm-6">
      <div class="card shadow-sm border-primary h-100">
        <div class="card-body">
          <h6 class="text-primary">Net Profit</h6>
          <h3 class="fw-bold text-primary">₹<fmt:formatNumber value="${summary.netProfit}" pattern="#,##0.00"/></h3>
        </div>
      </div>
    </div>

    <div class="col-md-3 col-sm-6">
      <div class="card shadow-sm border-warning h-100">
        <div class="card-body">
          <h6 class="text-warning">Profit Margin</h6>
          <h3 class="fw-bold text-warning"><fmt:formatNumber value="${summary.profitMargin}" pattern="#0.00"/>%</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- === Charts === -->
  <div class="row my-5">
    <div class="col-md-6 mb-4">
      <div class="card shadow-sm">
        <div class="card-header bg-light fw-bold">Income by Source</div>
        <div class="card-body">
          <canvas id="incomeChart" height="200"></canvas>
        </div>
      </div>
    </div>

    <div class="col-md-6 mb-4">
      <div class="card shadow-sm">
        <div class="card-header bg-light fw-bold">Expense by Category</div>
        <div class="card-body">
          <canvas id="expenseChart" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- === Accordion === -->
  <div class="accordion" id="financeAccordion">

    <!-- 💰 Income Management -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingIncome">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIncome">
          💰 Income Management
        </button>
      </h2>
      <div id="collapseIncome" class="accordion-collapse collapse show" data-bs-parent="#financeAccordion">
        <div class="accordion-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-success text-white">Income Sources</div>
                <div class="card-body">
                  <p>Manage income source master data.</p>
                  <a href="${pageContext.request.contextPath}/finance/income-source" class="btn btn-outline-success btn-sm">Manage</a>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-info text-white">Other Income</div>
                <div class="card-body">
                  <p>Record workshop and product income.</p>
                  <a href="${pageContext.request.contextPath}/finance/other-income" class="btn btn-outline-info btn-sm">Manage</a>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-primary text-white">Student Payments</div>
                <div class="card-body">
                  <p>View all student fee receipts.</p>
                  <a href="${pageContext.request.contextPath}/finance/student-payments" class="btn btn-outline-primary btn-sm">View</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🧾 Expense Management -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingExpense">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExpense">
          🧾 Expense Management
        </button>
      </h2>
      <div id="collapseExpense" class="accordion-collapse collapse" data-bs-parent="#financeAccordion">
        <div class="accordion-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-danger text-white">Expense Categories</div>
                <div class="card-body">
                  <p>Define and manage expense categories.</p>
                  <a href="${pageContext.request.contextPath}/finance/expense-categories" class="btn btn-outline-danger btn-sm">Manage</a>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-warning text-dark">Operational Expenses</div>
                <div class="card-body">
                  <p>Track office and operational spending.</p>
                  <a href="${pageContext.request.contextPath}/finance/expenses" class="btn btn-outline-warning btn-sm">Manage</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 👨‍🏫 Payroll -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingPayroll">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePayroll">
          👨‍🏫 Payroll & Payouts
        </button>
      </h2>
      <div id="collapsePayroll" class="accordion-collapse collapse" data-bs-parent="#financeAccordion">
        <div class="accordion-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-secondary text-white">Mentor Payouts</div>
                <div class="card-body">
                  <p>View and process mentor payments.</p>
                  <a href="${pageContext.request.contextPath}/finance/mentor-payouts" class="btn btn-outline-secondary btn-sm">Manage</a>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-dark text-white">Salary Payouts</div>
                <div class="card-body">
                  <p>Track staff salary payouts.</p>
                  <a href="${pageContext.request.contextPath}/finance/salary-payouts" class="btn btn-outline-dark btn-sm">View</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 📊 Reports -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingReports">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseReports">
          📊 Reports & Analysis
        </button>
      </h2>
      <div id="collapseReports" class="accordion-collapse collapse" data-bs-parent="#financeAccordion">
        <div class="accordion-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-info text-white">Monthly Reports</div>
                <div class="card-body">
                  <p>Generate income, expense, and profit summaries.</p>
                  <a href="${pageContext.request.contextPath}/finance/reports" class="btn btn-outline-info btn-sm">View Reports</a>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow-sm text-center h-100">
                <div class="card-header bg-success text-white">Finance Ledger</div>
                <div class="card-body">
                  <p>View all transactions in one ledger.</p>
                  <a href="${pageContext.request.contextPath}/finance/ledger" class="btn btn-outline-success btn-sm">View Ledger</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div> <!-- /accordion -->
</div> <!-- /container -->

<jsp:include page="/WEB-INF/views/footer.jsp" />

<!-- === Required JS === -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
  const incomeCtx = document.getElementById('incomeChart');
  const expenseCtx = document.getElementById('expenseChart');

  const incomeData = {
    labels: [<c:forEach var="e" items="${incomeBySource}">"${e.key}",</c:forEach>],
    datasets: [{
      label: 'Income',
      data: [<c:forEach var="e" items="${incomeBySource}">${e.value},</c:forEach>],
      backgroundColor: ['#28a745', '#6fcf97', '#a5d6a7', '#c8e6c9']
    }]
  };

  const expenseData = {
    labels: [<c:forEach var="e" items="${expenseByCategory}">"${e.key}",</c:forEach>],
    datasets: [{
      label: 'Expense',
      data: [<c:forEach var="e" items="${expenseByCategory}">${e.value},</c:forEach>],
      backgroundColor: ['#ff6b6b', '#f8c471', '#f1948a', '#f5b7b1']
    }]
  };

  new Chart(incomeCtx, { type: 'pie', data: incomeData });
  new Chart(expenseCtx, { type: 'bar', data: expenseData });
</script>
</body>
</html>
