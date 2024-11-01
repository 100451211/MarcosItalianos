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
app.use(cookieParser());
app.use(bodyParser.json());

const url = path.join(__dirname, '../');
app.use(express.static(url));  // Serve static files (HTML, CSS, JS)

const userCarts = {}; // This will store each user's cart as an array of items

// ========================================== //
// ============= INICIO SESIÓN ============== //
// ========================================== //

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

// ========================================== //
// ============= AUTENTICACIÓN ============== //
// ========================================== //


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
    res.json({ authenticated: false, message: 'Usuario no autenticado.' });
  }
});

// ========================================== //
// ============= CERRAR SESIÓN ============== //
// ========================================== //

app.post('/auth/sign-out', verifyToken, (req, res) => {
  try {
      // Check if the token exists in cookies before attempting to clear it
      if (!req.cookies.token) {
          return res.status(400).json({ message: 'Usuario no autenticado.' });
      }

      // Clear the token cookie to log the user out
      res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });

      // Send a success message if logout is successful
      res.json({ message: 'Cerrando sesión...' });
  } catch (error) {
      console.error('Error during sign-out:', error);
      res.status(500).json({ message: 'Ha habido un problema al cerrar la sesión. Inténtalo de nuevo más tarde.' });
  }
});

// ========================================== //
// ============= DATOS USUARIOS ============= //
// ========================================== //

// Load user details endpoint
app.get('/api/get-user', verifyToken, (req, res) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  const username = req.user.username; // Username from token verification

  // Read the entire users.json file
  fs.readFile(path.join(__dirname, '../data/users/users.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ message: 'Error al leer los datos de usuarios.' });
    }

    try {
      // Parse the JSON data
      const users = JSON.parse(data);

      // Find the user with the specified username
      const user = users.find(user => user.username === username);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Respond with user data if found
      res.json(user);
    } catch (parseError) {
      console.error('Error parsing users data:', parseError);
      res.status(500).json({ message: 'Error al procesar los datos de usuarios.' });
    }
  });
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

async function fetchProductDetails(productId) {
  // Define the paths to your category JSON files
  const categories = ['colores', 'clasico', 'natural', 'moderno'];
  const productsFolder = path.join(__dirname, '../data/products');

  // Loop through each category file to find the product
  for (const category of categories) {
      const filePath = path.join(productsFolder, `${category}.json`);

      try {
          const data = fs.readFileSync(filePath, 'utf-8');
          const products = JSON.parse(data);

          // Search for the product by ID
          const product = products.find(p => p.id === productId);
          if (product) {
              return {
                  productId: product.id,
                  imageUrl: product.images[0] || `../images/products/${product.id}.jpg`,  // Default image URL logic
                  price: product.supplier_prices.madrid  // Include the price in the product details
              };
          }
      } catch (error) {
          console.error(`Error reading ${category}.json file:`, error);
      }
  }

  // If product not found, return null
  console.warn(`Product with ID ${productId} not found in any category.`);
  return null;
}


app.get('/cart/view', verifyToken, async (req, res) => {
  if (req.user) {
    const userId = req.user.id;
    try {
        const userCart = userCarts[userId] || [];

        // Fetch product details including image URL
        const cartWithImages = await Promise.all(userCart.map(async item => {
            const product = await fetchProductDetails(item.productId);
            if (!product) {
                console.warn(`Product details not found for product ID: ${item.productId}`);
            }

            return {
                ...item,
                imageUrl: product ? product.imageUrl : '/path/to/default-image.png',  // Use default image if not found
                price: product ? product.price : '0.00'  // Use default price if not found
            };
        }));

        res.json({ cart: cartWithImages });
      } catch (error) {
          console.error("Error fetching cart with images:", error);
          res.status(500).json({ success: false, message: 'Failed to fetch cart' });
      }
    } else {
      console.warn(`Unauthenticated user attempted to view cart.`);
      res.status(401).json({ success: false, message: 'Unauthenticated user attempted to view cart.' });
    }
});

app.post('/cart/remove', verifyToken, (req, res) => {
  console.log("Received remove-cart request", req.body);
  const { productId } = req.body;
  const userId = req.user.id;

  // Remove the item from the user's cart
  const userCart = userCarts[userId];
  if (userCart) {
      const updatedCart = userCart.filter(item => item.productId !== productId);
      userCarts[userId] = updatedCart;
      res.json({ success: true });
  } else {
      res.status(400).json({ success: false, message: 'Cart not found' });
  }
});


// ========================================== //
// =========== CAMBIO CONTRASEÑA =========== //
// ======================================== //

const fsP = require('fs').promises;
const usersFilePath = path.join(__dirname, '../data/users/users.json');

app.post('/auth/reset-password', verifyToken, async (req, res) => {
  console.log(req.body);
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
      const data = await fsP.readFile(usersFilePath, 'utf-8');
      const users = JSON.parse(data);
      const user = users.find(user => user.id === userId);

      if (!user) return res.json({ message: "User not found." });

      if (!user.password || !currentPassword) {
          console.log("Either current password or stored hashed password is missing.");
          // return res.json({ message: "Current password is required." });
      }

      // Use compareSync for synchronous comparison
      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      console.log("Password matched ::", isMatch);
      if (!isMatch) return res.json({ message: "Contraseña actual incorrecta." });

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10); // Use hashSync here as well
      user.password = hashedNewPassword;

      await fsP.writeFile(usersFilePath, JSON.stringify(users, null, 2));
      res.json({ message: "Contraseña actualizada correctamente!" });
  } catch (error) {
      console.error("Error updating password:", error); 
      res.status(500).json({ message: "No se ha podido actualizar tu contraseña..." });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
