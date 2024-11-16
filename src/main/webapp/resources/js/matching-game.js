// matching-game.js

// Initialize score
let score = 0;

// Add event listeners for draggable items
document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
});

// Add event listeners for droppable categories
document.querySelectorAll(".category").forEach(category => {
    category.addEventListener("dragover", dragOver);
    category.addEventListener("drop", drop);
});

// Drag Start Function: Triggered when an item starts being dragged
function dragStart(event) {
    // Set the ID of the dragged item for transfer
    event.dataTransfer.setData("text", event.target.id);
    // Add a visual effect to the item being dragged
    event.target.classList.add("dragging");
}

// Drag End Function: Triggered when dragging ends
function dragEnd(event) {
    // Remove the dragging visual effect
    event.target.classList.remove("dragging");
}

// Drag Over Function: Triggered when an item is dragged over a category
function dragOver(event) {
    event.preventDefault();  // Allows the drop action
}

// Drop Function: Handles the logic when an item is dropped on a category
function drop(event) {
    event.preventDefault();
    
    // Get the ID of the dragged item
    const itemId = event.dataTransfer.getData("text");
    const item = document.getElementById(itemId);
    
    // Retrieve the correct category ID from the data attribute of the item
    const correctCategoryId = item.getAttribute("data-correct-category");

    // Check if the item is dropped in the correct category
    if (event.target.id === correctCategoryId) {
        // Append the item to the category
        event.target.appendChild(item);
        // Make the item non-draggable after a correct match
        item.draggable = false;
        
        // Update the score for a correct match
        score += 10;
        document.getElementById("result").textContent = "Correct!";
    } else {
        // Update the result message and deduct points for an incorrect match
        document.getElementById("result").textContent = "Try again!";
        score -= 5;
    }

    // Display the updated score
    document.getElementById("score").textContent = `Score: ${score}`;
}
