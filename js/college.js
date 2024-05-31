if (localStorage.Collegecode == null) {
  window.location.href = "landing.html";
}

var graphdata;
var students;
let moodChart = null;
var query = getParams();

document.getElementById("refresh-list").addEventListener("click", () => {
  console.log("refresh");
  localStorage.removeItem("students");
  fetchData();
});
async function fetchData() {
  try {
    if (localStorage.students) {
      students = JSON.parse(localStorage.students);
    } else {
      students = await fetchStudentsByCollege();

      localStorage.setItem("students", JSON.stringify(students));
    }
    const { ageAnalytics, deptAnalytics } = getStudentAnalytics(students);
    addAnalyticsToCard(ageAnalytics, deptAnalytics);
    displayStudents(students);
    addClickEventListeners();
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
fetchData();
const code = localStorage.getItem("Collegecode");
async function fetchStudentsByCollege() {
  let code = localStorage.getItem("Collegecode");

  const response = await axios.post(
    "https://atman.onrender.com/get-students-by-college",
    {
      code: code,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.students;
}

let timeoutId;

function displayStudents(students) {
 
  renderFilteredStudents(students);
}
const handleInputChange = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(filterStudents, 1000);
};
const searchInput = document.getElementById("searchstudent");
searchInput.addEventListener("input", handleInputChange);

function filterStudents() {
  const searchInput = document.getElementById("searchstudent");
  const searchText = searchInput.value.toLowerCase().trim();

  const filtredstudents = students.filter((student) => {
    const name = student.details.fulldetails.nickname.toLowerCase();
    const email = student.details.fulldetails.email.toLowerCase();
    const occupation =
      student.details.fulldetails?.occupation?.toLowerCase() || "";
    const dept = student.details.fulldetails?.dept?.toLowerCase() || "";

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      occupation.includes(searchText) ||
      dept.includes(searchText)
    );
  });
  renderFilteredStudents(filtredstudents);
}

function renderFilteredStudents(filteredStudents) {
  const tableBody = document.querySelector("#studentsTable tbody");
  tableBody.innerHTML = "";

  filteredStudents.forEach((student) => {
    const name = student.details.fulldetails.nickname;
    const email = student.details.fulldetails.email;
    const occupation = student.details.fulldetails?.occupation || "?";
    const dept = student.details.fulldetails?.dept || "?";
    const uid = student.uid;
    const status = student.details.fulldetails?.token;
    const lastLogin = student.details.fulldetails?.lastLogin;

    const row = `<tr data-uid="${uid}">
                        <td>${name}</td>
                        <td>${email}</td>
                        <td class=${status ? "text-success" : "text-danger"}>${status
        ? "active (" + formatFirestoreTimestamp(lastLogin) + ")"
        : "inactive (" + formatFirestoreTimestamp(lastLogin) + ")"
      }</td>
                        <td>${dept}</td>
                    </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
  new DataTable("#studentsTable",{searching: true,info: false,paging:true,});
}

function addClickEventListeners() {
  const tableBody = document.querySelector("#studentsTable tbody");

  tableBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", async function (event) {
      event.preventDefault();
      const uid = this.getAttribute("data-uid");

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("uid", uid);

      // Remove the uid parameter if it exists
      if (urlParams.has("id")) {
        urlParams.delete("id");
      }
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${urlParams}#feature`
      );
      query = getParams();
      const selectedstudent = students.filter((student) => {
        return student.uid === query["uid"];
      });
      const details = selectedstudent[0].details.fulldetails;
      if (details) {
        addDataToTable(details);
      }
      await fetchAnalytics(uid);
      loadPosts(query["uid"], 1, false);
    });
  });
}

function getParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return params;
}

if (query["uid"]) {
  fetchAnalytics(query["uid"]);
  loadPosts(query["uid"], 1, false);
  const selectedstudent = students.filter((student) => {
    return student.uid === query["uid"];
  });
  const details = selectedstudent[0].details.fulldetails;
  if (details) {
    addDataToTable(details);
  }
}

