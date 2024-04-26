const loadingdiv = document.getElementById("loading-div");


document.addEventListener("DOMContentLoaded", function () {
  
  const showpass = document.getElementsByClassName("showpass");

  // Convert HTMLCollection to an array
  const showpassArray = Array.from(showpass);

showpassArray.forEach((pass) => {
    pass.addEventListener("change", function() {
        const passwordField = document.querySelector(pass.getAttribute("data-target"));
        if (pass.checked) {
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    });
});














  const loginForm = document.getElementById("loginFormu");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    loadingdiv.classList.add("spinner-loading");
    const username = document.getElementById("username").value?.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Create an object with the login data
    const loginData = {
      email: username,
      password: password,
    };
    try {
      // Post the login data to the server using Axios
      const response = await axios.post(
        "https://atman.onrender.com/UserLogin",
        loginData
      );

      if (response.data.message === "Login successful") {
        localStorage.clear();
        localStorage.setItem("uid", response.data.userData.uid);
        localStorage.setItem("nickname", response.data.userData?.nickname);
        localStorage.setItem("token", response.data.userData.token);
        localStorage.setItem('userDetails', JSON.stringify(response.data));
        alert(response.data.message);

        window.location.href = "index.html";
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      // Handle error
      console.error("Login failed", error);
    } finally {
      loadingdiv.classList.remove("spinner-loading");
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registeru");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    loadingdiv.classList.add("spinner-loading");

    const nickname = document.querySelector('input[name="unickname"]').value;
    const email = document.querySelector('input[name="uemail"]').value;
    const password = document.querySelector('input[name="upassword"]').value;
    const age = document.querySelector('input[name="uage"]').value;
    const college = document.querySelector('select[name="collegecode"]').value;
    const formData = new FormData(this); // Get form data

    // Create an object from form data

    // Check if all required fields are filled
    if (!nickname || !email || !password || !age) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create an object with the registration data
    const registrationData = {
      nickname: nickname,
      email: email,
      password: password,
      age: age,
      college: college,
    };
    try {
      // Post the registration data to the server using Axios
      const response = await axios.post(
        "https://atman.onrender.com/registerUseronweb",
        registrationData
      );

      // Handle success response

      // Optionally, you can handle the response data here
      if (response.data.message) {
        alert(response.data.message);
        console.log(response.data);
        window.location.reload();
      } else if (response.data.message === "nickname already exist") {
        alert(response.data.message);
      } else if (response.data.status === 400) {
        alert("student registration failed", response.data.message);
      }
    } catch (error) {
      // Handle error
      console.log(error);
    } finally {
      loadingdiv.classList.remove("spinner-loading");
    }
  });
  const register = document.getElementById("registerp");

  register.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    loadingdiv.classList.add("spinner-loading");

    const nickname = document.querySelector('input[name="nname"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const aoe = document.querySelector('input[name="aoe"]').value;

    // Check if all required fields are filled
    if (!nickname || !email || !password || !aoe) {
      alert("Please fill in all required fields.");
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
      const response = await axios.post(
        "https://atman.onrender.com/registerPsychologistonweb",
        registrationData
      );

      // Handle success response

      // Optionally, you can handle the response data here
      if (response.data.message) {
        alert("Psycholigist registration successful", response.data.message);
        window.location.reload();
      } else if (response.data.message === "nickname already exist") {
        alert(response.data.message);
      } else if (response.data.status === 400) {
        alert(" registration failed", response.data.message);
      }
    } catch (error) {
      // Handle error

      console.log(error);
    } finally {
      loadingdiv.classList.remove("spinner-loading");
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginp");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    loadingdiv.classList.add("spinner-loading");

    const username = document
      .getElementById("input")
      .value?.toLowerCase()
      .trim();
    const password = document.querySelector('input[type="password"]').value;
    const rememberMe = document.querySelector('input[type="checkbox"]').checked;

    // Create an object with the login data
    const loginData = {
      email: username,
      password: password,
    };

    try {
      // Post the login data to the server using Axios
      const response = await axios.post(
        "https://atman.onrender.com/psychologistLogin",
        loginData
      );

      // Handle success response
      if (response.data.message === "Login successful") {
        localStorage.clear();
        localStorage.setItem("puid", response.data.userData.uid);
        localStorage.setItem("nickname", response.data.userData?.nickname);
        localStorage.setItem("token", response.data.userData?.token);
        localStorage.setItem('doctorDetails', JSON.stringify(response.data));


        window.location.href = "/index2.html";
      }
      alert(response.data.message); // Optionally, you can handle the response data here
    } catch (error) {
      // Handle error
      console.error("Login failed");
      console.error(error); // Optionally, you can handle the error response here
    } finally {
      loadingdiv.classList.remove("spinner-loading");
    }
  });
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(this); // Get form data

      // Create an object from form data
      const formDataObject = {};
      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });
      try {
        const response = await axios.post(
          "https://atman.onrender.com/collegelogin",
          {
            email: formDataObject["college-email"],
            password: formDataObject["college-password"],
          }
        );

        if (response) {
          // Successful login, handle accordingly (e.g., redirect)
          alert(response.data.message);
        } else {
          // Failed login, display error message
          console.error("Login failed:", response.data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
});

async function fetchAndStoreColleges() {
  try {
    const response = await axios.get("https://atman.onrender.com/listcolleges");
    const colleges = response.data;

    // Store colleges in session storage
    sessionStorage.setItem("colleges", JSON.stringify(colleges));

    return colleges;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Propagate the error for handling
  }
}

function populateCollegeSelect(colleges) {
  const collegeSelect = document.getElementById("collegeSelect");
  collegeSelect.innerHTML = ""; // Clear previous options

  colleges?.list?.forEach((college) => {
    const option = document.createElement("option");
    option.value = college.collegecode;
    option.text = college.collegename;
    collegeSelect.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    let colleges = JSON.parse(sessionStorage.getItem("colleges"));

    if (!colleges) {
      // If colleges data is not available in session storage, fetch and store it
      colleges = await fetchAndStoreColleges();
    }

    populateCollegeSelect(colleges);
  } catch (error) {
    console.error("Error:", error);
  }
});
