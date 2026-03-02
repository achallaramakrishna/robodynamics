<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Create Exam Paper</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${ctx}/resources/css/rd-platform-shell.css">
    <style>
        .chip-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 8px;
        }
        .session-chip {
            border: 1px solid #dfe4ea;
            border-radius: 8px;
            padding: 10px;
            background: #fff;
        }
        .result-card {
            border: 1px solid #d6e9c6;
            border-radius: 10px;
            background: #f8fff2;
            padding: 14px;
        }
    </style>
</head>
<body class="rd-shell-page">
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="rd-shell">
    <section class="rd-hero">
        <div>
            <p class="rd-eyebrow">Exam Preparation</p>
            <h1 class="rd-hero-title">Create Exam Paper</h1>
            <p class="rd-hero-sub">Select chapters, difficulty, and exam type to generate exam papers from your question bank.</p>
        </div>
    </section>

    <div class="rd-content">
        <div class="card">
            <div class="card-body">
                <form id="createExamForm" class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Course</label>
                        <select id="courseId" class="form-select" required>
                            <option value="">Select course</option>
                            <c:forEach var="course" items="${courses}">
                                <option value="${course.courseId}" <c:if test="${course.courseId == defaultCourseId}">selected</c:if>>${course.courseName}</option>
                            </c:forEach>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Exam Type</label>
                        <select id="examType" class="form-select">
                            <option value="FINAL_EXAM">Final Exam</option>
                            <option value="MID_TERM">Mid Term</option>
                            <option value="UNIT_TEST">Unit Test</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Year</label>
                        <input id="examYear" type="number" class="form-control" value="${currentYear}" min="2000" max="2100">
                    </div>

                    <div class="col-12">
                        <label class="form-label">Chapters / Sessions</label>
                        <div id="sessionList" class="chip-grid"></div>
                        <div class="form-text">Choose one or more chapters to build paper sections from question bank.</div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Question Types</label>
                        <div class="d-flex flex-wrap gap-3">
                            <label><input type="checkbox" name="questionType" value="multiple_choice" checked> MCQ</label>
                            <label><input type="checkbox" name="questionType" value="short_answer" checked> Short Answer</label>
                            <label><input type="checkbox" name="questionType" value="long_answer" checked> Long Answer</label>
                            <label><input type="checkbox" name="questionType" value="fill_in_blank"> Fill in the Blank</label>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Difficulty</label>
                        <div class="d-flex flex-wrap gap-3">
                            <label><input type="checkbox" name="difficulty" value="Easy" checked> Easy</label>
                            <label><input type="checkbox" name="difficulty" value="Medium" checked> Medium</label>
                            <label><input type="checkbox" name="difficulty" value="Hard" checked> Hard</label>
                            <label><input type="checkbox" name="difficulty" value="Expert" checked> Expert</label>
                        </div>
                        <div class="form-text">For exam sprint mode, keep <strong>Hard + Expert</strong> selected.</div>
                    </div>

                    <div class="col-md-2">
                        <label class="form-label">Total Marks</label>
                        <input id="totalMarks" type="number" class="form-control" value="50" min="1" required>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Duration (min)</label>
                        <input id="durationMinutes" type="number" class="form-control" value="90" min="15">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">No. of Papers</label>
                        <input id="numberOfPapers" type="number" class="form-control" value="1" min="1" max="10">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Board</label>
                        <input id="board" type="text" class="form-control" value="CBSE">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Title Prefix</label>
                        <input id="titlePrefix" type="text" class="form-control" value="Exam Preparation">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Subject (optional)</label>
                        <input id="subject" type="text" class="form-control" placeholder="e.g., New Enjoying Mathematics">
                    </div>
                    <div class="col-md-6 d-flex align-items-end">
                        <div class="form-check">
                            <input id="allowAiAugmentation" class="form-check-input" type="checkbox" checked>
                            <label for="allowAiAugmentation" class="form-check-label">
                                Allow AI to generate additional questions if bank is insufficient
                            </label>
                        </div>
                    </div>

                    <c:if test="${isAdminExamPrep}">
                        <div class="col-md-3">
                            <label class="form-label">AI Bank Target Marks</label>
                            <input id="aiTargetMarks" type="number" class="form-control" value="40" min="1">
                        </div>
                    </c:if>

                    <div class="col-12 d-flex gap-2">
                        <c:if test="${isAdminExamPrep}">
                            <button id="extractExercisesBtn" type="button" class="btn btn-outline-dark">Extract Exercises (PDF -> JSON -> Upload)</button>
                            <button id="prepareBankBtn" type="button" class="btn btn-outline-primary">Prepare Question Bank</button>
                        </c:if>
                        <button id="createBtn" type="submit" class="btn btn-primary">Create Exam Paper</button>
                        <a href="${ctx}${homePath}" class="btn btn-outline-secondary">Back to Dashboard</a>
                    </div>

                    <c:if test="${isAdminExamPrep}">
                        <div class="col-md-2">
                            <label class="form-label">Max PDFs</label>
                            <input id="maxPdfs" type="number" class="form-control" value="25" min="1">
                        </div>
                        <div class="col-md-3 d-flex align-items-end">
                            <div class="form-check">
                                <input id="dryRunExtract" class="form-check-input" type="checkbox">
                                <label for="dryRunExtract" class="form-check-label">Dry-run (extract JSON only)</label>
                            </div>
                        </div>

                        <div class="col-12"><hr></div>
                        <div class="col-md-4">
                            <label class="form-label">Upload Question Bank JSON</label>
                            <input id="qbankFile" type="file" class="form-control" accept=".json">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Map to Session</label>
                            <select id="jsonSessionId" class="form-select">
                                <option value="">Select session</option>
                            </select>
                        </div>
                        <div class="col-md-5 d-flex align-items-end">
                            <button id="uploadQbankBtn" type="button" class="btn btn-outline-success">Upload JSON to Question Bank</button>
                        </div>
                    </c:if>
                </form>
            </div>
        </div>

        <div id="resultBox" class="mt-3"></div>
    </div>