async function fetchAnalytics(uid) {
  try {
    const response = await axios.post(
      "https://atman.onrender.com/get-analysis-of-student",
      {
        uid: uid,
      }
    );

    if (response) {
      graphdata = response;
      displayMoodChart();
    }
    document.getElementById("togglepsystu").classList.remove("d-none");
    document.getElementById("psydata").classList.add("d-none");
  } catch (error) {
    console.log("Error fetching analytics data:", error);
    return Promise.reject(error);
  }
}

function addDataToTable(data) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Clear existing table data

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      if (
        key !== "profile" &&
        key !== "password" &&
        key !== "token" &&
        key !== "lastLogin"
      ) {
        const value = data[key];
        const row = `<tr>
                                <td>${key}</td>
                                <td>${value}</td>
                            </tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
      }
    }
  }
}

function displayMoodChart() {
  if (moodChart) {
    // If an existing chart instance exists, destroy it
    moodChart.destroy();
  }
  var selectedweek = 0;
  const dates = graphdata?.data?.moodDate;
  const scores = graphdata?.data?.analyticsResult?.moodScore;
  const label = [];
  const subLabels = [];
  const subScores = [];
  const days = [];
  var week = 1;

  if (!dates) {
    document.getElementById("no-graph-message").innerHTML =
      "no graph data available";
    return;
  }
  dates.forEach((date, index) => {
    const currentDate = new Date(date);
    const currentWeek = currentDate.getWeek(); // Assuming getWeek() returns week number

    // If current week is different from previous week, update week and weekStart
    if (currentWeek !== week) {
      week = currentWeek;
      label.push(`Week ${week}`);
      subLabels.push([]);
      subScores.push([]);
      days.push([]); // Initialize sub-scores array for the week
      weekStart = index;
    }

    // Add day name as sublabel
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(currentDate);
    subLabels[subLabels.length - 1].push(dayName);
    days[days.length - 1].push(date);
    // Add mood score for the day
    subScores[subScores.length - 1].push(scores[index]);
  });
  week = subScores.length - 1;

  const ctx = document.getElementById("moodChart").getContext("2d");
  const canvas = document.getElementById("moodChart");
  canvas.classList.add("card");
  canvas.style.width = "100%";
  canvas.style.height = "325px";
  const labels = [...subLabels[week]];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Mood Level",
        data: [...subScores[week]],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, values) {
            // Custom label mapping
            const labelMap = {
              1: "😩",
              2: "😢",
              3: "😞",
              4: "😄",
              5: "😊",
            };
            return labelMap[value] || value;
          },
        },
        title: {
          display: true,
          text: "Mood Level",
        },
      },
      x: {
        title: {
          display: true,
          text: "day",
        },
      },
    },
    // Set fixed height for the chart
    maintainAspectRatio: true, // Disable aspect ratio
    responsive: false, // Enable responsive
  };

  moodChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options,
  });

  const controls = document.getElementById("moodChartControl");

  const control = `
 <div class='' style='display:flex; flex-direction:row;align-content: space-between;justify-content: center;'>
<div style="width:fit-content;">
<button id='prev' class= 'btn btn-outline-primary' ><</button>
</div>
<div id='weekdata' style="width:fit-content;" class="ml-5 mr-5" >
</div>
<div style="width:fit-content;">
<button id='next' class= 'btn btn-outline-primary' >></button>
</div>
 </div>
 
 `;
  controls.innerHTML = control;

  const prevButton = document.getElementById("prev");
  prevButton.classList.add("btn");
  prevButton.textContent = "<";
  prevButton.addEventListener("click", function () {
    if (selectedweek > 0) {
      selectedweek--;
      week = selectedweek;
      updateGraph();
    }
  });

  // Create and append Week Data

  const weekdata = document.getElementById("weekdata");
  weekdata.innerHTML = ` <p>${days[week][0]} <br> ${days[week][days[week].length - 1]
    }</p>`;

  // Create and append Next Week button

  document.getElementById("next").addEventListener("click", function () {
    if (selectedweek < subLabels.length - 1) {
      selectedweek++;
      week = selectedweek;
      updateGraph();
    }
  });

  function updateGraph() {
    moodChart.data.labels = [...subLabels[selectedweek]];
    moodChart.data.datasets[0].data = [...subScores[selectedweek]];
    moodChart.update();
    weekdata.innerHTML = `<p>${days[selectedweek][0]} <br>${days[selectedweek][days[selectedweek].length - 1]
      }<p>`;
  }
  var modes = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date(
    graphdata?.data?.currentStreak?.dates[
    graphdata?.data?.currentStreak?.dates.length - 1
    ]
  );
  document.getElementById(
    "averagemoodscore"
  ).innerHTML = `<div class='card mt-2 '> <div class='card-title widget-title'>Resilience points</div> <div class='card-body'><h1>${graphdata?.data?.moodDate.length * 5
    }</h1><img src='./images/points_coin.png' class="points_logo"></div></div>`;
  document.getElementById(
    "analytics"
  ).innerHTML = `<div class='card mt-2 ml-2 '> <div class='card-title widget-title'>last login</div> <div class='card-body'><h3>${today.toLocaleDateString(
    "en-US",
    modes
  )}</h3></div></div>`;
}
Date.prototype.getWeek = function () {
  const onejan = new Date(this.getFullYear(), 0, 1);
  const weekStart = new Date(
    onejan.getFullYear(),
    onejan.getMonth(),
    onejan.getDate() - onejan.getDay()
  );
  const diff = this - weekStart;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
};

fetchDoctorsByCollege(code)
  .then((doctorsData) => {
    displayDoctorsDataInTable(doctorsData); // Display the doctors data in the table
  })
  .catch((error) => {
    console.log("Error fetching doctors data:", error);
    // Handle errors
  });
async function fetchDoctorsByCollege(collegeCode) {
  // Check if data exists in local storage
  const storedData = localStorage.getItem("doctorsData");
  if (storedData) {
    return JSON.parse(storedData); // Return the stored data
  }

  // If data doesn't exist in local storage, fetch it from the server
  try {
    const response = await axios.get(
      `https://atman.onrender.com/admin/doctorforcollege/${collegeCode}`
    );
    const doctorsData = response.data; // Extract data from the response
    localStorage.setItem("doctorsData", JSON.stringify(doctorsData)); // Store data in local storage
    return doctorsData; // Return the data received from the server
  } catch (error) {
    console.log("Error fetching doctors data:", error);
    throw error; // Propagate the error for handling
  }
}

