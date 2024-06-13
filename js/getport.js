getportanddisplay()


var port;
async function getportanddisplay() {
  try {
console.log(document.getElementById("body"))

    var p;

    if (window.location.pathname === "/myportfolio.html") {
      p = localStorage.getItem("nickname");
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      p = urlParams.get("p");

      document.getElementById("body").innerHTML = `<div class='container text-center h1'>not found</div>`;
    }

    var data;
    if (p) {
      // Construct the URL for the request
      const url = `https://atman.onrender.com/doctor/portfolio/${p}`;

      // Send a GET request to the server
      const response = await fetch(url);

      // Parse the JSON response
      data = await response.json();

      if (
        data?.message === "Portfolio data not found" ||
        data?.message === "Doctor not found"
      ) {

        document.getElementById("body").innerHTML = `<div class='container text-center h1'>data not found</div>`;
        document.getElementById("body").innerHTML += ` <div class="text-center">
                        <h1> create or update portfolio </h1><a href="./account.html"> here</a>
                      </div>`
      } else {
        pushPortfolioContent(data);
      }
    } else {
      if (window.location.pathname === "/myportfolio.html") {
        document.getElementById("body").innerHTML = `<div class='container text-center h1'> </div>`;
      } else {
        document.getElementById("body").innerHTML = `<div class='container text-center h1'>${data?.message}</div>`;
      }
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

function pushPortfolioContent(data) {
  document.getElementById("fullname").textContent = data?.user?.fullName;
  document.getElementById("position").textContent = data?.user?.designation;
  // document.getElementById("fullname1").textContent = data?.user?.fullName;
  // document.getElementById("position1").textContent = data?.user?.designation;

  document.getElementById("quote1").innerHTML = data?.user?.quote1;

  document.getElementById("quote2").innerHTML = data?.user?.quote2;
  document.getElementById("portfolioimg").src = data?.details?.profile;

  document.getElementById("para1").innerHTML = data?.user?.paragraph1;
  document.getElementById("para2").innerHTML = data?.user?.paragraph2;
  document.getElementById("para3").innerHTML = data?.user?.paragraph3;
  document.getElementById("emailid").innerHTML =
    "email : " + data?.details?.email;
  document.getElementById("phonenumber").innerHTML =
    "phone number : " + data?.details?.phone;
  document.title = `${data?.user?.fullName} | ${data?.user?.designation} | ${data?.user?.email}`;
  document.getElementById("mainquote").innerHTML =
    data?.user?.mainquote ||
    ` “Only when we are brave enough to explore the darkness
       will we discover the infinite power of our light.”
       ~Brene Brown`;
  document.getElementById("service").innerHTML = (data?.user?.services || [])
    .map(
      (serv) => `<div class="col-lg-6 col-sm-6">
                      <div class="card">
                          
                              <div class="post-title">
                                  <h4><a title href="https://google.com/search?=${serv}" target="_blank">${serv}</a></h4>
                              </div>
                         
                      </div>
                  </div>`
    )
    .join("");
}
