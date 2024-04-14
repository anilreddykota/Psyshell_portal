document.addEventListener("DOMContentLoaded", function () {
  // Set UID from localStorage
  var uid = localStorage.getItem("uid");

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
    var uid = localStorage.getItem("uid");
    formData.set("uid", uid);

  
    axios
      .post("  https://atman.onrender.com/updateuserprofile", formData)
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
    var uid = localStorage.getItem('uid');

    // Send POST request to removeprofileimage endpoint
    axios.post('  https://atman.onrender.com/removeprofileimage', { uid: uid })
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
