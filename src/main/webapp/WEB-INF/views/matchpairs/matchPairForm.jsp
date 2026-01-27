<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Match Pair</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Back -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/matchpairs/pairs?matchQuestionId=${matchQuestion.matchQuestionId}';">
        Back to Pairs
    </button>

    <h2 class="mb-4">
        <c:choose>
            <c:when test="${not empty matchPair}">
                Edit Match Pair
            </c:when>
            <c:otherwise>
                Add Match Pair
            </c:otherwise>
        </c:choose>
    </h2>

    <!-- Flash Messages -->
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- ================= FORM ================= -->
    <form method="post"
          action="${pageContext.request.contextPath}/matchpairs/pair/save"
          class="card p-4 shadow-sm">

        <!-- Hidden IDs -->
        <input type="hidden" name="matchQuestionId"
               value="${matchQuestion.matchQuestionId}" />

        <c:if test="${not empty matchPair}">
            <input type="hidden" name="matchPairId"
                   value="${matchPair.matchPairId}" />
        </c:if>

        <!-- ================= LEFT SIDE ================= -->

        <h5 class="mb-3">Left Side</h5>

        <div class="mb-3">
            <label class="form-label">Left Text</label>
            <input type="text"
                   name="leftText"
                   class="form-control"
                   required
                   value="${matchPair.leftText}">
        </div>

        <div class="mb-3">
            <label class="form-label">Left Type</label>
            <select name="leftType" class="form-control">
                <option value="TEXT"
                    <c:if test="${matchPair.leftType == 'TEXT'}">selected</c:if>>
                    TEXT
                </option>
                <option value="IMAGE"
                    <c:if test="${matchPair.leftType == 'IMAGE'}">selected</c:if>>
                    IMAGE
                </option>
            </select>
            <div class="form-text">
                IMAGE type expects an uploaded image in Media Manager.
            </div>
        </div>

        <!-- ================= RIGHT SIDE ================= -->

        <h5 class="mb-3 mt-4">Right Side</h5>

        <div class="mb-3">
            <label class="form-label">Right Text</label>
            <input type="text"
                   name="rightText"
                   class="form-control"
                   required
                   value="${matchPair.rightText}">
        </div>

        <div class="mb-3">
            <label class="form-label">Right Type</label>
            <select name="rightType" class="form-control">
                <option value="TEXT"
                    <c:if test="${matchPair.rightType == 'TEXT'}">selected</c:if>>
                    TEXT
                </option>
                <option value="IMAGE"
                    <c:if test="${matchPair.rightType == 'IMAGE'}">selected</c:if>>
                    IMAGE
                </option>
            </select>
            <div class="form-text">
                IMAGE type expects an uploaded image in Media Manager.
            </div>
        </div>

        <!-- ================= ORDER ================= -->

        <div class="mb-3 mt-4">
            <label class="form-label">Display Order</label>
            <input type="number"
                   name="displayOrder"
                   class="form-control"
                   min="1"
                   value="${matchPair.displayOrder}">
            <div class="form-text">
                Used for admin ordering; student UI can shuffle.
            </div>
        </div>

        <!-- ================= SUBMIT ================= -->

        <div class="mt-4 d-flex gap-2">
            <button type="submit" class="btn btn-success">
                Save Match Pair
            </button>
            <a href="${pageContext.request.contextPath}/matchpairs/pairs?matchQuestionId=${matchQuestion.matchQuestionId}"
               class="btn btn-outline-secondary">
                Cancel
            </a>
        </div>

    </form>

</div>

<jsp:include page="/footer.jsp" />

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
