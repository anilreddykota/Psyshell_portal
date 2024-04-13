
document.addEventListener('DOMContentLoaded', function () {


  
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Retrieve form input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Perform basic validation
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        // Prepare data for login request
        const formData = new FormData();
        formData.append('email', username);
        formData.append('password', password);

        try {
            // Send login request to server
            const response = await fetch('https://atman.onrender.com/UserLogin', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Login successful
                const data = await response.json();
                 
                alert(data.message);
                localStorage.setItem('uid',data.uid)
                // Optionally, redirect to another page or display a success message
            } else {
                // Login failed
                const errorData = await response.json();
                console.error('Login failed:', errorData.message);
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            // Handle network or server errors
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
});