var graphdata = [];
let moodChart = null;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('message-list').innerHTML = "";

    var approvedAppointments = [];

    async function getAppointments() {
        const puid = localStorage.puid;
        try {
            const response = await axios.post('https://atman.onrender.com/getAppointmentsByDoctor', { puid });
            const appointments = response.data;
            console.log(appointments);
            approvedAppointments = [...appointments.approvedAppointments, ...appointments.addedAppointmentsData];
            displayAppointments([...appointments.approvedAppointments, ...appointments.addedAppointmentsData]);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    function filterUsers(userNickname) {
        if (userNickname === "") {
            displayAppointments(approvedAppointments);
        } else {
            const users = approvedAppointments.filter(appointment => {
                console.log(appointment.userDetails.nickname);
                return appointment.userDetails.nickname === userNickname;
            });
            displayAppointments(users);
        }
    }

    function displayAppointments(appointments) {
        const appointmentsDiv = document.getElementById('message-list');
        appointmentsDiv.innerHTML = ''; // Clear previous appointments
        if (appointments.length === 0) {
            appointmentsDiv.textContent = 'No appointments found for this doctor.';
        } else {
            appointments.map(appointment => {
                const appointmentHTML = `
                <li class="unread appointment" data-uid="${appointment.uid}">
                <div class="d-flex">
                    <div class="w-25">
                        <img src="${appointment.userDetails.profile || "./images/resources/defaultpic.jpg"}" alt="" class="pt-3">
                    </div>
                    <div class="newpst-input  groups">
                        <h3 class="appointment-title"> ${appointment.userDetails.nickname?.toUpperCase()}</h3>
                        <div class="row">
                        <div class="col-sm-12">
                        <a href='chatting.html?uid=${appointment.uid}&uname=${appointment.userDetails?.nickname}'> <button class="btn">chat</button></a>
                       <a> <button class="btn" onclick="showFeature(4)">Notes</button></a><br><br>
                       </div>
                       <div class='col-sm-12'>
                       <a> <button class="btn" onclick="showFeature(2)">Monitor</button></a
                       <a> <button class="btn" onclick="showFeature(3)">Tasks</button></a>  
                       </div>

                        </div>
                       
                        <br>
                    </div>
                </div>
                </li>
                `;
                appointmentsDiv.innerHTML += appointmentHTML;
            });
            document.getElementById('selectedstudent').style.display = 'none';
            document.querySelectorAll('.appointment').forEach(item => {
                document.getElementById('selectedstudent').style.display = 'block';
                item.addEventListener('click', async event => {
                    window.location.hash = "#selectedstudent";
                    const selectedUserId = event.currentTarget.dataset.uid;
                    const selectedUser = approvedAppointments.find(appointment => appointment.uid === selectedUserId);
                    const response = await axios.post('https://atman.onrender.com/get-analysis-of-student', { uid: selectedUser.uid })




                    graphdata = response;
                    console.log(graphdata.data);
                    if (response.data.message === 'No mood data found for the specified user.') {
                        console.log(response.data.message);
                        document.getElementById('no-graph-message').innerHTML = response.data.message;
                        document.getElementById('moodChart').innerHTML = "";
                        document.getElementById('streak-data').innerHTML = "";
                        if (moodChart) {
                            // If an existing chart instance exists, destroy it
                            moodChart.destroy();
                        }

                    } else {
                        displayMoodChart();
                        streakdata(response.data.longestStreak, response.data.currentStreak);
                        document.getElementById('no-graph-message').innerHTML = "";

                    }





                    if (selectedUser) {
                        document.getElementById('chat-link').setAttribute('href', `chatting.html?uid=${selectedUser.uid}&uname=${selectedUser.userDetails?.nickname}`)
                        document.getElementById('user-image').setAttribute('src', selectedUser.userDetails?.profile || './images/resources/defaultpic.jpg')

                        const userDetails = selectedUser.userDetails;
                        const userFields = [
                            { label: 'Name', value: userDetails.name },
                            { label: 'Gender', value: userDetails.gender },
                            { label: 'Age', value: userDetails.age },
                            { label: 'Occupation', value: userDetails.occupation },
                            { label: 'Relationship Status', value: userDetails.relationshipstatus },
                            { label: 'Languages Spoken', value: userDetails.languagesSpoken?.join(', ') || userDetails.language },
                            { label: 'Contact Details', value: userDetails.email }
                        ];
                        let userHTML = '';
                        userFields.forEach(field => {
                            if (field.value) {
                                userHTML += `<li class="list-group-item">${field.label}: <b>${field.value}</b></li>`;
                            }
                        });
                        document.querySelector('.users-data').innerHTML = userHTML;
                    }







                });

            });

        }
    }

    const user = document.getElementById('search-user');
    user.addEventListener('change', function () {
        filterUsers(user.value);
    });


    getAppointments();
});
function showFeature(featureNum) {
    // Hide all features
    for (let i = 1; i <= 5; i++) {
        document.getElementById('feature' + i).classList.add('hidden');
    }
    // Show only the clicked feature
    document.getElementById('feature' + featureNum).classList.remove('hidden');
}





let notes = [];
let tasks = [];


