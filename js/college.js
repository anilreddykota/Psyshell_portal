if(localStorage.Collegecode == null){
    window.location.href = "landing.html";
}


var graphdata;
var students;
let moodChart = null;
const query = getParams();


document.getElementById('refresh-list').addEventListener("click", () =>{
    console.log('refresh');
    localStorage.removeItem("students");
    fetchData();
})
async function fetchData() {
  try {
    if (localStorage.students) {
      students = JSON.parse(localStorage.students);
    } else {
      students = await fetchStudentsByCollege();
      
      localStorage.setItem("students", JSON.stringify(students));
    }

    displayStudents(students);
    addClickEventListeners();
  } catch (error) {
    console.error("Error fetching data:", error);
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
  console.log(searchText);
  const filtredstudents= students.filter((student) => {
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
  renderFilteredStudents(filtredstudents)
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

    const row = `<tr data-uid="${uid}">
                        <td>${name}</td>
                        <td>${email}</td>
                        <td>${occupation}</td>
                        <td>${dept}</td>
                    </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

function addClickEventListeners() {
  const tableBody = document.querySelector("#studentsTable tbody");

  tableBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", async function (event) {
      event.preventDefault();
      const uid = this.getAttribute("data-uid");

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("uid", uid);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${urlParams}#feature`
      );
      let query = getParams();
      const selectedstudent = students.filter((student) => {
        return student.uid === query["uid"];
      });
      const details = selectedstudent[0].details.fulldetails;
      if (details) {
        addDataToTable(details);
      }
      await fetchAnalytics(uid);
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
  } catch (error) {
    console.error("Error fetching analytics data:", error);
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
  weekdata.innerHTML = ` <p>${days[week][0]} <br> ${
    days[week][days[week].length - 1]
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
    weekdata.innerHTML = `<p>${days[selectedweek][0]} <br>${
      days[selectedweek][days[selectedweek].length - 1]
    }<p>`;
  }
  document.getElementById('averagemoodscore').innerHTML = `<div class='card mt-2 ml-2'> <div class='card-title widget-title'>Resilience points</div> <div class='card-body'><h1>${graphdata?.data?.moodDate.length *5}</h1><img src='./images/points_coin.png' class="points_logo"></div></div>`;

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
        console.log("Doctors data:", doctorsData);
        displayDoctorsDataInTable(doctorsData); // Display the doctors data in the table
    })
    .catch((error) => {
        console.error("Error fetching doctors data:", error);
        // Handle errors
    });
async function fetchDoctorsByCollege(collegeCode) {
    try {
        const response = await axios.get(`https://atman.onrender.com/admin/doctorforcollege/${collegeCode}`);
        return response.data; // Return the data received from the server
    } catch (error) {
        console.error("Error fetching doctors data:", error);
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
}