function showQuestion() {
    var questionContainer = document.getElementById('questionContainer');
    document.querySelector('div .journal-container').style.display = 'none';
    questionContainer.style.display = 'block';

    fetch("https://atman.onrender.com/get-next-question")
        .then((response) => response.json())
        .then((data) => {
            var question = document.getElementById('question');
            question.textContent = data.question;
        })
}

async function SubmitJournalAnswer () {
    const answer = document.getElementById('answerTextarea').value;
    const uid = localStorage.uid;

    try {
        const response = await axios.post('https://atman.onrender.com/submit-daily-journal-answer', {
                uid: uid,
                answer: answer,
        })

        if (response.data) {
           showToast(response.data.message);
            window.location.href = './';
        }
    } catch (error) {
        console.log(error)
    }


}

function showToast(message) {
    const messageToast = document.getElementById('messageToast');
    messageToast.innerText = message;
    messageToast.style.display = 'block'; // Show the message
    setTimeout(() => {
      closeToast(); // Automatically close after 5 seconds
    }, 5000);
  }
  
  // Function to close the toast message
  function closeToast() {
    const messageToast = document.getElementById('messageToast');
    messageToast.style.animation = 'slideOutRight 1s forwards'; // Animation for exit
    setTimeout(() => {
      messageToast.style.display = 'none'; // Hide the message after animation
      messageToast.style.animation = ''; // Reset animation
    }, 500); // Wait for animation to complete
  }