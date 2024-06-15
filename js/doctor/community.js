const puid = localStorage.puid;

fetch("https://atman.onrender.com/get-newsfeed")
  .then((response) => response.json())
  .then((data) => {
    // Process the received JSON data
    document.getElementById("posts-container").innerHTML = "";
    if (data.posts && data.posts.length > 0) {
      // Iterate over posts data
      data.posts.forEach((post) => {
        // Generate HTML markup for each post
        const date = new Date(
          post.date._seconds * 1000 +
            Math.round(post.date._nanoseconds / 1000000)
        );
        // Format the date and time

        const formattedDateTime = date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const postHTML = `<div class="central-meta item">
        <div class="user-post">
            <div class="friend-info">
                <figure>
                    <img src="${
                      post?.userDetails?.profile ||
                      "./images/resources/defaultpic.jpg"
                    }" alt="" class='card__avatar profile-round' loading="lazy">
                </figure>
                <div class="friend-name">
                <ins><a  title="">${
                  post.userDetails?.nickname || "unknown user"
                }</a>  
                ${
                  post?.userDetails?.badges
                    ? post?.userDetails?.badges?.map(
                        (badge) =>
                          ` <img src="./images/badges/${badge}.png" class="user-badges" loading="lazy">`
                      )
                    : ""
                }
               </ins>
                    <span>published: ${formattedDateTime}</span>
                </div>


                
                <div class="post-meta post-container">
                    <ins><a title="">${post.title}</a></ins>
                    <img src="${post.imageUrl}" alt="" class='h-50' loading="lazy">
                    <div class="description">
                        <p>${post.description}</p>
                    </div>
                    <div class="menu-container">
        <div class="menu">
            <div class="dot-menu-p">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="menu-content-p">
                <button onclick="deletePost('${post.postId}')">Delete</button>
                <button onclick="savePost()">Save</button>
            </div>
        </div>
    </div>
                    <div class="we-video-info">
                    <ul style="height:30px;">
                    <li>
                        <span class="like" data-toggle="tooltip" title="like">
                            <button class="like-button">
                                <div class="like-wrapper like-btn ${
                                  post?.likedBy?.likes[puid] == true
                                    ? "liked"
                                    : ""
                                }"  key="${post.postId}" isliked="${!!post
          ?.likedBy?.likes[puid]}">
                                    <svg class="heart" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
                                    </svg>
                                    <div class="particles" style="--total-particles: 6">
                                    <div class="particle" style="--i: 1; --color: #7642F0"></div>
                                   <div class="particle" style="--i: 2; --color: #AFD27F"></div>
                                   <div class="particle" style="--i: 3; --color: #DE8F4F"></div>
                                   <div class="particle" style="--i: 4; --color: #D0516B"></div>
                                   <div class="particle" style="--i: 5; --color: #5686F2"></div>
                                  <div class="particle" style="--i: 6; --color: #D53EF3"></div>
                                   </div>
                                 </div>
                             </button>
                            
                        </span>

                    </li>
                    <li>
                    <p><span class="ins like-button" key="${post?.postId}" >${
          post?.likesCount
        }</span></p>
                    </li>
                </ul>
                    </div>
                    
                </div>
            </div>
        </div>
       
        <div class="form-group">
            <card-with-comments class="card-with-comments" role="article">
            ${
              post?.comments?.length > 0
                ? `
                <div class="comments">
                    ${post?.comments
                      ?.map(
                        (comment) => `
                        <div class="comment">
                            <div class="comment__header">
                                <img src="${
                                  comment.commenterDetails.profile ||
                                  "./images/resources/defaultpic.jpg" 
                                }" alt="Comment writer image" class="comment__avatar profile-round" loading="lazy">
                                <p class="comment__user-name">${
                                  comment.commenterDetails.nickname ||
                                  "unknown user"
                                }</p>
                                <p class="comment__time text-success">${formatTimeDifferences(
                                  comment.timestamp
                                )}</p>
                                <p class="comment__chip">${
                                  comment.commenterDetails.role ||
                                  "Psycholigist"
                                }</p>
                            </div>
                            <p class="comment__text">${comment.comment}</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                `
                : ""
            }
                <div class="form">
                <img src="${
                  `https://firebasestorage.googleapis.com/v0/b/psycove-4ebf5.appspot.com/o/profilepics%2F${localStorage.puid}?alt=media` ||
                  "../images/resources/defaultpic.jpg"
                }" alt="Your avatar" class="comment__avatar" loading="lazy">
                <input type="text" class="form__input" placeholder="Share your thoughts on this post" id="commentText_${
                  post.postId
                }">
                <button class="form__button" onclick="addcomment('${
                  post.postId
                }','${localStorage.puid}')"></button>
            </div>
            
            </card-with-comments>
        </div>
        
    </div>`;

        document.getElementById("posts-container").innerHTML += postHTML;
        const likeButtons = document.querySelectorAll(".like-btn");
        if (puid) {
          likeButtons?.forEach((like) => {
            like.addEventListener("click", async (event) => {
              try {
                const uniqueKey = like.getAttribute("key");
                const isLiked = like.getAttribute("isliked");
                const ins = document.querySelector(`.ins[key="${uniqueKey}"]`);
                const puid = localStorage.getItem("puid");
                const queryParams = new URLSearchParams();
                queryParams.append("postid", uniqueKey);
                queryParams.append("uid", puid);
                let url;

                if (isLiked == "true") {
                  url = `https://atman.onrender.com/dislike-post?${queryParams.toString()}`;
                  ins.textContent = Math.max(parseInt(ins.textContent) - 1, 0);

                  like.setAttribute("isliked", "false");
                  showToast("like removed from post");
                } else {
                  url = `https://atman.onrender.com/like-post?${queryParams.toString()}`;
                  ins.textContent = parseInt(ins.textContent) + 1;

                  showToast(" your like added to post");

                  like.setAttribute("isliked", "true");
                }

                const response = await fetch(url, {
                  method: "POST",
                });
                const result = await response.json();
                if (result.message === "Post liked successfully") {
                  like.setAttribute("isliked", "true");
                  // Optionally, update UI to reflect the change in like status
                } else if (result.message === "Post disliked successfully") {
                  like.setAttribute("isliked", "false");
                } else {
                  console.error(
                    "Failed to send like request:",
                    response.statusText
                  );
                  // Optionally, display an error message to the user
                }
              } catch (error) {
                console.error("Error sending like request:", error);
                // Handle network or other errors
              }
            });
          });
        }
      });
    } else {
      console.log("No posts found");
    }
  })
  .catch((error) => {
    console.error("Error fetching posts:", error);
  });

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

    const puid = localStorage.puid;
    if (!title || !description || !image1) {
      alert("Please fill in all fields");
      return;
    }

    // Set puid value

    document.getElementById("uid").value = puid;

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
        window.location.reload();
        // Optionally, redirect to another page or display a success message
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

