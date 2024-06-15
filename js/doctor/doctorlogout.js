document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.createElement('span');
    countdownElement.id = 'countdownTimer';
    document.querySelector('.logout-meta').appendChild(countdownElement);

    let countdown = 5; // Countdown time in seconds

    const countdownInterval = setInterval(function () {
        countdown--;
        document.getElementById('countdownTimer').textContent = countdown + ' secs logging out';
        document.getElementById('countdownTimer').style.fontSize = '50px';

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            logout();
        }
    }, 1000);

    async function logout() {
        try {
            const body = {
                puid: localStorage.puid
            };

            const response = await axios.post('https://atman.onrender.com/psychologistLogout', body);

            // Handle logout success response
            if(response.data?.message ==="Logout successful")
            {
                console.log('Logout successful');
                localStorage.clear();
                sessionStorage.clear();

                window.location.href = 'landing.html';
            }
           
        } catch (error) {
            // Handle logout error
            console.error('Logout failed');
            console.error(error); // Optionally, you can handle the error response here
            localStorage.clear();
            sessionStorage.clear();
                window.location.href = 'landing.html';
        }
    }
    
});
