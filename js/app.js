const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const secretKey = 'yourSecretKey'; // Change this to a secure key

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files (HTML, CSS, JS)

// Login Route
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Username:', username);  // Log username for debugging

    const url = path.join(__dirname, 'data/users/users.json');
    console.log("login-URL:", url);
  
    fs.readFile(url, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Successfully read users.json');
        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(u => u.username === username);

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log('User found:', user);

        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log('Password valid:', isPasswordValid);  // Log password validation result

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // If password is correct, generate a JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
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
