function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

// Function to validate time from-to
function validateTime(fromTime, toTime) {
    return fromTime < toTime;
}

// Function to add a new task for today
async function addTask() {
    const taskTitle = document.getElementById('task-value').value;
    const fromTime = document.getElementById('start-time').value;
    const toTime = document.getElementById('end-time').value;

    if (!taskTitle || !fromTime || !toTime) {
        alert('Please fill in all fields');
        return;
    }




    if (!validateTime(fromTime, toTime)) {
        alert('End time must be after start time');
        return;
    }

    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-card');
    taskItem.textContent = `${taskTitle} (${fromTime} - ${toTime})`;
    taskList.appendChild(taskItem);

    const data = {
        uid :localStorage.puid,
        plan:taskTitle,
        date:getTodayDate(),
        time: {from:fromTime, to:toTime}
    }
     const response = await axios.post('https://atman.onrender.com/store-reminder',data);

     console.log(response.data);


    
    document.getElementById('task-value').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}

// Display tasks for today
function displayTasksForToday(tasks) {
    // Assume tasks are retrieved from a database or some data source
  

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-card');
        taskItem.textContent = `${task.plan} (${task.time.from} - ${task.time.to})`;
        taskList.appendChild(taskItem);
    });
}

// Display today's date in the input field on page load
document.addEventListener('DOMContentLoaded', function() {
    getasks();
});

async function getasks(todayDate = getTodayDate()) {
    document.getElementById('selecteddate').value = todayDate;

    const data = {
        uid: localStorage.puid,
        date: todayDate
    };

    try {
        const response = await axios.post('https://atman.onrender.com/get-records', data);

        if (response.data) {
            console.log(response.data);
            displayTasksForToday(response.data.tasks);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

document.getElementById('selecteddate').addEventListener('change', function(event) {
    getasks(event.target.value);
});


// Add task button click event listener
document.getElementById('addtask').addEventListener('click', addTask);