function showQuestion() {
    console.log('showQuestion');
    var questionContainer = document.getElementById('questionContainer');
    document.querySelector('div .journal-container').style.display = 'none';
    questionContainer.style.display = 'block';

    fetch("https://atman.onrender.com/get-next-question")
        .then((response) => response.json())
        .then((data) => {
           console.log(data);
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
           
            alert(response.data.message)
            window.location.href = './';
        }
    } catch (error) {
        console.log(error)
    }


}
