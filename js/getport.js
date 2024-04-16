getportanddisplay();
var port;
async function getportanddisplay() {
    try {
        // Get the value of the query parameter 'p' from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get('p');

        if (p) {
            // Construct the URL for the request
            const url = `http://localhost:3002/doctor/portfolio/${p}`;

            // Send a GET request to the server
            const response = await fetch(url);



            // Parse the JSON response
            const data = await response.json();

            if (data?.message === 'Portfolio data not found' || data?.message==='Doctor not found') {
 console.log('Error', data)
                document.body.innerHTML = `<div class='container text-center h1'>${data?.message}</div>`;
            } else {
                pushPortfolioContent(data)

            }


        }else{
            alert('no data available')
            document.body.innerHTML = `<div class='container text-center h1'>${data?.message}</div>`;

        }





    } catch (error) {
        console.error('Error fetching portfolio data:', error);
    }
}


function pushPortfolioContent(data) {
    document.getElementById('fullname').textContent = data?.user?.fullName;
    document.getElementById('position').textContent = data?.user?.designation;
    document.getElementById('fullname1').textContent = data?.user?.fullName;
    document.getElementById('position1').textContent = data?.user?.designation;

    document.getElementById('quote1').innerHTML = data?.user?.quote1;

    document.getElementById('quote2').innerHTML = data?.user?.quote2;
    document.getElementById('portfolioimg').src = data?.details?.profile;


    document.getElementById('para1').innerHTML = data?.user?.paragraph1;
    document.getElementById('para2').innerHTML = data?.user?.paragraph2;
    document.getElementById('para3').innerHTML = data?.user?.paragraph3;

    document.getElementById('mainquote').innerHTML = data?.user?.mainquote || ` “Only when we are brave enough to explore the darkness
       will we discover the infinite power of our light.”
       ~Brene Brown`;
    document.getElementById('service').innerHTML = data?.user?.services.map(serv => (`
        <div class="col-lg-4 col-sm-6">
                            <div class="g-post-classic">
                                <div class="g-post-meta">
                                    <div class="post-title">
                                        <h4><a title href="#">${serv}</a></h4>
                                    </div>

                                </div>
                            </div>
           </div>
        
        `));







}