<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Competitions | Robo Dynamics</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(180deg, #f7f9fc, #eef3ff);
        }

        .page-title {
            font-size: 34px;
            font-weight: 800;
            background: linear-gradient(90deg, #4e54c8, #8f94fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Competition Tiles */
        .contest-tile {
            padding: 24px;
            border-radius: 18px;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            cursor: pointer;
            transition: transform .25s, box-shadow .25s;
            box-shadow: 0 10px 24px rgba(0,0,0,.18);
            text-align: center;
        }

        .contest-tile:hover {
            transform: translateY(-6px);
            box-shadow: 0 14px 32px rgba(0,0,0,.28);
        }

        .tile-spelling { background: linear-gradient(135deg, #667eea, #764ba2); }
        .tile-math { background: linear-gradient(135deg, #43cea2, #185a9d); }
        .tile-coding { background: linear-gradient(135deg, #11998e, #38ef7d); }
        .tile-robotics { background: linear-gradient(135deg, #f7971e, #ffd200); color:#000; }
        .tile-speaking { background: linear-gradient(135deg, #ff758c, #ff7eb3); }

        /* Detail Card */
        .competition-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,.1);
        }

        .nav-tabs {
            border-bottom: none;
            justify-content: center;
        }

        .nav-tabs .nav-link {
            border: none;
            margin: 0 6px;
            padding: 10px 20px;
            border-radius: 30px;
            background: #f1f3f8;
            font-weight: 600;
            color: #555;
        }

        .nav-tabs .nav-link.active {
            background: linear-gradient(90deg, #36d1dc, #5b86e5);
            color: #fff;
        }

        .section-text {
            background: #f8faff;
            padding: 22px;
            border-radius: 14px;
            border-left: 6px solid #5b86e5;
            font-size: 15.5px;
            line-height: 1.8;
        }

        .section-text ul li {
            margin-bottom: 8px;
        }

        .faq-text p {
            background: #ffffff;
            padding: 14px 16px;
            border-radius: 12px;
            border-left: 5px solid #ff9800;
            margin-bottom: 12px;
        }
    </style>
</head>

<body>

<jsp:include page="header.jsp" />

<div class="container mt-4 mb-5">

    <h2 class="page-title text-center mb-4">Explore Our Competitions</h2>
    <!-- ================= REGISTER CTA (TOP) ================= -->
	<div class="text-center mb-4">
	
	    <p class="mb-3">
	        <strong>How it works:</strong>
	        Register → Login or Signup → Choose Competitions → Participate
	    </p>
	
	    <a href="${pageContext.request.contextPath}/competitions/register"
	       class="btn btn-warning btn-lg fw-bold px-5 shadow">
	        🏆 Register for Competitions
	    </a>
	
	</div>
	    

    <!-- ================== COMPETITION TILES ================== -->
    <div class="row g-4 mb-5 text-center">

        <div class="col-md-4 col-sm-6">
            <div class="contest-tile tile-spelling" onclick="loadContest('spelling')">
                📝 Spelling Bee
            </div>
        </div>

        <div class="col-md-4 col-sm-6">
            <div class="contest-tile tile-math" onclick="loadContest('math')">
                🔢 Math Contest
            </div>
        </div>

        <div class="col-md-4 col-sm-6">
            <div class="contest-tile tile-coding" onclick="loadContest('coding')">
                💻 Python Coding
            </div>
        </div>

        <div class="col-md-6 col-sm-6">
            <div class="contest-tile tile-robotics" onclick="loadContest('robotics')">
                🤖 Robotics Contest
            </div>
        </div>

        <div class="col-md-6 col-sm-6">
            <div class="contest-tile tile-speaking" onclick="loadContest('speaking')">
                🎤 Impromptu Speaking
            </div>
        </div>

    </div>

    <!-- ================== DETAILS SECTION ================== -->
    <div class="competition-card">

        <ul class="nav nav-tabs mb-4">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#general">General</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#rules">Rules</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#prep">Preparation</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#faq">FAQ</button></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane fade show active section-text" id="general"></div>
            <div class="tab-pane fade section-text" id="rules"></div>
            <div class="tab-pane fade section-text" id="prep"></div>
            <div class="tab-pane fade section-text faq-text" id="faq"></div>
        </div>

    </div>
    
    <!-- ================= REGISTER CTA (BOTTOM) ================= -->
<div class="text-center mt-5">

    <p class="fw-semibold mb-2">
        Ready to participate in Robo Dynamics Competitions 2025?
    </p>

    <a href="${pageContext.request.contextPath}/competitions/register"
       class="btn btn-primary btn-lg fw-bold px-5">
        Register Now
    </a>

</div>
    

</div>

<script>
function loadContest(type) {
    if (type === 'spelling') spelling();
    else if (type === 'math') math();
    else if (type === 'coding') coding();
    else if (type === 'robotics') robotics();
    else if (type === 'speaking') speaking();

   
}

function coding() {

    /* ================= GENERAL INFORMATION ================= */
    general.innerHTML = `
    <p>
        The <b>Python Coding Contest</b> is designed to evaluate students’ ability to think logically,
        solve problems efficiently, and apply programming skills using Python.
        Participants work on real-world style coding challenges that test
        algorithmic thinking, logical reasoning, and structured coding practices.
    </p>
    <p>
        The contest encourages creativity, analytical skills, and clarity in writing
        clean and efficient code. Participation helps students gain confidence in programming,
        improve computational thinking, and build a strong foundation for advanced coding
        and technology learning.
    </p>`;

    /* ================= RULES & GUIDELINES ================= */
    rules.innerHTML = `
    <ul>
        <li>This is an <b>individual coding competition</b>.</li>
        <li>Participants must solve Python-based programming challenges within the given time.</li>
        <li>Programs must be written <b>only in Python</b> unless otherwise specified.</li>
        <li>Code should be logically structured, readable, and efficient.</li>
        <li>Plagiarism or copying from others is <b>strictly prohibited</b>.</li>
        <li>Use of AI tools, auto-solvers, or external coding assistance is not allowed
            unless explicitly permitted.</li>
        <li>Internet usage guidelines will be defined by the organizers.</li>
        <li>Judges may evaluate solutions based on logic, correctness, execution,
            efficiency, and code cleanliness.</li>
        <li>The judges’ decision will be <b>final and binding</b>.</li>
    </ul>`;

    /* ================= PREPARATION ================= */
    prep.innerHTML = `
    <p>
        To perform well in the Python Coding Contest, students should focus on
        strong fundamentals and regular practice.
    </p>
    <ul>
        <li>Practice core Python concepts such as loops, conditionals, functions, and lists.</li>
        <li>Strengthen logical thinking and problem-solving approach.</li>
        <li>Work on programs involving input/output handling and real-world logic.</li>
        <li>Practice coding challenges regularly to build accuracy and confidence.</li>
        <li>Learn debugging skills to quickly identify and fix errors.</li>
        <li>Attempt timed practice problems to improve speed and performance.</li>
    </ul>
    <p>
        Consistent coding practice helps students build confidence and develop
        strong computational thinking skills.
    </p>`;

    /* ================= FAQ ================= */
    faq.innerHTML = `
    <p><b>Why is the Python Coding Contest conducted?</b><br>
    To promote logical thinking, problem-solving abilities, programming confidence,
    and exposure to real-world coding.</p>

    <p><b>What type of problems will be asked?</b><br>
    Students may solve logical, mathematical, pattern-based,
    and real-life scenario coding challenges.</p>

    <p><b>Who can participate?</b><br>
    Eligible students within the defined age or grade criteria
    who are familiar with basic Python programming.</p>

    <p><b>Do students need prior coding experience?</b><br>
    Yes, a basic understanding of Python is recommended.</p>

    <p><b>Can students use the internet or external help?</b><br>
    No. Participants must solve problems independently unless
    exceptions are declared by the organizers.</p>

    <p><b>How should students prepare?</b><br>
    By practicing Python coding regularly, solving logic-based problems,
    and improving debugging and execution accuracy.</p>`;
}

function math() {

    /* ================= GENERAL INFORMATION ================= */
    general.innerHTML = `
    <p>
        The <b>Math Contest</b> is designed to inspire students to strengthen their analytical thinking,
        logical reasoning, and problem-solving abilities. It encourages students to think critically
        while maintaining both speed and accuracy under time constraints.
    </p>
    <p>
        The contest includes a balanced variety of <b>arithmetic, algebra, geometry, and logical reasoning</b>
        questions, helping students apply mathematical concepts in real-world and competitive situations.
        Participation in this contest builds confidence, enhances mental agility, and develops a deeper
        appreciation for mathematics.
    </p>`;

    /* ================= RULES & GUIDELINES ================= */
    rules.innerHTML = `
    <ul>
        <li>The contest will be conducted in <b>multiple timed rounds</b>.</li>
        <li>This is an <b>individual competition</b>; team participation is not allowed.</li>
        <li>Students must solve problems independently without using unfair means.</li>
        <li>Use of calculators or electronic devices is <b>not permitted</b> unless explicitly allowed.</li>
        <li>Participants must maintain discipline and follow all contest instructions.</li>
        <li>The judges’ decision will be <b>final and binding</b>.</li>
    </ul>
    <p class="mt-2">
        <i>Note: Marks, number of rounds, contest structure, and elimination rules can be customized
        by the organizers if required.</i>
    </p>`;

    /* ================= PREPARATION ================= */
    prep.innerHTML = `
    <p>
        To perform well in the Math Contest, students should focus on both conceptual clarity
        and speed of execution.
    </p>
    <ul>
        <li>Practice regularly to improve speed and accuracy.</li>
        <li>Strengthen understanding of arithmetic, algebra, and geometry concepts.</li>
        <li>Solve logical reasoning and puzzle-based problems to enhance thinking ability.</li>
        <li>Attempt timed mock tests to build competition confidence.</li>
        <li>Review commonly made mistakes and focus on accuracy.</li>
    </ul>
    <p>
        Consistent practice helps students gain confidence and perform effectively under pressure.
    </p>`;

    /* ================= FAQ ================= */
    faq.innerHTML = `
    <p><b>Why is the Math Contest conducted?</b><br>
    To encourage logical thinking, problem-solving ability, confidence, and a love for mathematics.</p>

    <p><b>What type of questions will be asked?</b><br>
    Questions may include arithmetic, algebra, geometry, and logical reasoning.</p>

    <p><b>Who can participate?</b><br>
    Eligible students within the defined grade or age criteria for the contest.</p>

    <p><b>Are calculators allowed?</b><br>
    Generally no, unless specified by the organizers.</p>

    <p><b>How should students prepare?</b><br>
    Regular practice, improving speed and accuracy, solving reasoning problems,
    and attempting timed mock tests.</p>`;
}


function robotics() {

    /* ================= GENERAL INFORMATION ================= */
    general.innerHTML = `
    <p>
        The <b>Robotics Contest</b> is designed to inspire students to explore creativity,
        engineering thinking, and practical problem-solving skills. Participants design,
        build, and operate robots to complete specific tasks and challenges, applying
        concepts from mechanics, electronics, and programming.
    </p>
    <p>
        The contest encourages innovation, structured thinking, teamwork, and hands-on learning.
        Through this competition, students develop confidence, technical understanding,
        and a strong foundation in <b>STEM</b>, while experiencing the excitement of building
        something real and functional.
    </p>`;

    /* ================= RULES & GUIDELINES ================= */
    rules.innerHTML = `
    <ul>
        <li>The contest may be conducted in <b>stages or themed challenges</b>,
            depending on the event format.</li>
        <li>Students must design, build, and operate robots within the given rules
            and specifications.</li>
        <li>Robots must comply with size, safety, and materials guidelines provided
            by the organizers.</li>
        <li>Only approved kits or components may be used, if specified.</li>
        <li>Teams must work independently; external assistance during the contest
            is not allowed.</li>
        <li>Safe operation must be maintained at all times; organizers reserve the right
            to stop unsafe robots.</li>
        <li>Technical faults must be handled only within permitted time limits.</li>
        <li>Judges may evaluate robots based on design, functionality, innovation,
            performance, and teamwork.</li>
        <li>The judges’ decision will be <b>final and binding</b>.</li>
    </ul>
    <p class="mt-2">
        <i>Note: Number of team members, wired/wireless restrictions, arena rules,
        and robot weight or size limits can be customized by the organizers.</i>
    </p>`;

    /* ================= PREPARATION ================= */
    prep.innerHTML = `
    <p>
        To perform well in the Robotics Contest, students should focus on preparation,
        testing, and teamwork.
    </p>
    <ul>
        <li>Understand the challenge requirements clearly.</li>
        <li>Develop knowledge of basic electronics, sensors, motors, and controllers.</li>
        <li>Practice designing and assembling robots systematically.</li>
        <li>Work on stability, accuracy, and reliability of movement.</li>
        <li>Learn basic troubleshooting to handle technical issues quickly.</li>
        <li>Practice teamwork, communication, and time management.</li>
        <li>Test robots thoroughly before the competition to reduce failures.</li>
    </ul>
    <p>
        Hands-on practice and experimentation are key to success in robotics competitions.
    </p>`;

    /* ================= FAQ ================= */
    faq.innerHTML = `
    <p><b>Why is the Robotics Contest conducted?</b><br>
    To promote creativity, engineering thinking, problem-solving,
    and interest in STEM.</p>

    <p><b>What do students do in the contest?</b><br>
    Students design, build, and operate robots to complete specific challenges.</p>

    <p><b>Is this an individual or team competition?</b><br>
    It may be individual or team-based, depending on the event format.</p>

    <p><b>Do students need prior robotics experience?</b><br>
    Basic knowledge helps, but learning through participation
    is strongly encouraged.</p>

    <p><b>What skills does this contest develop?</b><br>
    Engineering thinking, logical reasoning, creativity,
    teamwork, technical confidence, and innovation.</p>`;
}

function speaking() {

    /* ================= GENERAL INFORMATION ================= */
    general.innerHTML = `
    <p>
        The <b>Impromptu Speaking Contest</b> is designed to help students develop confidence,
        clarity, and strong communication skills. Participants are required to speak on
        surprise topics with minimal preparation time, encouraging quick thinking,
        presence of mind, and effective expression of ideas.
    </p>
    <p>
        The contest helps students overcome stage fear, organize thoughts rapidly,
        articulate clearly, and communicate with impact. This event nurtures leadership
        qualities, public speaking confidence, and overall personality development.
    </p>`;

    /* ================= RULES & GUIDELINES ================= */
    rules.innerHTML = `
    <ul>
        <li>Participants will be given a <b>surprise topic</b> shortly before their speaking turn.</li>
        <li>Only <b>minimal preparation time</b> will be provided.</li>
        <li>This is an <b>individual competition</b>.</li>
        <li>The speech must remain relevant to the given topic.</li>
        <li>Participants must speak within the <b>allocated time limit</b>.</li>
        <li>Reading from paper, phone, or external prompts is not allowed.</li>
        <li>Language used must be respectful and appropriate.</li>
        <li>Points may be awarded based on clarity, confidence, structure,
            relevance, and delivery.</li>
        <li>The judges’ decision will be <b>final and binding</b>.</li>
    </ul>
    <p class="mt-2">
        <i>Note: Preparation time, speaking duration, and scoring breakdown
        can be customized by the organizers if required.</i>
    </p>`;

    /* ================= PREPARATION ================= */
    prep.innerHTML = `
    <p>
        To perform well in the Impromptu Speaking Contest, students should focus on
        confidence, clarity, and structured thinking.
    </p>
    <ul>
        <li>Practice speaking on random and real-life topics.</li>
        <li>Develop quick thinking and structured thought organization.</li>
        <li>Work on clarity of speech, body language, and eye contact.</li>
        <li>Improve vocabulary and sentence flow.</li>
        <li>Stay calm and confident under pressure.</li>
        <li>Listen carefully to the topic and focus on key ideas.</li>
    </ul>
    <p>
        Regular practice helps students gain confidence, fluency,
        and controlled expression during the contest.
    </p>`;

    /* ================= FAQ ================= */
    faq.innerHTML = `
    <p><b>Why is the Impromptu Speaking Contest conducted?</b><br>
    To build communication skills, confidence, presence of mind,
    and public speaking ability.</p>

    <p><b>What happens in this contest?</b><br>
    Participants receive a surprise topic and must speak on it
    after a very short preparation time.</p>

    <p><b>Who can participate?</b><br>
    Eligible students within the defined grade or age category.</p>

    <p><b>How long will participants get to prepare?</b><br>
    A very short preparation time, defined by the organizers.</p>

    <p><b>How are students judged?</b><br>
    Based on clarity, confidence, relevance to the topic,
    organization of ideas, and overall delivery.</p>`;
}


function spelling() {

    /* ================= GENERAL INFORMATION ================= */
    general.innerHTML = `
    <p>
        The <b>Spelling Bee Competition</b> is designed to help students develop strong language skills
        by improving spelling accuracy, enriching vocabulary, and strengthening pronunciation and comprehension.
        It also plays a significant role in building confidence, concentration, and clarity in communication.
    </p>
    <p>
        To ensure fair participation and appropriate challenge levels, the competition will be conducted
        in two categories: <b>Junior</b> and <b>Senior</b>, allowing students to compete within their respective
        age and learning groups.
    </p>`;

    /* ================= RULES & GUIDELINES ================= */
    rules.innerHTML = `
    <ul>
        <li>The Spelling Bee will be conducted in <b>two stages</b>:
            <ul>
                <li><b>Stage 1:</b> Written Round</li>
                <li><b>Stage 2:</b> Oral Round</li>
            </ul>
        </li>
        <li>This is an <b>individual competition</b>; team participation is not allowed.</li>
        <li>Participants must maintain discipline and follow all contest instructions.</li>
        <li>No external assistance such as prompting, use of electronic devices, or help from others is permitted.</li>
        <li>The judges’ decision will be <b>final and binding</b> on all participants.</li>
    </ul>`;

    /* ================= PREPARATION ================= */
    prep.innerHTML = `
    <p>
        Success in the Spelling Bee depends on consistent and meaningful preparation.
        Students are encouraged to practice regularly and revise frequently.
    </p>
    <ul>
        <li>Build vocabulary regularly and revise word lists.</li>
        <li>Practice spelling aloud to improve clarity and pronunciation.</li>
        <li>Understand word meaning, usage, and origin wherever possible.</li>
        <li>Learn commonly misspelled words and tricky spellings.</li>
        <li>Participate in mock spelling sessions and quizzes.</li>
        <li>Develop confidence through regular reading and guided practice.</li>
    </ul>
    <p>
        Regular reading, spelling practice, and structured revision significantly
        enhance performance and confidence during the competition.
    </p>`;

    /* ================= FAQ ================= */
    faq.innerHTML = `
    <p><b>Why is the Spelling Bee conducted?</b><br>
    To help students develop strong spelling skills, enrich vocabulary, and gain confidence
    in English communication.</p>

    <p><b>How are students grouped?</b><br>
    Students are divided into <b>Junior</b> and <b>Senior</b> categories to ensure fair competition.</p>

    <p><b>How does the competition help students?</b><br>
    It improves language proficiency, listening ability, memory skills,
    pronunciation, and stage confidence.</p>

    <p><b>Who can participate?</b><br>
    Eligible students within the defined grade or age limits for Junior and Senior categories
    can register.</p>

    <p><b>How should students prepare?</b><br>
    By practicing regularly, revising vocabulary lists, reading extensively,
    and participating in guided practice sessions.</p>`;
}
/* Default load */
window.onload = spelling;
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
