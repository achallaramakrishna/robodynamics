import { speak, queueSpeech } from './speech.js';

// Usage of speak function with callback
speak("This is an example sentence.", () => {
    console.log("Speech finished, now you can trigger other actions here.");
});

// Usage of queueSpeech function to play multiple statements in sequence
queueSpeech([
    "Hello, welcome to the tutorial.",
    "We will now learn about whole numbers.",
    "Whole numbers start from zero and go up infinitely."
]);
