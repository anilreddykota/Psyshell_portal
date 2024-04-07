var users;
var selectedpsy = document.querySelector('#card-title');
var selectedpsychat = document.querySelector('#chat-btn');
var params = getParams();
var filtred;

// Access the "doc" parameter
var docValue = params["doc"];
if(!docValue)
{
  var right = document.getElementById("appoint");

  right.innerHTML = " select doctor to book appointment";
}


fetch("http://localhost:3002/admin/doctors", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers if required
    },
    // Add body if you need to send data with the request
})
    .then(response => response.json())
    .then(data => {
        const peopleList = document.getElementById("people-list");

        // Clear existing list items
        peopleList.innerHTML = "";
        

        users = data.users;
        docValue = params["doc"];
    
       var filtred = users.filter((user) => { return user.email === docValue; }); 
       
       selectedpsy.textContent = filtred[0]?.name;
       selectedpsychat.setAttribute('href','messages.html?puid='+filtred[0]?.uid+'&uname='+filtred[0]?.name);
        
        // Iterate through the fetched data and create list items
        data.users.forEach(doctor => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
            <div class="border border-secondary-subtle p-3">
        <div class="card mb-3 ">
        <div class="row g-0">
       
            <div class="col-sm-2">
                <img src="images/resources/friend-avatar.jpg" class="" alt="Doctor Avatar">
            </div>
            <div class="col-sm-8"> <a href="groups.html?doc=${doctor.email}#appoint" id="select" >

               
                <h5 class="card-title">${doctor?.nickname}</h5>
                <p class="card-title">${doctor.area_of_expertise}</p>
                </a>

               
            </div>
            
        </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
              <p class="card-text">Next Available : <br> ${doctor.nextAvailableTime}</p>
            </div>
            <div class="col-sm-6">
                <a href="?doc=${doctor.email}#appoint" title="" class="add-butn" data-ripple="">Book Appointment</a>
            </div>
       
    </div>
    </div>
        `;
         
            listItem.classList.add("friendz-meta");

            peopleList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
// Function to parse URL parameters
function getParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var pairs = queryString.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
}

// Get the parameters


// Output the value of the "doc" parameter




