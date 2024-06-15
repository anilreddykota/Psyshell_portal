// Create a style element to define the custom alert CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            position: -30px;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
             position: 30px;
        }
    }

    #network-notification, #custom-alert {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        display: none;
        z-index: 1000;
        transition: opacity 0.5s ease-in-out;
    }

    #network-notification.show, #custom-alert.show {
        display: block;
        animation: fadeIn 2s forwards;
    }

    #network-notification.hide, #custom-alert.hide {
        animation: fadeOut 2s forwards;
    }

    #custom-alert {
        top: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        padding: 20px;
        color: white !important;
        font-size: 20px;
        text-align: center;
        background-color: #1fb6ff;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);

    }

    #custom-alert .alert-title {
        font-size: 18px;
        margin-bottom: 10px;
    }

    #custom-alert .alert-message {
        margin-bottom: 20px;
    }

    #custom-alert .alert-button {
        padding: 10px 20px;
        background-color: #1fb6ff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width:100%;
    }

    #custom-alert .alert-button:hover {
        background-color: white;
        color: #1fb6ff;
    }
`;

document.head.appendChild(style);

// Create the network notification element
const networkNotification = document.createElement('div');
networkNotification.id = 'network-notification';
networkNotification.textContent = 'Network Disconnected. Please check your connection.';

// Append the network notification to the body
document.body.appendChild(networkNotification);

// Function to show the network notification
function showNetworkNotification(message,color) {
    networkNotification.textContent = message;
    networkNotification.classList.add('show',color);
    networkNotification.classList.remove('hide');

    setTimeout(() => {
        networkNotification.classList.remove('show',color);
        networkNotification.classList.add('hide');
    }, 3000); // Hide the notification after 3 seconds
}

// Create the custom alert element
const customAlert = document.createElement('div');
customAlert.id = 'custom-alert';
customAlert.innerHTML = `
    <div class="alert-title">PsyShell Says...</div>
    <hr>
    <div class="alert-message"></div>
    <hr>
    <button class="alert-button">OK</button>
`;

// Append the custom alert to the body
document.body.appendChild(customAlert);

// Function to show the custom alert
function showCustomAlert(title, message) {
    customAlert.querySelector('.alert-title').textContent = title;
    customAlert.querySelector('.alert-message').textContent = message;
    customAlert.classList.add('show');
    customAlert.classList.remove('hide');

    // Add click event to the OK button to hide the alert
    customAlert.querySelector('.alert-button').onclick = function() {
        customAlert.classList.remove('show');
        customAlert.classList.add('hide');
    };
}

// Override the default alert function
window.alert = function(message) {
    showCustomAlert('PsyShell Says...', message);
};

// Function to toggle the network notification based on network status
function toggleNetworkNotification() {
    if (!navigator.onLine) {
        showNetworkNotification('Network Disconnected. Please check your connection.','bg-danger');
    } else {
        showNetworkNotification('Network Connected.',"bg-success");
    }
}

// Add event listeners for online and offline events
window.addEventListener('online', toggleNetworkNotification);
window.addEventListener('offline', toggleNetworkNotification);




(function() {
    const originalFetch = window.fetch;
  
    window.fetch = async function(...args) {
      if (!navigator.onLine) {
        return new Response('Network request blocked because you are offline.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
  
      return originalFetch.apply(this, args);
    };
  })();
  
  // Axios interceptors

  
  axios.interceptors.request.use(
    function(config) {
      if (!navigator.onLine) {
        return Promise.reject({
          response: {
            status: 503,
            statusText: 'Service Unavailable',
            data: 'Network request blocked because you are offline.'
          }
        });
      }
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );
  

  