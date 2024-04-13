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
        console.log('called logout');
        try {
            const body = {
                puid: localStorage.puid
            };
            console.log('called logout');

            const response = await axios.post('https://atman.onrender.com/psychologistLogout', body);
            console.log('called logout');

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
