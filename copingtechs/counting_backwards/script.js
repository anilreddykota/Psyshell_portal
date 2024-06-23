


document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const instructionText = document.getElementById('instruction-text');
    const controlButton = document.getElementById('control-button');
    const doneButton = document.getElementById('done-button');
    const countSelect = document.getElementById('count-select');

    let isAnimating = true;
    let isDone = false;
    let seconds = parseInt(countSelect.value, 10);
    let timer;
    let isTimerRunning = false;

    controlButton.addEventListener('click', () => {
        if (isTimerRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    doneButton.addEventListener('click', () => {
        if (!isTimerRunning) {
            alert('You have successfully completed the exercise!');
            reset();
        }
    });

    countSelect.addEventListener('change', () => {
        if (!isTimerRunning) {
            seconds = parseInt(countSelect.value, 10);
            timerDisplay.innerText = seconds;
        }
    });

    function startTimer() {
        isAnimating = false;
        isDone = false;
        isTimerRunning = true;
        controlButton.innerText = 'Stop';
        instructionText.innerText = 'Count Backward with Numbers';

        timer = setInterval(() => {
            seconds--;
            timerDisplay.innerText = seconds;

            if (seconds === 0) {
                isAnimating = true;
                isDone = true;
                stopTimer();
                seconds = parseInt(countSelect.value, 10);
            }
        }, 1000);
    }

    function stopTimer() {
        isTimerRunning = false;
        clearInterval(timer);
        controlButton.innerText = 'Play';
        instructionText.innerText = 'Click Play to Start';
        if (isDone) {
            doneButton.disabled = false;
        }
    }

    function reset() {
        isAnimating = true;
        isDone = false;
        seconds = parseInt(countSelect.value, 10);
        timerDisplay.innerText = seconds;
        controlButton.innerText = 'Play';
        instructionText.innerText = 'Click Play to Start';
        doneButton.disabled = true;
    }
});
