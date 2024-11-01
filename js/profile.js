// Function to open the pop-up with a message and an optional redirect
function showPopup(message, redirect = null) {
  const popup = document.getElementById('popup');
  document.getElementById('popup-message').textContent = message;
  popup.style.display = 'block';

  const closeButton = popup.querySelector('button');
  closeButton.onclick = () => {
    closePopup();
    if (redirect) {
      window.location.href = redirect;
    }
  };
}

// Function to close the pop-up
function closePopup() {
  document.getElementById('popup').style.display = 'none';
}


// ========================================== //
// =========== CAMBIO CONTRASEÑA =========== //
// ======================================== //


// Modify the API call to use the pop-up for feedback
document.getElementById('update-password-btn').addEventListener('click', async () => {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;

  if (!currentPassword || !newPassword) {
      showPopup("Rellenar campos obligatorios para el cambio de contraseña.");
      return;
  }

  try {
      const response = await fetch('/api/reset-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer your_jwt_token' // Replace with actual token if used
          },
          body: JSON.stringify({ currentPassword, newPassword })
      });

      const result = await response.json();
      showPopup(result.message); // Show success or error message in pop-up
  } catch (error) {
      showPopup("Error updating password.");
  }
});


// ========================================== //
// ============= CERRAR SESION ============= //
// ======================================== //
document.getElementById('logout-link').addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent default link behavior

  try {
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies if using them for session management
    });

    const result = await response.json();

    if (response.ok) {
      // Clear any stored tokens if using JWTs
      localStorage.removeItem('token'); // Example: remove the token from localStorage

      // Show the API's success message and redirect to login page
      showPopup(result.message, '../login.html');
    } else {
      // Show the API's error message without redirect
      showPopup(result.message);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    showPopup(result.message); // Show a fallback error message if API call fails
  }
});




// profile.js
document.addEventListener('DOMContentLoaded', () => {
  
    // Function to handle updating profile details
    const saveChangesButton = document.querySelector('.user-details button');
    saveChangesButton.addEventListener('click', () => {
      const address = document.querySelector('#address').value;
      alert(`Profile updated with address: ${address}`);
      // Here you would make an API call to save the address
      // e.g., saveProfileDetails({ address });
    });
  
    
  
  
    // Function to handle saving preferences
    const savePreferencesButton = document.querySelector('.preferences button');
    savePreferencesButton.addEventListener('click', () => {
      const newsletter = document.querySelector('input[name="newsletter"]').checked;
      const notifications = document.querySelector('input[name="notifications"]').checked;
      const language = document.querySelector('#language').value;
  
      alert(`Preferences saved: Newsletter (${newsletter}), Notifications (${notifications}), Language (${language})`);
      // API call to save preferences
      // e.g., savePreferences({ newsletter, notifications, language });
    });
  
    // Function to handle viewing order details
    const orderDetailsButtons = document.querySelectorAll('.order-history button');
    orderDetailsButtons.forEach(button => {
      button.addEventListener('click', () => {
        const orderId = button.closest('tr').getAttribute('data-order-id');
        alert(`Viewing details for Order ID: ${orderId}`);
        // API call to fetch order details
        // e.g., fetchOrderDetails(orderId);
      });
    });
  
    // Function to handle logout
    
  });
  