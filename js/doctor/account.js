document.addEventListener("DOMContentLoaded", function () {
  // Set UID from localStorage
  var uid = localStorage.getItem("puid");
  document.getElementById(
    "portfoliolink"
  ).innerHTML = `<a href='./portfolio.html?p=${localStorage.nickname}' target='_blank' class="link"></a>`;

  if (uid) {
    document.getElementById(
      "profileImage"
    ).src = `https://firebasestorage.googleapis.com/v0/b/psycove-4ebf5.appspot.com/o/profilepics%2F${uid}?alt=media`;
    document.getElementById("addImageText").style.display = "none";
  }
});

document
  .getElementById("imageUploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var formData = new FormData(this);

    // Set UID in form data
    var uid = localStorage.getItem("puid");
    formData.set("uid", uid);

    axios
      .post("https://atman.onrender.com/updatedoctorprofile", formData)
      .then((response) => {
        alert("Image uploaded successfully:", response.data);
        // Update profile image in localStorage
        document.getElementById(
          "profileImage"
        ).src = `https://firebasestorage.googleapis.com/v0/b/psycove-4ebf5.appspot.com/o/profilepics%2F${uid}?alt=media`;
        document.getElementById("addImageText").style.display = "none";
      })
      .catch((error) => {
        alert("Error uploading image:", error);
        // Optionally, display an error message or perform other actions
      });
  });

document.getElementById("imageInput").addEventListener("change", function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var imagePreview = document.getElementById("profileImage");
      imagePreview.src = event.target.result;
      document.getElementById("addImageText").style.display = "none";
    };
    reader.readAsDataURL(file);
    document.getElementById("upload-btn").style.display = "block";
  }
});

// Function to remove profile image
function removeProfileImage() {
  // Get UID from localStorage
  var uid = localStorage.getItem("puid");

  // Send POST request to removeprofileimage endpoint
  axios
    .post("https://atman.onrender.com/removedoctorprofileimage", { uid: uid })
    .then((response) => {
      alert("Profile image removed successfully:", response.data);
      // Update profile image in localStorage to default
      localStorage.removeItem("profileImage");
      // Display default profile image
      document.getElementById("profileImage").src =
        "./images/resources/defaultpic.jpg";
      // Hide remove button
      document.getElementById("removeImageButton").style.display = "none";
    })
    .catch((error) => {
      console.error("Error removing profile image:", error);
      // Optionally, display an error message or perform other actions
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const userDetails =
    JSON.parse(localStorage.getItem("doctorDetails"))?.details ||
    JSON.parse(localStorage.getItem("doctorDetails"))?.userData?.details;

  if (userDetails) {
    document.getElementById("name").value = userDetails.name || "";
    document.getElementById("gender").value = userDetails.gender || "";
    document.getElementById("age").value = userDetails.age || "";
    document.getElementById("phonenumber").value =
      userDetails.phonenumber || "";
    document.getElementById("area_of_expertise").value =
      userDetails.area_of_expertise || "";
    document.getElementById("language").value =
      userDetails.language.join(", ") || "";
  }
});

document
  .getElementById("userDetailsForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const userDetails = {};
    formData.forEach((value, key) => {
      userDetails[key] = value;
    });
    userDetails["language"] = userDetails["language"]
      .split(",")
      .map((lang) => lang.trim());
    userDetails["uid"] = localStorage.puid;

    try {
      const response = await axios.post(
        "https://atman.onrender.com/doctordetails",
        userDetails
      );

      if (response.data.message === "User details saved successfully") {
        localStorage.setItem("doctorDetails", JSON.stringify(response.data));
        alert("your details saved successfully");
      }

      // Optionally, you can handle success response here (e.g., show a success message to the user)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  });

document
  .getElementById("portfolioForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get form data
    const formData = new FormData(this);

    // Convert FormData to JSON object
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data["puid"] = localStorage.puid;
    data["services"] = data["services"].split(",").map((serv) => serv.trim());

    // Send data to backend using Axios
    axios
      .post("https://atman.onrender.com/doctor/portfolioupdate", data)
      .then((response) => {
        console.log(response.data);
        alert("Portfolio created or updated successfully!");
        document.getElementById(
          "portfoliolink"
        ).innerHTML = `<a href='/portfolio.html?p=${localStorage.nickname}' target='_blank'></a>`;
      })
      .catch((error) => {
        console.error("Error creating portfolio:", error);
        // Handle error response
        alert("An error occurred while creating portfolio.");
      });
  });

function validateForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const designation = document.getElementById("designation").value.trim();
  // Add more fields for validation as needed

  if (fullName === "" || designation === "") {
    alert("Please fill out all required fields.");
    return false;
  }

  // Additional validation logic can be added here

  return true;
}

const form = document.getElementById("addtime");

// Add event listener for form submission
// Add event listener for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get current date and time
  const now = new Date();

  // Get form data
  const date = document.getElementById("date").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  if (!date || !from || !to) {
    alert("Please enter a valid date");
    return false;
  }

  const selectedDate = new Date(date);
  const selectedFromTime = new Date(`${date}T${from}`);
  const selectedToTime = new Date(`${date}T${to}`);

  // Validate selected date
  if (selectedDate <= now) {
    alert("Please choose a date that is not in the past.");
    return;
  }

  if (selectedFromTime < now.getTime() || selectedToTime < now.getTime()) {
    alert("Please choose a time that is not in the past.");
    return;
  }

  // Ensure 'to' time is after 'from' time
  if (selectedToTime <= selectedFromTime) {
    alert("The end time should be after the start time.");
    return;
  }

  // Ensure 'from' time is at least 30 minutes before 'to' time
  const timeDifference = (selectedToTime - selectedFromTime) / (1000 * 60);
  if (timeDifference < 30) {
    alert("The time slot should be at least 30 minutes.");
    return;
  }

  // Get puid from localStorage
  const puid = localStorage.getItem("puid");

  try {
    const response = await axios.post(
      "https://atman.onrender.com/doctor/settime",
      { puid, from, to, date }
    );

    // Check if request was successful
    if (response.status === 200) {
      // Show confirmation alert
      alert("Time has been set successfully!");
    } else {
      // Show error alert
      alert("Failed to set time. Please try again later.");
    }
  } catch (error) {
    console.error("Error setting available time:", error);
    // Show error alert
    alert("An error occurred. Please try again later.");
  }
});

document.getElementById("copy-link").addEventListener("click", async () => {
  const linkToCopy = `https://psyshell.help/portfolio.html?p=${localStorage.nickname}`;

  try {
    const data = {
      url: linkToCopy,
      text: " this is my portfolio on psyshell portal",
      title: "my portfolio",
    };

    await navigator.share(data);
  } catch (error) {
    // Handle any errors that may occur during copying
    console.error("Error copying link to clipboard:", error);
    // Show error notification or perform appropriate error handling
    alert("Failed to copy link to clipboard.");
  }
});
