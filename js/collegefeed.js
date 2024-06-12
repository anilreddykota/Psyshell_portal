document.addEventListener("DOMContentLoaded", function () {
    const createPostForm = document.getElementById("createPostForm");
    const imagePreview = document.getElementById("imagePreview");
    var imageref = document.getElementById("image");
  
    imageref?.addEventListener("change", (event) => {
      imagePreview.src = URL.createObjectURL(event.target.files[0]);
      imagePreview.style.display = "block";
      imagePreview.onload = function () {
        URL.revokeObjectURL(imagePreview.src);
      };
    });
    createPostForm?.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      // Validate form fields
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const image1 = document.getElementById("image")?.files[0];
  
      const uid = localStorage.Collegecode;
      if (!title || !description || !image1) {
        alert("Please fill in all fields");
        return;
      }
  
      // Set UID value
  
      document.getElementById("uid").value = uid;
  
      // Create FormData object
      const formData = new FormData(this);
  
      try {
        const response = await fetch("https://atman.onrender.com/create-post", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          alert(data.message);
        } else {
          console.error("Failed to create post:", response.statusText);
          // Handle error appropriately
        }
      } catch (error) {
        console.error("Error creating post:", error);
        // Handle error appropriately
      }
    });
  });