function formatTimeDifferences(timestamp) {
  const currentTime = new Date();
  const commentTime = new Date(
    timestamp._seconds * 1000 + Math.round(timestamp._nanoseconds / 1000000)
  );

  const differenceInSeconds = Math.floor((currentTime - commentTime) / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays > 7) {
    // If it crosses more than a week, display the date
    const options = { year: "numeric", month: "short", day: "numeric" };
    return commentTime.toLocaleDateString("en-US", options);
  } else if (differenceInDays > 0) {
    // If it's within a week, but more than a day, display days ago
    return differenceInDays === 1
      ? "1 day ago"
      : `${differenceInDays} days ago`;
  } else if (differenceInHours > 0) {
    // If it's within a day, but more than an hour, display hours ago
    return differenceInHours === 1
      ? "1 hr ago"
      : `${differenceInHours} hrs ago`;
  } else {
    // If it's within an hour, display minutes ago
    return differenceInMinutes <= 1
      ? "just now"
      : `${differenceInMinutes} mins ago`;
  }
}

async function addcomment(postid, puid) {
  const commentTextElement = document.getElementById(`commentText_${postid}`);
  const commentText = commentTextElement.value.trim();

  if (commentText === "") {
    showToast("Please enter a comment.");
    return;
  }
  const response = await axios.post(
    "https://atman.onrender.com/doctor/addcomment",
    { comment: commentText, puid: puid, postid }
  );

  if (response.data.message === "Comment added successfully.") {
    showToast(response.data.message);
    commentTextElement.value = "";
  }
}

// Function to show the toast message
function showToast(message) {
  const messageToast = document.getElementById("messageToast");
  messageToast.innerText = message;
  messageToast.style.display = "block"; // Show the message
  setTimeout(() => {
    closeToast(); // Automatically close after 4 seconds
  }, 4000);
}

// Function to close the toast message
function closeToast() {
  const messageToast = document.getElementById("messageToast");
  messageToast.style.animation = "slideOutRight 1s forwards"; // Animation for exit
  setTimeout(() => {
    messageToast.style.display = "none"; // Hide the message after animation
    messageToast.style.animation = ""; // Reset animation
  }, 1000); // Wait for animation to complete
}

async function deletePost(id) {
  const response = await fetch("https://atman.onrender.com/deletePost", {
    method: "POST",
    body: JSON.stringify({ postId: id }),
    headers: { "Content-Type": "application/json" },
  });

  const responseData = await response.json();

  if (response.ok) {
    showToast(responseData.message);
    window.location.reload();
  } else {
    console.error("Failed to delete post:", responseData);
  }
}
