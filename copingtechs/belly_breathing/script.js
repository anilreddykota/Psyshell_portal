document.addEventListener('DOMContentLoaded', () => {
    const animation = document.getElementById('animation');
    const instructionText = document.getElementById('instruction-text');
    const controlButton = document.getElementById('control-button');
    const doneButton = document.getElementById('done-button');
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-button');

    let isAnimating = false;
    let isDone = true;

    controlButton.addEventListener('click', () => {
        if (isDone) {
            openModal();
            return;
        }

        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    doneButton.addEventListener('click', () => {
        if (!isDone && !isAnimating) {
            alert('You have successfully completed the exercise!');
            reset();
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        controlButton.disabled = false;
        controlButton.innerText = 'Play';
        instructionText.innerText = "Let's get start by clicking Play button and follow the rhythm of the circle.";
        isDone = false;
    });

    function openModal() {
        modal.style.display = 'block';
        controlButton.disabled = true;
    }

    function startAnimation() {
        isAnimating = true;
        controlButton.innerText = 'Stop';
        instructionText.innerText = 'Breathe in slowly through your nose for 4 count';
        animateCircle('expand');
    }

    function stopAnimation() {
        isAnimating = false;
        controlButton.innerText = 'Play';
        animation.style.width = '50px';
        animation.style.height = '50px';
        animation.style.backgroundColor = '#7F8C8D';
        instructionText.innerText = "Click Start to begin the task.";
    }

    function animateCircle(action) {
        if (isAnimating) {
            if (action === 'expand') {
                animation.style.width = '100px';
                animation.style.height = '100px';
                animation.style.backgroundColor = '#D3A3F1';
                instructionText.innerText = 'Breathe in slowly through your nose for 4 count';

                setTimeout(() => {
                    if (isAnimating) {
                        animateCircle('contract');
                    }
                }, 6000);
            } else if (action === 'contract') {
                animation.style.width = '50px';
                animation.style.height = '50px';
                animation.style.backgroundColor = 'blue';
                instructionText.innerText = 'Breathe out slowly through your mouth for 4 count';

                setTimeout(() => {
                    if (isAnimating) {
                        animateCircle('expand');
                    }
                }, 6000);
            }
        }
    }

    function reset() {
        isDone = true;
        controlButton.innerText = 'Start';
        instructionText.innerText = 'Click Start to begin the task.';
        doneButton.disabled = true;
    }
});
