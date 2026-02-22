// speech.js

// Basic speak function with callback support
function speak(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    speech.onend = callback;
    window.speechSynthesis.speak(speech);
    
    console.log('speak called');
}

// Queue multiple texts to be spoken one after the other
function queueSpeech(textArray) {
    let index = 0;

    function speakNext() {
        if (index < textArray.length) {
            const speech = new SpeechSynthesisUtterance(textArray[index]);
            speech.pitch = 1;
            speech.rate = 1;
            speech.volume = 1;
            speech.onend = () => {
                index++;
                speakNext();
            };
            window.speechSynthesis.speak(speech);
        }
    }

    speakNext();
}
