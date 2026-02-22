window.addEventListener("load", () => {
    const script = [
        { text: "Hey there! Ever thought about how numbers are like our oldest friends? They’ve been around forever, just hanging out, waiting for us to get to know them better.", character: "max" },
        { text: "Wow, really? I never thought about it that way! So numbers have been with us, like, forever?", character: "student" },
        { text: "Yep, absolutely! And it all starts with number ONE. The original, the beginning of everything. Then we keep adding ‘one more than the one before’…and BOOM! Numbers keep growing forever.", character: "max" },
        { text: "That’s actually kind of cool! So, what’s next?", character: "student" },
        { text: "Well, this idea comes from Vedic Mathematics, an ancient way of thinking about numbers. It says we can keep making new numbers by adding ‘one more than the one before.’ Simple, right? But kind of genius!", character: "max" }
    ];

    // Function to handle each line of dialogue
    function startDialogue() {
        script.forEach((line, index) => {
            setTimeout(() => speak(line.text, line.character), index * 5000);
        });
    }

    // Displaying and animating numbers 1 to 10
    function displayNumbers() {
        const numbersContainer = document.getElementById("numbers");

        for (let i = 1; i <= 10; i++) {
            const number = document.createElement("div");
            number.classList.add("number");
            number.textContent = i;
            numbersContainer.appendChild(number);

            // Animate each number with a "pop" effect
            gsap.fromTo(number, { opacity: 0, scale: 0.5 }, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                delay: i * 0.5,
                onStart: () => speak(`Number ${i}`, i % 2 === 0 ? "student" : "max") // Alternate characters for fun
            });
        }
    }

    // Start dialogue and animations
    startDialogue();
    displayNumbers();
});
