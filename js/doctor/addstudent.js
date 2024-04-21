document.getElementById("openPopup").addEventListener("click", function() {
    document.getElementById("overlay-add-student").style.display = "block";
});

function closePopup() {
    document.getElementById("overlay-add-student").style.display = "none";
}


document.getElementById("closePopup").addEventListener("click", closePopup);
document.getElementById('addButton').addEventListener("click", async () => {
    const nickname = document.getElementById('nickname').value;
     if(nickname == ""){
        showToast("please enter a college code ","red");
        return;
     }
    try {
        const response = await axios.post('http://localhost:3002/addAppointmentToDoctorList', {
            nickname: nickname,
            puid : localStorage.puid
        });

        if(response.data.message === "Appointment added to the doctor list successfully")
        {
            showToast(response.data.message)
            closePopup();
        }else{
            showToast(response.data.message)
            closePopup();

        }
        
    } catch (error) {
        // Handle errors if needed
        console.error('Error occurred while sending request:', error);
    }
});


function showToast(message,color) {
    const messageToast = document.getElementById('messageToast');
    messageToast.innerText = message;
    messageToast.style.backgroundColor = color;
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