// Function to generate time slots
function generateTimeSlots(startTime, endTime, interval) {
    var timeSlots = [];
    var currentTime = new Date(startTime);
    while (currentTime <= endTime) {
        timeSlots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return timeSlots;
}

// Function to render time slots
function renderTimeSlots(timeSlots) {
    var timeSlotsContainer = document.querySelector('.time-slots');
    timeSlotsContainer.innerHTML = ' ';

    var selectedSlot = document.createElement('span');
    selectedSlot.classList.add('time-slot-selected');
    var bookButton = document.createElement('button');
    bookButton.classList.add('btn');
    bookButton.textContent = 'Book';

    var row;
    timeSlots.forEach(function (timeSlot, index) {
        if (index % 3 === 0) {
            row = document.createElement('div');
            row.classList.add('row');
            timeSlotsContainer.appendChild(row);
        }

        var slotItem = document.createElement('a');
        slotItem.classList.add('time-slot', 'col-sm-2', 'mb-3', 'bg-color', 'w-25', 'text-light');
        slotItem.textContent = timeSlot;
        slotItem.addEventListener('click', function (event) {
            event.preventDefault();

            alert('You selected time slot: ' + timeSlot);

            // Update selected time slot
            selectedSlot.textContent = timeSlot;

            // Clear previous button
            var existingButton = timeSlotsContainer.querySelector('button');
            var newButton = timeSlotsContainer.querySelector('span')
            if (existingButton) {
                existingButton.remove();
                newButton.remove();
            }

            // Append selected time slot and button to container
            timeSlotsContainer.appendChild(selectedSlot.cloneNode(true));
            timeSlotsContainer.appendChild(bookButton.cloneNode(true));
        });
        row.appendChild(slotItem);
    });
}
// Example usage:
var startTime = new Date(); // Current time
startTime.setHours(9, 0, 0); // Set start time to 9:00 AM
var endTime = new Date(); // Current time
endTime.setHours(17, 0, 0); // Set end time to 5:00 PM
var interval = 30; // Time interval in minutes (e.g., 30 for 30-minute slots)

var timeSlots = generateTimeSlots(startTime, endTime, interval);
renderTimeSlots(timeSlots);




