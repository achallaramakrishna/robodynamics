	// Function for Speech Synthesis
	function speak(text) {
	  const speech = new SpeechSynthesisUtterance(text);
	  speech.pitch = 1;
	  speech.rate = 1;
	  speech.volume = 1;
	  window.speechSynthesis.speak(speech);
	}
	
	// Initial Animation for "Max" Introduction
	function startMaxIntroduction() {
	  // GSAP animation for Max appearance
	  gsap.from("#math-explorer-max", {
	    y: -200,
	    opacity: 0,
	    duration: 1,
	    ease: "bounce",
	    onComplete: () => speak("Hi there! I’m Max, and today, we’re going to explore the amazing world of integers!")
	  });
	}
	
	// Event Listener for "Next" Button
	document.getElementById("next-button").addEventListener("click", function() {
	  // Update text and animate Max with voice
	  document.getElementById("max-speech").textContent = "Let’s dive into integers. Click next to begin!";
	  gsap.to("#math-explorer-max", { x: 100, duration: 1 });
	  speak("Let’s dive into integers. Click next to begin!");
	});
	
	// Start Max's introduction when the page loads
	window.onload = startMaxIntroduction;
