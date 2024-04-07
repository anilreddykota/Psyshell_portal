document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('message-list').innerHTML = "";

    var approvedAppointments = [];
    var selectedAppointments = [];

    async function getAppointments() {
        const puid = localStorage.puid;
        try {
            const response = await axios.post('https://atman.onrender.com/getAppointmentsByDoctor', { puid });
            const appointments = response.data;
            console.log(appointments);
            approvedAppointments = [...appointments.approvedAppointments];
            displayAppointments([...appointments.approvedAppointments,...appointments.pendingAppointments]);
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
                console.log(appointment);
                const appointmentHTML = `
                <li class="unread">
                <input class="select-message" type="checkbox" name="userselect" data-uid="${appointment.uid}"/>
                <div class="d-flex">
                    <div class="w-25">
                        <img src="${appointment.userDetails.profile|| "./images/resources/defaultpic.jpg"}" alt="" class="pt-3">
                    </div>
                    <div class="newpst-input  groups">
                        <h1 class="appointment-title"> ${appointment.userDetails.nickname?.toUpperCase()}</h1>
                        <h5>Gender: ${appointment.userDetails.gender}</h5>
                        <h5>Age: ${appointment.userDetails.age}</h5>
                        <h5>Occupation: ${appointment.userDetails.occupation}</h5>
                        <span class="slot">Time Slot: ${appointment.date} /  ${appointment.timeSlot}</span><br>
                        <br>
                        <a href="" class="appointment-title">View more</a>
                    </div>
                </div>
                </li>
                `;
                appointmentsDiv.innerHTML += appointmentHTML;
            });
        }
    }

    const user = document.getElementById('search-user');
    user.addEventListener('change', function() {
        filterUsers(user.value);
    });

    // Add event listener to checkboxes
    const checkboxes = document.querySelectorAll('.select-message');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(event) {
            const uid = event.target.getAttribute('data-uid');
            if (event.target.checked) {
                selectedAppointments.push(uid);
            } else {
                const index = selectedAppointments.indexOf(uid);
                if (index !== -1) {
                    selectedAppointments.splice(index, 1);
                }
            }
            console.log(selectedAppointments);
        });
    });

    // Add event listener to "Select all" checkbox
    const selectAllCheckbox = document.getElementById('select_all');
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.select-message');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            const uid = checkbox.getAttribute('data-uid');
            if (selectAllCheckbox.checked && !selectedAppointments.includes(uid)) {
                selectedAppointments.push(uid);
            } else if (!selectAllCheckbox.checked && selectedAppointments.includes(uid)) {
                const index = selectedAppointments.indexOf(uid);
                selectedAppointments.splice(index, 1);
            }
        });
        console.log(selectedAppointments);
    });
    const sendReminderButton = document.getElementById('send-reminder');
    sendReminderButton.addEventListener('click', async function() {
        const message = document.getElementById('message-reminder').value.trim();
        const puid = localStorage.puid;
        const uids = selectedAppointments; 

        if (!message) {
            alert('Please enter a message');
            return;
        }
        if(uids.length ===0){
            alert("select users");
            return;
        }

        try {
            const response = await axios.post('https://atman.onrender.com/api/sendmessages', {
                puid: puid,
                uids: uids,
                message: message
            });
            if(response.data){
                alert(response.data.message);
            }
            // Optionally, you can clear the text area after sending the reminder
            document.getElementById('message-reminder').value = '';
        } catch (error) {
            console.error('Error sending reminder:', error);
            alert('Error sending reminder. Please try again later.');
        }
    });





    getAppointments();
});
