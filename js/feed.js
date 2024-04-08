
const uid = localStorage.uid;



fetch('https://atman.onrender.com/get-newsfeed')
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
        const postHTML = `<div class="central-meta item" >
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
                            <ins><a  title="">${post.title}</a></ins>
                                <img src="${post.imageUrl}" alt="" class='h-50'>
                                <div class="we-video-info">
                                    <ul>
                                        <li>
                                            <span class="like" data-toggle="tooltip" title="like">
                                                 <i class="ti-heart like-btn text-${post?.likedBy?.likes[uid] == true ? 'danger' : 'success'}" key="${post.postId}" isliked="${!!post?.likedBy?.likes[uid]}"></i>
                                                
                                                <p><span class="ins" key="${post.postId}" >${post.likesCount}</span></p>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="description">
                                    <p>${post.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                `;


        document.getElementById('posts-container').innerHTML += postHTML;
        const likeButtons = document.querySelectorAll('.like-btn');
        if (uid){
          
        
        likeButtons?.forEach(like => {
          like.addEventListener('click', async (event) => {
            try {
              const uniqueKey = like.getAttribute('key');
              const isLiked = like.getAttribute('isliked');
              const ins = document.querySelector(`.ins[key="${uniqueKey}"]`);
              const uid = localStorage.getItem('uid');
              const queryParams = new URLSearchParams();
              queryParams.append('postid', uniqueKey);
              queryParams.append('uid', uid);
              let url;


              if (isLiked == 'true') {
                url = `https://atman.onrender.com/dislike-post?${queryParams.toString()}`;
                ins.textContent = Math.max(parseInt(ins.textContent) - 1, 0);
                like.classList.remove('text-danger');
                like.classList.add('text-success')
                like.setAttribute('isliked', 'false');

              } else {
                url = `https://atman.onrender.com/like-post?${queryParams.toString()}`;
                ins.textContent = parseInt(ins.textContent) + 1;
                like.classList.remove('text-success')
                like.classList.add('text-danger');

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

    const uid = localStorage.uid;
    if (!title || !description || !image1) {
      alert('Please fill in all fields');
      return;
    }

    // Set UID value

    document.getElementById('uid').value = uid;

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


