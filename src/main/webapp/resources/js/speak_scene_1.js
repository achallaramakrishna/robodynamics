function speak(text, character) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    window.speechSynthesis.speak(msg);

    // Make the speaking character visible
    document.getElementById(character).style.opacity = 1;
    setTimeout(() => {
        document.getElementById(character).style.opacity = 0;
    }, 3000); // Adjust duration based on text length
}