function displayDoctorsDataInTable(doctorsData) {
  const tableBody = document.querySelector("#doctorsTable tbody");
  tableBody.innerHTML = ""; // Clear existing table data

  doctorsData.forEach((doctor) => {
    const row = `
            <tr>
                <td>${doctor.email}</td>
                <td>${doctor?.nickname || doctor?.name}</td>
                <td>${doctor.area_of_expertise}</td>
                <td>${doctor?.phonenumber || "?"}</td>
            </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  // Add event listener to all rows
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.addEventListener("click", () => {
      const urlParams = new URLSearchParams(window.location.search);
      var puid = doctorsData[index].id;
      // Set the id parameter based on the doctor's data
      urlParams.set("id", puid);

      // Remove the uid parameter if it exists
      if (urlParams.has("uid")) {
        urlParams.delete("uid");
      }

      // Replace the current URL with the updated parameters
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${urlParams}`
      );
      getAppointments(puid);
    });
  });
}

function getStudentAnalytics(students) {
  // Initialize objects to store analytics
  const ageAnalytics = {};
  const deptAnalytics = {};

  // Iterate over each student
  students.forEach((student) => {
    // Extract student details
    const { age, dept } = student.details.fulldetails;

    // Update age analytics
    if (age in ageAnalytics) {
      ageAnalytics[age]++;
    } else {
      ageAnalytics[age] = 1;
    }

    // Update department analytics
    if (dept in deptAnalytics) {
      deptAnalytics[dept]++;
    } else {
      deptAnalytics[dept] = 1;
    }
  });

  return { ageAnalytics, deptAnalytics };
}

