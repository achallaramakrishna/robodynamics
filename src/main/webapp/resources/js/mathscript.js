// Start Explanation function
function startExplanation() {
    console.log("Starting explanation...");
    animateToNearestTen(); // Begin with animating to the nearest ten
}

// Function for Speech Synthesis and Animation of Completing the Whole
function animateToNearestTen() {
    const marker = document.getElementById("marker");
    if (!marker) {
        console.error("Marker element not found.");
        return;
    }

    console.log('Animating marker to the nearest 10 on the number line...');
    
    // GSAP animation to move marker to the nearest 10 on the number line
    gsap.to(marker, {
        x: 100, // Adjust x-value to move to the nearest 10
        duration: 2,
        ease: "power2.out",
        onStart: () => console.log('Animation started...'),
        onComplete: () => {
            console.log('Animation complete, starting speech...');
            // Start the speech sequence after animation
            speak("Completing the Whole involves adjusting numbers to reach the nearest 10.", () => {
                speak("For example, if you have a number like 6, think about how close it is to 10. By adding just 4, we reach the next whole number: 10!", () => {
                    speak("This trick helps solve math problems quickly and accurately.", createTenPointCircle);
                });
            });
        }
    });
}

// Function to Create and Animate the Ten-Point Circle
function createTenPointCircle() {
    const circle = document.getElementById("circle");
    if (!circle) {
        console.error("Circle element not found.");
        return;
    }

    const radius = 100;
    const angleIncrement = (2 * Math.PI) / 10; // Divide the circle into 10 sections

    // Clear any existing numbers in the circle before adding new ones
    circle.innerHTML = "";

    // Place numbers in a circular layout
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
    console.log('Animating circle numbers...');
    gsap.from(".circle-number", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        onStart: () => {
            console.log('Starting speech for Ten-Point Circle...');
            // Speech sequence for Ten-Point Circle explanation
            speak("This is the Ten-Point Circle, which represents numbers 1 through 9, with 0 at the top.", () => {
                speak("The Ten-Point Circle helps visualize how numbers loop back after reaching 9.");
            });
        }
    });
}
