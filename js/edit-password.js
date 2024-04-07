async function updatePassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const currentPassword = document.getElementById("currentPassword").value;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        alert("Password must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character: !@#$%^&*");
        return;
    }

    // Construct request body
    const requestBody = {
        uid: localStorage.uid,
        currentPassword: currentPassword,
        newPassword: newPassword
    };

    try {
        // Send POST request using Axios with async/await
        const response = await axios.post('http://localhost:3001/change-password', requestBody);

        // Check if response status is ok
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        // Handle success response
        console.log(response.data);

        if(response.data){
            alert(response.data.message);
            window.location.href = '/';
        }
       
    } catch (error) {
        // Handle error
        console.error('There was a problem with the request:', error);
        alert("An error occurred while updating the password. Please try again later.");
    }
}
