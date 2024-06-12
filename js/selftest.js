var questions;
var index = 0;
var scores = {}; // Object to store scores for each set

async function startQuiz() {
    console.log("Starting");
    await fetchQuestions();
}

// Function to fetch questions from the API
async function fetchQuestions() {

var url = "https://atman.onrender.com/random-questions";

    var test = document.getElementById("testname").value;
if(test!= ""){
   url =  `https://atman.onrender.com/random-questions?college=${test}`;
}
console.log(url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        questions = data;

        console.log(questions);
        renderQuestion();

    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Function to render a question
function renderQuestion() {
    const appDiv = document.getElementById('app');
    if (!questions || questions.length === 0 || index >= questions.length) {
        // Handle case when questions are not available or index is out of bounds
        appDiv.innerHTML = '<div>No questions available</div>';
        return;
    }
    const currentQuestion = questions[index];
    appDiv.innerHTML = `<div class="questionspage">
    <div class="qa1bg">
    <img src="./images/qa1.svg" class="qa1"><br>
    <h5>Few steps ahead to your mental health</h5>
    </div>
    <div class="questions-container">
        <div class="questions">${index + 1}. ${currentQuestion?.text}</div>
        <div class="options">
            ${currentQuestion?.options?.map((option, i) => `
                <div class="option" onclick="handleOptionClick(${i}, ${currentQuestion.scores[i]}, '${currentQuestion.set}')"> <span class="opt">${String.fromCharCode(97 + i).toUpperCase()}</span> ${option}</div><br>
            `).join('')}
        </div>
        <button id="nextBtn" class="next-btn hidden result" onclick="handleNextClick()">Next Question</button>
    </div>
    </div>
`;
}

// Function to handle option selection
function handleOptionClick(optionIndex, score, set) {
    // Update score for the set
    if (!scores[set]) {
        scores[set] = 0;
    }
    scores[set] += score;
    handleNextClick();
    const nextBtn = document.getElementById('nextBtn');
    nextBtn?.classList?.remove('hidden'); // Show the "Next Question" button
    // Update score or perform other actions based on selected option
}

// Function to handle next question button click
function handleNextClick() {
    index++;
    const nextQuestionIndex = index + 1;
    if (index < questions.length) {
        renderQuestion();
    } else {
        // Quiz completed
        showResults();
    }
}

// Function to display results set-wise
function showResults() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="results-containers">
            <div class="congratulations">
                <img src="./images/boy2.png" alt="Boy Image">
                <h2>Congratulations!</h2>
            </div>
            <div class="results">
                ${Object.entries(scores).map(([set, score]) => `
                    <div class="result-set">
                        <h3>${set}</h3>
                        <h6>Score: ${score}</h6>
                    </div>
                `).join('')}
            </div>
            <button class="btn result" onclick="history.back()">Done</button>
        </div>
    `;
   let uid = localStorage.uid
    saveResults(scores,uid)
}


function saveResults(results,uid) {
    fetch('https://atman.onrender.com/saveSelfTestResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results,uid })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}




