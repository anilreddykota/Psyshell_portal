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

    function logout() {
        window.location.href = 'landing.html';
        localStorage.clear();
        axios.post('https://atman.onrender.com/logout', null, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}` // Replace with your actual token
            }
        })
        .then(function (response) {
            // Handle logout success response
            document.getElementById('logoutHeading').textContent = 'Logged out successfully';
            console.log('Logout successful');
           
        })
        .catch(function (error) {
            // Handle logout error
            console.error('Logout failed');
            console.error(error); // Optionally, you can handle the error response here
        });
    }
});
