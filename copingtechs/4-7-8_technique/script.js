document.addEventListener('DOMContentLoaded', () => {
    const gif = document.getElementById('gif');
    const instructionText = document.getElementById('instruction-text');
    const controlButton = document.getElementById('control-button');
    const doneButton = document.getElementById('done-button');

    let isAnimating = false;
    let timer;
    let count = 0;

    controlButton.addEventListener('click', () => {
        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    doneButton.addEventListener('click', () => {
        if (!isAnimating) {
            alert('You have successfully completed the exercise!');
            reset();
        }
    });

    function startAnimation() {
        isAnimating = true;
        controlButton.innerText = 'Stop';
        gif.style.animation = 'none';
        gif.offsetHeight; /* trigger reflow */
        gif.style.animation = null;
      
        let timeElapsed = 0;
        var animatedImage = document.getElementById("gif");
        animatedImage.src = "assets/Coping_image/478.gif"
        console.log(animatedImage)
        instructionText.innerText = 'Breathe in through your nose for 4 seconds';
        timer = setInterval(() => {
            timeElapsed++;

            if (timeElapsed <= 4) {
                instructionText.innerText = 'Breathe in through your nose for 4 seconds';
            } else if (timeElapsed <= 11) {
                instructionText.innerText = 'Hold breathe for 7 seconds';
            } else if (timeElapsed <= 19) {
                instructionText.innerText = 'Breathe out slowly through your mouth for 8 seconds';
            } else {
                instructionText.innerText = 'Repeat minimum 3 times';
                if (++count >= 3) {
                    doneButton.disabled = false;
                }
                timeElapsed = 0;
            }
        }, 1000);
    }

    function stopAnimation() {
        isAnimating = false;
        controlButton.innerText = 'Play';
         var animatedImage = document.getElementById('gif');
        animatedImage.src = "assets/Coping_image/4-7-8.png"
        clearInterval(timer);
        instructionText.innerText = 'Click Start to Begin the task and do it minimum 3 times';
    }

    function reset() {
        isAnimating = false;
        controlButton.innerText = 'Start';
        instructionText.innerText = 'Click Start to Begin the task and do it minimum 3 times';
        doneButton.disabled = true;
        count = 0;
    }
});
