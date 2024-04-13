document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // Fetch data immediately on page load
    setInterval(fetchData, 6 * 60 * 60 * 1000); // Fetch data every 6 hours
});

async function fetchData() {
    try {
        const lastFetchedTime = sessionStorage.getItem('lastFetchTime');
        const currentTime = Date.now();

        // Check if data was fetched in the last 24 hours or if it's the first fetch
        if (!lastFetchedTime || (currentTime - lastFetchedTime) > (24 * 60 * 60 * 1000)) {
            const uid = localStorage.puid;
            const response = await fetch('https://atman.onrender.com/user/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid: uid })
            });

            

            const data = await response.json(); // Assuming the response is JSON
            // Get the activity log ul element
            const activityLog = document.getElementById('activity-log');

            // Clear existing content
            activityLog.innerHTML = '';

            // Iterate over the data and create list items
            data?.activityLog?.forEach(activity => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="activity-meta">
                        <i>${formatTimeDifference(activity.timestamp)}</i>
                        <span><a href="#" title="">${activity.activity}</a></span>
                    </div>
                `;
                activityLog.appendChild(li);
            });

            // Update last fetch time in session storage
            sessionStorage.setItem('lastFetchTime', currentTime);
            // Store fetched data in session storage
            sessionStorage.setItem('activityLogData', JSON.stringify(data.activityLog));
        } else {
            // If data was fetched within the last 24 hours, retrieve and display it from session storage
            const activityLogData = JSON.parse(sessionStorage.getItem('activityLogData'));
            const activityLog = document.getElementById('activity-log');

            // Clear existing content
            activityLog.innerHTML = '';

            // Iterate over the stored data and create list items
            activityLogData?.forEach(activity => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="activity-meta">
                        <i>${formatTimeDifference(activity.timestamp)}</i>
                        <span><a href="#" title="">${activity.activity}</a></span>
                    </div>
                `;
                activityLog.appendChild(li);
            });
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


function formatTimeDifference(timestamp) {
    const currentTime = new Date();
    const commentTime = new Date(timestamp);

    const differenceInSeconds = Math.floor((currentTime - commentTime) / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
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