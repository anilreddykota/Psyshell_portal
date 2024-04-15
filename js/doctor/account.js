document.addEventListener("DOMContentLoaded", function () {
    // Set UID from localStorage
    var uid = localStorage.getItem("puid");
  
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
        .post("http://localhost:3002/updatedoctorprofile", formData)
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
      var uid = localStorage.getItem('puid');
  
      // Send POST request to removeprofileimage endpoint
      axios.post('http://localhost:3002/removedoctorprofileimage', { uid: uid })
          .then(response => {
              alert('Profile image removed successfully:', response.data);
              // Update profile image in localStorage to default
              localStorage.removeItem('profileImage');
              // Display default profile image
              document.getElementById('profileImage').src = './images/resources/defaultpic.jpg';
              // Hide remove button
              document.getElementById('removeImageButton').style.display = 'none';
          })
          .catch(error => {
              console.error('Error removing profile image:', error);
              // Optionally, display an error message or perform other actions
          });
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const userDetails = JSON.parse(localStorage.getItem('doctorDetails'))?.details;
  
    if (userDetails) {
        document.getElementById('name').value = userDetails.name || '';
        document.getElementById('gender').value = userDetails.gender || '';
        document.getElementById('age').value = userDetails.age || '';
        document.getElementById('phonenumber').value = userDetails.phonenumber || '';
        document.getElementById('area_of_expertise').value = userDetails.area_of_expertise || '';
        document.getElementById('language').value = userDetails.language.join(', ') || '';
      
    }
  });
  
  document.getElementById('userDetailsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const userDetails = {};
    formData.forEach((value, key) => {
        userDetails[key] = value;
    });
    userDetails['language'] = userDetails['language'].split(',').map(lang => lang.trim());
    userDetails['uid'] = localStorage.puid;
  
    try {
        const response = await axios.post('http://localhost:3002/doctordetails', userDetails);
  
        if (response.data.message === 'User details saved successfully') {
            localStorage.setItem('doctorDetails', JSON.stringify(response.data));
            alert('your details saved successfully');
        }
  
        // Optionally, you can handle success response here (e.g., show a success message to the user)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  });
  
  document.getElementById('portfolioForm').addEventListener('submit', async function(event) {
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
    data['services'] = data['services'].split(',').map(serv => serv.trim());

    // Send data to backend using Axios
    axios.post('http://localhost:3002/doctor/portfolioupdate', data)
      .then(response => {
        console.log(response.data);
        
        alert('Portfolio created or updated successfully!');
       
      })
      .catch(error => {
        console.error('Error creating portfolio:', error);
        // Handle error response
        alert('An error occurred while creating portfolio.');
      });
  });
  
  function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const designation = document.getElementById('designation').value.trim();
    // Add more fields for validation as needed
    
    if (fullName === '' || designation === '') {
      alert('Please fill out all required fields.');
      return false;
    }
    
    // Additional validation logic can be added here
    
    return true;
  }