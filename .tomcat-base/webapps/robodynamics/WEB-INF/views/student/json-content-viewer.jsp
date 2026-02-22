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
    .fc-scene { perspective: 1200px; width: 100%; max-width: 640px; height: 320px; margin: 0 auto 24px; cursor: pointer; }
    .fc-card  { width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform .5s ease; }
    .fc-card.flipped { transform:rotateY(180deg); }
    .fc-face   { position:absolute; width:100%; height:100%; backface-visibility:hidden;
                 border-radius:18px; display:flex; align-items:center; justify-content:center;
                 padding:28px; text-align:center; font-size:1.05rem; line-height:1.6; }
    .fc-front  { background:linear-gradient(135deg,#1e3a5f,#0f766e); color:#fff; }
    .fc-back   { background:linear-gradient(135deg,#0f766e,#166534); color:#fff; transform:rotateY(180deg); }
    .fc-progress { font-size:.85rem; color:#64748b; text-align:center; margin-bottom:10px; }
    .diff-badge { font-size:.7rem; padding:2px 8px; border-radius:999px; }
    .diff-easy   { background:#dcfce7; color:#166534; }
    .diff-medium { background:#fef9c3; color:#854d0e; }
    .diff-hard   { background:#fee2e2; color:#991b1b; }

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

<script>
(function(){
  const TYPE  = "<c:out value='${contentType}'/>";
  const TITLE = "<c:out value='${contentTitle}'/>";
  <c:choose>
    <c:when test="${not empty contentJson}">
  const RAW = ${contentJson};
    </c:when>
    <c:otherwise>
  const RAW = {};
    </c:otherwise>
  </c:choose>

  // ── helpers ──────────────────────────────────────────────────────────
  function h(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  const root = document.getElementById('viewerRoot');

  // ── dispatch ─────────────────────────────────────────────────────────
  const cards    = RAW.cards    || [];
  const pairs    = RAW.pairs    || [];
  const questions= RAW.questions|| [];
  const sections = RAW.sections || [];
  const meta     = RAW.meta     || {};

  // Title bar
  root.innerHTML = `
    <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
      <h4 class="section-header mb-0">${h(meta.topic||meta.session_title||meta.title||TITLE)}</h4>
      <span class="topic-badge text-uppercase">${h(TYPE)}</span>
    </div>`;

  if(TYPE==='flashcard' && cards.length)         renderFlashcards(cards, meta);
  else if(TYPE==='quiz'  && questions.length)    renderQuiz(questions, meta);
  else if(TYPE==='matchinggame' && pairs.length) renderMatchingGame(pairs, meta);
  else if(TYPE==='matchingpair' && pairs.length) renderMatchingPair(pairs, meta);
  else if(TYPE==='notes')                        renderNotes(sections, meta, RAW);
  else if(TYPE==='exampaper')                    renderExamPaper(sections, meta, RAW);
  else if(TYPE==='labmanual')                    renderLabManual(RAW);
  else root.innerHTML += `<div class="alert alert-info">No content available to display.</div>`;

  // ╔══════════════════════════════════════════════╗
  // ║  FLASHCARD RENDERER                          ║
  // ╚══════════════════════════════════════════════╝
  function renderFlashcards(cards, meta){
    let idx=0;
    function render(){
      const c=cards[idx];
      const diff = c.difficulty||'';
      const diffCls = diff==='easy'?'diff-easy':diff==='medium'?'diff-medium':'diff-hard';
      // front/back content can be {type,content} object or plain string
      const frontText = (c.front && c.front.content) ? c.front.content : (c.front||'');
      const backText  = (c.back  && c.back.content)  ? c.back.content  : (c.back||'');
      while(root.children.length>1) root.removeChild(root.lastChild);
      root.innerHTML += `
        <p class="fc-progress">Card <span id="fcIdx">${idx+1}</span> of ${cards.length}
           &nbsp;<span class="diff-badge ${diffCls}">${h(diff)}</span>
           &nbsp;<span class="text-muted fst-italic">${h(c.category||'')}</span>
        </p>
        <div class="fc-scene" id="fcScene" title="Click to flip">
          <div class="fc-card" id="fcCard">
            <div class="fc-face fc-front"><span style="white-space:pre-wrap">${h(frontText)}</span></div>
            <div class="fc-face fc-back"><span style="white-space:pre-wrap">${h(backText)}</span></div>
          </div>
        </div>
        <div class="d-flex justify-content-center gap-3 mb-3">
          <button class="btn btn-outline-secondary nav-btn" id="fcPrev" ${idx===0?'disabled':''}>&#8592; Prev</button>
          <button class="btn btn-outline-primary  nav-btn" id="fcFlip">Flip</button>
          <button class="btn btn-outline-secondary nav-btn" id="fcNext" ${idx===cards.length-1?'disabled':''}>Next &#8594;</button>
        </div>`;
      document.getElementById('fcScene').onclick = flipCard;
      document.getElementById('fcFlip').onclick  = flipCard;
      document.getElementById('fcPrev').onclick  = ()=>{ idx--; render(); };
      document.getElementById('fcNext').onclick  = ()=>{ idx++; render(); };
    }
    function flipCard(){ document.getElementById('fcCard').classList.toggle('flipped'); }
    render();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  QUIZ RENDERER  (CMS format)                 ║
  // ╚══════════════════════════════════════════════╝
  function renderQuiz(questions, meta){
    let idx=0, score=0, answered=0;
    function render(){
      const q = questions[idx];
      const opts = q.options||[];
      // CMS format: option_id, option_text, is_correct
      const optsHtml = opts.map(o=>{
        const label   = o.option_id || o.label || '';
        const text    = o.option_text || o.text || '';
        const correct = String(o.is_correct);
        const expJson = JSON.stringify(q.explanation||'');
        return `<div class="quiz-option" data-correct="${correct}" onclick="pickOpt(this,${expJson})">
          <strong>${h(label)}</strong>&nbsp; ${h(text)}
        </div>`;
      }).join('');
      const diff = q.difficulty_level || q.difficulty || 'easy';
      const diffCls = diff==='easy'?'diff-easy':diff==='medium'?'diff-medium':'diff-hard';
      // code snippet support
      const codeHtml = q.code_snippet
        ? `<pre class="code-block">${h(q.code_snippet)}</pre>` : '';
      while(root.children.length>1) root.removeChild(root.lastChild);
      root.innerHTML += `
        <p class="text-muted mb-1">Question ${idx+1} of ${questions.length}
          &nbsp;<span class="marks-badge">${q.marks||1} mark${(q.marks||1)>1?'s':''}</span>
          &nbsp;<span class="diff-badge ${diffCls}">${h(diff)}</span>
        </p>
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <p class="fw-semibold">${h(q.question_text||q.text||q.question||'')}</p>
            ${codeHtml}
            <div id="optContainer">${optsHtml}</div>
            <div id="explanation" class="d-none quiz-explanation"></div>
          </div>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <button class="btn btn-outline-secondary nav-btn" ${idx===0?'disabled':''} onclick="qNav(-1)">&#8592; Prev</button>
          <span class="text-muted small pt-2">Score: <strong>${score}/${answered}</strong></span>
          <button class="btn btn-outline-secondary nav-btn" ${idx===questions.length-1?'disabled':''} onclick="qNav(1)">Next &#8594;</button>
        </div>`;
    }
    window.pickOpt=function(el,exp){
      const opts=document.querySelectorAll('.quiz-option');
      opts.forEach(o=>o.onclick=null);
      const isCorrect = el.dataset.correct==='true';
      el.classList.add(isCorrect?'correct':'wrong');
      opts.forEach(o=>{ if(o.dataset.correct==='true') o.classList.add('revealed'); });
      answered++;
      if(isCorrect) score++;
      if(exp){
        const d=document.getElementById('explanation');
        d.innerHTML='<strong>Explanation:</strong> '+h(exp);
        d.classList.remove('d-none');
      }
    };
    window.qNav=function(dir){ idx+=dir; render(); };
    render();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  MATCHING GAME  (CMS format)                 ║
  // ╚══════════════════════════════════════════════╝
  function renderMatchingGame(rawPairs, meta){
    // CMS: pairs[].pair_id, pairs[].term.content, pairs[].match.content
    const pairs = rawPairs.map(p=>({
      id:   String(p.pair_id || p.id || Math.random()),
      term: (p.term  && p.term.content)  ? p.term.content  : (p.term  || ''),
      def:  (p.match && p.match.content) ? p.match.content : (p.match || p.definition || '')
    }));
    const shuffled = [...pairs].sort(()=>Math.random()-.5);
    let sel=null, matched=0;

    function build(){
      const leftHtml  = pairs.map(p=>`<div class="mg-card" id="L${p.id}" data-id="${p.id}" onclick="mgPick('L',this)">${h(p.term)}</div>`).join('');
      const rightHtml = shuffled.map(p=>`<div class="mg-card" id="R${p.id}" data-id="${p.id}" onclick="mgPick('R',this)">${h(p.def)}</div>`).join('');
      while(root.children.length>1) root.removeChild(root.lastChild);
      root.innerHTML += `
        <p class="text-muted mb-3">Click a <strong>Term</strong> then click its <strong>Definition</strong>.</p>
        <div class="row g-3">
          <div class="col-md-6"><h6 class="fw-bold mb-2">Terms</h6>${leftHtml}</div>
          <div class="col-md-6"><h6 class="fw-bold mb-2">Definitions</h6>${rightHtml}</div>
        </div>
        <div id="mgMsg" class="mt-3"></div>`;
    }
    window.mgPick=function(side,el){
      if(el.classList.contains('matched')) return;
      if(sel===null){ sel={side,el}; el.classList.add('selected'); return; }
      if(sel.side===side){ sel.el.classList.remove('selected'); sel={side,el}; el.classList.add('selected'); return; }
      const ok = sel.el.dataset.id === el.dataset.id;
      if(ok){
        sel.el.classList.remove('selected'); sel.el.classList.add('matched');
        el.classList.add('matched'); matched++;
        if(matched===pairs.length) document.getElementById('mgMsg').innerHTML='<div class="alert alert-success fw-bold">🎉 All matched correctly!</div>';
      } else {
        sel.el.classList.add('wrong'); el.classList.add('wrong');
        setTimeout(()=>{ sel.el.classList.remove('wrong','selected'); el.classList.remove('wrong'); },700);
      }
      sel=null;
    };
    build();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  MATCHING PAIR  (CMS format)                 ║
  // ╚══════════════════════════════════════════════╝
  function renderMatchingPair(rawPairs, meta){
    // CMS: pairs[].pair_id, pairs[].column_a.content, pairs[].column_b.content
    const pairs = rawPairs.map(p=>({
      id: String(p.pair_id || p.id || Math.random()),
      colA: (p.column_a && p.column_a.content) ? p.column_a.content : (p.column_a || ''),
      colB: (p.column_b && p.column_b.content) ? p.column_b.content : (p.column_b || '')
    }));
    const shuffled=[...pairs].sort(()=>Math.random()-.5);
    let sel=null, matched=0;

    function build(){
      const leftHtml = pairs.map(p=>`<div class="mg-card" id="A${p.id}" data-id="${p.id}" onclick="mpPick('A',this)"><code style="font-size:.85rem">${h(p.colA)}</code></div>`).join('');
      const rightHtml= shuffled.map(p=>`<div class="mg-card" id="B${p.id}" data-id="${p.id}" onclick="mpPick('B',this)">${h(p.colB)}</div>`).join('');
      while(root.children.length>1) root.removeChild(root.lastChild);
      root.innerHTML += `
        <p class="text-muted mb-3">Click <strong>Column A</strong> then its matching <strong>Column B</strong>.</p>
        <div class="row g-3">
          <div class="col-md-6"><h6 class="fw-bold mb-2">Column A</h6>${leftHtml}</div>
          <div class="col-md-6"><h6 class="fw-bold mb-2">Column B</h6>${rightHtml}</div>
        </div>
        <div id="mpMsg" class="mt-3"></div>`;
    }
    window.mpPick=function(side,el){
      if(el.classList.contains('matched')) return;
      if(sel===null){ sel={side,el}; el.classList.add('selected'); return; }
      if(sel.side===side){ sel.el.classList.remove('selected'); sel={side,el}; el.classList.add('selected'); return; }
      const ok = sel.el.dataset.id === el.dataset.id;
      if(ok){
        sel.el.classList.remove('selected'); sel.el.classList.add('matched');
        el.classList.add('matched'); matched++;
        if(matched===pairs.length) document.getElementById('mpMsg').innerHTML='<div class="alert alert-success fw-bold">🎉 Perfect matching!</div>';
      } else {
        sel.el.classList.add('wrong'); el.classList.add('wrong');
        setTimeout(()=>{ sel.el.classList.remove('wrong','selected'); el.classList.remove('wrong'); },700);
      }
      sel=null;
    };
    build();
  }

  // ╔══════════════════════════════════════════════╗
  // ║  NOTES RENDERER  (CMS format)                ║
  // ╚══════════════════════════════════════════════╝
  function renderNotes(sections, meta, raw){
    const readTime = meta.reading_time_minutes
      ? `<p class="text-muted small mb-3">⏱ Estimated reading time: <strong>${meta.reading_time_minutes} min</strong></p>` : '';

    // Overview block
    let overviewHtml = '';
    if(raw.overview){
      const ov=raw.overview;
      const summary = ov.summary ? `<p>${h(ov.summary)}</p>` : '';
      const outcomes = Array.isArray(ov.learning_outcomes) && ov.learning_outcomes.length
        ? `<strong>Learning Outcomes:</strong><ul class="note-list">${ov.learning_outcomes.map(o=>`<li>${h(o)}</li>`).join('')}</ul>` : '';
      overviewHtml = `<div class="note-section"><h4>Overview</h4>${summary}${outcomes}</div>`;
    }

    // Main sections (CMS format: {title, content, key_points, syntax_box, banking_context})
    const secHtml = sections.map(s=>{
      let body = '';
      // content (string)
      if(typeof s.content === 'string' && s.content.trim())
        body += `<p style="white-space:pre-wrap">${h(s.content)}</p>`;
      // content_blocks (block array format)
      else if(Array.isArray(s.content_blocks||s.blocks)){
        body += (s.content_blocks||s.blocks).map(b=>{
          if(b.type==='code') return `<div class="code-block">${h(b.code||b.content||'')}</div>`;
          if(b.type==='list') return `<ul class="note-list">${(b.items||[]).map(i=>`<li>${h(i)}</li>`).join('')}</ul>`;
          return `<p>${h(b.content||b.text||'')}</p>`;
        }).join('');
      }
      // syntax_box
      if(s.syntax_box)
        body += `<div class="code-block">${h(s.syntax_box)}</div>`;
      // key_points
      if(Array.isArray(s.key_points)&&s.key_points.length)
        body += `<div class="mt-2"><strong>Key Points:</strong><ul class="note-list">${s.key_points.map(p=>`<li>${h(p)}</li>`).join('')}</ul></div>`;
      // banking context
      if(s.banking_context||s.examples){
        const ex=s.banking_context||s.examples;
        if(typeof ex==='string') body+=`<div class="alert alert-info mt-2 small">${h(ex)}</div>`;
      }
      return `<div class="note-section"><h4>${h(s.title||s.section_id||'')}</h4>${body}</div>`;
    }).join('');

    // Quick reference table
    let qrHtml='';
    if(raw.quick_reference && Array.isArray(raw.quick_reference.table)){
      const rows=raw.quick_reference.table.map(r=>`<tr><td class="fw-semibold">${h(r.item||r.key||'')}</td><td>${h(r.description||r.value||'')}</td></tr>`).join('');
      qrHtml=`<div class="note-section"><h4>Quick Reference</h4>
        <table class="table table-sm table-bordered"><thead><tr><th>Item</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    while(root.children.length>1) root.removeChild(root.lastChild);
    root.innerHTML += readTime + overviewHtml + secHtml + qrHtml;
  }

  // ╔══════════════════════════════════════════════╗
  // ║  EXAM PAPER RENDERER  (CMS format)           ║
  // ╚══════════════════════════════════════════════╝
  function renderExamPaper(sections, meta, raw){
    const title = raw.title || meta.title || TITLE;
    const duration = raw.duration_minutes || meta.duration_minutes || raw.duration || '–';
    const totalMarks = raw.total_marks || meta.total_marks || '–';
    const examType = raw.exam_type || meta.exam_type || '';
    const instrList = Array.isArray(raw.instructions) && raw.instructions.length
      ? `<ul class="note-list small mb-0">${raw.instructions.map(i=>`<li>${h(i)}</li>`).join('')}</ul>` : '';

    const headerHtml = `
      <div class="card mb-3 border-0 shadow-sm">
        <div class="card-body">
          <h5 class="fw-bold mb-2">${h(title)}</h5>
          <div class="d-flex gap-2 flex-wrap mb-2">
            <span class="badge bg-primary">⏱ ${h(String(duration))} min</span>
            <span class="badge bg-dark">Total: ${h(String(totalMarks))} marks</span>
            ${examType?`<span class="badge bg-secondary">${h(examType)}</span>`:''}
          </div>
          ${instrList ? `<div class="mt-2"><strong>Instructions:</strong>${instrList}</div>` : ''}
        </div>
      </div>`;

    const secHtml = sections.map((s,i)=>{
      // CMS uses section_name, total_marks, instructions (string)
      const sTitle  = s.section_name || s.title || `Section ${i+1}`;
      const sMarks  = s.total_marks  || s.marks  || '';
      const sInstr  = typeof s.instructions === 'string' ? s.instructions : '';
      const qs = (s.questions||[]).map((q,j)=>{
        const qText = q.question_text || q.text || q.question || '';
        const qMarks = q.marks || 1;
        const codeHtml = q.code_snippet ? `<pre class="code-block">${h(q.code_snippet)}</pre>` : '';
        let optHtml='';
        if(Array.isArray(q.options)&&q.options.length){
          optHtml=`<div class="ms-3 mt-1">${q.options.map(o=>{
            const oid = o.option_id||o.label||'';
            const otxt= o.option_text||o.text||'';
            return `<div class="small">(<strong>${h(oid)}</strong>) ${h(otxt)}</div>`;
          }).join('')}</div>`;
        }
        return `<div class="exam-q">
          <span class="exam-q-num">Q${j+1}.</span> ${h(qText)}
          <span class="ms-2 marks-badge">[${qMarks} mark${qMarks>1?'s':''}]</span>
          ${codeHtml}${optHtml}
        </div>`;
      }).join('');
      return `<div class="exam-section">
        <h5 class="fw-bold">${h(sTitle)}</h5>
        ${sMarks||sInstr?`<p class="text-muted small">${h(sInstr)} ${sMarks?'— '+sMarks+' marks':''}</p>`:''}
        ${qs}
      </div>`;
    }).join('');

    while(root.children.length>1) root.removeChild(root.lastChild);
    root.innerHTML += headerHtml + secHtml;
  }

  // ╔══════════════════════════════════════════════╗
  // ║  LAB MANUAL RENDERER  (CMS format)           ║
  // ╚══════════════════════════════════════════════╝
  function renderLabManual(raw){
    const meta     = raw.meta     || {};
    const overview = raw.overview || {};
    const exercises= raw.exercises|| raw.sections || [];

    // Overview (objectives, prerequisites, tools)
    let overviewHtml='';
    if(overview.objectives&&overview.objectives.length){
      overviewHtml+=`<div class="note-section"><h4>Objectives</h4>
        <ul class="note-list">${overview.objectives.map(o=>`<li>${h(o)}</li>`).join('')}</ul></div>`;
    }
    if(overview.prerequisites&&overview.prerequisites.length){
      overviewHtml+=`<div class="note-section"><h4>Prerequisites</h4>
        <ul class="note-list">${overview.prerequisites.map(p=>`<li>${h(p)}</li>`).join('')}</ul></div>`;
    }

    const exercisesHtml = exercises.map((ex,i)=>{
      let body='';
      if(ex.objective)  body+=`<p class="text-muted">${h(ex.objective)}</p>`;
      if(ex.scenario)   body+=`<div class="alert alert-secondary mb-2 small"><strong>Scenario:</strong> ${h(ex.scenario)}</div>`;
      if(Array.isArray(ex.instructions)&&ex.instructions.length)
        body+=`<h6>Steps</h6><ol class="note-list">${ex.instructions.map(s=>`<li>${h(s)}</li>`).join('')}</ol>`;
      if(ex.starter_code)
        body+=`<h6 class="mt-2">Starter Code</h6><pre class="code-block">${h(ex.starter_code)}</pre>`;
      if(Array.isArray(ex.hints)&&ex.hints.length)
        body+=`<details class="mt-2"><summary class="text-primary" style="cursor:pointer">💡 Hints</summary>
          <ul class="note-list mt-1">${ex.hints.map(hh=>`<li>${h(hh)}</li>`).join('')}</ul></details>`;
      if(Array.isArray(ex.reflection_questions)&&ex.reflection_questions.length)
        body+=`<h6 class="mt-2">Reflection Questions</h6><ol class="note-list">${ex.reflection_questions.map(q=>`<li>${h(q)}</li>`).join('')}</ol>`;
      if(ex.debugging_task)
        body+=`<div class="alert alert-warning mt-2 small"><strong>🐛 Debug Challenge:</strong> ${h(ex.debugging_task)}</div>`;

      const diffBadge=ex.difficulty?`<span class="badge bg-secondary ms-2" style="font-size:.7rem">${h(ex.difficulty)}</span>`:'';
      const timeBadge=ex.duration_minutes?`<span class="text-muted small ms-2">⏱ ${ex.duration_minutes} min</span>`:'';
      return `<div class="note-section">
        <h4>${h(ex.title||ex.exercise_id||`Exercise ${i+1}`)}${diffBadge}${timeBadge}</h4>
        ${body}
      </div>`;
    }).join('');

    while(root.children.length>1) root.removeChild(root.lastChild);
    root.innerHTML += overviewHtml + (exercisesHtml||`<p class="text-muted">Lab content loaded.</p>`);
  }

})();
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
