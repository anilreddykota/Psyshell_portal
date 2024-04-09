const loadingdiv = document.getElementById('loading-div');
document.addEventListener('DOMContentLoaded', function () {

    localStorage.clear();
    const loginForm = document.getElementById('loginFormu');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        loadingdiv.classList.add('spinner-loading');
        const username = document.getElementById('username').value?.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Create an object with the login data
        const loginData = {
            email: username,
            password: password,

        };
        try {

            // Post the login data to the server using Axios
            const response = await axios.post('http://localhost:3001/UserLogin', loginData);

            if (response.data.message === 'Login successful') {
                localStorage.clear();
                localStorage.setItem('uid', response.data.userData.uid)
                localStorage.setItem('nickname', response.data.userData?.nickname)
                localStorage.setItem('token', response.data.userData.token)
                alert(response.data.message);


                window.location.href = 'index.html';

            } else {
                alert(response.data.message);
            }

        } catch (error) {
            // Handle error
            console.error('Login failed', error);
        } finally {
            loadingdiv.classList.remove('spinner-loading');

        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registeru');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        loadingdiv.classList.add('spinner-loading');

        const nickname = document.querySelector('input[name="unickname"]').value;
        const email = document.querySelector('input[name="uemail"]').value;
        const password = document.querySelector('input[name="upassword"]').value;
        const age = document.querySelector('input[name="uage"]').value;

        // Check if all required fields are filled
        if (!nickname || !email || !password || !age) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create an object with the registration data
        const registrationData = {
            nickname: nickname,
            email: email,
            password: password,
            age: age,

        };

        try {
            // Post the registration data to the server using Axios
            const response = await axios.post('http://localhost:3001/registerUseronweb', registrationData);

            // Handle success response

            // Optionally, you can handle the response data here
            if (response.data.message) {
                alert('student registration successful', response.data.message);
                window.location.reload();
            } else if (response.data.message === 'nickname already exist') {
                alert(response.data.message)
            }
            else if (response.data.status === 400) {
                alert('student registration failed', response.data.message);
            }




        } catch (error) {
            // Handle error
            console.log(error);
        } finally {
            loadingdiv.classList.remove('spinner-loading');

        }
    });
    const register = document.getElementById('registerp');

    register.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        loadingdiv.classList.add('spinner-loading');

        const nickname = document.querySelector('input[name="nname"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const aoe = document.querySelector('input[name="aoe"]').value;

        // Check if all required fields are filled
        if (!nickname || !email || !password || !aoe) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create an object with the registration data
        const registrationData = {
            nickname: nickname,
            email: email,
            password: password,
            area_of_expertise: aoe,

        };

        try {
            // Post the registration data to the server using Axios
            const response = await axios.post('https://atman.onrender.com/registerPsychologistonweb', registrationData);

            // Handle success response

            // Optionally, you can handle the response data here
            if (response.data.message) {
                alert('Psycholigist registration successful', response.data.message);
                window.location.reload();
            } else if (response.data.message === 'nickname already exist') {
                alert(response.data.message)
            }
            else if (response.data.status === 400) {
                alert(' registration failed', response.data.message);
            }




        } catch (error) {
            // Handle error

            console.log(error);
        } finally {
            loadingdiv.classList.remove('spinner-loading');

        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginp');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        loadingdiv.classList.add('spinner-loading');

        const username = document.getElementById('input').value?.toLowerCase().trim();
        const password = document.querySelector('input[type="password"]').value;
        const rememberMe = document.querySelector('input[type="checkbox"]').checked;

        // Create an object with the login data
        const loginData = {
            email: username,
            password: password,

        };

        try {
            // Post the login data to the server using Axios
            const response = await axios.post('https://atman.onrender.com/psychologistLogin', loginData);

            // Handle success response
            if (response.data.message === 'Login successful') {
                localStorage.clear();
                localStorage.setItem('puid', response.data.userData.uid);
                localStorage.setItem('nickname', response.data.userData?.nickname);
                localStorage.setItem('token', response.data.userData?.token);

                window.location.href = '/index2.html';
            }
            alert(response.data.message);// Optionally, you can handle the response data here
        } catch (error) {
            // Handle error
            console.error('Login failed');
            console.error(error); // Optionally, you can handle the error response here
        } finally {
            loadingdiv.classList.remove('spinner-loading');

        }
    });
});

