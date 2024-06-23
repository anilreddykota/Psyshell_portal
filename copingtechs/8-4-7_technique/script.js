let isAnimating = false;
let completionCount = 0;
const texts = [
    'Breathe out through your mouth for 8 seconds',
    'Breathe in through your nose for 4 seconds',
    'Hold breathe for 7 seconds',
    'Repeat few times'
];
const intervals = [8000, 4000, 7000, 1000];
let currentIndex = 0;
const instructionText = document.getElementById('instructionText');
const startStopButton = document.getElementById('startStopButton');
const doneButton = document.getElementById('doneButton');

let animationTimeout;

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
    currentIndex = 0;
    instructionText.textContent = texts[0];
    animateStep();
    var gifImg = document.getElementById("gifImage");
    gifImg.src = "assets/Coping_image/847.gif";
}

function stopAnimation() {
    var gifImg = document.getElementById("gifImage");
    gifImg.src = "assets/Coping_image/8-4-7.png";
    clearTimeout(animationTimeout);
    instructionText.textContent = 'Click Start to Begin the task and do it minimum 3 times';
}

function animateStep() {
    animationTimeout = setTimeout(() => {
        currentIndex++;
        if (currentIndex >= texts.length) {
            currentIndex = 0;
            completionCount++;
            if (completionCount >= 3) {
                stopAnimation();
                instructionText.textContent = 'Congratulations. You Completed the Task';
                doneButton.disabled = false;
                return;
            }
        }
        instructionText.textContent = texts[currentIndex];
        animateStep();
    }, intervals[currentIndex]);
}
