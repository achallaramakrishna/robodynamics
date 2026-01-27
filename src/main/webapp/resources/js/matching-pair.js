/* =========================================================
   MATCHING PAIR GAME – STUDENT SIDE
   ========================================================= */

let score = 0;
let totalPairs = 0;

document.addEventListener("DOMContentLoaded", () => {
    initMatchingPairs();
});

/* ---------------------------------------------------------
   INITIALIZE GAME
--------------------------------------------------------- */
function initMatchingPairs() {

    const draggableItems = document.querySelectorAll(".pair-item");
    const dropZones = document.querySelectorAll(".drop-zone");

    totalPairs = dropZones.length;

    draggableItems.forEach(item => {
        item.addEventListener("dragstart", onDragStart);
    });

    dropZones.forEach(zone => {
        zone.addEventListener("dragover", onDragOver);
        zone.addEventListener("drop", onDrop);
    });

    updateScore();
}

/* ---------------------------------------------------------
   DRAG START
--------------------------------------------------------- */
function onDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

/* ---------------------------------------------------------
   DRAG OVER
--------------------------------------------------------- */
function onDragOver(event) {
    event.preventDefault();
}

/* ---------------------------------------------------------
   DROP HANDLER
--------------------------------------------------------- */
function onDrop(event) {
    event.preventDefault();

    const draggedId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);

    if (!draggedElement) return;

    const expectedMatch = event.currentTarget.dataset.match;

    if (expectedMatch === draggedId) {
        handleCorrectMatch(event.currentTarget, draggedElement);
    } else {
        handleWrongMatch(event.currentTarget);
    }
}

/* ---------------------------------------------------------
   CORRECT MATCH
--------------------------------------------------------- */
function handleCorrectMatch(dropZone, draggedItem) {

    if (dropZone.classList.contains("correct")) return;

    dropZone.classList.remove("wrong");
    dropZone.classList.add("correct");

    draggedItem.style.display = "none";

    score++;
    updateScore();

    if (score === totalPairs) {
        showCompletionMessage();
    }
}

/* ---------------------------------------------------------
   WRONG MATCH
--------------------------------------------------------- */
function handleWrongMatch(dropZone) {
    dropZone.classList.add("wrong");

    setTimeout(() => {
        dropZone.classList.remove("wrong");
    }, 800);
}

/* ---------------------------------------------------------
   UPDATE SCORE
--------------------------------------------------------- */
function updateScore() {
    const scoreEl = document.getElementById("score");
    if (scoreEl) {
        scoreEl.innerText = `Score: ${score} / ${totalPairs}`;
    }
}

/* ---------------------------------------------------------
   COMPLETION MESSAGE
--------------------------------------------------------- */
function showCompletionMessage() {

    const result = document.createElement("div");
    result.className = "alert alert-success text-center mt-4";
    result.innerHTML = `
        🎉 <strong>Well Done!</strong><br>
        You have completed all matching pairs.
    `;

    document.body.appendChild(result);
}
