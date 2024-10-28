document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Invalid username or password');
    }
    return response.json();
  })
  .then(data => {
    if (data.message === 'Login successful') {
      // Check for a stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');

      // Redirect and clear the stored URL if it exists
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        // Fallback redirect if no redirect URL is found
        window.location.href = 'index.html';  // Change this to your desired default page
      }
    } else {
      // Display an error message on the page
      document.getElementById('loginError').textContent = 'Usuario o contraseña inválida. Por favor, inténtelo de nuevo.';
      document.getElementById('loginError').style.display = 'block';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('loginError').textContent = 'Usuario o contraseña inválida. Por favor, inténtelo de nuevo.';
    document.getElementById('loginError').style.display = 'block';
  });
});


function logoutUser() {
  localStorage.removeItem('isLoggedIn'); // Remove the login status
  window.location.href = 'index.html'; // Redirect to the home page or login page
}