document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('message-list').innerHTML = "";

    var approvedAppointments = [];

    async function getAppointments() {
        const puid = localStorage.puid;
        try {
            const response = await axios.post('http://localhost:3001/getAppointmentsByDoctor', { puid });
            const appointments = response.data;
            console.log(appointments);
            approvedAppointments = [...appointments.approvedAppointments];
            displayAppointments([...appointments.approvedAppointments]);
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
                <li class="unread appointment" data-uid="${appointment.uid}">
                <div class="d-flex">
                    <div class="w-25">
                        <img src="${appointment.userDetails.profile || "./images/resources/defaultpic.jpg"}" alt="" class="pt-3">
                    </div>
                    <div class="newpst-input  groups">
                        <h1 class="appointment-title"> ${appointment.userDetails.nickname?.toUpperCase()}</h1>
                        <div>
                        <a href='chatting.html?uid=${appointment.uid}&uname=${appointment.userDetails?.nickname}'> <button class="btn">chat</button></a>

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
        console.log(item);
        item.addEventListener('click', event => {
 

            const selectedUserId = event.currentTarget.dataset.uid;
            const selectedUser = approvedAppointments.find(appointment => appointment.uid === selectedUserId);
            if (selectedUser) {
                document.getElementById('chat-link').setAttribute('href',`chatting.html?uid=${selectedUser.uid}&uname=${selectedUser.userDetails?.nickname}`)
                document.getElementById('user-image').setAttribute('src',selectedUser.userDetails?.profile|| './images/resources/defaultpic.jpg')

                const userDetails = selectedUser.userDetails;
                const userFields = [
                    { label: 'Name', value: userDetails.name },
                    { label: 'Gender', value: userDetails.gender },
                    { label: 'Age', value: userDetails.age },
                    { label: 'Occupation', value: userDetails.occupation },
                    { label: 'Relationship Status', value: userDetails.relationshipStatus },
                    { label: 'Languages Spoken', value: userDetails.languagesSpoken?.join(', ') },
                    { label: 'Contact Details', value: userDetails.contactDetails }
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
