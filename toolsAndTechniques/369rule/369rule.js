let habit = "";
let morning = "pending";
let afternoon = "pending";
let evening = "pending";
let days = 0;
let lastCompletedDate = "";

window.onload = function() {
    loadFromLocalStorage();
}

function start() {
    habit = document.getElementById('habit').value;
    if (habit === "") {
        alert("Please enter the habit");
        return;
    }
    document.getElementById('habitname').innerText = `Tracking: ${habit}`;
    document.getElementById('morningstatus').innerText = `Morning: ${morning}`;
    document.getElementById('afternoonstatus').innerText = `Afternoon: ${afternoon}`;
    document.getElementById('eveningstatus').innerText = `Evening: ${evening}`;
    document.getElementById('days').innerText = `Days Completed: ${days}`;
    document.getElementById('tracker').style.display = 'block';
    saveToLocalStorage();
}

function updateProgress(time) {
    if (time === 'morning') {
        morning = "completed";
        document.getElementById('morningstatus').innerText = `Morning: ${morning}`;
    } else if (time === 'afternoon' && morning === "completed") {
        afternoon = "completed";
        document.getElementById('afternoonstatus').innerText = `Afternoon: ${afternoon}`;
    } else if (time === 'evening' && afternoon === "completed") {
        evening = "completed";
        document.getElementById('eveningstatus').innerText = `Evening: ${evening}`;
    } else {
        alert("Please complete the previous step first.");
        return;
    }
    saveToLocalStorage();
}

function nextDay() {
    if (evening === "completed") {
        morning = "pending";
        afternoon = "pending";
        evening = "pending";
        document.getElementById('morningstatus').innerText = `Morning: ${morning}`;
        document.getElementById('afternoonstatus').innerText = `Afternoon: ${afternoon}`;
        document.getElementById('eveningstatus').innerText = `Evening: ${evening}`;
        days += 1;
        document.getElementById('days').innerText = `Days Completed: ${days}`;
        lastCompletedDate = new Date().toISOString().split('T')[0]; // Store only the date part
        saveToLocalStorage();
    } else {
        alert("Please complete all steps for the day before proceeding to the next day.");
    }
}

function saveToLocalStorage() {
    localStorage.setItem('habit', habit);
    localStorage.setItem('days', days);
    localStorage.setItem('morning', morning);
    localStorage.setItem('afternoon', afternoon);
    localStorage.setItem('evening', evening);
    localStorage.setItem('lastCompletedDate', lastCompletedDate);
}

function loadFromLocalStorage() {
    if (localStorage.getItem('habit')) {
        habit = localStorage.getItem('habit');
        days = parseInt(localStorage.getItem('days'));
        morning = localStorage.getItem('morning');
        afternoon = localStorage.getItem('afternoon');
        evening = localStorage.getItem('evening');
        lastCompletedDate = localStorage.getItem('lastCompletedDate');

        document.getElementById('habitname').innerText = `Tracking: ${habit}`;
        document.getElementById('morningstatus').innerText = `Morning: ${morning}`;
        document.getElementById('afternoonstatus').innerText = `Afternoon: ${afternoon}`;
        document.getElementById('eveningstatus').innerText = `Evening: ${evening}`;
        document.getElementById('days').innerText = `Days Completed: ${days}`;

        // Check if a new day has started
        const today = new Date().toISOString().split('T')[0];
        if (lastCompletedDate !== today) {
            morning = "pending";
            afternoon = "pending";
            evening = "pending";
            document.getElementById('morningstatus').innerText = `Morning: ${morning}`;
            document.getElementById('afternoonstatus').innerText = `Afternoon: ${afternoon}`;
            document.getElementById('eveningstatus').innerText = `Evening: ${evening}`;
        }
    }
}
