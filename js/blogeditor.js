document.addEventListener("DOMContentLoaded", (event) => {
    if (localStorage.getItem("content")) {
      document.getElementById("editor").innerHTML =
        localStorage.getItem("content");
    }
    document.getElementById("autoSaveToggle").checked =
      localStorage.getItem("autoSave") === "true";
  
    document
      .getElementById("autoSaveToggle")
      .addEventListener("change", function () {
        localStorage.setItem("autoSave", this.checked);
        if (this.checked) {
          startAutoSave();
        } else {
          stopAutoSave();
        }
      });
  
    if (localStorage.getItem("autoSave") === "true") {
      startAutoSave();
    }
  });
  
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          execCmd("bold");
          break;
        case "i":
          e.preventDefault();
          execCmd("italic");
          break;
        case "u":
          e.preventDefault();
          if (e.shiftKey) {
            e.preventDefault();
            toggleCase("upper");
            break;
          }
          execCmd("underline");
          break;
        case "x":
          if (e.shiftKey) {
            e.preventDefault();
            execCmd("strikeThrough");
          }
          break;
        case "l":
          e.preventDefault();
          if (e.shiftKey) {
            e.preventDefault();
            toggleCase("lower");
            break;
          }
          execCmd("justifyLeft");
          break;
        case "e":
          e.preventDefault();
          execCmd("justifyCenter");
          break;
        case "r":
          e.preventDefault();
          execCmd("justifyRight");
          break;
        case "7":
          if (e.shiftKey) {
            e.preventDefault();
            execCmd("insertOrderedList");
          }
          break;
        case "8":
          if (e.shiftKey) {
            e.preventDefault();
            execCmd("insertUnorderedList");
          }
          break;
        case "1":
          e.preventDefault();
          execCmdWithArg("formatBlock", "H1");
          break;
        case "2":
          e.preventDefault();
          execCmdWithArg("formatBlock", "H2");
          break;
        case "3":
          e.preventDefault();
          execCmdWithArg("formatBlock", "H3");
          break;
        case "f":
          if (e.shiftKey) {
            e.preventDefault();
            execCmdWithArg("fontSize", "3");
          }
          break;
        case "c":
          if (e.shiftKey) {
            e.preventDefault();
            document.querySelector('input[title="Text Color"]').click();
          }
          break;
        case "b":
          if (e.shiftKey) {
            e.preventDefault();
            document.querySelector('input[title="Background Color"]').click();
          }
          break;
        case "i":
          if (e.shiftKey) {
            e.preventDefault();
            document.getElementById("imageInput").click();
          }
          break;
        case "k":
          e.preventDefault();
          insertLink();
          break;
        case "/":
          e.preventDefault();
          execCmd("removeFormat");
          break;
        case "z":
          e.preventDefault();
          execCmd("undo");
          break;
        case "y":
          e.preventDefault();
          execCmd("redo");
          break;
      }
    }
  });
  
  let autoSaveInterval;
  
  function execCmd(command) {
    document.execCommand(command, false, null);
  }
  
  function execCmdWithArg(command, arg) {
    document.execCommand(command, false, arg);
  }
  
  function toggleCase(caseType) {
    let text = window.getSelection().toString();
    let replacement =
      caseType === "upper" ? text.toUpperCase() : text.toLowerCase();
    document.execCommand("insertText", false, replacement);
  }
  
  function insertLink() {
    let url = prompt("Enter the URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  }
  
  function insertImage() {
    let file = document.getElementById("imageInput").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      document.execCommand("insertImage", false, e.target.result);
    };
    reader.readAsDataURL(file);
  }
  
  function previewContent() {
    let content = document.getElementById("editor").innerHTML;
  
    const title = document.getElementById("blogTitle").value;
  
    const bannerSrc = document.getElementById("blogbanner-preview").src;
  
    if (!title || !bannerSrc) {
      alert("title and banner required");
      return;
    }
    document.getElementById("preview-title").textContent = title;
    if (bannerSrc) {
      const previewBanner = document.getElementById("preview-banner");
      previewBanner.src = bannerSrc;
      previewBanner.hidden = false;
    }
    document.querySelector("div.preview-container").style.display = "block";
    document.getElementById("preview-content").innerHTML = content;
  }
  
  function toggleShortcutHelp() {
    document.getElementById("shortcut-help").classList.toggle("hidden");
  }
  
  function startAutoSave() {
    autoSaveInterval = setInterval(() => {
      let content = document.getElementById("editor").innerHTML;
      localStorage.setItem("content", content);
    }, 5000); // Save every 5 seconds
  }
  
  function stopAutoSave() {
    clearInterval(autoSaveInterval);
  }
  
  function initializeEditor() {
    var editor = document.getElementById("editor");
    editor.style.textAlign = "left"; // Set default text alignment to left
    editor.focus();
  
    // Place cursor at the beginning of the editor content
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(editor, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  window.addEventListener("load", initializeEditor);
  
  var uid = localStorage.getItem("uid");
  var puid = localStorage.getItem("puid");
  
  function getUserData() {
    const closeDialogButton = document.getElementById("closeDialog");
  
    closeDialogButton.addEventListener("click", () => {
      dialog.style.display = "none";
    });
  
    // Close the dialog when clicking outside the form
    window.addEventListener("click", (event) => {
      if (event.target == dialog) {
        dialog.style.display = "none";
      }
    });
  
    var userDetails;
    // Handle form submission

    document
      .getElementById("userDetailsForm")
      .addEventListener("submit", async (e) => {
       const submit =  document.querySelector("button[type=submit]")
       submit.value = "posting";
       submit.disabled =true;

        e.preventDefault();
  
        const email = document.getElementById("email").value;
        const nickname = document.getElementById("authorName").value;
        const linkedin = document.getElementById("linkedin").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
  
        if (!email || !authorName || !linkedin || !phoneNumber) {
          alert("plese enter you details");
          return false;
        }
  
        userDetails = {
          email,
          nickname,
          linkedin,
          phoneNumber,
        };
  
        if (!userDetails) {
          closeDialogButton.click();
          return false;
        }
  
        postBlog(userDetails);
        submit.value = "done";
        submit.disabled =false;
      });
  }
  
  function postingBlog() {
    if (!uid && !puid) {
      document.getElementById("userDetailsDialog").style.display = "block";
      getUserData();
    } else {
      postBlog();
    }
  }
  
  async function postBlog(userDetails) {
    let content = document.getElementById("editor").innerHTML;
    let editor = document.getElementById("editor");
    let images = editor.querySelectorAll("img");
    const blogTitle = document.getElementById("blogTitle").value;
    const blogBanner = document.getElementById("blogbanner").files[0];
  
    let bannerUrl = "";
    if (blogBanner) {
      const base64Banner = await getBase64FromFile(blogBanner);
      bannerUrl = await uploadImageToStorage(base64Banner);
    }
    // Array to store promises of image URLs
    let imageUrls = [];
  
    // Iterate over each image and convert to Base64
    for (const image of images) {
      const imageUrl = await uploadImageToStorage(image.src);
      imageUrls.push(imageUrl);
  
      // Replace base64 string with image URL in the content
      content = content.replace(image.src, imageUrl);
    }
  
    // Send blog post data to server
    try {
      const postResponse = await fetch("https://atman.onrender.com/create-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          puid: puid,
          title: blogTitle,
          bannerUrl: bannerUrl,
          content: content,
          imageUrls: imageUrls,
          userDetails: userDetails,
        }),
      });
      const postData = await postResponse.json();
      if (postData.message === "Blog post created successfully") {
        localStorage.removeItem("autosave");
        localStorage.removeItem("content");
        localStorage.clear();
        alert("your post sent to admin approval");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error posting blog:", error);
    }
  }
  
  // Function to upload image to Firebase Storage
  async function uploadImageToStorage(base64Image) {
    const response = await fetch("https://atman.onrender.com/uploadblog-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });
    const data = await response.json();
    return data.imageUrl;
  }
  
  document
    .getElementById("postblog")
    .addEventListener("click", () => postingBlog());
  
  function getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  
  document.getElementById("blogbanner").addEventListener("input", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("blogbanner-preview");
        preview.src = e.target.result;
        preview.hidden = false;
  
        document.getElementById("banner-image").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
  
  function removeBanner() {
    const preview = document.getElementById("blogbanner-preview");
    preview.src = "";
    preview.hidden = true;
  
    document.getElementById("banner-image").style.display = "block";
    document.getElementById("blogbanner").value = "";
  }
  
  function editBanner() {
    document.getElementById("blogbanner").click();
  }
  
  
  function resetEditor() {
  
    var result = confirm("Are you sure you want to reset the editor");
  if(!result){
    return;
  }
  
  
  
    let editor = document.getElementById('editor');
    editor.innerHTML = '';
  
    // Reset toolbar settings
    // Example: reset font size, text color, and background color inputs
    document.querySelector('select[title="Font Size"]').selectedIndex = 1; // Reset to default size
    document.querySelector('input[title="Text Color"]').value = '#000000'; // Reset to black
    document.querySelector('input[title="Background Color"]').value = '#FFFFFF'; // Reset to white
  
    // If you have other toolbar settings, reset them accordingly
    // For example, deselect any active formatting buttons
    let toolbarButtons = document.querySelectorAll('.btn-toolbar .btn');
    toolbarButtons.forEach(button => button.classList.remove('active'));
  
    // Clear any stored settings in local storage
    localStorage.removeItem('content');
    localStorage.removeItem('autoSave'); // Assuming you store settings under this key
  
    // Reset any other custom settings or state
    // For example, reset the preview area if you have one
    let previewArea = document.getElementById('preview');
    if (previewArea) {
        previewArea.innerHTML = '';
    }
  
    // Reset image banner preview if you have one
    let bannerPreview = document.getElementById('blogbanner-preview');
    if (bannerPreview) {
        bannerPreview.src = '';
        bannerPreview.hidden = true;
    }
  
    // Optionally, reset the form fields
    let blogTitle = document.getElementById('blogTitle');
    if (blogTitle) {
        blogTitle.value = '';
    }
  
    let blogBanner = document.getElementById('blogbanner');
    if (blogBanner) {
        blogBanner.value = '';
    }
  
    // Remove any applied formatting from the editor content
    document.execCommand('removeFormat', false, null);
  }
  
  