let score = 0;

document.addEventListener("DOMContentLoaded", () => {

    console.log("🎮 Matching Game JS Loaded");

    document.querySelectorAll(".item").forEach(item => {
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragend", dragEnd);
    });

    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("dragover", dragOver);
        category.addEventListener("drop", drop);
    });
});

/* ===== DRAG ===== */

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
    event.target.classList.add("dragging");

    console.log("➡️ Drag start:", event.target.id);
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}

/* ===== DROP ===== */

function dragOver(event) {
    event.preventDefault(); // REQUIRED
}

function drop(event) {
    event.preventDefault();

    // SAFELY find category even if dropping on text/image
    const category = event.target.closest(".category");
    if (!category) {
        console.warn("⚠️ Drop ignored (not on category)");
        return;
    }

    const itemId = event.dataTransfer.getData("text/plain");
    const item = document.getElementById(itemId);

    if (!item) {
        console.error("❌ Item not found:", itemId);
        return;
    }

    const correctCategoryId = item.dataset.correctCategory;

    console.log("⬇️ Dropped:", itemId);
    console.log("   On:", category.id);
    console.log("   Expected:", correctCategoryId);

    if (category.id === correctCategoryId) {

        category.appendChild(item);
        item.draggable = false;
        item.style.cursor = "default";

        score += 10;
        showResult("✅ Correct!", "green");
        console.log("✅ MATCH SUCCESS");

    } else {

        score -= 5;
        showResult("❌ Try again!", "red");
        console.log("❌ MATCH FAILED");
    }

    updateScore();
}

/* ===== UI ===== */

function showResult(text, color) {
    const result = document.getElementById("result");
    result.textContent = text;
    result.style.color = color;
}

function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}
