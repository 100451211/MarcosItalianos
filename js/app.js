const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();;


const app = express();
const secretKey = process.env.SECRET_KEY

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const url = path.join(__dirname, '../');
console.log("app.js:", url);
app.use(express.static(url));  // Serve static files (HTML, CSS, JS)


app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for:', username);

  const usersFilePath = path.join(__dirname, '../data/users/users.json');

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    try {
      const users = JSON.parse(data);
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        return res.status(401).json({ message: 'Invalid username!' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      // Generate JWT token
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

      // Send JWT as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login successful' });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
});


// Token verification middleware
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Verify user's authentication status
app.get('/auth/check-auth', verifyToken, (req, res) => {
  res.json({ authenticated: true });
});

app.post('/auth/sign-out', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' }); // Clear the token cookie
  res.json({ message: 'Signed out successfully' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));



// =========================================================================================================
// ============== INTENTO PREVIO ===========================================================================
// =========================================================================================================

// app.use((req, res, next) => {
//     console.log('Request URL:', req.url);  // Log every request URL
//     next();
// });

// app.get('/login.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'login.html'));
// });

// app.post('/auth/login', (req, res) => {
//   const { username, password } = req.body;
//   console.log('Login attempt for:', username);

//   // Log the path and make sure it's correct
//   const usersFilePath = path.join(__dirname, '../data/users/users.json');
//   console.log('Reading users from:', usersFilePath);

//   fs.readFile(usersFilePath, 'utf-8', (err, data) => {
//     if (err) {
//       console.error('Error reading users.json:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }

//     try {
//       const users = JSON.parse(data); // Parse JSON safely
//       console.log('Users data:', users[0].username, username); // Log parsed users to verify data

//       // Ensure case-insensitive username matching
//       const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

//       if (!user) {
//         console.log('User not found');
//         return res.status(401).json({ message: 'Invalid username!' });
//       }

//       // Check if password is valid
//       const isPasswordValid = bcrypt.compareSync(password, user.password);
//       if (!isPasswordValid) {
//         console.log('Invalid password');
//         return res.status(401).json({ message: 'Invalid password!' });
//       }

//       // Generate and send JWT token
//       const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
//       res.cookie('token', token, { httpOnly: true });
//       res.json({ message: 'Sesion iniciada correctamente!' });
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
// });

  

// // Check authentication
// app.get('/auth/check-auth', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//       // No token, user is not authenticated
//       return res.json({ authenticated: false });
//   }

//   try {
//       // Verify the token using the secret key
//       jwt.verify(token, secretKey);
//       // If token is valid, the user is authenticated
//       return res.json({ authenticated: true });
//   } catch (error) {
//       // Token verification failed, handle it
//       console.error('JWT verification failed:', error);
//       return res.json({ authenticated: false });
//   }
// });

// // Sign-out route to clear the token cookie
// app.post('/auth/sign-out', (req, res) => {
//   // Clear the token from cookies
//   res.clearCookie('token'); // Clear the JWT cookie
//   res.json({ message: 'Signed out successfully' });
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));