document.addEventListener("DOMContentLoaded", () => {
  const startStopButton = document.getElementById("startStopButton");
  const doneButton = document.getElementById("doneButton");
  const instructionText = document.getElementById("instructionText");
  const instructionModal = document.getElementById("instructionModal");
  const closeModalButton = document.getElementById("closeModalButton");
  const instructionList = document.getElementById("instructionList");
  const closeButton = document.querySelector(".close-button");
  const nostrilGif = document.getElementById("nostrilGif");

  let isAnimating = false;
  let timer;

  const instructions = [
    "Sit Comfortably and use your right thumb to close your right nostril.",
    "Breathe in slowly through your left nostril.",
    "Close your left nostril with your right ring finger and release your thumb from your right nostril.",
    "Breathe out slowly through your right nostril.",
    "Breathe in through your right nostril",
    "Switch and breathe out through your left nostril",
    "Repeat minimum 3 times for benefit.",
  ];

  instructions.forEach((instruction, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${instruction}`;
    instructionList.appendChild(listItem);
  });

  startStopButton.addEventListener("click", () => {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  doneButton.addEventListener("click", () => {
    alert("Well done!");
  });

  closeButton.addEventListener("click", () => {
    instructionModal.style.display = "none";
  });

  closeModalButton.addEventListener("click", () => {
    instructionModal.style.display = "none";
  });

  function startAnimation() {
    isAnimating = true;
    startStopButton.textContent = "Stop";
    doneButton.disabled = true;
    instructionText.textContent = "Breathe in slowly through your left nostril";
    nostrilGif.src = "./assets/Coping_image/Nostril.gif";

    let count = 0;
    timer = setInterval(() => {
      count++;
      if (count <= 5) {
        instructionText.textContent =
          "Breathe in slowly through your left nostril";
        console.log("in intervel 5");

        if (count == 1) {
          console.log("Breathe in slowly through your left nostril");
          speakSentence(instructionText.textContent);
        }
      } else if (count <= 10) {
        instructionText.textContent =
          "Breathe out slowly through your right nostril";

        if (count == 6) {
          console.log("Breathe out slowly through your right nostril");

          speakSentence(instructionText.textContent);
        }
      } else if (count <= 15) {
        instructionText.textContent = "Breathe in through your right nostril";
        if (count == 11) {
          speakSentence("Breathe in through your right nostril");
        }
      } else if (count <= 20) {
        instructionText.textContent =
          "Switch and breathe out through your left nostril";
        if (count == 16) {
          speakSentence("Switch and breathe out through your left nostril");
        }
      } else {
        instructionText.textContent = "Repeat minimum 3 times";
        if (count == 21) {
          speakSentence("Repeat minimum 3 times");
        }
        stopAnimation();
      }
    }, 1000);
  }

  function stopAnimation() {
    isAnimating = false;
    startStopButton.textContent = "Start";
    doneButton.disabled = false;
    clearInterval(timer);
    instructionText.textContent = "Click Start to begin the task.";
    nostrilGif.src = "./assets/Coping_image/Altrnate Nostril breathing.png";
  }

  document.getElementById("startStopButton").addEventListener("click", () => {
    instructionModal.style.display = "flex";
  });
});

function speakSentence(sentence) {
  const utterance = new SpeechSynthesisUtterance(sentence);
  window.speechSynthesis.speak(utterance);
}