</div>

<script>
(function () {
    const ctx = "${ctx}";
    const courseSelect = document.getElementById("courseId");
    const sessionList = document.getElementById("sessionList");
    const createForm = document.getElementById("createExamForm");
    const resultBox = document.getElementById("resultBox");
    const createBtn = document.getElementById("createBtn");
    const prepareBankBtn = document.getElementById("prepareBankBtn");
    const extractExercisesBtn = document.getElementById("extractExercisesBtn");
    const uploadQbankBtn = document.getElementById("uploadQbankBtn");
    const jsonSessionId = document.getElementById("jsonSessionId");

    function renderSessions(items) {
        sessionList.innerHTML = "";
        if (jsonSessionId) {
            jsonSessionId.innerHTML = "<option value=''>Select session</option>";
        }
        if (!items || items.length === 0) {
            sessionList.innerHTML = "<div class='text-muted'>No sessions found for this course.</div>";
            return;
        }
        items.forEach(function (s) {
            const label = document.createElement("label");
            label.className = "session-chip";
            const total = Number(s.questionCount || 0);
            const easy = Number(s.easyCount || 0);
            const medium = Number(s.mediumCount || 0);
            const hard = Number(s.hardCount || 0);
            const expert = Number(s.expertCount || 0);
            const master = Number(s.masterCount || 0);
            const tough = Number(s.toughCount || (hard + expert + master));
            label.innerHTML =
                "<input type='checkbox' class='form-check-input me-2' name='sessionId' value='" + s.sessionId + "'>" +
                "<strong>" + (s.sessionTitle || ("Session " + s.sessionId)) + "</strong>" +
                "<div class='text-muted' style='font-size:12px;margin-top:6px;'>Q: " + total
                + " | Easy: " + easy
                + " | Medium: " + medium
                + " | Hard: " + hard
                + " | Expert: " + expert
                + " | Tough: " + tough + "</div>";
            sessionList.appendChild(label);

            if (jsonSessionId) {
                const option = document.createElement("option");
                option.value = s.sessionId;
                option.textContent = s.sessionTitle || ("Session " + s.sessionId);
                jsonSessionId.appendChild(option);
            }
        });
    }

    async function loadSessions(courseId) {
        sessionList.innerHTML = "<div class='text-muted'>Loading chapters...</div>";
        try {
            const resp = await fetch(ctx + "/exam-prep/api/sessions?courseId=" + encodeURIComponent(courseId));
            const data = await resp.json();
            renderSessions(data);
        } catch (e) {
            sessionList.innerHTML = "<div class='text-danger'>Unable to load sessions.</div>";
        }
    }

    function checkedValues(name) {
        return Array.from(document.querySelectorAll("input[name='" + name + "']:checked")).map(function (el) {
            return el.value;
        });
    }

    function checkedIntValues(name) {
        return checkedValues(name).map(function (v) { return Number(v); }).filter(function (v) { return v > 0; });
    }

    function showResult(html, isError) {
        resultBox.innerHTML = "<div class='" + (isError ? "alert alert-danger" : "result-card") + "'>" + html + "</div>";
    }

    function buildPayload() {
        const aiTargetInput = document.getElementById("aiTargetMarks");
        return {
            courseId: Number(courseSelect.value || 0),
            sessionIds: checkedIntValues("sessionId"),
            questionTypes: checkedValues("questionType"),
            difficultyLevels: checkedValues("difficulty"),
            examType: document.getElementById("examType").value,
            totalMarks: Number(document.getElementById("totalMarks").value || 0),
            durationMinutes: Number(document.getElementById("durationMinutes").value || 90),
            numberOfPapers: Number(document.getElementById("numberOfPapers").value || 1),
            allowAiAugmentation: document.getElementById("allowAiAugmentation").checked,
            aiTargetMarks: aiTargetInput ? Number(aiTargetInput.value || 0) : 0,
            titlePrefix: document.getElementById("titlePrefix").value || "",
            subject: document.getElementById("subject").value || "",
            board: document.getElementById("board").value || "CBSE",
            examYear: Number(document.getElementById("examYear").value || 0)
        };
    }

    courseSelect.addEventListener("change", function () {
        const courseId = Number(courseSelect.value || 0);
        sessionList.innerHTML = "";
        if (courseId > 0) loadSessions(courseId);
    });

    const initialCourseId = Number(courseSelect.value || 0);
    if (initialCourseId > 0) {
        loadSessions(initialCourseId);
    }

    createForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const courseId = Number(courseSelect.value || 0);
        const sessionIds = checkedIntValues("sessionId");
        const questionTypes = checkedValues("questionType");
        const payload = buildPayload();

        if (courseId <= 0) {
            showResult("Please select a course.", true);
            return;
        }
        if (sessionIds.length === 0) {
            showResult("Please select at least one chapter/session.", true);
            return;
        }
        if (questionTypes.length === 0) {
            showResult("Please select at least one question type.", true);
            return;
        }

        createBtn.disabled = true;
        createBtn.textContent = "Generating...";
        showResult("Generating exam paper(s). This can take a minute when AI augmentation is enabled.", false);

        try {
            const resp = await fetch(ctx + "/exam-prep/api/create-exam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const body = await resp.json();
            if (!resp.ok || !body.success) {
                showResult((body && body.message) ? body.message : "Failed to create exam papers.", true);
                return;
            }

            const result = body.result || {};
            const papers = result.createdPapers || [];
            let html = "";
            html += "<h5 class='mb-2'>Exam papers generated</h5>";
            html += "<p class='mb-2'>Requested: <strong>" + (result.requestedPaperCount || 0) + "</strong>, Created: <strong>" + (result.createdPaperCount || 0) + "</strong>, AI Questions Added: <strong>" + (result.aiGeneratedQuestionsCount || 0) + "</strong></p>";
            if (papers.length > 0) {
                html += "<ul class='mb-0'>";
                papers.forEach(function (p) {
                    html += "<li><a href='" + ctx + "/exam/view?examPaperId=" + p.examPaperId + "' target='_blank'>"
                        + (p.title || ("Exam Paper #" + p.examPaperId))
                        + "</a> (" + (p.totalMarks || 0) + " marks)</li>";
                });
                html += "</ul>";
            }
            showResult(html, false);
        } catch (err) {
            showResult("Unexpected error while creating exam papers.", true);
        } finally {
            createBtn.disabled = false;
            createBtn.textContent = "Create Exam Paper";
        }
    });

    if (prepareBankBtn) {
        prepareBankBtn.addEventListener("click", async function () {
        const payload = buildPayload();
        if (payload.courseId <= 0) {
            showResult("Please select a course.", true);
            return;
        }
        if (!payload.sessionIds || payload.sessionIds.length === 0) {
            showResult("Please select at least one chapter/session.", true);
            return;
        }

        prepareBankBtn.disabled = true;
        prepareBankBtn.textContent = "Preparing...";
        showResult("Preparing chapter-wise question bank with AI.", false);

        try {
            const resp = await fetch(ctx + "/exam-prep/api/prepare-bank", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const body = await resp.json();
            if (!resp.ok || !body.success) {
                showResult((body && body.message) ? body.message : "Failed to prepare question bank.", true);
                return;
            }
            showResult("Question bank prepared. AI generated questions: <strong>" + (body.generatedCount || 0) + "</strong>", false);
        } catch (e) {
            showResult("Unexpected error while preparing question bank.", true);
        } finally {
            prepareBankBtn.disabled = false;
            prepareBankBtn.textContent = "Prepare Question Bank";
        }
        });
    }

    if (extractExercisesBtn) {
        extractExercisesBtn.addEventListener("click", async function () {
        const payload = {
            courseId: Number(courseSelect.value || 0),
            sessionIds: checkedIntValues("sessionId"),
            maxPdfs: Number(document.getElementById("maxPdfs").value || 0),
            dryRun: document.getElementById("dryRunExtract").checked,
            includeNonExercise: false
        };

        if (payload.courseId <= 0) {
            showResult("Please select a course.", true);
            return;
        }
        if (!payload.sessionIds || payload.sessionIds.length === 0) {
            showResult("Please select one or more sessions for extraction.", true);
            return;
        }

        extractExercisesBtn.disabled = true;
        extractExercisesBtn.textContent = "Extracting...";
        showResult("Extracting exercise questions from chapter PDFs and creating JSON.", false);

        try {
            const resp = await fetch(ctx + "/exam-prep/api/extract-exercises", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const body = await resp.json();
            if (!resp.ok || !body.success) {
                showResult((body && body.message) ? body.message : "Exercise extraction failed.", true);
                return;
            }
            const r = body.result || {};
            let html = "";
            html += "<h5 class='mb-2'>Exercise extraction completed</h5>";
            html += "<p class='mb-1'>Scanned PDFs: <strong>" + (r.scannedPdfCount || 0) + "</strong></p>";
            html += "<p class='mb-1'>Extracted Questions: <strong>" + (r.extractedQuestionCount || 0) + "</strong></p>";
            if (r.generatedJsonPath) {
                html += "<p class='mb-1'>Generated JSON: <code>" + r.generatedJsonPath + "</code></p>";
            }
            if (r.generatedJsonPaths && r.generatedJsonPaths.length > 0) {
                html += "<p class='mb-1'>Exercise JSON files: <strong>" + r.generatedJsonPaths.length + "</strong></p>";
            }
            if (r.importResult) {
                html += "<p class='mb-1'>Uploaded to question bank: created <strong>" + (r.importResult.createdQuestions || 0) +
                    "</strong>, skipped <strong>" + (r.importResult.skippedQuestions || 0) + "</strong></p>";
            }
            if (r.failedFiles && r.failedFiles.length > 0) {
                html += "<p class='mb-0 text-danger'>Failed files: " + r.failedFiles.length + "</p>";
            }
            showResult(html, false);
        } catch (e) {
            showResult("Unexpected error while extracting exercises.", true);
        } finally {
            extractExercisesBtn.disabled = false;
            extractExercisesBtn.textContent = "Extract Exercises (PDF -> JSON -> Upload)";
        }
        });
    }

    if (uploadQbankBtn) {
        uploadQbankBtn.addEventListener("click", async function () {
        const courseId = Number(courseSelect.value || 0);
        const sessionId = Number(jsonSessionId.value || 0);
        const fileInput = document.getElementById("qbankFile");
        const file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

        if (courseId <= 0) {
            showResult("Please select a course.", true);
            return;
        }
        if (sessionId <= 0) {
            showResult("Please choose the session where this JSON should be imported.", true);
            return;
        }
        if (!file) {
            showResult("Please choose a JSON file to upload.", true);
            return;
        }

        const formData = new FormData();
        formData.append("courseId", String(courseId));
        formData.append("sessionId", String(sessionId));
        formData.append("file", file);

        uploadQbankBtn.disabled = true;
        uploadQbankBtn.textContent = "Uploading...";
        showResult("Uploading JSON question bank...", false);

        try {
            const resp = await fetch(ctx + "/exam-prep/api/upload-question-bank", {
                method: "POST",
                body: formData
            });
            const body = await resp.json();
            if (!resp.ok || !body.success) {
                showResult((body && body.message) ? body.message : "Question bank upload failed.", true);
                return;
            }
            const r = body.result || {};
            showResult(
                "Question bank uploaded. Total: <strong>" + (r.totalQuestions || 0) +
                "</strong>, Created: <strong>" + (r.createdQuestions || 0) +
                "</strong>, Skipped: <strong>" + (r.skippedQuestions || 0) + "</strong>",
                false
            );
        } catch (e) {
            showResult("Unexpected error while uploading question bank.", true);
        } finally {
            uploadQbankBtn.disabled = false;
            uploadQbankBtn.textContent = "Upload JSON to Question Bank";
        }
        });
    }
})();
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
