// Create a style element to define the backdrop CSS
const style = document.createElement('style');
style.textContent = `
    #network-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 24px;
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
`;

// Append the style element to the document's head
document.head.appendChild(style);

// Create a div element for the network backdrop
const backdrop = document.createElement('div');
backdrop.id = 'network-backdrop';
backdrop.textContent = 'Network Disconnected. Please check your connection.';

// Append the backdrop element to the document body
document.body.prepend(backdrop);

// Function to toggle the visibility of the backdrop based on network status
function toggleBackdrop() {
    if (!navigator.onLine) {
        backdrop.style.display = 'flex'; // Show the backdrop if offline
    } else {
        backdrop.style.display = 'none'; // Hide the backdrop if online
    }
}

// Initial check for network status and set up event listener for changes
toggleBackdrop();
window.addEventListener('online', toggleBackdrop);
window.addEventListener('offline', toggleBackdrop);
