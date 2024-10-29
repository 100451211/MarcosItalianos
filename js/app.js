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

const userCarts = {}; // This will store each user's cart as an array of items



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

  // If token is missing, mark the user as unauthenticated
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    // If token is invalid, mark as unauthenticated but don't block the request
    req.isAuthenticated = false;
    next();
  }
}

// Verify user's authentication status
app.get('/auth/check-auth', verifyToken, (req, res) => {
  if (req.isAuthenticated) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false, message: 'User not authenticated' });
  }
});

app.post('/auth/sign-out', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' }); // Clear the token cookie
  res.json({ message: 'Signed out successfully' });
});

// ========================================== //
// =========== AÑADIR AL CARRITO ============ //
// ========================================== //

function addProductToUserCart(userId, productId, quantity) {
  // Ensure the user has a cart initialized
  if (!userCarts[userId]) {
      userCarts[userId] = [];
  }

  // Check if the product is already in the cart
  const existingCartItem = userCarts[userId].find(item => item.productId === productId);

  if (existingCartItem) {
      // If the product is already in the cart, increase the quantity
      existingCartItem.quantity += quantity;
  } else {
      // If not, add a new item to the cart
      userCarts[userId].push({ productId, quantity });
  }

  return { success: true };
}

// Add to cart endpoint
app.post('/cart/add', verifyToken, (req, res) => {
  console.log("Received add-to-cart request", req.body);
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    addProductToUserCart(userId, productId, quantity);
    res.json({ success: true });
  } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

app.get('/cart/view', verifyToken, (req, res) => {
  const userId = req.user.id;
  const cart = userCarts[userId] || [];
  res.json({ cart });
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
