<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
    Integer studentId = session.getAttribute("rdUser") != null
            ? ((com.robodynamics.model.RDUser) session.getAttribute("rdUser")).getUserID()
            : 0;
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VidaPath Career Discovery</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
  <style>
    :root {
      --bg-dark: #050b16;
      --bg-mid: #0f172a;
      --neon-blue: #00f0ff;
      --neon-purple: #c300ff;
      --neon-green: #39ff14;
      --panel: rgba(5, 11, 22, 0.85);
      --glass-border: 1px solid rgba(255,255,255,0.15);
      --shadow: 0 20px 45px rgba(0,0,0,0.35);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
      background: linear-gradient(135deg, #050b16, #090f1f 60%, #0d172e);
      color: #e9f2ff;
    }
    .vidapath-shell {
      min-height: 100vh;
      padding: 0 5vw 4rem;
    }
    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 2rem;
    }
    .panel {
      background: var(--panel);
      border: var(--glass-border);
      border-radius: 24px;
      box-shadow: var(--shadow);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .section-title {
      font-family: "Orbitron", sans-serif;
      font-size: 1.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .orb {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(var(--neon-green) 0% 0%, rgba(57,255,20,0.3) 0%);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 0 30px rgba(57,255,20,0.6);
      transition: background 0.4s ease;
    }
    .orb span {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
    }
    #questDeck {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .question-card {
      flex: 1 1 48%;
      min-width: 260px;
      background: rgba(15, 23, 42, 0.9);
      border-radius: 18px;
      padding: 1rem;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 0 45px rgba(0,0,0,0.4);
      position: relative;
    }
    .question-card .question-label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .icon-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--neon-blue);
      box-shadow: 0 0 15px var(--neon-blue);
    }
    .options {
      display: grid;
      gap: 0.5rem;
    }
    .options button, .options label {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.2);
      color: #e9f2ff;
      padding: 0.65rem 0.9rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
    }
    .options input[type=range] {
      width: 100%;
    }
    .options button.selected, .options label.selected {
      background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
      border-color: transparent;
      box-shadow: 0 0 20px rgba(0,240,255,0.6);
    }
    .controls {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    .neon-btn {
      background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
      border: none;
      padding: 0.85rem 2rem;
      border-radius: 999px;
      color: #030712;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 30px rgba(0,240,255,0.5);
    }
    #voicePanel {
      border: 1px dashed rgba(255,255,255,0.3);
      border-radius: 16px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: space-between;
      background: linear-gradient(135deg, rgba(3,7,18,0.8), rgba(5,11,22,0.9));
    }
    #voiceVisualizer {
      width: 220px;
      height: 60px;
      display: flex;
      align-items: flex-end;
      gap: 4px;
    }
    .voice-bar {
      width: 8px;
      height: 20px;
      background: linear-gradient(180deg, var(--neon-purple), var(--neon-blue));
      border-radius: 4px;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    @keyframes shimmer {
      0%,100% { height: 20px; }
      50% { height: 50px; }
    }
    #resultsRadar, #timelineChart {
      width: 100%;
      height: 320px;
    }
    .inline-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
      gap: 1rem;
    }
    .career-card {
      background: rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 1rem;
      border: 1px solid rgba(255,255,255,0.1);
      min-height: 180px;
    }
    .career-card h4 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }
    .timeline-container {
      overflow-x: auto;
      padding-bottom: 1rem;
    }
    .timeline-strip {
      display: flex;
      gap: 2rem;
      min-width: 900px;
      align-items: center;
    }
    .milestone {
      text-align: center;
      position: relative;
    }
    .milestone-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--neon-green);
      box-shadow: 0 0 20px rgba(57,255,20,0.8);
      margin: 0 auto 0.5rem;
    }
    .milestone-card {
      padding: 0.6rem 0.8rem;
      border-radius: 12px;
      background: rgba(5,11,22,0.8);
      border: 1px solid rgba(255,255,255,0.1);
      font-size: 0.85rem;
      width: 180px;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
</head>
<body>
  <jsp:include page="/WEB-INF/views/header.jsp"/>
  <div class="vidapath-shell">
    <div class="content">
      <div class="panel">
        <div class="section-title">VidaPath Career Discovery</div>
        <p>Future-ready careers for 2026–2036. The test adapts, the AI companion listens, and the roadmap updates as you progress.</p>
        <div class="controls">
          <div class="orb" id="progressOrb"><span>0%</span></div>
          <button class="neon-btn" id="startBtn">Begin Discovery</button>
        </div>
      </div>

      <div id="questionArea" class="panel" style="display:none;">
        <div class="section-title">Mission Questions</div>
        <div id="questDeck"></div>
        <div class="controls">
          <button class="neon-btn" id="submitAnswers">Submit &amp; Next</button>
          <button class="neon-btn" id="voiceToggle">Toggle Voice Mode</button>
        </div>
        <div id="voicePanel" style="margin-top:1rem;">
          <div>
            <strong>Voice Companion</strong>
            <p class="mb-0">Speak to guide in Phase 2 (visualizer placeholder)</p>
          </div>
          <div id="voiceVisualizer">
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="section-title">Profile Snapshot</div>
        <canvas id="resultsRadar"></canvas>
      </div>

      <div class="panel">
        <div class="section-title">Future Horizon Timeline</div>
        <div class="timeline-container">
          <div class="timeline-strip" id="timelineStrip"></div>
        </div>
      </div>

      <div class="panel">
        <div class="section-title">Future Careers</div>
        <div class="inline-cards" id="careerCards"></div>
      </div>
    </div>
  </div>
  <jsp:include page="/WEB-INF/views/footer.jsp"/>

  <script>
    const studentId = <%= studentId %>;
    let sessionToken = null;
    const answeredCount = { value: 0 };
    const radarCtx = document.getElementById('resultsRadar').getContext('2d');
    const radarChart = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['AI & Tech', 'Green & Sustainability', 'Healthcare & Care', 'Data & Analytics', 'Creative Impact'],
        datasets: [{
          label: 'Profiling Score',
          data: [0,0,0,0,0],
          backgroundColor: 'rgba(0,240,255,0.2)',
          borderColor: 'rgba(0,240,255,0.9)',
          pointBackgroundColor: '#ffffff',
          borderWidth: 3,
          pointBorderColor: '#00f0ff'
        }]
      },
      options: {
        scales: {
          r: {
            min:0,
            max:5,
            ticks: { stepSize: 1, display: true, color: '#a5b4fc' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            angleLines: { color: 'rgba(255,255,255,0.2)' },
            pointLabels: { color: '#e0f2ff' }
          }
        },
        animation: { duration: 1500, easing: 'easeOutExpo' },
        plugins: { legend: { display: false } }
      }
    });

    const timelineEntries = [
      { title: 'Today', detail: 'Grade 9 · Warm-up in math + logic' },
      { title: 'Grade 10', detail: 'PCM + intro CS; board prep' },
      { title: 'Grade 11-12', detail: 'Advanced calculus, algorithms' },
      { title: 'College', detail: 'B.Tech AI/ML · IIT/IIIT' },
      { title: '2036', detail: 'AI Engineer · 12-25 LPA' }
    ];
    const timelineStrip = document.getElementById('timelineStrip');
    timelineEntries.forEach(entry => {
      const block = document.createElement('div');
      block.className = 'milestone';
      block.innerHTML = `
        <div class="milestone-dot"></div>
        <div class="milestone-card">
          <strong>${entry.title}</strong>
          <p>${entry.detail}</p>
        </div>`;
      timelineStrip.appendChild(block);
    });

    document.getElementById('startBtn').addEventListener('click', () => {
      if (!studentId) {
        alert('Login required to start VidaPath.');
        return;
      }
      startSession();
    });

    document.getElementById('submitAnswers').addEventListener('click', () => {
      submitCurrentBatch();
    });

    document.getElementById('voiceToggle').addEventListener('click', () => {
      document.querySelector('#voicePanel').classList.toggle('active');
    });

    async function startSession() {
      const payload = { studentId };
      const response = await fetch('/vidapath/api/session/start', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        alert('Cannot start VidaPath session.');
        return;
      }
      const data = await response.json();
      sessionToken = data.sessionToken;
      document.querySelector('#questionArea').style.display = 'block';
      populateQuestions(data.questions);
      updateState(data.state);
      fetchCareers();
    }

    function clearQuestionArea() {
      document.getElementById('questDeck').innerHTML = '';
    }

    function populateQuestions(questions) {
      clearQuestionArea();
      questions.forEach(question => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.questionId = question.questionId;
        const label = document.createElement('div');
        label.className = 'question-label';
        label.innerHTML = `<span class="icon-dot"></span> ${question.section}`;
        const text = document.createElement('p');
        text.textContent = question.questionText;
        card.appendChild(label);
        card.appendChild(text);
        const options = document.createElement('div');
        options.className = 'options';
        if (question.type.toLowerCase().includes('mcq')) {
          (question.questionText.match(/A\)/g) ? question.questionText.split(' A) ') : [question.questionText]).forEach((opt, index) => {
            const button = document.createElement('button');
            button.textContent = opt.replace(/^[A-Z]\)\s*/,'').trim();
            button.addEventListener('click', () => {
              button.classList.toggle('selected');
            });
            options.appendChild(button);
          });
        } else if (question.type.toLowerCase().includes('slider')) {
          const slider = document.createElement('input');
          slider.type = 'range';
          slider.min = 1;
          slider.max = 5;
          slider.step = 1;
          slider.value = 3;
          options.appendChild(slider);
        } else if (question.type.toLowerCase().includes('ranking')) {
          ['1','2','3','4','5'].slice(0,4).forEach(rank => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="${question.questionId}" value="${rank}" style="margin-right:6px;"> Option ${rank}`;
            options.appendChild(label);
          });
        } else {
          const textarea = document.createElement('textarea');
          textarea.rows = 3;
          textarea.style.width = '100%';
          textarea.style.background = 'rgba(255,255,255,0.05)';
          textarea.style.border = '1px solid rgba(255,255,255,0.2)';
          textarea.style.borderRadius = '12px';
          textarea.style.color = '#fff';
          options.appendChild(textarea);
        }
        card.appendChild(options);
        document.getElementById('questDeck').appendChild(card);
      });
    }

    async function submitCurrentBatch() {
      if (!sessionToken) {
        alert('Start the session first.');
        return;
      }
      const cards = document.querySelectorAll('.question-card');
      const answers = [];
      cards.forEach(card => {
        const questionId = card.dataset.questionId;
        let rawAnswer = '';
        let score = 3;
        const buttons = card.querySelectorAll('.options button.selected');
        if (buttons.length) {
          rawAnswer = Array.from(buttons).map(b => b.textContent).join(', ');
          score = buttons.length;
        } else if (card.querySelector('input[type=range]')) {
          const slider = card.querySelector('input[type=range]');
          rawAnswer = slider.value;
          score = parseInt(slider.value, 10);
        } else {
          const textarea = card.querySelector('textarea');
          if (textarea && textarea.value.trim()) {
            rawAnswer = textarea.value.trim();
            score = 3;
          }
          const radio = card.querySelector('input[type=radio]:checked');
          if (radio) {
            rawAnswer = radio.value;
            score = parseInt(radio.value, 10);
          }
        }
        answers.push({ questionId, rawAnswer, score });
      });
      const response = await fetch(`/vidapath/api/session/${sessionToken}/answers`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ answers })
      });
      if (!response.ok) {
        alert('Unable to send answers.');
        return;
      }
      const data = await response.json();
      populateQuestions(data.questions);
      updateState(data.state);
      updateOrb();
      if ((answeredCount.value % 6 === 0) && answeredCount.value > 0) {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.3 },
          colors: ['#00f0ff', '#c300ff', '#39ff14']
        });
      }
    }

    function updateState(state) {
      const answered = state.answeredQuestionIds.length;
      answeredCount.value = answered;
      const progress = Math.min(100, Math.round((answered / 30) * 100));
      document.querySelector('#progressOrb').style.background = `conic-gradient(var(--neon-green) 0% ${progress}%, rgba(57,255,20,0.2) ${progress}% 100%)`;
      document.querySelector('#progressOrb span').textContent = `${progress}%`;
      updateRadar(state.profileScores);
    }

    function updateRadar(scores) {
      const fields = {
        'ai_tech': 0,
        'green': 0,
        'healthcare': 0,
        'data': 0,
        'motivation': 0
      };
      Object.keys(fields).forEach(key => {
        if (scores && scores[key]) {
          fields[key] = Math.min(5, parseFloat(scores[key]).toFixed(2));
        }
      });
      radarChart.data.datasets[0].data = [
        fields['ai_tech'] || 0,
        fields['green'] || 0,
        fields['healthcare'] || 0,
        fields['data'] || 0,
        fields['motivation'] || 0
      ];
      radarChart.update();
    }

    async function fetchCareers() {
      const response = await fetch('/vidapath/api/future-careers');
      if (!response.ok) return;
      const careers = await response.json();
      const container = document.getElementById('careerCards');
      container.innerHTML = '';
      careers.forEach(career => {
        const card = document.createElement('div');
        card.className = 'career-card';
        card.innerHTML = `
          <h4>${career.careerName}</h4>
          <p>${career.description}</p>
          <p><strong>Skills:</strong> ${career.requiredSkills}</p>
          <p class="mb-0"><small>${career.projectedGrowthIndia} · Global ${career.projectedGrowthGlobal}</small></p>`;
        container.appendChild(card);
      });
    }
  </script>
</body>
</html>