function addAnalyticsToCard(ageAnalytics, deptAnalytics) {
  // Select the flex div inside the card
  const flexDiv = document.querySelector(".card .flex");

  flexDiv.innerHTML = "";
  const ageChartContainer = document.createElement("div");
  const deptChartContainer = document.createElement("div");
  const text1 = document.createElement("h4");
  text1.textContent = "Students vs Ages";
  const text2 = document.createElement("h4");
  text2.textContent = "Students vs Departments";

  ageChartContainer.appendChild(text1);
  deptChartContainer.appendChild(text2);
  // Append chart containers to the flex div

  flexDiv.appendChild(ageChartContainer);
  flexDiv.appendChild(deptChartContainer);

  // Create canvas elements for the charts
  const ageCanvas = document.createElement("canvas");
  const deptCanvas = document.createElement("canvas");

  // Append canvas elements to the chart containers
  ageChartContainer.appendChild(ageCanvas);
  deptChartContainer.appendChild(deptCanvas);

  // Generate data and labels for the age chart
  const ageData = Object.values(ageAnalytics);
  const ageLabels = Object.keys(ageAnalytics);

  // Generate data and labels for the department chart
  const deptData = Object.values(deptAnalytics);
  const deptLabels = Object.keys(deptAnalytics);

  // Create and render the age chart
  new Chart(ageCanvas, {
    type: "bar",
    data: {
      labels: ageLabels,
      datasets: [
        {
          label: "Number of Students",
          data: ageData,
          backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue color with transparency
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Create and render the department chart
  new Chart(deptCanvas, {
    type: "bar",
    data: {
      labels: deptLabels,
      datasets: [
        {
          label: "Number of Students",
          data: deptData,
          backgroundColor: "rgba(255, 99, 132, 0.5)", // Red color with transparency
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

var approvedAppointments = [];
var pendingAppointments = [];

async function getAppointments(puid) {
  try {
    const response = await axios.post(
      "https://atman.onrender.com/getAppointmentsByDoctor",
      { puid }
    );
    const appointments = response.data;

    if (appointments) {
      approvedAppointments = [...appointments.approvedAppointments];
      pendingAppointments = [...appointments.pendingAppointments];
      displayAppointments([
        ...appointments.approvedAppointments,
        ...appointments.pendingAppointments,
      ]);
    } else {
      document.getElementById("psydata").textContent =
        "No appointments found for this doctor.";
    }
  } catch (error) {
    document.getElementById("psydata").textContent =
      "No appointments found for this doctor.";

    console.log("Error fetching appointments:", error);
  }
}

function displayAppointments(appointments) {
  document.getElementById("togglepsystu").classList.add("d-none");
  const appointmentsDiv = document.getElementById("psydata");
  appointmentsDiv.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsDiv.textContent = "No appointments found for this doctor.";
  } else {
    appointments.map((appointment) => {
      const appointmentHTML = `
                <div class="central-meta p-0 appointment-card">
                    <div class="new-postbox">
                        <div class="w-25 mt-5">
                       
                            <img src="${appointment.userDetails.profile ||
        "./images/resources/defaultpic.jpg"
        }" alt="" class="pt-3 user-avatar appoint">
                        </div>
                        <div class="newpst-input p-5 groups">
                            <h1 class="appointment-title"> ${appointment.userDetails.name?.toUpperCase()}</h1>
                            <h5>Gender: ${appointment.userDetails.gender}</h5>
                            <h5>Age: ${appointment.userDetails.age}</h5>
                            <h5>Occupation: ${appointment.userDetails.occupation
        }</h5>
                            <span class="slot">Time Slot: ${appointment.date
        } /  ${appointment.timeSlot}</span><br>
                            <br>
                        </div>
                    </div>
                </div>
            `;
      appointmentsDiv.innerHTML += appointmentHTML;
    });
  }
}

// Function to fetch posts of a user
async function fetchPosts(uid, page = 1) {
  try {
    const response = await axios.get(
      "https://atman.onrender.com/filterPostByUid",
      {
        params: { uid, page },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching posts:", error);
    return null;
  }
}
var currentPage = 0;
// Function to display posts
function displayPosts(posts, append = false) {
  const postsContainer = document.getElementById("posts-container");
  if (!append) {
    postsContainer.innerHTML = ""; // Clear previous posts only if not appending
    return;
  }

  if (posts.length > 0) {
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("col-md-6", "col-sm-6", "col-12", "mb-4");
      // Create post content
      let postContent = `
        <div class="card">
        <div class="card-header text-center">
        <h5 class="card-title">${post.title?.toUpperCase()}</h5>
      </div>

          ${post.imageUrl
          ? `<img src="${post.imageUrl}" class="card-img-top" alt="Post Image" loading='lazy'>`
          : ""
        }
          <div class="card-body row">
           
            <p class="card-text ">${post.description}</p>
          </div>
          <div class="card-footer text-muted text-center">
        ${formatTimeDifferences(post.date)}

        </div>
        </div>
      `;

      postElement.innerHTML = postContent;
      postsContainer.appendChild(postElement);
      currentPage = 1;
    });
  } else if (!append) {
    postsContainer.innerHTML = "<p>No posts found</p>";
  }
}

async function loadPosts(uid, page, append = false) {
  try {
    const data = await fetchPosts(uid, page);

    if (data) {
      displayPosts(data.posts, append);
      if (data.posts.length === 0) {
        // If no more posts, disconnect the observer
        observer.disconnect();
      }
    } else {
      observer.disconnect();
    }
  } catch (e) {
    console.log(e);
  }
}

// IntersectionObserver to load more posts when reaching the bottom
const loadMoreTrigger = document.getElementById("load-more-trigger");
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      currentPage += 1;
      loadPosts(query["uid"], currentPage, true);
    }
  },
  { threshold: 1.0 }
);

// Initial call to load posts for a user

// Start observing the load-more-trigger element
observer.observe(loadMoreTrigger);

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

function formatFirestoreTimestamp(firestoreTimestamp) {
  if (!firestoreTimestamp) {
    return "not loggedin";
  }
  const { _seconds, _nanoseconds } = firestoreTimestamp;

  // Create a JavaScript Date object from the seconds and nanoseconds
  const milliseconds = _seconds * 1000 + _nanoseconds / 1000000;
  const dateObject = new Date(milliseconds);

  // Get the current time
  const currentTime = new Date();

  // Calculate the difference in milliseconds between the current time and the Firestore timestamp
  const difference = currentTime - dateObject;

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;

  // Calculate the time difference in minutes, hours, and days
  const minutesAgo = Math.floor(difference / minute);
  const hoursAgo = Math.floor(difference / hour);
  const daysAgo = Math.floor(difference / day);

  // Determine the appropriate time ago message
  let timeAgoMessage;
  if (daysAgo > 0) {
    timeAgoMessage = `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  } else if (hoursAgo > 0) {
    timeAgoMessage = `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else if (minutesAgo > 0) {
    timeAgoMessage = `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  } else {
    timeAgoMessage = "no";
  }

  return timeAgoMessage;
}

document
  .getElementById("convertToExcel")
  .addEventListener("click", downloadExcel);
function downloadExcel() {
  const data = students;
  const allKeys = new Set();
  data.forEach((item) => {
    Object.keys(item.details.fulldetails || {}).forEach((key) =>
      allKeys.add(key)
    );
  });

  // Convert the set to an array
  const allKeysArray = Array.from(allKeys);
  const keysToExclude = new Set(["password", "token", "profile", "lastLogin"]);

  // Transform the data to a flat structure suitable for Excel
  const transformedData = data.map((item) => {
    const details = item.details.fulldetails || {};

    const transformedItem = {};
    allKeysArray.forEach((key) => {
      if (!keysToExclude.has(key)) {
        transformedItem[key] = details[key] || "";
      }
    });
    return transformedItem;
  });

  const time = new Date().toLocaleDateString().replaceAll("/", "_");

  console.log(time, transformedData);
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Students_${time}`);

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `Students_details_on_${time}.xlsx`);
}
