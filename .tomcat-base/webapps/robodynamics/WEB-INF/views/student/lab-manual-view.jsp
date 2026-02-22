<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${fn:escapeXml(manual.title)} | Lab Manual</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
<style>
/* ===== DARK THEME ===== */
body {
    background: #0f172a;
    color: #f8fafc;
    font-family: "Segoe UI", sans-serif;
    min-height: 100vh;
}

/* ===== SIDEBAR ===== */
.lab-sidebar {
    background: #0b1220;
    min-height: 100vh;
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: 100vh;
    overflow-y: auto;
    border-right: 1px solid rgba(148,163,184,0.1);
}
.lab-sidebar a {
    color: #94a3b8;
    text-decoration: none;
    display: block;
    padding: 6px 0;
    font-size: 0.875rem;
    border-left: 3px solid transparent;
    padding-left: 8px;
    transition: all 0.15s;
}
.lab-sidebar a:hover, .lab-sidebar a.active {
    color: #38bdf8;
    border-left-color: #38bdf8;
}
.section-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    vertical-align: middle;
}
.badge-intro    { background: rgba(59,130,246,0.2);  color: #93c5fd; border: 1px solid rgba(59,130,246,0.3); }
.badge-step     { background: rgba(16,185,129,0.2);  color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
.badge-theory   { background: rgba(245,158,11,0.2);  color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
.badge-summary  { background: rgba(139,92,246,0.2);  color: #c4b5fd; border: 1px solid rgba(139,92,246,0.3); }

/* ===== CONTENT SECTIONS ===== */
.lab-section {
    background: #1e293b;
    padding: 28px 32px;
    border-radius: 12px;
    margin-bottom: 28px;
    border: 1px solid rgba(148,163,184,0.08);
}
.lab-section h3 {
    color: #e2e8f0;
    margin-bottom: 18px;
}
.step-card {
    background: #0f172a;
    border-radius: 8px;
    padding: 18px 20px;
    margin-bottom: 16px;
    border-left: 3px solid #38bdf8;
}
.step-card h5 {
    color: #7dd3fc;
    font-size: 1rem;
    margin-bottom: 10px;
}

/* ===== CODE BLOCKS ===== */
.code-wrapper {
    position: relative;
    margin-top: 12px;
}
.code-block {
    background: #0b1120;
    padding: 18px 20px;
    border-radius: 8px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 13.5px;
    white-space: pre;
    overflow-x: auto;
    display: none;
    border: 1px solid rgba(148,163,184,0.12);
    line-height: 1.6;
    color: #e2e8f0;
}
.code-block.visible { display: block; }
.btn-toggle-code {
    background: rgba(14,165,233,0.15);
    border: 1px solid rgba(14,165,233,0.3);
    color: #38bdf8;
    font-size: 0.8rem;
    border-radius: 6px;
    padding: 4px 12px;
}
.btn-toggle-code:hover { background: rgba(14,165,233,0.25); color: #7dd3fc; }
.btn-copy {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(30,41,59,0.9);
    border: 1px solid rgba(148,163,184,0.2);
    color: #94a3b8;
    font-size: 0.75rem;
    border-radius: 5px;
    padding: 3px 10px;
    z-index: 2;
}
.btn-copy:hover { color: #f8fafc; }
.lang-badge {
    font-size: 0.7rem;
    background: rgba(99,102,241,0.2);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    border-radius: 4px;
    padding: 2px 7px;
    margin-right: 6px;
}

/* ===== EXPECTED OUTPUT ===== */
.expected-output {
    background: #0d1f12;
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 8px;
    padding: 14px 16px;
    font-family: Consolas, monospace;
    font-size: 13px;
    color: #6ee7b7;
    white-space: pre-wrap;
    margin-top: 10px;
}

/* ===== META INFO BAR ===== */
.meta-bar {
    background: #1e293b;
    border-radius: 10px;
    padding: 14px 20px;
    margin-bottom: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    border: 1px solid rgba(148,163,184,0.08);
}
.meta-item { color: #94a3b8; font-size: 0.875rem; }
.meta-item span { color: #e2e8f0; font-weight: 600; }

/* ===== PROGRESS BAR ===== */
.progress-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    height: 4px;
}
.progress-container .progress { height: 4px; border-radius: 0; background: rgba(30,41,59,0.8); }
.progress-bar { background: linear-gradient(90deg, #38bdf8, #818cf8); transition: width 0.1s; }

/* ===== SECTION TYPE ICONS ===== */
.icon-intro   { color: #60a5fa; }
.icon-step    { color: #34d399; }
.icon-theory  { color: #fbbf24; }
.icon-summary { color: #a78bfa; }

/* ===== MOBILE ===== */
@media (max-width: 768px) {
    .lab-sidebar { min-height: auto; position: static; max-height: none; }
    .lab-section { padding: 18px; }
}
</style>
</head>
<body>

<jsp:include page="../header.jsp"/>

<div class="container-fluid">
<div class="row g-0">

<!-- ===== SIDEBAR ===== -->
<div class="col-md-3 col-lg-2 lab-sidebar p-3">
    <div class="mb-3">
        <div class="text-info fw-bold" style="font-size:0.95rem;">${fn:escapeXml(manual.title)}</div>
        <div style="color:#64748b; font-size:0.78rem;" class="mt-1">${fn:escapeXml(manual.difficultyLevel)}</div>
    </div>
    <hr style="border-color:rgba(148,163,184,0.15)"/>

    <a href="#overview">📋 Overview</a>
    <c:forEach items="${manual.sections}" var="sec">
        <a href="#section-${sec.labSectionId}">
            <c:choose>
                <c:when test="${sec.sectionType == 'INTRO'}">📘</c:when>
                <c:when test="${sec.sectionType == 'THEORY'}">📖</c:when>
                <c:when test="${sec.sectionType == 'SUMMARY'}">✅</c:when>
                <c:otherwise>⚙</c:otherwise>
            </c:choose>
            ${fn:escapeXml(sec.title)}
        </a>
    </c:forEach>
</div>

<!-- ===== MAIN CONTENT ===== -->
<div class="col-md-9 col-lg-10 p-4 p-md-5">

    <!-- Title -->
    <h1 class="text-info mb-1" style="font-size:1.75rem;">${fn:escapeXml(manual.title)}</h1>
    <p class="text-secondary mb-4">${fn:escapeXml(manual.objective)}</p>

    <!-- Meta bar -->
    <div class="meta-bar">
        <div class="meta-item"><i class="bi bi-clock me-1"></i>Est. time: <span>${manual.estimatedTimeMinutes} min</span></div>
        <div class="meta-item"><i class="bi bi-bar-chart me-1"></i>Level: <span>${fn:escapeXml(manual.difficultyLevel)}</span></div>
        <div class="meta-item"><i class="bi bi-book me-1"></i>Version: <span>v${fn:escapeXml(manual.version)}</span></div>
        <div class="meta-item"><i class="bi bi-layers me-1"></i>Sections: <span>${fn:length(manual.sections)}</span></div>
    </div>

    <!-- Overview / Objective -->
    <div class="lab-section" id="overview">
        <h3 class="icon-intro"><i class="bi bi-info-circle me-2"></i>Overview</h3>
        <p>${fn:escapeXml(manual.objective)}</p>
        <c:if test="${not empty manual.reflectionQuestions}">
            <h5 class="mt-3" style="color:#fbbf24;">Reflection Questions</h5>
            <p style="color:#cbd5e1;">${manual.reflectionQuestions}</p>
        </c:if>
    </div>

    <!-- SECTIONS -->
    <c:forEach items="${manual.sections}" var="sec">
        <div class="lab-section" id="section-${sec.labSectionId}">

            <%-- Section header with type badge --%>
            <h3>
                <c:choose>
                    <c:when test="${sec.sectionType == 'INTRO'}">
                        <span class="icon-intro"><i class="bi bi-book me-2"></i></span>
                        <span class="section-badge badge-intro">${sec.sectionType}</span>
                    </c:when>
                    <c:when test="${sec.sectionType == 'THEORY'}">
                        <span class="icon-theory"><i class="bi bi-lightbulb me-2"></i></span>
                        <span class="section-badge badge-theory">${sec.sectionType}</span>
                    </c:when>
                    <c:when test="${sec.sectionType == 'SUMMARY'}">
                        <span class="icon-summary"><i class="bi bi-check2-circle me-2"></i></span>
                        <span class="section-badge badge-summary">${sec.sectionType}</span>
                    </c:when>
                    <c:otherwise>
                        <span class="icon-step"><i class="bi bi-terminal me-2"></i></span>
                        <span class="section-badge badge-step">STEP</span>
                    </c:otherwise>
                </c:choose>
                &nbsp;${fn:escapeXml(sec.title)}
            </h3>

            <%-- STEPS --%>
            <c:forEach items="${sec.steps}" var="step" varStatus="st">
                <div class="step-card">
                    <h5>
                        <span class="badge bg-secondary me-2" style="font-size:0.7rem;">Step ${step.stepNumber}</span>
                        ${fn:escapeXml(step.heading)}
                    </h5>

                    <%-- Instruction HTML (rendered as HTML, not escaped) --%>
                    <c:if test="${not empty step.instructionHtml}">
                        <div class="mb-2" style="color:#cbd5e1;">${step.instructionHtml}</div>
                    </c:if>
                    <c:if test="${empty step.instructionHtml and not empty step.instruction}">
                        <p style="color:#cbd5e1;">${fn:escapeXml(step.instruction)}</p>
                    </c:if>

                    <%-- Code blocks --%>
                    <c:forEach items="${step.codeBlocks}" var="cb" varStatus="cbSt">
                        <c:set var="cbId" value="cb_${sec.labSectionId}_${step.labStepId}_${cbSt.index}"/>
                        <div class="code-wrapper">
                            <c:if test="${cb.showToggle}">
                                <button class="btn btn-toggle-code btn-sm mb-2"
                                        onclick="toggleCode('${cbId}', this)">
                                    <i class="bi bi-code-slash me-1"></i>
                                    <span class="lang-badge">${fn:escapeXml(cb.language)}</span>
                                    Show Code
                                </button>
                            </c:if>
                            <div id="${cbId}" class="code-block${cb.showToggle ? '' : ' visible'}">
                                <button class="btn btn-copy btn-sm" onclick="copyCode('${cbId}', this)">
                                    <i class="bi bi-clipboard me-1"></i>Copy
                                </button>
                                <c:out value="${cb.codeContent}" escapeXml="true"/>
                            </div>
                        </div>
                    </c:forEach>

                    <%-- Expected output --%>
                    <c:if test="${not empty step.expectedOutputHtml}">
                        <div class="mt-3">
                            <small style="color:#64748b;"><i class="bi bi-terminal me-1"></i>Expected Output</small>
                            <div class="expected-output">${step.expectedOutputHtml}</div>
                        </div>
                    </c:if>
                    <c:if test="${empty step.expectedOutputHtml and not empty step.expectedOutput}">
                        <div class="mt-3">
                            <small style="color:#64748b;"><i class="bi bi-terminal me-1"></i>Expected Output</small>
                            <div class="expected-output"><c:out value="${step.expectedOutput}"/></div>
                        </div>
                    </c:if>

                </div><%-- end step-card --%>
            </c:forEach>

        </div><%-- end lab-section --%>
    </c:forEach>

    <!-- Done banner -->
    <div class="text-center py-4">
        <div style="color:#34d399; font-size:2rem;"><i class="bi bi-check-circle-fill"></i></div>
        <div class="mt-2" style="color:#94a3b8;">You've reached the end of this lab manual.</div>
    </div>

</div><%-- end main col --%>
</div><%-- end row --%>
</div><%-- end container --%>

<!-- Fixed progress bar -->
<div class="progress-container">
    <div class="progress">
        <div class="progress-bar" id="progressBar" style="width:0%"></div>
    </div>
</div>

<jsp:include page="../footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
// Toggle code block visibility
function toggleCode(id, btn) {
    const el = document.getElementById(id);
    const visible = el.classList.toggle('visible');
    const icon = btn.querySelector('i');
    if (visible) {
        btn.innerHTML = btn.innerHTML.replace('Show Code', 'Hide Code');
        icon.className = 'bi bi-eye-slash me-1';
    } else {
        btn.innerHTML = btn.innerHTML.replace('Hide Code', 'Show Code');
        icon.className = 'bi bi-code-slash me-1';
    }
}

// Copy code content to clipboard
function copyCode(id, btn) {
    const el = document.getElementById(id);
    // Get text, skip the copy button text itself
    let text = el.innerText;
    // Remove "Copy" button text from the start if present
    text = text.replace(/^\s*Copy\s*/, '');

    const doCopy = (t) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(t).then(() => showCopied(btn)).catch(() => fallback(t, btn));
        } else {
            fallback(t, btn);
        }
    };
    doCopy(text);
}

function fallback(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    showCopied(btn);
}

function showCopied(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check2 me-1"></i>Copied!';
    btn.style.color = '#34d399';
    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1800);
}

// Reading progress bar
document.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = height > 0 ? (scrollTop / height) * 100 : 0;
        document.getElementById('progressBar').style.width = pct + '%';
    });
});

// Highlight active sidebar link on scroll
const sideLinks = document.querySelectorAll('.lab-sidebar a');
const sections = document.querySelectorAll('[id^="section-"], #overview');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            sideLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector('.lab-sidebar a[href="#' + e.target.id + '"]');
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => observer.observe(s));
</script>
</body>
</html>
