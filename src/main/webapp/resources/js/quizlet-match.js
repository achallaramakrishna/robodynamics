document.addEventListener("DOMContentLoaded", () => {

    let firstCard = null;
    let lockBoard = false;

    const remainingEl = document.getElementById("remaining");

    console.log("✅ Quizlet Match JS Loaded");

    const cards = document.querySelectorAll(".match-card");
	shuffleCards();   // 👈 ADD HERE
	updateRemaining();

    cards.forEach(card => {

        console.log("🃏 Card found:",
            card.innerText.trim(),
            "pair =", card.dataset.pair,
            "side =", card.dataset.side
        );

        card.addEventListener("click", () => {

            if (lockBoard) return;
            if (card.classList.contains("matched")) return;

            console.log("👉 Card clicked:",
                card.innerText.trim(),
                "pair =", card.dataset.pair
            );

            // FIRST SELECTION
            if (!firstCard) {
                firstCard = card;
                card.classList.add("selected");
                return;
            }

            // SAME CARD CLICKED AGAIN
            if (firstCard === card) return;

            checkMatch(firstCard, card);
        });
    });

    function checkMatch(card1, card2) {
        lockBoard = true;

        const pair1 = card1.dataset.pair;
        const pair2 = card2.dataset.pair;

        console.log("🔍 CHECK MATCH");
        console.log("   Card 1:", card1.innerText.trim(), "pair =", pair1);
        console.log("   Card 2:", card2.innerText.trim(), "pair =", pair2);

        // SAFETY CHECK
        if (!pair1 || !pair2) {
            console.error("❌ data-pair missing!", pair1, pair2);
            reset();
            return;
        }

        if (pair1 === pair2) {
            console.log("✅ MATCH SUCCESS");
            resolveMatch(card1, card2);
        } else {
            console.log("❌ MATCH FAILED");
            rejectMatch(card1, card2);
        }
    }

    function resolveMatch(c1, c2) {
        c1.classList.add("correct", "matched");
        c2.classList.add("correct", "matched");

        setTimeout(() => {
            c1.remove();
            c2.remove();
            reset();
            updateRemaining();
        }, 450);
    }

    function rejectMatch(c1, c2) {
        c1.classList.add("wrong");
        c2.classList.add("wrong");

        setTimeout(() => {
            c1.classList.remove("wrong", "selected");
            c2.classList.remove("wrong", "selected");
            reset();
        }, 450);
    }

    function reset() {
        firstCard = null;
        lockBoard = false;
        document.querySelectorAll(".match-card.selected")
            .forEach(c => c.classList.remove("selected"));
    }

	function shuffleCards() {
	    const grid = document.getElementById("gameGrid");
	    const cards = Array.from(grid.children);

	    console.log("🔀 Shuffling cards...");

	    for (let i = cards.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [cards[i], cards[j]] = [cards[j], cards[i]];
	    }

	    cards.forEach(card => grid.appendChild(card));
	}

    function updateRemaining() {
        const remaining = document.querySelectorAll(".match-card").length;
        console.log("📊 Remaining cards:", remaining);
        if (remainingEl) {
            remainingEl.innerText = "Remaining cards: " + remaining;
        }
    }
});
