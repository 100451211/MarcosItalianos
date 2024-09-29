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
  .then(response => response.json())
  .then(data => {
    if (data.message ===  'Sesion iniciada correctamente!') {
      // Store login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      console.log("isLoggedIn: TRUE", localStorage.isLoggedIn);

      // Check if there's a stored URL to redirect to after login
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');  // Remove the item after using it
        window.location.href = redirectUrl;  // Redirect back to the original product page
      } else {
        console.log("no redirectUrl");
        // window.location.href = 'product.html';  // Fallback if no redirect URL is found
      }
    } else {
      document.getElementById('error-message').textContent = 'Usuario o contraseña inválida. Por favor, inténtelo de nuevo.';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

function logoutUser() {
  localStorage.removeItem('isLoggedIn'); // Remove the login status
  window.location.href = 'index.html'; // Redirect to the home page or login page
}