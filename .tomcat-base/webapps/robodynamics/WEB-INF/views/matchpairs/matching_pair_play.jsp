<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${question.instructions}</title>

<style>
body {
    font-family: 'Comic Sans MS', Arial, sans-serif;
    background:#f5faff;
}

/* ===== HEADER ===== */
h2 {
    text-align:center;
    color:#ff6f61;
    margin-top:20px;
}

#remaining {
    text-align:center;
    font-size:1.1rem;
    color:#0d6efd;
    margin-bottom:14px;
}

/* ===== GRID ===== */
.game-grid {
    max-width:1100px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(190px, 1fr));
    gap:18px;
    padding:20px;
}

/* ===== CARD ===== */
.match-card {
    background:#fff;
    border-radius:14px;
    padding:14px;
    height:140px;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    box-shadow:0 4px 10px rgba(0,0,0,0.12);
    cursor:pointer;
    user-select:none;
    border:3px solid transparent;
    transition:all .2s ease;
}

.match-card:hover {
    transform:scale(1.04);
}

.match-card.selected {
    border-color:#0d6efd;
    background:#e7f1ff;
}

.match-card.correct {
    animation: vanish .45s forwards;
    pointer-events:none;
}

.match-card.wrong {
    animation: shake .4s;
    border-color:#dc3545;
}

/* ===== ANIMATIONS ===== */
@keyframes vanish {
    to { opacity:0; transform:scale(.6); }
}

@keyframes shake {
    0% { transform:translateX(0); }
    25% { transform:translateX(-6px); }
    50% { transform:translateX(6px); }
    75% { transform:translateX(-6px); }
    100% { transform:translateX(0); }
}

/* ===== MOBILE ===== */
@media(max-width:768px) {
    .match-card { height:120px; font-size:.95rem; }
}
</style>
</head>

<body>

<h2>${question.instructions}</h2>
<p id="remaining">Remaining cards: ${pairs.size() * 2}</p>

<!-- ================= GRID ================= -->
<div class="game-grid" id="gameGrid">

    <c:forEach var="p" items="${pairs}">

        <!-- LEFT CARD -->
        <div class="match-card"
             data-pair="${p.matchPairId}"
             data-debug="LEFT-${p.matchPairId}">
            <strong>${p.leftText}</strong>
        </div>

        <!-- RIGHT CARD -->
        <div class="match-card"
             data-pair="${p.matchPairId}"
             data-debug="RIGHT-${p.matchPairId}">
            <strong>${p.rightText}</strong>
        </div>

    </c:forEach>

</div>

<!-- ================= DEBUG HELPER ================= -->
<script>
console.group("🧪 JSP DEBUG — Cards Rendered");
document.querySelectorAll(".match-card").forEach((c,i)=>{
    console.log(
        i+1,
        c.innerText.trim(),
        "data-pair =", c.dataset.pair,
        "debug =", c.dataset.debug
    );
});
console.groupEnd();
</script>

<!-- ================= MATCH ENGINE ================= -->
<script src="${pageContext.request.contextPath}/js/quizlet-match.js"></script>

</body>
</html>
