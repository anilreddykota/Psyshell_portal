document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('appointments').innerHTML = "<div class='text-center card text-danger'> no appointments found</div>";

    async function getAppointments() {
        const puid = localStorage.puid;
        try {
            const response = await axios.post('http://localhost:3001/getAppointmentsByDoctor', { puid });
            const appointments = response.data;
            console.log(appointments);

            if(appointments){
                displayAppointments([...appointments.approvedAppointments,...appointments.pendingAppointments] );

            }else{
                document.getElementById('appointments').textContent = 'No appointments found for this doctor.';

            }
         
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    function displayAppointments(appointments) {
        console.log(appointments);
        const appointmentsDiv = document.getElementById('appointments');
        document.getElementById('appointments').innerHTML = "";

        if (appointments.length === 0) {
            appointmentsDiv.textContent = 'No appointments found for this doctor.';
        } else {
            
            appointments.map(appointment => {
                console.log(appointment);
                const appointmentHTML = `
                    <div class="central-meta p-0 appointment-card">
                        <div class="new-postbox">
                            <div class="w-25 mt-5">
                                <img src="${appointment.userDetails.profile|| "./images/resources/defaultpic.jpg"}" alt="" class="pt-3">
                            </div>
                            <div class="newpst-input p-5 groups">
                                <h1 class="appointment-title"> ${appointment.userDetails.name?.toUpperCase()}</h1>
                                <h5>Gender: ${appointment.userDetails.gender}</h5>
                                <h5>Age: ${appointment.userDetails.age}</h5>
                                <h5>Occupation: ${appointment.userDetails.occupation}</h5>
                                <span class="slot">Time Slot: ${appointment.date} /  ${appointment.timeSlot}</span><br>
                                <br>
                                <a href="inbox.html" class="appointment-title">View more</a>
                            </div>
                        </div>
                    </div>
                `;
                appointmentsDiv.innerHTML += appointmentHTML;
            });
        }
    }

    getAppointments();
});
