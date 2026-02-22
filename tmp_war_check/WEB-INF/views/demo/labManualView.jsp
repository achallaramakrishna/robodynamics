<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${manual.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
body{
    background:#0f172a;
    color:#f8fafc;
    font-family:"Segoe UI", sans-serif;
}
.sidebar{
    background:#0b1220;
    min-height:100vh;
    position:sticky;
    top:0;
    align-self:flex-start;
}
.sidebar a{
    color:#cbd5e1;
    text-decoration:none;
    display:block;
    margin:8px 0;
}
.sidebar a:hover{ color:#ffffff; }

.section{
    background:#1e293b;
    padding:30px;
    border-radius:10px;
    margin-bottom:30px;
}

.code-block{
    background:#0b1120;
    padding:20px;
    border-radius:8px;
    font-family:Consolas, monospace;
    font-size:14px;
    white-space:pre-wrap;
    overflow-x:auto;
    display:none;
    border:1px solid rgba(148,163,184,0.15);
    position:relative;
}

.copy-btn{
    position:absolute;
    top:10px;
    right:10px;
}

.progress-container{
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    z-index:999;
}
.badge-soft{
    background:rgba(59,130,246,0.15);
    border:1px solid rgba(59,130,246,0.25);
    color:#93c5fd;
}
.small-note{ color:#cbd5e1; }
hr.border-soft{ border-color: rgba(148,163,184,0.25) !important; }

img{
    max-width:100%;
    border-radius:8px;
    margin-top:15px;
    min-height:180px;
    object-fit:cover;
}
</style>
</head>

<body>

<div class="container-fluid">
<div class="row">

<!-- SIDEBAR -->
<div class="col-md-3 col-lg-2 sidebar p-4">

    <h5 class="text-info mb-2">${manual.title}</h5>
    <div class="small-note mb-3">
        Difficulty:
        <span class="badge badge-soft">${manual.difficultyLevel}</span>
    </div>

    <hr class="border-secondary">

    <a href="#objective">Objective</a>

    <c:forEach var="section" items="${manual.sections}">
        <a href="#section-${section.labSectionId}">
            ${section.title}
        </a>
    </c:forEach>

</div>


<!-- MAIN CONTENT -->
<div class="col-md-9 col-lg-10 p-5">

<h1 class="text-info">${manual.title}</h1>
<h5 class="mb-4 text-secondary">${manual.subtitle}</h5>

<!-- OBJECTIVE -->
<div class="section" id="objective">
    <h3>🎯 Objective</h3>
    <p>${manual.objective}</p>
</div>


<!-- SECTIONS -->
<c:forEach var="section" items="${manual.sections}">

<div class="section" id="section-${section.labSectionId}">
    <h3>${section.title}</h3>

    <c:forEach var="step" items="${section.steps}">

        <div class="mt-4">

            <h5>
                Step ${step.stepNo}
                <span class="text-info">${step.heading}</span>
            </h5>

            <div class="mt-3">
                ${step.instructionHtml}
            </div>

            <!-- CODE BLOCK -->
            <c:if test="${not empty step.codeBlock}">
                <div class="mt-3">
                    <button class="btn btn-info btn-sm"
                            onclick="toggleCode('code-${step.stepId}')">
                        Show Code
                    </button>

                    <div class="code-block mt-3"
                         id="code-${step.stepId}">
                        <button class="btn btn-sm btn-outline-info copy-btn"
                                onclick="copyCode('code-${step.stepId}', this)">
                            Copy
                        </button>
${step.codeBlock}
                    </div>
                </div>
            </c:if>

            <!-- EXPECTED OUTPUT -->
            <c:if test="${not empty step.expectedOutputHtml}">
                <div class="mt-3 text-warning">
                    <strong>Expected Output:</strong>
                    ${step.expectedOutputHtml}
                </div>
            </c:if>

            <!-- STEP IMAGES -->
            <div class="row mt-3">
                <c:forEach var="media" items="${manual.media}">
                    <c:if test="${media.step.stepId == step.stepId}">
                        <div class="col-md-4 mb-3">
                            <img src="${pageContext.request.contextPath}/admin/labmanual/media/view/${media.mediaId}"
                                 onerror="this.onerror=null;this.src='${pageContext.request.contextPath}/resources/images/placeholder.png';">
                        </div>
                    </c:if>
                </c:forEach>
            </div>

            <hr class="border-soft mt-4">

        </div>

    </c:forEach>

</div>

</c:forEach>

</div>
</div>
</div>

<!-- PROGRESS BAR -->
<div class="progress-container">
<div class="progress">
  <div class="progress-bar bg-info" id="progressBar"></div>
</div>
</div>

<script>
function toggleCode(id){
    const el=document.getElementById(id);
    el.style.display = el.style.display==="block"?"none":"block";
}

function copyCode(id, button){
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(()=>{
        button.innerText="Copied!";
        setTimeout(()=>button.innerText="Copy",1500);
    });
}

document.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;
    document.getElementById("progressBar").style.width = percent + "%";
});
</script>

</body>
</html>
