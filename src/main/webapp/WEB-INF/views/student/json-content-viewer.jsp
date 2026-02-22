<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><c:out value="${contentTitle}" default="Content Viewer"/></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    body { background: #f0f4f8; }
    .viewer-shell { max-width: 900px; margin: 0 auto; padding: 20px 16px 60px; }

    /* ── FLASHCARD ── */
    .fc-scene { perspective: 1200px; width: 100%; max-width: 640px; height: 340px; margin: 0 auto 24px; cursor: pointer; }
    .fc-card  { width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform .5s ease; }
    .fc-card.flipped { transform:rotateY(180deg); }
    .fc-face   { position:absolute; width:100%; height:100%; backface-visibility:hidden;
                 border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center;
                 padding:24px; text-align:center; font-size:.95rem; line-height:1.6; overflow:hidden; }
    .fc-front  { background:linear-gradient(135deg,#1e3a5f,#0f766e); color:#fff; }
    .fc-back   { background:linear-gradient(135deg,#0f766e,#166534); color:#fff; transform:rotateY(180deg); text-align:left; overflow-y:auto; }
    .fc-progress { font-size:.85rem; color:#64748b; text-align:center; margin-bottom:10px; }
    .diff-badge { font-size:.7rem; padding:2px 8px; border-radius:999px; }
    .diff-easy       { background:#dcfce7; color:#166534; }
    .diff-medium,
    .diff-intermediate { background:#fef9c3; color:#854d0e; }
    .diff-hard,
    .diff-advanced   { background:#fee2e2; color:#991b1b; }

    /* ── QUIZ ── */
    .quiz-option { border:2px solid #e2e8f0; border-radius:10px; padding:12px 16px;
                   cursor:pointer; margin-bottom:8px; transition:all .2s; }
    .quiz-option:hover { border-color:#0f766e; background:#f0fdf4; }
    .quiz-option.correct  { border-color:#22c55e; background:#dcfce7; }
    .quiz-option.wrong    { border-color:#ef4444; background:#fee2e2; }
    .quiz-option.revealed { border-color:#22c55e; background:#dcfce7; }
    .quiz-explanation { background:#f0fdf4; border-left:4px solid #22c55e; border-radius:6px; padding:12px; margin-top:12px; font-size:.9rem; }
    .marks-badge { font-size:.75rem; background:#dbeafe; color:#1e40af; border-radius:999px; padding:2px 8px; }

    /* ── MATCHING GAME ── */
    .mg-card { border:2px solid #e2e8f0; border-radius:12px; padding:14px; cursor:pointer;
               background:#fff; transition:all .2s; min-height:70px; display:flex; align-items:center; }
    .mg-card.selected  { border-color:#0f766e; background:#f0fdf4; }
    .mg-card.matched   { border-color:#22c55e; background:#dcfce7; opacity:.7; pointer-events:none; }
    .mg-card.wrong     { border-color:#ef4444; background:#fee2e2; }

    /* ── NOTES ── */
    .note-section { background:#fff; border-radius:14px; padding:24px; margin-bottom:16px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .note-section h4 { color:#0f766e; border-bottom:2px solid #f0fdf4; padding-bottom:8px; margin-bottom:16px; }
    .code-block { background:#1e293b; color:#e2e8f0; border-radius:10px; padding:16px; font-family:monospace; font-size:.88rem; overflow-x:auto; margin:10px 0; white-space:pre; }
    .note-list  { padding-left:20px; line-height:1.8; }
    .mnemonic-box { background:#fffbeb; border-left:4px solid #f59e0b; border-radius:6px; padding:10px 14px; margin-top:10px; font-size:.9rem; }

    /* ── EXAM PAPER ── */
    .exam-section { background:#fff; border-radius:14px; padding:20px; margin-bottom:16px; border-left:4px solid #0f766e; }
    .exam-q { background:#f8fafc; border-radius:8px; padding:12px; margin-bottom:10px; }
    .exam-q-num { font-weight:700; color:#0f766e; }

    /* ── GENERAL ── */
    .nav-btn { border-radius:10px; font-weight:600; }
    .section-header { color:#0b1f3a; font-weight:700; margin-bottom:4px; }
    .topic-badge { background:#dbeafe; color:#1e40af; border-radius:999px; padding:3px 12px; font-size:.78rem; font-weight:600; }
  </style>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="viewer-shell">

  <!-- Navigation -->
  <div class="d-flex gap-2 mb-3 flex-wrap">
    <c:if test="${not empty courseId and not empty enrollmentId}">
      <a href="${pageContext.request.contextPath}/course/monitor/v2?courseId=${courseId}&enrollmentId=${enrollmentId}"
         class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-grid-3x3-gap"></i> Course Workspace
      </a>
    </c:if>
    <c:if test="${not empty courseSessionId and not empty enrollmentId}">
      <a href="${pageContext.request.contextPath}/course/session/${courseSessionId}/dashboard?enrollmentId=${enrollmentId}"
         class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left"></i> Session Overview
      </a>
    </c:if>
  </div>

  <!-- Error state -->
  <c:if test="${not empty error}">
    <div class="alert alert-danger"><i class="bi bi-exclamation-circle"></i> <c:out value="${error}"/></div>
  </c:if>

  <!-- Content rendered by JS -->
  <div id="viewerRoot"></div>

</div>

<%-- ═══════════════════════════════════════════════════════════════════════
     JSON data is injected safely into a <script type="application/json">
     block so the JSP EL parser never sees ${...} inside JavaScript code.
     ═══════════════════════════════════════════════════════════════════════ --%>
<script type="application/json" id="__contentJson"><c:choose><c:when test="${not empty contentJson}">${contentJson}</c:when><c:otherwise>{}</c:otherwise></c:choose></script>

<script>
(function(){
  var TYPE  = document.getElementById('viewerRoot').getAttribute('data-type') || '';
  var TITLE = document.getElementById('viewerRoot').getAttribute('data-title') || '';

  <%-- Pass TYPE and TITLE via data attributes set below --%>
  document.getElementById('viewerRoot').setAttribute('data-type',  '<c:out value="${contentType}"/>');
  document.getElementById('viewerRoot').setAttribute('data-title', '<c:out value="${contentTitle}"/>');
  TYPE  = '<c:out value="${contentType}"/>';
  TITLE = '<c:out value="${contentTitle}"/>';

  var RAW = {};
  try {
    var raw = document.getElementById('__contentJson').textContent || '{}';
    RAW = JSON.parse(raw);
  } catch(e) {
    document.getElementById('viewerRoot').innerHTML = '<div class="alert alert-warning">Could not parse content JSON: ' + e.message + '</div>';
    return;
  }

  // ── HTML escape helper ──────────────────────────────────────────────────
  function h(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var root = document.getElementById('viewerRoot');

  // ── Normalise data — support BOTH user files AND CMS JSON formats ───────
  // Flashcards: user format -> RAW.flashcards[], CMS format -> RAW.cards[]
  var flashcards = RAW.flashcards || RAW.cards || [];
  // Quiz: user format -> RAW.quiz.questions[], CMS format -> RAW.questions[]
  var questions  = (RAW.quiz && RAW.quiz.questions) ? RAW.quiz.questions : (RAW.questions || []);
  // Pairs (matching)
  var pairs      = RAW.pairs || [];
  // Sections: user exam format -> RAW.exam.sections[], CMS -> RAW.sections[]
  var sections   = (RAW.exam && RAW.exam.sections) ? RAW.exam.sections : (RAW.sections || []);
  // Meta
  var meta       = RAW.meta || RAW.quiz || RAW.exam || RAW.session || {};

  // ── Title bar ───────────────────────────────────────────────────────────
  root.innerHTML =
    '<div class="d-flex align-items-center gap-2 mb-3 flex-wrap">' +
      '<h4 class="section-header mb-0">' + h(meta.topic||meta.session_title||meta.title||meta.subtitle||TITLE) + '</h4>' +
      '<span class="topic-badge text-uppercase">' + h(TYPE) + '</span>' +
    '</div>';

  // ── Dispatch ────────────────────────────────────────────────────────────
  if      (TYPE==='flashcard'    && flashcards.length) renderFlashcards(flashcards, meta);
  else if (TYPE==='quiz'         && questions.length)  renderQuiz(questions, meta);
  else if (TYPE==='matchinggame' && pairs.length)      renderMatchingGame(pairs, meta);
  else if (TYPE==='matchingpair' && pairs.length)      renderMatchingPair(pairs, meta);
  else if (TYPE==='notes')                             renderNotes(sections, meta, RAW);
  else if (TYPE==='exampaper')                         renderExamPaper(sections, meta, RAW);
  else if (TYPE==='labmanual')                         renderLabManual(RAW);
  else root.innerHTML += '<div class="alert alert-info">No renderable content found for type: <strong>' + h(TYPE) + '</strong></div>';

  // ╔══════════════════════════════════════════════╗
  // ║  FLASHCARD RENDERER                          ║
  // ╚══════════════════════════════════════════════╝
  function renderFlashcards(cards, meta){
    var idx = 0;
    function render(){
      var c    = cards[idx];
      var diff = c.difficulty || '';
      var diffCls = 'diff-' + (diff || 'easy');

      // Support user format: c.front.text / c.back.text / c.back.code
      // Support CMS format:  c.front.content / c.back.content / plain string
      var frontText = typeof c.front === 'string' ? c.front
                    : (c.front ? (c.front.text || c.front.content || '') : '');
      var hint      = c.front && c.front.hint ? c.front.hint : '';
      var backText  = typeof c.back === 'string' ? c.back
                    : (c.back ? (c.back.text || c.back.content || '') : '');
      var backCode  = c.back && c.back.code ? c.back.code : '';
      var mnemonic  = c.back && c.back.mnemonic ? c.back.mnemonic : '';

      while(root.children.length > 1) root.removeChild(root.lastChild);

      var html = '';
      html += '<p class="fc-progress">Card <span id="fcIdx">' + (idx+1) + '</span> of ' + cards.length;
      html += ' &nbsp;<span class="diff-badge ' + h(diffCls) + '">' + h(diff) + '</span>';
      html += ' &nbsp;<span class="text-muted fst-italic">' + h(c.topic||c.category||'') + '</span></p>';

      html += '<div class="fc-scene" id="fcScene" title="Click to flip">';
      html += '<div class="fc-card" id="fcCard">';

      // Front face
      html += '<div class="fc-face fc-front">';
      html += '<div style="white-space:pre-wrap;overflow-y:auto">' + h(frontText) + '</div>';
      if(hint) html += '<div class="mt-2 small opacity-75 fst-italic">Hint: ' + h(hint) + '</div>';
      html += '</div>';

      // Back face
      html += '<div class="fc-face fc-back">';
      html += '<div style="white-space:pre-wrap;overflow-y:auto;max-height:200px">' + h(backText) + '</div>';
      if(backCode) html += '<pre class="code-block mt-2" style="font-size:.78rem;text-align:left;max-height:120px;overflow-y:auto">' + h(backCode) + '</pre>';
      if(mnemonic) html += '<div class="mnemonic-box mt-2 text-start" style="color:#92400e;font-size:.85rem">&#128161; ' + h(mnemonic) + '</div>';
      html += '</div>';

      html += '</div></div>'; // fc-card, fc-scene

      // Nav buttons
      html += '<div class="d-flex justify-content-center gap-3 mb-3">';
      html += '<button class="btn btn-outline-secondary nav-btn" id="fcPrev"' + (idx===0 ? ' disabled' : '') + '>&#8592; Prev</button>';
      html += '<button class="btn btn-outline-primary  nav-btn" id="fcFlip">Flip</button>';
      html += '<button class="btn btn-outline-secondary nav-btn" id="fcNext"' + (idx===cards.length-1 ? ' disabled' : '') + '>Next &#8594;</button>';
      html += '</div>';

      root.innerHTML += html;

      document.getElementById('fcScene').onclick = flipCard;
      document.getElementById('fcFlip').onclick  = flipCard;
      document.getElementById('fcPrev').onclick  = function(){ idx--; render(); };
      document.getElementById('fcNext').onclick  = function(){ idx++; render(); };
    }
    function flipCard(){ document.getElementById('fcCard').classList.toggle('flipped'); }
    render();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  QUIZ RENDERER                               ║
  // ╚══════════════════════════════════════════════╝
  function renderQuiz(rawQuestions, meta){
    var idx = 0, score = 0, answered = 0;

    function render(){
      var q         = rawQuestions[idx];
      var isTF      = (q.type === 'true_false');
      var qText     = q.question || q.question_text || q.text || '';
      var diff      = q.difficulty || q.difficulty_level || 'beginner';
      var diffCls   = 'diff-' + diff;
      var points    = q.marks || q.points || 1;
      var correctId = q.correct; // user format: "c", CMS: not used (use o.is_correct)

      var opts;
      if(isTF){
        opts = [
          {id:'true',  label:'True',  text:'True',  isCorrect: q.correct === true  || q.correct === 'true'},
          {id:'false', label:'False', text:'False', isCorrect: q.correct === false || q.correct === 'false'}
        ];
      } else {
        opts = (q.options||[]).map(function(o){
          var isCorrect = (typeof o.is_correct !== 'undefined') ? o.is_correct : (o.id === correctId);
          return { id: o.option_id||o.id||'', text: o.option_text||o.text||'', isCorrect: isCorrect };
        });
      }

      var optsHtml = opts.map(function(o){
        var expJson = JSON.stringify(q.explanation||'').replace(/</g,'\\u003c').replace(/>/g,'\\u003e');
        return '<div class="quiz-option" data-correct="' + o.isCorrect + '" onclick="pickOpt(this,' + expJson + ')">'
             + (o.id ? '<strong>' + h(o.id) + '</strong>&nbsp; ' : '') + h(o.text)
             + '</div>';
      }).join('');

      var codeHtml = q.code_snippet ? '<pre class="code-block">' + h(q.code_snippet) + '</pre>' : '';

      while(root.children.length > 1) root.removeChild(root.lastChild);
      var html = '';
      html += '<p class="text-muted mb-1">Question ' + (idx+1) + ' of ' + rawQuestions.length;
      html += ' &nbsp;<span class="marks-badge">' + points + ' mark' + (points>1?'s':'') + '</span>';
      html += ' &nbsp;<span class="diff-badge ' + h(diffCls) + '">' + h(diff) + '</span>';
      if(q.topic) html += ' &nbsp;<span class="text-muted small">' + h(q.topic) + '</span>';
      html += '</p>';
      html += '<div class="card mb-3 border-0 shadow-sm"><div class="card-body">';
      html += '<p class="fw-semibold" style="white-space:pre-wrap">' + h(qText) + '</p>';
      html += codeHtml;
      html += '<div id="optContainer">' + optsHtml + '</div>';
      html += '<div id="explanation" class="d-none quiz-explanation"></div>';
      html += '</div></div>';
      html += '<div class="d-flex justify-content-between mb-2">';
      html += '<button class="btn btn-outline-secondary nav-btn"' + (idx===0?' disabled':'') + ' onclick="qNav(-1)">&#8592; Prev</button>';
      html += '<span class="text-muted small pt-2">Score: <strong>' + score + '/' + answered + '</strong></span>';
      html += '<button class="btn btn-outline-secondary nav-btn"' + (idx===rawQuestions.length-1?' disabled':'') + ' onclick="qNav(1)">Next &#8594;</button>';
      html += '</div>';
      root.innerHTML += html;
    }

    window.pickOpt = function(el, exp){
      var allOpts = document.querySelectorAll('.quiz-option');
      allOpts.forEach(function(o){ o.onclick = null; });
      var isCorrect = el.dataset.correct === 'true';
      el.classList.add(isCorrect ? 'correct' : 'wrong');
      allOpts.forEach(function(o){ if(o.dataset.correct==='true') o.classList.add('revealed'); });
      answered++;
      if(isCorrect) score++;
      if(exp){
        var d = document.getElementById('explanation');
        d.innerHTML = '<strong>Explanation:</strong> ' + h(exp);
        d.classList.remove('d-none');
      }
    };
    window.qNav = function(dir){ idx += dir; render(); };
    render();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  MATCHING GAME  (CMS format)                 ║
  // ╚══════════════════════════════════════════════╝
  function renderMatchingGame(rawPairs, meta){
    var normPairs = rawPairs.map(function(p){
      return {
        id:   String(p.pair_id || p.id || Math.random()),
        term: (p.term && p.term.content) ? p.term.content : (p.term || ''),
        def:  (p.match && p.match.content) ? p.match.content : (p.match || p.definition || '')
      };
    });
    var shuffled = normPairs.slice().sort(function(){ return Math.random()-.5; });
    var sel = null, matched = 0;

    var leftHtml  = normPairs.map(function(p){ return '<div class="mg-card" id="L' + h(p.id) + '" data-id="' + h(p.id) + '" onclick="mgPick(\'L\',this)">' + h(p.term) + '</div>'; }).join('');
    var rightHtml = shuffled.map(function(p){  return '<div class="mg-card" id="R' + h(p.id) + '" data-id="' + h(p.id) + '" onclick="mgPick(\'R\',this)">' + h(p.def)  + '</div>'; }).join('');

    while(root.children.length > 1) root.removeChild(root.lastChild);
    root.innerHTML +=
      '<p class="text-muted mb-3">Click a <strong>Term</strong> then click its <strong>Definition</strong>.</p>' +
      '<div class="row g-3">' +
        '<div class="col-md-6"><h6 class="fw-bold mb-2">Terms</h6>' + leftHtml + '</div>' +
        '<div class="col-md-6"><h6 class="fw-bold mb-2">Definitions</h6>' + rightHtml + '</div>' +
      '</div>' +
      '<div id="mgMsg" class="mt-3"></div>';

    window.mgPick = function(side, el){
      if(el.classList.contains('matched')) return;
      if(sel===null){ sel={side:side, el:el}; el.classList.add('selected'); return; }
      if(sel.side===side){ sel.el.classList.remove('selected'); sel={side:side, el:el}; el.classList.add('selected'); return; }
      var ok = sel.el.dataset.id === el.dataset.id;
      if(ok){
        sel.el.classList.remove('selected'); sel.el.classList.add('matched');
        el.classList.add('matched'); matched++;
        if(matched===normPairs.length) document.getElementById('mgMsg').innerHTML='<div class="alert alert-success fw-bold">&#127881; All matched correctly!</div>';
      } else {
        sel.el.classList.add('wrong'); el.classList.add('wrong');
        setTimeout(function(){ sel.el.classList.remove('wrong','selected'); el.classList.remove('wrong'); }, 700);
      }
      sel = null;
    };
  }

  // ╔══════════════════════════════════════════════╗
  // ║  MATCHING PAIR  (CMS format)                 ║
  // ╚══════════════════════════════════════════════╝
  function renderMatchingPair(rawPairs, meta){
    var normPairs = rawPairs.map(function(p){
      return {
        id:   String(p.pair_id || p.id || Math.random()),
        colA: (p.column_a && p.column_a.content) ? p.column_a.content : (p.column_a || ''),
        colB: (p.column_b && p.column_b.content) ? p.column_b.content : (p.column_b || '')
      };
    });
    var shuffled = normPairs.slice().sort(function(){ return Math.random()-.5; });
    var sel = null, matched = 0;

    var leftHtml  = normPairs.map(function(p){ return '<div class="mg-card" id="A' + h(p.id) + '" data-id="' + h(p.id) + '" onclick="mpPick(\'A\',this)"><code style="font-size:.85rem">' + h(p.colA) + '</code></div>'; }).join('');
    var rightHtml = shuffled.map(function(p){  return '<div class="mg-card" id="B' + h(p.id) + '" data-id="' + h(p.id) + '" onclick="mpPick(\'B\',this)">' + h(p.colB) + '</div>'; }).join('');

    while(root.children.length > 1) root.removeChild(root.lastChild);
    root.innerHTML +=
      '<p class="text-muted mb-3">Click <strong>Column A</strong> then its matching <strong>Column B</strong>.</p>' +
      '<div class="row g-3">' +
        '<div class="col-md-6"><h6 class="fw-bold mb-2">Column A</h6>' + leftHtml + '</div>' +
        '<div class="col-md-6"><h6 class="fw-bold mb-2">Column B</h6>' + rightHtml + '</div>' +
      '</div>' +
      '<div id="mpMsg" class="mt-3"></div>';

    window.mpPick = function(side, el){
      if(el.classList.contains('matched')) return;
      if(sel===null){ sel={side:side, el:el}; el.classList.add('selected'); return; }
      if(sel.side===side){ sel.el.classList.remove('selected'); sel={side:side, el:el}; el.classList.add('selected'); return; }
      var ok = sel.el.dataset.id === el.dataset.id;
      if(ok){
        sel.el.classList.remove('selected'); sel.el.classList.add('matched');
        el.classList.add('matched'); matched++;
        if(matched===normPairs.length) document.getElementById('mpMsg').innerHTML='<div class="alert alert-success fw-bold">&#127881; Perfect matching!</div>';
      } else {
        sel.el.classList.add('wrong'); el.classList.add('wrong');
        setTimeout(function(){ sel.el.classList.remove('wrong','selected'); el.classList.remove('wrong'); }, 700);
      }
      sel = null;
    };
  }

  // ╔══════════════════════════════════════════════╗
  // ║  NOTES RENDERER                              ║
  // ╚══════════════════════════════════════════════╝
  function renderNotes(sections, meta, raw){
    var readTime = meta.reading_time_minutes
      ? '<p class="text-muted small mb-3">&#9201; Estimated reading time: <strong>' + meta.reading_time_minutes + ' min</strong></p>' : '';

    var overviewHtml = '';
    if(raw.overview){
      var ov = raw.overview;
      var summary = ov.summary ? '<p>' + h(ov.summary) + '</p>' : '';
      var outcomes = Array.isArray(ov.learning_outcomes) && ov.learning_outcomes.length
        ? '<strong>Learning Outcomes:</strong><ul class="note-list">' + ov.learning_outcomes.map(function(o){ return '<li>' + h(o) + '</li>'; }).join('') + '</ul>' : '';
      overviewHtml = '<div class="note-section"><h4>Overview</h4>' + summary + outcomes + '</div>';
    }

    var secHtml = sections.map(function(s){
      var body = '';
      if(typeof s.content === 'string' && s.content.trim())
        body += '<p style="white-space:pre-wrap">' + h(s.content) + '</p>';
      else if(Array.isArray(s.content_blocks || s.blocks)){
        (s.content_blocks||s.blocks).forEach(function(b){
          if(b.type==='code') body += '<div class="code-block">' + h(b.code||b.content||'') + '</div>';
          else if(b.type==='list') body += '<ul class="note-list">' + (b.items||[]).map(function(i){ return '<li>'+h(i)+'</li>'; }).join('') + '</ul>';
          else body += '<p>' + h(b.content||b.text||'') + '</p>';
        });
      }
      // syntax_box can be string or object
      if(s.syntax_box){
        var code = typeof s.syntax_box === 'string' ? s.syntax_box : (s.syntax_box.code || '');
        if(s.syntax_box.description) body += '<p class="small text-muted mb-1"><strong>' + h(s.syntax_box.description) + '</strong></p>';
        body += '<div class="code-block">' + h(code) + '</div>';
      }
      if(Array.isArray(s.key_points) && s.key_points.length)
        body += '<div class="mt-2"><strong>Key Points:</strong><ul class="note-list">' + s.key_points.map(function(p){ return '<li>'+h(p)+'</li>'; }).join('') + '</ul></div>';
      // examples array
      if(Array.isArray(s.examples) && s.examples.length){
        s.examples.forEach(function(ex){
          if(ex.code) body += '<h6 class="mt-2 small text-muted">' + h(ex.title||'Example') + '</h6><div class="code-block">' + h(ex.code) + '</div>';
          if(ex.output) body += '<p class="small text-muted mt-1">Output: <code>' + h(ex.output) + '</code></p>';
        });
      }
      if(s.banking_context || (typeof s.examples === 'string')){
        var ex = s.banking_context || s.examples;
        if(typeof ex === 'string') body += '<div class="alert alert-info mt-2 small">' + h(ex) + '</div>';
      }
      return '<div class="note-section"><h4>' + h(s.title||s.section_id||'') + '</h4>' + body + '</div>';
    }).join('');

    var qrHtml = '';
    if(raw.quick_reference && Array.isArray(raw.quick_reference.table)){
      var rows = raw.quick_reference.table.map(function(r){
        return '<tr><td class="fw-semibold">' + h(r.item||r.key||'') + '</td><td>' + h(r.description||r.value||'') + '</td></tr>';
      }).join('');
      qrHtml = '<div class="note-section"><h4>Quick Reference</h4>' +
        '<table class="table table-sm table-bordered"><thead><tr><th>Item</th><th>Description</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    }

    while(root.children.length > 1) root.removeChild(root.lastChild);
    root.innerHTML += readTime + overviewHtml + secHtml + qrHtml;
  }

  // ╔══════════════════════════════════════════════╗
  // ║  EXAM PAPER RENDERER                         ║
  // ╚══════════════════════════════════════════════╝
  function renderExamPaper(sections, meta, raw){
    // Support both user format (RAW.exam) and CMS format
    var examData = raw.exam || raw;
    var title    = examData.title || meta.title || TITLE;
    var duration = examData.duration_minutes || meta.duration_minutes || '–';
    var total    = examData.total_marks || meta.total_marks || '–';
    var examType = examData.exam_type || '';
    var instrArr = examData.instructions || (Array.isArray(raw.instructions) ? raw.instructions : []);
    var instrHtml = instrArr.length
      ? '<div class="mt-2"><strong>Instructions:</strong><ul class="note-list small mb-0">' + instrArr.map(function(i){ return '<li>'+h(i)+'</li>'; }).join('') + '</ul></div>'
      : '';

    var headerHtml =
      '<div class="card mb-3 border-0 shadow-sm"><div class="card-body">' +
        '<h5 class="fw-bold mb-2">' + h(title) + '</h5>' +
        (examData.subtitle ? '<p class="text-muted mb-2">' + h(examData.subtitle) + '</p>' : '') +
        '<div class="d-flex gap-2 flex-wrap mb-2">' +
          '<span class="badge bg-primary">&#9201; ' + h(String(duration)) + ' min</span>' +
          '<span class="badge bg-dark">Total: ' + h(String(total)) + ' marks</span>' +
          (examType ? '<span class="badge bg-secondary">' + h(examType) + '</span>' : '') +
          (examData.pass_marks ? '<span class="badge bg-success">Pass: ' + examData.pass_marks + ' marks</span>' : '') +
        '</div>' +
        instrHtml +
      '</div></div>';

    var secHtml = sections.map(function(s, si){
      var sTitle = s.section_name || s.title || ('Section ' + (si+1));
      var sMarks = s.total_marks || s.marks || '';
      var sDesc  = s.description || '';
      var sInstr = typeof s.instructions === 'string' ? s.instructions : '';

      var qs = (s.questions||[]).map(function(q, qi){
        var qText  = q.question || q.question_text || '';
        var qMarks = q.marks || 1;
        var qType  = q.type || 'mcq';
        var codeHtml = q.code_snippet ? '<pre class="code-block mt-1">' + h(q.code_snippet) + '</pre>' : '';
        var optHtml = '';
        if(Array.isArray(q.options) && q.options.length){
          optHtml = '<div class="ms-3 mt-1">' + q.options.map(function(o){
            var oid = o.option_id||o.id||'';
            var otxt = o.option_text||o.text||'';
            return '<div class="small">(' + h(oid) + ') ' + h(otxt) + '</div>';
          }).join('') + '</div>';
        }
        // expected answer points for short answer
        var expectedHtml = '';
        if(Array.isArray(q.expected_answer_points) && q.expected_answer_points.length){
          expectedHtml = '<div class="ms-3 mt-1"><em class="small text-muted">Key points: ' +
            q.expected_answer_points.map(function(p){ return h(p); }).join('; ') + '</em></div>';
        }
        return '<div class="exam-q">' +
          '<span class="exam-q-num">Q' + (qi+1) + '.</span> ' +
          '<span style="white-space:pre-wrap">' + h(qText) + '</span>' +
          ' <span class="ms-2 marks-badge">[' + qMarks + ' mark' + (qMarks>1?'s':'') + ']</span>' +
          ' <span class="badge bg-secondary ms-1" style="font-size:.65rem">' + h(qType) + '</span>' +
          codeHtml + optHtml + expectedHtml +
        '</div>';
      }).join('');

      return '<div class="exam-section">' +
        '<h5 class="fw-bold">' + h(sTitle) + '</h5>' +
        (sDesc ? '<p class="text-muted small mb-2">' + h(sDesc) + '</p>' : '') +
        (sMarks||sInstr ? '<p class="text-muted small">' + h(sInstr) + (sMarks ? ' &mdash; <strong>' + sMarks + ' marks</strong>' : '') + '</p>' : '') +
        qs +
      '</div>';
    }).join('');

    while(root.children.length > 1) root.removeChild(root.lastChild);
    root.innerHTML += headerHtml + secHtml;
  }

  // ╔══════════════════════════════════════════════╗
  // ║  LAB MANUAL RENDERER                         ║
  // ╚══════════════════════════════════════════════╝
  function renderLabManual(raw){
    var overview  = raw.overview || {};
    var exercises = raw.exercises || raw.sections || [];

    var overviewHtml = '';
    if(overview.objectives && overview.objectives.length)
      overviewHtml += '<div class="note-section"><h4>Objectives</h4>' +
        '<ul class="note-list">' + overview.objectives.map(function(o){ return '<li>'+h(o)+'</li>'; }).join('') + '</ul></div>';
    if(overview.prerequisites && overview.prerequisites.length)
      overviewHtml += '<div class="note-section"><h4>Prerequisites</h4>' +
        '<ul class="note-list">' + overview.prerequisites.map(function(p){ return '<li>'+h(p)+'</li>'; }).join('') + '</ul></div>';

    var exHtml = exercises.map(function(ex, i){
      var body = '';
      if(ex.objective)  body += '<p class="text-muted">' + h(ex.objective) + '</p>';
      if(ex.scenario)   body += '<div class="alert alert-secondary mb-2 small"><strong>Scenario:</strong> ' + h(ex.scenario) + '</div>';
      if(Array.isArray(ex.instructions) && ex.instructions.length)
        body += '<h6>Steps</h6><ol class="note-list">' + ex.instructions.map(function(s){ return '<li>'+h(s)+'</li>'; }).join('') + '</ol>';
      if(ex.starter_code)
        body += '<h6 class="mt-2">Starter Code</h6><pre class="code-block">' + h(ex.starter_code) + '</pre>';
      if(Array.isArray(ex.hints) && ex.hints.length)
        body += '<details class="mt-2"><summary class="text-primary" style="cursor:pointer">&#128161; Hints</summary>' +
          '<ul class="note-list mt-1">' + ex.hints.map(function(hh){ return '<li>'+h(hh)+'</li>'; }).join('') + '</ul></details>';
      if(Array.isArray(ex.reflection_questions) && ex.reflection_questions.length)
        body += '<h6 class="mt-2">Reflection Questions</h6><ol class="note-list">' + ex.reflection_questions.map(function(q){ return '<li>'+h(q)+'</li>'; }).join('') + '</ol>';
      if(ex.debugging_task)
        body += '<div class="alert alert-warning mt-2 small"><strong>&#128027; Debug Challenge:</strong> ' + h(ex.debugging_task) + '</div>';

      var diffBadge = ex.difficulty ? '<span class="badge bg-secondary ms-2" style="font-size:.7rem">' + h(ex.difficulty) + '</span>' : '';
      var timeBadge = ex.duration_minutes ? '<span class="text-muted small ms-2">&#9201; ' + ex.duration_minutes + ' min</span>' : '';
      return '<div class="note-section">' +
        '<h4>' + h(ex.title||ex.exercise_id||('Exercise '+(i+1))) + diffBadge + timeBadge + '</h4>' +
        body +
      '</div>';
    }).join('');

    while(root.children.length > 1) root.removeChild(root.lastChild);
    root.innerHTML += overviewHtml + (exHtml || '<p class="text-muted">Lab content loaded.</p>');
  }

})();
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
