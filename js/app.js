const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const { hash } = require('crypto');

const app = express();
const secretKey = 'yourSecretKey'; // Change this to a secure key

app.use(bodyParser.json());
app.use(cookieParser());
const url = path.join(__dirname, '../');
console.log("app.js:", url);
app.use(express.static(url));  // Serve static files (HTML, CSS, JS)

app.use((req, res, next) => {
    console.log('Request URL:', req.url);  // Log every request URL
    next();
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for:', username);

  // Fix fs.readFile - Ensure you pass a callback function
  fs.readFile(path.join(__dirname, '../data/users/users.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    try {
      const users = JSON.parse(data); // Parse JSON safely
      const user = users.find(u => u.username === username);

      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid username!' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password!'});
      }

      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Sesion iniciada correctamente!' });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
});

  

// Check authentication
app.get('/auth/check-auth', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);  // Log the username for debugging
    const token = req.cookies.token;

    if (!token) {
        return res.json({ authenticated: false });
    }

    try {
        jwt.verify(token, secretKey);
        res.json({ authenticated: true });
    } catch (error) {
        res.json({ authenticated: false });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));