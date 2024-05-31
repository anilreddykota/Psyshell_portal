document.addEventListener('DOMContentLoaded', function () {
    const questionsForm = document.getElementById('questions');
    const questionContainer = document.getElementById('questionContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    
    addQuestionBtn.addEventListener('click', addQuestionField);

    function addQuestionField() {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'questionDiv mb-3 p-3 border rounded';


        const categorySelect = document.createElement('select');
        categorySelect.name = 'category';
        categorySelect.className = 'form-control mb-2';

        ['Mood', 'anxiety', 'sleep issues', 'stress'].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        questionDiv.appendChild(categorySelect);

        const questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.name = 'question';
        questionInput.placeholder = 'Enter your question';
        questionInput.className = 'form-control mb-2';
        questionInput.required = true;

        questionDiv.appendChild(questionInput);

        const optionContainer = document.createElement('div');
        optionContainer.className = 'optionContainer';

        const addOptionBtn = document.createElement('button');
        addOptionBtn.type = 'button';
        addOptionBtn.textContent = 'Add Option';
        addOptionBtn.className = 'btn btn-secondary mb-2';

        addOptionBtn.addEventListener('click', () => addOptionField(optionContainer));
        questionDiv.appendChild(addOptionBtn);

       

        questionDiv.appendChild(optionContainer);
        questionContainer.appendChild(questionDiv);
    }

    function addOptionField(optionContainer) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'optionDiv mb-2 p-2 border rounded';
    
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
    
        const optionCol = document.createElement('div');
        optionCol.className = 'col-md-8';
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.name = 'option';
        optionInput.className = 'form-control mb-2';
        optionInput.placeholder = 'Enter option';
        optionInput.required = true;
        optionCol.appendChild(optionInput);
    
        const scoreCol = document.createElement('div');
        scoreCol.className = 'col-md-4';
        const scoreInput = document.createElement('input');
        scoreInput.type = 'number';
        scoreInput.name = 'score';
        scoreInput.placeholder = 'Score';
        scoreInput.className = 'form-control';
        optionInput.required = true;
        scoreInput.min = 1;
        scoreCol.appendChild(scoreInput);
    
        rowDiv.appendChild(optionCol);
        rowDiv.appendChild(scoreCol);
        optionDiv.appendChild(rowDiv);
    
        optionContainer.appendChild(optionDiv);
    }
    

    questionsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const questionsArray = [];

        const questions = document.querySelectorAll('.questionDiv');
        questions.forEach(questionDiv => {
            const question = questionDiv.querySelector('input[name="question"]').value;
            const category = questionDiv.querySelector('select[name="category"]').value;
            const options = [];
            
            const optionDivs = questionDiv.querySelectorAll('.optionDiv');
            optionDivs.forEach(optionDiv => {
                const option = optionDiv.querySelector('input[name="option"]').value;
                const score = optionDiv.querySelector('input[name="score"]').value;
                options.push({ option, score });
            });

            if (question && category && options.length > 0 && options.every(o => o.option && o.score)) {
                questionsArray.push({ question, category, options });
            }
        });

        if(questionsArray.length <1){
            alert(" please add a new question completely");
            return
        }
        var college = document.getElementById("collegecode").value;

        if(!college){
           var ok =  confirm("college code is required to group questions");
           if(!ok){
            return
           }

           
        }




        fetch('http://localhost:3002/postQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },


            body: JSON.stringify({college:college, questions: questionsArray })
        })
        .then(response => response.json())
        .then(data => {

            if(data.message === "Questions added successfully")
                {
                    console.log('Success:', data);    
                }
           
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});