function showFeature(featureNum) {
    // Hide all features
    for (let i = 1; i <= 4; i++) {
        document.getElementById('feature' + i).classList.add('hidden');
    }
    // Show only the clicked feature
    document.getElementById('feature' + featureNum).classList.remove('hidden');


}



function saveNote() {
    document.getElementById('note-modal').classList.add('hidden');
    document.getElementById('note-modal').classList.remove('show');

    const title = document.getElementById('note-title').value;
    const description = document.getElementById('note-description').value;
    notes.push({ title, description });
    displayNotes();
    // Clear form fields
    document.getElementById('note-title').value = '';
    document.getElementById('note-description').value = '';
}

function displayNotes() {

    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.innerHTML = `
      <div class='h1'>${note.title}</div>
      <div>${note.description}</div>
      <button onclick="editNote(${index})" class='btn'>Edit</button>
      <button onclick="deleteNote(${index})" class='btn btn-outline-danger'>Delete</button>
    `;
        notesContainer.appendChild(noteElement);
    });
}

function editNote(index) {
    const note = notes[index];

    const noteForm = document.getElementById('edit-note-form');
    noteForm.style.display = 'block';
    noteForm.innerHTML = `<div class="widget p-2">
    <input type="hidden" id="edit-note-index" value="${index}">
    <label for="edit-note-title">Title:</label>
    <input type="text" id="edit-note-title" value="${note.title}" required><br>
    <label for="edit-note-description">Description:</label><br>
    <textarea id="edit-note-description" required>${note.description}</textarea><br>
    <button type="button" onclick="saveEditedNote()" class='btn '>Save</button></div>
  `;
}

function saveEditedNote() {
    document.getElementById('edit-note-form').style.display = "none";
    const index = document.getElementById('edit-note-index').value;
    const title = document.getElementById('edit-note-title').value;
    const description = document.getElementById('edit-note-description').value;
    notes[index] = { title, description };
    displayNotes();
}

function deleteNote(index) {
    notes.splice(index, 1);
    displayNotes();
}

function openNoteForm() {
    document.getElementById('note-modal').classList.remove('hidden');
    document.getElementById('note-modal').classList.add('show');

}

function closeNoteForm() {
    document.getElementById('note-modal').classList.add('hidden');
    document.getElementById('note-modal').classList.remove('show');

}
function addTask() {
    const taskInput = document.getElementById('task');
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        tasks.push(taskName);
        displayTasks();
        taskInput.value = '';
    }
}

function displayTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('widget-task');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');

        const taskText = document.createElement('span');
        taskText.textContent = task;

        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskText);

        tasksContainer.appendChild(taskElement);
    });
}


function displayMoodChart() {
    if (moodChart) {
        // If an existing chart instance exists, destroy it
        moodChart.destroy();
    }
    const ctx = document.getElementById('moodChart').getContext('2d');
    const labels = [...graphdata?.data?.moodDate];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Mood Level',
            data: [...graphdata?.data?.analyticsResult?.moodScore],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        // Custom label mapping
                        const labelMap = {
                            1: "😩 Terrible",
                            2: "😢 Sad",
                            3: "😞 Bad",
                            4: "😄 Happy",
                            5: "😊 Amazing",

                        };
                        return labelMap[value] || value;
                    }
                },
                title: {
                    display: true,
                    text: 'Mood Level'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    };

    moodChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

}


function streakdata(longest, current) {
    const datesLongest = longest.dates;
    const datesCurrent = current.dates;

    // Function to format dates as "Month Day, Year"
    // Function to format dates as "Month Day, Year"
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };


    // Generate calendar HTML
    const generateCalendarHTML = (dates) => {


        const calendar = {};

        // Initialize calendar object
        dates.forEach(date => {
            const key = formatDate(date);
            console.log(key);
            calendar[key] = true;
        });

        // Generate HTML for each day
        let html = '<div class="calendar">';
        const today = new Date();
        for (let date = new Date(today.getFullYear(), today.getMonth(), 1); date.getMonth() === today.getMonth(); date.setDate(date.getDate() + 1)) {
            const key = formatDate(date);
            const isStreakDay = calendar[key] ? 'streak-day' : '';
            const isCompletedDay = calendar[key] ? '' : (date <= today ? 'completed-day' : ''); // Check if day is completed (past)
            html += `<div class="calendar-day ${isStreakDay} ${isCompletedDay}">${date.getDate()}</div>`;
        }
        html += '</div>';
        return html;
    };

    // Updating streak-data element with formatted HTML
    document.getElementById('streak-data').innerHTML = `
        <div class="row">
            <div class="col-sm-5 card m-2">
                <h5>Longest Streak</h5>
                <p>Length: ${longest.length}</p>
                <div class="month-year">${formatDate(new Date(datesLongest[0]))}</div>
                ${generateCalendarHTML(datesLongest)}
            </div>
            <div class="col-sm-5 card m-2">
                <h5>Current Streak</h5>
                <p>Length: ${current.length}</p>
                <div class="month-year">${formatDate(new Date(datesCurrent[0]))}</div>
                ${generateCalendarHTML(datesCurrent)}
            </div>
        </div>
    `;
}




