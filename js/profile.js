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
  
    // Function to handle password update
    const updatePasswordButton = document.querySelector('.password-update button');
    updatePasswordButton.addEventListener('click', () => {
      const currentPassword = document.querySelector('#current-password').value;
      const newPassword = document.querySelector('#new-password').value;
  
      if (currentPassword && newPassword) {
        alert('Password updated successfully');
        // Here you would make an API call to update the password
        // e.g., updatePassword({ currentPassword, newPassword });
      } else {
        alert('Please fill in both password fields.');
      }
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
    const logoutButton = document.querySelector('.logout-button button');
    logoutButton.addEventListener('click', () => {
      alert('Logging out...');
      // Redirect to the login page or make an API call to log out
      // e.g., logoutUser();
      window.location.href = '../login.html'; // Redirect to login page
    });
  });
  