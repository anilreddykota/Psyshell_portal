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


document.head.appendChild(style);


const backdrop = document.createElement('div');
backdrop.id = 'network-backdrop';
backdrop.textContent = 'Network Disconnected. Please check your connection.';


const body = document.getElementsByTagName('body');
console.log(body);
console.log(body[0])
body.appendChild(backdrop);

function toggleBackdrop() {
    if (!navigator.onLine) {
        backdrop.style.display = 'flex'; // Show the backdrop if offline
    } else {
        backdrop.style.display = 'none'; // Hide the backdrop if online
    }
}

window.addEventListener('online', toggleBackdrop);
window.addEventListener('offline', toggleBackdrop);
