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

    // Check for redirectUrl in the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirectUrl');

    if (redirectUrl) {
      window.location.href = decodeURIComponent(redirectUrl);
    } else {
      console.log('No redirect URL found, redirecting to index.html');
      window.location.href = '../index.html';
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
  window.location.href = '../index.html'; // Redirect to the home page or login page
}