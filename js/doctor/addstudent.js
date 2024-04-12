document.getElementById("openPopup").addEventListener("click", function() {
    document.getElementById("overlay-add-student").style.display = "block";
});

function closePopup() {
    document.getElementById("overlay-add-student").style.display = "none";
}


document.getElementById("closePopup").addEventListener("click", closePopup);
document.getElementById('addButton').addEventListener("click", async () => {
    const nickname = document.getElementById('nickname').value;

    try {
        const response = await axios.post('https://atman.onrender.com/addAppointmentToDoctorList', {
            nickname: nickname,
            puid : localStorage.puid
        });

        if(response.data.message === "Appointment added to the doctor list successfully")
        {
            alert(response.data.message)
            closePopup();
        }else{
            alert(response.data.message)  
        }
        
    } catch (error) {
        // Handle errors if needed
        console.error('Error occurred while sending request:', error);
    }
});
 