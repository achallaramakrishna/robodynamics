<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Lab Manual Admin View</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
<style>
.step-card { border-left: 4px solid #0d6efd; }
.code-preview {
    background: #1e293b;
    color: #e2e8f0;
    font-family: Consolas, monospace;
    font-size: 12.5px;
    padding: 12px;
    border-radius: 6px;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
}
.section-header { background: #f1f5f9; border-radius: 8px; padding: 10px 16px; margin-bottom: 12px; }
</style>
</head>
<body class="bg-light">

<jsp:include page="../fragments/header.jsp"/>

<div class="container-fluid py-4 px-4">
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
            <h4 class="mb-0"><i class="bi bi-journal-code me-2 text-primary"></i>${fn:escapeXml(manual.title)}</h4>
            <div class="text-muted small">Lab Manual ID: ${manual.labManualId} &nbsp;|&nbsp; Session Detail: ${manual.sessionDetailId}</div>
        </div>
        <div class="d-flex gap-2">
            <a href="${pageContext.request.contextPath}/student/labmanual/${manual.labManualId}"
               class="btn btn-success btn-sm" target="_blank">
                <i class="bi bi-eye me-1"></i>Student Preview
            </a>
            <a href="${pageContext.request.contextPath}/admin/labmanual/list?sessionDetailId=${manual.sessionDetailId}"
               class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i>Back to List
            </a>
        </div>
    </div>

    <!-- Meta -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body py-3">
                    <div class="fs-4 fw-bold text-primary">${manual.estimatedTimeMinutes}</div>
                    <div class="text-muted small">Minutes</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body py-3">
                    <div class="fs-4 fw-bold text-success">${fn:length(manual.sections)}</div>
                    <div class="text-muted small">Sections</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body py-3">
                    <div class="fs-4 fw-bold text-warning">${fn:escapeXml(manual.difficultyLevel)}</div>
                    <div class="text-muted small">Difficulty</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body py-3">
                    <div class="fs-4 fw-bold text-info">v${fn:escapeXml(manual.version)}</div>
                    <div class="text-muted small">Version</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Objective -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h6 class="text-muted text-uppercase small mb-2">Objective</h6>
            <p class="mb-0">${fn:escapeXml(manual.objective)}</p>
        </div>
    </div>

    <!-- Sections + Steps -->
    <c:forEach items="${manual.sections}" var="sec" varStatus="sIdx">
        <div class="card shadow-sm mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge bg-secondary me-2">${sec.sectionType}</span>
                    <strong>${fn:escapeXml(sec.title)}</strong>
                    <span class="text-muted small ms-2">Order: ${sec.displayOrder}</span>
                </div>
                <span class="badge bg-light text-dark border">${fn:length(sec.steps)} step(s)</span>
            </div>
            <div class="card-body">
                <c:forEach items="${sec.steps}" var="step">
                    <div class="card mb-3 step-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge bg-primary me-2">Step ${step.stepNumber}</span>
                                    <strong>${fn:escapeXml(step.heading)}</strong>
                                </div>
                                <!-- Upload image for this step -->
                                <button class="btn btn-outline-secondary btn-sm"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#upload-${step.labStepId}">
                                    <i class="bi bi-image me-1"></i>Add Image
                                </button>
                            </div>

                            <div class="text-muted small mb-2">
                                ${step.instructionHtml}
                            </div>

                            <c:if test="${not empty step.expectedOutputHtml}">
                                <div class="mt-2">
                                    <small class="text-success fw-semibold"><i class="bi bi-terminal me-1"></i>Expected Output:</small>
                                    <div class="code-preview mt-1">${fn:escapeXml(step.expectedOutputHtml)}</div>
                                </div>
                            </c:if>

                            <!-- Code blocks preview -->
                            <c:forEach items="${step.codeBlocks}" var="cb">
                                <div class="mt-2">
                                    <small class="text-info"><i class="bi bi-code-slash me-1"></i>${fn:escapeXml(cb.language)}</small>
                                    <div class="code-preview mt-1"><c:out value="${cb.codeContent}"/></div>
                                </div>
                            </c:forEach>

                            <!-- Image upload collapse panel -->
                            <div class="collapse mt-3" id="upload-${step.labStepId}">
                                <div class="border rounded p-3 bg-light">
                                    <h6 class="small fw-semibold mb-2">Upload Image for Step ${step.stepNumber}</h6>
                                    <form class="d-flex gap-2 align-items-end"
                                          onsubmit="uploadStepImage(event, ${manual.labManualId}, ${step.labStepId}, this)">
                                        <div class="flex-grow-1">
                                            <input type="file" name="file" class="form-control form-control-sm"
                                                   accept="image/*" required/>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-sm">
                                            <i class="bi bi-upload me-1"></i>Upload
                                        </button>
                                    </form>
                                    <div class="mt-2 text-success small upload-result-${step.labStepId}"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </c:forEach>
            </div>
        </div>
    </c:forEach>

</div>

<jsp:include page="../fragments/footer.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
function uploadStepImage(e, labManualId, stepId, form) {
    e.preventDefault();
    const fd = new FormData(form);
    fd.append('labManualId', labManualId);
    fd.append('stepId', stepId);
    const resultDiv = document.querySelector('.upload-result-' + stepId);
    resultDiv.textContent = 'Uploading...';
    fetch('${pageContext.request.contextPath}/admin/labmanual/media/upload', {
        method: 'POST',
        body: fd
    }).then(r => r.text()).then(t => {
        if (t.startsWith('SUCCESS')) {
            resultDiv.textContent = '✅ Image uploaded successfully!';
            resultDiv.className = resultDiv.className.replace('text-danger','text-success');
            form.reset();
        } else {
            resultDiv.textContent = '❌ ' + t;
            resultDiv.className = resultDiv.className.replace('text-success','text-danger');
        }
    }).catch(err => {
        resultDiv.textContent = '❌ Upload failed: ' + err;
    });
}
</script>
</body>
</html>
