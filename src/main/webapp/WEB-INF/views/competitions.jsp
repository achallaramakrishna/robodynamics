<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Competitions</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .section-card {
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .title-head {
            font-size: 28px;
            font-weight: 700;
        }
    </style>
</head>

<body>

<jsp:include page="header.jsp" />

<div class="container mt-4 mb-5">

    <h2 class="title-head text-center mb-4">Explore Our Competitions</h2>

    <!-- Contest Selection -->
    <div class="row">
        <div class="col-md-6 offset-md-3 text-center">
            <label class="fw-bold mb-2">Select a Competition</label>

            <select id="contestSelect" class="form-select" onchange="showContest()">
                <option value="spelling">Spelling Bee</option>
                <option value="math">Math Contest</option>
                <option value="coding">Python Coding</option>
                <option value="robotics">Robotics</option>
                <option value="speaking">Impromptu Speaking</option>
            </select>
        </div>
    </div>

    <!-- ================== CONTENT SECTIONS ==================== -->

    <div id="contestContent" class="mt-4 section-card">

        <!-- ========= TABS ========= -->
        <ul class="nav nav-tabs" id="contestTabs">
            <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#general">General Info</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#rules">Rules</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#prep">Preparation</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#faq">FAQ</button>
            </li>
        </ul>

        <!-- ========= TAB CONTENT ========= -->
        <div class="tab-content mt-3">

            <!-- GENERAL -->
            <div class="tab-pane fade show active" id="general">
                <div id="generalText"></div>
            </div>

            <!-- RULES -->
            <div class="tab-pane fade" id="rules">
                <div id="rulesText"></div>
            </div>

            <!-- PREPARATION -->
            <div class="tab-pane fade" id="prep">
                <div id="prepText"></div>
            </div>

            <!-- FAQ -->
            <div class="tab-pane fade" id="faq">
                <div id="faqText"></div>
            </div>

        </div>
    </div>

</div>

<script>
    function showContest() {
        const contest = document.getElementById("contestSelect").value;

        if (contest === "spelling") spellingContent();
        else if (contest === "math") mathContent();
        else if (contest === "coding") codingContent();
        else if (contest === "robotics") roboticsContent();
        else if (contest === "speaking") speakingContent();
    }

    // ================= CONTENT DATA =====================

    function spellingContent() {
        document.getElementById("generalText").innerHTML = `
        Spelling Bee competition helps students improve language skills, confidence and vocabulary.
        There will be Junior and Senior categories.`;

        document.getElementById("rulesText").innerHTML = `
        - Two stage contest: Written + Oral Round<br>
        - Individual participation<br>
        - Judges decision final<br>
        - No external help allowed`;

        document.getElementById("prepText").innerHTML = `
        - Practice word lists<br>
        - Learn roots and origin<br>
        - Improve pronunciation`;

        document.getElementById("faqText").innerHTML = `
        <b>Who can participate?</b> Students based on age category.<br>
        <b>Is prior experience required?</b> No.<br>`;
    }

    function mathContent() {
        document.getElementById("generalText").innerHTML = `
        Math contest encourages logical thinking, speed and accuracy. Questions include arithmetic,
        algebra, geometry and reasoning.`;

        document.getElementById("rulesText").innerHTML = `
        - Written test<br>
        - No calculators unless allowed<br>
        - Individual participation<br>
        - Tie break rules may apply`;

        document.getElementById("prepText").innerHTML = `
        - Practice worksheets<br>
        - Time-based practice<br>
        - Strengthen concepts`;

        document.getElementById("faqText").innerHTML = `
        <b>Are calculators allowed?</b> Depends on rule.<br>`;
    }

    function codingContent() {
        document.getElementById("generalText").innerHTML = `
        A Python coding challenge designed to test logical thinking, problem solving and programming skills.`;

        document.getElementById("rulesText").innerHTML = `
        - Only Python allowed<br>
        - Time bound contest<br>
        - No plagiarism<br>
        - Individual participation`;

        document.getElementById("prepText").innerHTML = `
        - Practice coding problems<br>
        - Learn loops, lists, logic<br>
        - Work on test-based problems`;

        document.getElementById("faqText").innerHTML = `
        <b>Do I need laptop?</b> Yes if offline.<br>`;
    }

    function roboticsContent() {
        document.getElementById("generalText").innerHTML = `
        Robotics contest focuses on creativity, engineering thinking and practical application.
        Students design, build and operate robots for given challenges.`;

        document.getElementById("rulesText").innerHTML = `
        - Team participation allowed<br>
        - Safety rules mandatory<br>
        - Robot size limits apply<br>
        - Judges decision final`;

        document.getElementById("prepText").innerHTML = `
        - Learn basics of sensors & motors<br>
        - Practice problem solving<br>
        - Test robot thoroughly`;

        document.getElementById("faqText").innerHTML = `
        <b>Will kits be provided?</b> Depends on event policy.<br>`;
    }

    function speakingContent() {
        document.getElementById("generalText").innerHTML = `
        Impromptu Speaking competition builds confidence, clarity and communication skills.
        Participants speak on surprise topics with minimal preparation time.`;

        document.getElementById("rulesText").innerHTML = `
        - Topic given on the spot<br>
        - Fixed prep time<br>
        - Strict speech duration<br>
        - No reading from paper`;

        document.getElementById("prepText").innerHTML = `
        - Practice speaking<br>
        - Work on structure<br>
        - Build confidence`;

        document.getElementById("faqText").innerHTML = `
        <b>Can I use notes?</b> Minimal reference allowed if permitted.<br>`;
    }

    window.onload = spellingContent;
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<jsp:include page="footer.jsp" />

</body>
</html>
