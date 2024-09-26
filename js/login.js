document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  console.log('Form submitted');  // Add this to check if the event is firing
  
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
    console.log('Response from server:', data);  // Log the response for debugging
    if (data.message === 'Sesión iniciada correctamente.') {
      window.location.href = 'product.html';  // Redirect to the product page
    } else {
      document.getElementById('error-message').textContent = 'Usuario o contraseña incorrecta. Inténtelo de nuevo.';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

  
