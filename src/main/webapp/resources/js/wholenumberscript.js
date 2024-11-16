// Function for Speech Synthesis
function speak(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    speech.onend = callback;
    window.speechSynthesis.speak(speech);
}

// GSAP animation for numbers
function animateNumbers(numbers, color) {
    gsap.fromTo(numbers, 
        { scale: 0, opacity: 0, backgroundColor: color }, 
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.3, backgroundColor: "lightblue" });
}

// Main function to start the explanation
function startExplanation() {
    // Text descriptions
    const description = document.getElementById("description");

    // Step 1: Explain whole numbers
    description.textContent = "Whole numbers are numbers that include 0, 1, 2, 3, 4... and go on forever, starting from zero. They are the set of natural numbers without any fractions or decimals.";
    speak(description.textContent, () => {
        // Step 2: Animate whole numbers
        const wholeNumbers = document.querySelectorAll("#whole-numbers .number");
        animateNumbers(wholeNumbers, "lightgreen");

        // Step 3: Explain integers after whole numbers
        setTimeout(() => {
            description.textContent = "Integers include positive whole numbers, negative whole numbers, and zero. These numbers represent values like temperature, money, and elevation.";
            speak(description.textContent, () => {
                // Step 4: Animate integers example (adding positive and negative numbers)
                const extraNumbers = [-3, -2, -1, 0, 1, 2, 3];
                addAndAnimateIntegers(extraNumbers);
            });
        }, 3000);
    });
}

// Function to add and animate integer examples
function addAndAnimateIntegers(numbers) {
    const numberBox = document.createElement("div");
    numberBox.classList.add("number-box");

    numbers.forEach(num => {
        const numElement = document.createElement("div");
        numElement.classList.add("number");
        numElement.textContent = num;
        numberBox.appendChild(numElement);
    });

    document.body.appendChild(numberBox);
    animateNumbers(numberBox.children, "salmon");
}
