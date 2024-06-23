let isAnimating = false;
let completionCount = 0;
const texts = [
    'Take a breath for 4 seconds',
    'Hold for 4 seconds',
    'Exhale for 4 seconds',
    'Hold for 4 seconds'
];
let currentIndex = 0;

const box = document.getElementById('animationBox');
const dot = document.getElementById('movingDot');
const instructionText = document.getElementById('instructionText');
const animationText = document.getElementById('animationText');
const startStopButton = document.getElementById('startStopButton');
const doneButton = document.getElementById('doneButton');

let animationInterval;

startStopButton.addEventListener('click', () => {
    if (isAnimating) {
        stopAnimation();
    } else {
        startAnimation();
    }
    isAnimating = !isAnimating;
    startStopButton.textContent = isAnimating ? 'Stop' : 'Start';
    doneButton.disabled = isAnimating;
});

function startAnimation() {
    completionCount = 0;
    currentIndex = 1;
    instructionText.textContent = 'Repeat minimum 3 times';
    moveDot();
    animationInterval = setInterval(moveDot, 4000);
}

function stopAnimation() {
    clearInterval(animationInterval);
    instructionText.textContent = 'Click Start to Begin the task and done it minimum 3 times';
}

function moveDot() {

    if (currentIndex === 0) {
        x = -208;
        y = -4;
    } else if (currentIndex === 1) {
        x = -8;
        y = -4;
    } else if (currentIndex === 2) {
        x = -8;
        y = 192;
    } else if (currentIndex === 3) {
        x = -212;
        y = 192;
    }
    dot.style.transition = 'left 4s, top 4s';  
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    animationText.textContent = texts[currentIndex];
    currentIndex = (currentIndex + 1) % 4;
    if (currentIndex === 1) {
        completionCount++;
        if (completionCount >= 3) {
            clearInterval(animationInterval);
            instructionText.textContent = 'Congratulations. You Completed the Task';
            doneButton.disabled = false;
        }
    }
}
