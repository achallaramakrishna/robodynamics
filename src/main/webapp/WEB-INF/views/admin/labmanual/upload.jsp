<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Upload Lab Manual | Admin</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
</head>
<body class="bg-light">

<jsp:include page="../fragments/header.jsp"/>

<div class="container py-4" style="max-width:860px;">
    <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="${pageContext.request.contextPath}/home">Admin</a></li>
            <li class="breadcrumb-item active">Upload Lab Manual</li>
        </ol>
    </nav>

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <i class="bi bi-upload me-2"></i>Upload Lab Manual (JSON)
        </div>
        <div class="card-body">

            <c:if test="${not empty error}">
                <div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>${error}</div>
            </c:if>

            <p class="text-muted small">
                Paste the full Lab Manual JSON. The system will parse it and save all sections, steps and code blocks.
                After upload, you can attach images for each step from the <strong>View</strong> page.
            </p>

            <form method="post" action="${pageContext.request.contextPath}/admin/labmanual/upload">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Session Detail ID</label>
                    <input type="number" name="sessionDetailId" class="form-control" required
                           placeholder="e.g. 1022"
                           title="This overrides the sessionDetailId in the JSON if provided"/>
                    <div class="form-text">Leave blank to use the value from the JSON.</div>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Created By (User ID)</label>
                    <input type="number" name="createdBy" class="form-control" value="1"/>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Lab Manual JSON</label>
                    <textarea name="labManualJson" class="form-control font-monospace"
                              rows="18" required
                              placeholder='Paste JSON here...'></textarea>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-cloud-upload me-1"></i>Upload & Save
                    </button>
                    <button type="button" class="btn btn-outline-secondary" onclick="loadSample()">
                        <i class="bi bi-file-code me-1"></i>Load Sample
                    </button>
                    <button type="button" class="btn btn-outline-info" onclick="validateJson()">
                        <i class="bi bi-check2-circle me-1"></i>Validate JSON
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>

<jsp:include page="../fragments/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
const SAMPLE = {
  "assetType": "labmanual",
  "courseId": 55,
  "sessionId": 34,
  "sessionDetailId": 1022,
  "title": "Spring Core Lab 01 – Traditional Java (Before Spring)",
  "subtitle": "Understanding Tight Coupling and Manual Dependency Creation",
  "version": 1,
  "difficultyLevel": "beginner",
  "estimatedTimeMinutes": 60,
  "objective": "Understand how objects are created manually in traditional Java and why it leads to tight coupling.",
  "prerequisites": "Basic Java knowledge, Maven basics",
  "sections": [
    {
      "title": "Introduction",
      "sectionType": "INTRO",
      "displayOrder": 1,
      "steps": [
        {
          "stepNo": 1,
          "heading": "What is Tight Coupling?",
          "instructionHtml": "<p>In traditional Java, objects are created using the <code>new</code> keyword.</p>",
          "expectedOutputHtml": null,
          "codeBlocks": [],
          "media": []
        }
      ]
    }
  ]
};

function loadSample() {
    document.querySelector('textarea[name="labManualJson"]').value = JSON.stringify(SAMPLE, null, 2);
}

function validateJson() {
    const ta = document.querySelector('textarea[name="labManualJson"]');
    try {
        JSON.parse(ta.value);
        alert('✅ Valid JSON!');
    } catch(e) {
        alert('❌ Invalid JSON: ' + e.message);
    }
}
</script>
</body>
</html>
