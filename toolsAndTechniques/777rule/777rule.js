let habit = "";
let days = 0;
let morning = "pending";
let midmorning = "pending";
let afternoon = "pending";
let evening = "pending";

// Load data from local storage on page load
window.onload = function() {
    loadFromLocalStorage();
}

function start() {
    habit = document.getElementById('habit').value;
    if (habit === "") {
        alert("Please enter the habit");
        return;
    }
    document.getElementById('habitname').innerText = `Habit: ${habit}`;
    document.getElementById('morning').innerText = `Morning: ${morning}`;
    document.getElementById('midmorning').innerText = `Mid-Morning: ${midmorning}`;
    document.getElementById('afternoon').innerText = `Afternoon: ${afternoon}`;
    document.getElementById('evening').innerText = `Evening: ${evening}`;
    saveToLocalStorage();
}

function morningstatus() {
    morning = "completed";
    document.getElementById('morning').innerText = `Morning: ${morning}`;
    saveToLocalStorage();
}

function midmorningstatus() {
    if (morning === "completed") {
        midmorning = "completed";
        document.getElementById('midmorning').innerText = `Mid-Morning: ${midmorning}`;
        saveToLocalStorage();
    } else {
        alert("Please complete the morning task first");
    }
}

function afternoonstatus() {
    if (midmorning === "completed") {
        afternoon = "completed";
        document.getElementById('afternoon').innerText = `Afternoon: ${afternoon}`;
        saveToLocalStorage();
    } else {
        alert("Please complete the mid-morning task first");
    }
}

function eveningstatus() {
    if (afternoon === "completed") {
        evening = "completed";
        document.getElementById('evening').innerText = `Evening: ${evening}`;
        if (evening === "completed") {
            days += 1;
            document.getElementById('daysstatus').innerText = `Days completed: ${days}`;
            resetDailyStatuses();
            saveToLocalStorage();
        }
    } else {
        alert("Please complete the afternoon task first");
    }
}

function resetDailyStatuses() {
    morning = "pending";
    midmorning = "pending";
    afternoon = "pending";
    evening = "pending";
    document.getElementById('morning').innerText = `Morning: ${morning}`;
    document.getElementById('midmorning').innerText = `Mid-Morning: ${midmorning}`;
    document.getElementById('afternoon').innerText = `Afternoon: ${afternoon}`;
    document.getElementById('evening').innerText = `Evening: ${evening}`;
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('habit', habit);
    localStorage.setItem('days', days);
    localStorage.setItem('morning', morning);
    localStorage.setItem('midmorning', midmorning);
    localStorage.setItem('afternoon', afternoon);
    localStorage.setItem('evening', evening);
}

function loadFromLocalStorage() {
    if (localStorage.getItem('habit')) {
        habit = localStorage.getItem('habit');
        days = parseInt(localStorage.getItem('days'));
        morning = localStorage.getItem('morning');
        midmorning = localStorage.getItem('midmorning');
        afternoon = localStorage.getItem('afternoon');
        evening = localStorage.getItem('evening');

        document.getElementById('habitname').innerText = `Habit: ${habit}`;
        document.getElementById('morning').innerText = `Morning: ${morning}`;
        document.getElementById('midmorning').innerText = `Mid-Morning: ${midmorning}`;
        document.getElementById('afternoon').innerText = `Afternoon: ${afternoon}`;
        document.getElementById('evening').innerText = `Evening: ${evening}`;
        document.getElementById('daysstatus').innerText = `Days completed: ${days}`;
    }
}
