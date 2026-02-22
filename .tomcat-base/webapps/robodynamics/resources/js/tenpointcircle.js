// Start Explanation function
function startExplanation() {
    console.log("Starting explanation...");
    speak("Hello, math explorers! Today, we’re diving into the amazing world of numbers. It all starts with the number one.", () => {
        animateNumberLine();
    });
}

// Function to Animate and Explain the Number Line
function animateNumberLine() {
    console.log('Animating number line...');
    
    speak("Think of it this way: after one comes two, then three, and then we keep counting up. Numbers are like a line of friends, each one coming after the other. We can call this line the number line!", () => {
        
        const numberLine = document.getElementById("numberLine");
        if (!numberLine) {
            console.error("Number line element not found.");
            return;
        }

        // Animate numbers appearing on the line one by one
        for (let i = 1; i <= 10; i++) {
            const numberDiv = document.createElement("div");
            numberDiv.classList.add("line-number");
            numberDiv.textContent = i;
            numberLine.appendChild(numberDiv);
            gsap.from(numberDiv, {
                opacity: 0,
                x: -30,
                duration: 0.5,
                delay: i * 0.3
            });
        }

        // Narrate the sutra explanation
        speak("There’s a special trick, or what we call a sutra, that describes how numbers keep growing. It’s called By One More than the One Before. That’s just a fancy way to say we keep adding one to get to the next number.", animateCircle);
    });
}

// Function to Create and Animate the Ten-Point Circle
function animateCircle() {
    console.log('Creating and animating ten-point circle...');

    const circle = document.getElementById("circle");
    if (!circle) {
        console.error("Circle element not found.");
        return;
    }

    const radius = 100;
    const angleIncrement = (2 * Math.PI) / 10; // Divide the circle into 10 sections

    // Clear any existing numbers in the circle before adding new ones
    circle.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const angle = i * angleIncrement;
        const x = radius + radius * Math.cos(angle) - 15; // Offset by 15px to center
        const y = radius + radius * Math.sin(angle) - 15;

        const numberDiv = document.createElement("div");
        numberDiv.classList.add("circle-number");
        numberDiv.textContent = i === 9 ? 0 : i + 1; // Place 0 at the top position
        numberDiv.style.left = `${x}px`;
        numberDiv.style.top = `${y}px`;
        circle.appendChild(numberDiv);
    }

    // Animate numbers to appear sequentially
    gsap.from(".circle-number", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        onStart: () => {
            speak("Did you know? Each number is unique, kind of like each one of us! Just like each of you has something special, every number has its own quirks and surprises. Some numbers are even seen as lucky, or mysterious, or have other stories behind them.", () => {
                speak("To help us understand numbers a bit better, let’s try putting the first ten numbers in a circle.", () => {
                    speak("Imagine the numbers from 1 to 10 going around like the hours on a clock. This circle of numbers shows us something interesting: we can make new numbers by going around it again!", explainNumberCombinations);
                });
            });
        }
    });
}

// Function to Explain Number Combinations Beyond 10
function explainNumberCombinations() {
    speak("When we go past 9, we start combining numbers. So, for example, 10 is made from a 1 and a 0. And after 10, we keep going: 11, 12, and so on.", () => {
        speak("Imagine that when we reach 11, it could sit right above 1 on our number circle, only further out. And 12 could go out from 2, and it keeps going, like a spiral of friends!", () => {
            speak("So, in this number adventure, remember that every number is unique. Get to know them well, because as you learn more, they’ll become like friends you can count on anytime!");
        });
    });
}

// Example speak function using SpeechSynthesis API
function speak(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
}
