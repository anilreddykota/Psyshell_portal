var data;
var timeslot;
var date;
var uid= localStorage.uid;

function generateTimeSlots(startTime, endTime, interval) {
    var timeSlots = [];
    var currentTime = new Date(startTime);
    while (currentTime <= endTime) {
        timeSlots.push(
            currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return timeSlots;
}
function getParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var pairs = queryString.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
}

async function getpsydata(puid) {
    const result = await (
        await fetch(`https://atman.onrender.com/doctor/availabletimes/${puid}`)
    ).json();

    data = result;
}

if (getParams()) {
    getpsydata(getParams()["doc"]);
}

function renderTimeSlots(timeSlots) {
    var timeSlotsContainer = document.querySelector(".time-slots");
    timeSlotsContainer.innerHTML = ""; // Clear the content of the time slots container

    var selectedSlot = document.createElement("span");
    selectedSlot.classList.add("time-slot-selected");
    var bookButton = document.createElement("button");
    bookButton.classList.add("btn");
    bookButton.textContent = "Book";

    var timeslot; // Declare timeslot variable outside the event listener functions

    var row;
    timeSlots.forEach(function(timeSlot, index) {
        if (index % 3 === 0) {
            row = document.createElement("div");
            row.classList.add("row");
            timeSlotsContainer.appendChild(row);
        }

        var slotItem = document.createElement("a");
        slotItem.classList.add("time-slot", "col-sm-2", "mb-3", "bg-color", "w-25", "text-light");
        slotItem.textContent = timeSlot;

        slotItem.addEventListener("click", function(event) {
            event.preventDefault();
      showToast("You selected time slot: " + timeSlot)
            timeslot = timeSlot; // Update the value of timeslot when a time slot is clicked

            selectedSlot.textContent = timeSlot;
        });

        row.appendChild(slotItem);
    });

    // Add event listener to the book button outside the forEach loop
    bookButton.addEventListener('click', async function() {
        console.log("Book clicked");
        if (!timeslot) {
            showToast("Please select a time slot.")
            return;
        }

        try {
            const response = await axios.post('https://atman.onrender.com/bookAppointment', { uid, date, timeSlot: timeslot, puid: getParams()['doc'] });
            console.log(response);


            if(response.data){
                showToast(response.data.message)
            }
            
          
        } catch (e) {
            console.error("Error booking appointment:", e);
            alert("An error occurred while booking the appointment. Please try again later.");
        }
    });

    // Append selected slot and book button to the time slots container
    timeSlotsContainer.appendChild(selectedSlot);
    timeSlotsContainer.appendChild(bookButton);
}


document.getElementById("date").addEventListener("change", () => {
    // Get the selected date from the input field
    const selectedDate = document.getElementById("date").value;
date = selectedDate;
    // Filter available times based on the selected date
    const selectedTimes = data.availableTimes.filter(item => item.date === selectedDate);

    // Assuming selectedTimes contains at least one element
    if (selectedTimes.length > 0) {
        const { from: fromTime, to: toTime } = selectedTimes[0];
        const [fromTimeHours, fromTimeMins] = fromTime.split(":");
        const [toTimeHours, toTimeMins] = toTime.split(":");
        
        var startTime = new Date(selectedDate);
        startTime.setHours(parseInt(fromTimeHours), parseInt(fromTimeMins), 0); // Set start time based on the available from time
        var endTime = new Date(selectedDate);
        endTime.setHours(parseInt(toTimeHours), parseInt(toTimeMins), 0); // Set end time based on the available to time
        var interval = 30;

        var timeSlots = generateTimeSlots(startTime, endTime, interval);
        renderTimeSlots(timeSlots);
        document.getElementById("nomessage").innerHTML ="";

    } else {
        console.log("No available times for selected date");
        document.getElementById("nomessage").innerHTML ="No available times for selected date";
    }
});




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