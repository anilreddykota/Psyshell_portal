
const puid = localStorage.puid;



fetch('http://localhost:3002/get-newsfeed')
  .then(response => response.json())
  .then(data => {
    // Process the received JSON data
    document.getElementById('posts-container').innerHTML = "";
    if (data.posts && data.posts.length > 0) {
      // Iterate over posts data
      data.posts.forEach(post => {
        // Generate HTML markup for each post

        const date = new Date(post.date._seconds * 1000 + Math.round(post.date._nanoseconds / 1000000));
        // Format the date and time
        const formattedDateTime = date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const postHTML = `<div class="central-meta item">
        <div class="user-post">
            <div class="friend-info">
                <figure>
                    <img src="${post?.userDetails?.profile || "./images/resources/defaultpic.jpg"}" alt="">
                </figure>
                <div class="friend-name">
                    <ins><a href="time-line.html" title="">${post.userDetails?.nickname || "unknown user"}</a></ins>
                    <span>published: ${formattedDateTime}</span>
                </div>
                <div class="post-meta">
                    <ins><a title="">${post.title}</a></ins>
                    <img src="${post.imageUrl}" alt="" class='h-50'>
                    <div class="description">
                        <p>${post.description}</p>
                    </div>
                    <div class="we-video-info">
                        <ul>
                            <li>
                                <span class="like" data-toggle="tooltip" title="like">
                                    <i class="ti-heart like-btn text-${post?.likedBy?.likes[puid] == true ? 'danger' : 'success'}" key="${post.postId}" isliked="${!!post?.likedBy?.likes[puid]}"></i>
                                    <p><span class="ins" key="${post.postId}" >${post.likesCount}</span></p>
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>
       
        <div class="form-group">
            <card-with-comments class="card-with-comments" role="article">
            ${post.comments.length > 0 ? `
                <div class="comments">
                    ${post.comments.map(comment => `
                        <div class="comment">
                            <div class="comment__header">
                                <img src="${comment.commenterDetails.profile || "./images/resources/defaultpic.jpg"}" alt="Comment writer image" class="comment__avatar">
                                <p class="comment__user-name">${comment.commenterDetails.nickname || "unknown user"}</p>
                                <p class="comment__time text-success">${formatTimeDifference(comment.timestamp)}</p>
                                <p class="comment__chip">${comment.commenterDetails.role || "Psycholigist"}</p>
                            </div>
                            <p class="comment__text">${comment.comment}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                <div class="form">
                    <img src="../images/resources/defaultpic.jpg" alt="Your avatar" class="form__avatar">
                    <input type="text" class="form__input" placeholder="add comment to this post" id="commentText_${post.postId}">
                    <button class="form__button" onclick="addcomment('${post.postId}','${localStorage.puid}')"></button>
                </div>
            </card-with-comments>
        </div>
        
    </div>`;

        document.getElementById('posts-container').innerHTML += postHTML;
        const likeButtons = document.querySelectorAll('.like-btn');
        if (puid) {


          likeButtons?.forEach(like => {
            like.addEventListener('click', async (event) => {
              try {
                const uniqueKey = like.getAttribute('key');
                const isLiked = like.getAttribute('isliked');
                const ins = document.querySelector(`.ins[key="${uniqueKey}"]`);
                const puid = localStorage.getItem('puid');
                const queryParams = new URLSearchParams();
                queryParams.append('postid', uniqueKey);
                queryParams.append('uid', puid);
                let url;


                if (isLiked == 'true') {
                  url = `https://atman.onrender.com/dislike-post?${queryParams.toString()}`;
                  ins.textContent = Math.max(parseInt(ins.textContent) - 1, 0);
                  like.classList.remove('text-danger');
                  like.classList.add('text-success')
                  like.setAttribute('isliked', 'false');
                  showToast("like removed from post");

                } else {
                  url = `https://atman.onrender.com/like-post?${queryParams.toString()}`;
                  ins.textContent = parseInt(ins.textContent) + 1;
                  like.classList.remove('text-success')
                  like.classList.add('text-danger');
                  showToast(" your like added to post");

                  like.setAttribute('isliked', 'true');
                }


                const response = await fetch(url, {
                  method: 'POST'
                });

                if (response.ok) {
                  console.log('Like request successful');
                  like.setAttribute('isliked', (!isLiked).toString());
                  // Optionally, update UI to reflect the change in like status
                } else {
                  console.error('Failed to send like request:', response.statusText);
                  // Optionally, display an error message to the user
                }
              } catch (error) {
                console.error('Error sending like request:', error);
                // Handle network or other errors
              }
            });

          });
        }
      });

    } else {
      console.log('No posts found');
    }
  })
  .catch(error => {
    console.error('Error fetching posts:', error);
  });




document.addEventListener('DOMContentLoaded', function () {
  const createPostForm = document.getElementById('createPostForm');
  const imagePreview = document.getElementById('imagePreview');
  var imageref = document.getElementById('image');

  imageref?.addEventListener('change', (event) => {
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.style.display = 'block';
    imagePreview.onload = function () {
      URL.revokeObjectURL(imagePreview.src)
    }

  })
  createPostForm?.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Validate form fields
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const image1 = document.getElementById('image')?.files[0];

    const puid = localStorage.puid;
    if (!title || !description || !image1) {
      alert('Please fill in all fields');
      return;
    }

    // Set puid value

    document.getElementById('uid').value = puid;

    // Create FormData object
    const formData = new FormData(this);

    try {
      const response = await fetch('https://atman.onrender.com/create-post', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        alert(data.message);
        window.location.reload();
        // Optionally, redirect to another page or display a success message
      } else {
        console.error('Failed to create post:', response.statusText);
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error appropriately
    }
  });
});


function formatTimeDifference(timestamp) {
  const currentTime = new Date();
  const commentTime = new Date(timestamp._seconds * 1000 + Math.round(timestamp._nanoseconds / 1000000));

  const differenceInSeconds = Math.floor((currentTime - commentTime) / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);
  console.log(timestamp)
  if (differenceInDays > 7) {
    // If it crosses more than a week, display the date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return commentTime.toLocaleDateString('en-US', options);
  } else if (differenceInDays > 0) {
    // If it's within a week, but more than a day, display days ago
    return differenceInDays === 1 ? '1 day ago' : `${differenceInDays} days ago`;
  } else if (differenceInHours > 0) {
    // If it's within a day, but more than an hour, display hours ago
    return differenceInHours === 1 ? '1 hr ago' : `${differenceInHours} hrs ago`;
  } else {
    // If it's within an hour, display minutes ago
    return differenceInMinutes <= 1 ? 'just now' : `${differenceInMinutes} mins ago`;
  }
}

async function addcomment(postid, puid) {
  console.log('adding comment', postid, puid);
  const commentTextElement = document.getElementById(`commentText_${postid}`);
  const commentText = commentTextElement.value.trim();


  if (commentText === "") {
    showToast("Please enter a comment.");
    return;
  }
  const response = await axios.post('http://localhost:3002/doctor/addcomment', { comment: commentText, puid: puid, postid });

  if (response.data.message === "Comment added successfully.") {
    showToast(response.data.message)
  }


}


// Function to show the toast message
function showToast(message) {
  const messageToast = document.getElementById('messageToast');
  messageToast.innerText = message;
  messageToast.style.display = 'block'; // Show the message
  setTimeout(() => {
    closeToast(); // Automatically close after 5 seconds
  }, 5000);
}

// Function to close the toast message
function closeToast() {
  const messageToast = document.getElementById('messageToast');
  messageToast.style.animation = 'slideOutRight 1s forwards'; // Animation for exit
  setTimeout(() => {
    messageToast.style.display = 'none'; // Hide the message after animation
    messageToast.style.animation = ''; // Reset animation
  }, 500); // Wait for animation to complete
}

