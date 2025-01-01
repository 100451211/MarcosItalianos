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
  const usersFilePath = path.join(__dirname, '../data/users/users.json');

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    try {
      const users = JSON.parse(data);
      console.log("Users array:", users); // Inspect the structure of users
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        return res.status(401).json({ message: 'Invalid username!' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      // Generate JWT token with only the username included
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

      // Send JWT as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
      res.json({ message: 'Login successful' });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
});


function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = { username: verified.username };
    req.isAuthenticated = true;
    console.log("Authenticated User:", req.user.username); // Log the username for each request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    req.isAuthenticated = false;
    next();
  }
}

// Verify user's authentication status
app.get('/auth/check-auth', verifyToken, (req, res) => {
  if (req.isAuthenticated) {
    // console.log("check/auth - request:", req);
    res.json({ authenticated: true, message: 'Usuario autenticado :)' });
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
      res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', path: '/' });

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

function addProductToUserCart(username, productId, quantity) {
  // Ensure the user has a cart initialized
  if (!userCarts[username]) {
      userCarts[username] = []; // Create a cart array for each user
  }

  // Check if the product is already in the cart
  const existingCartItem = userCarts[username].find(item => item.productId === productId);

  if (existingCartItem) {
      // If the product is already in the cart, increase the quantity
      existingCartItem.quantity += quantity;
  } else {
      // If not, add a new item to the cart
      userCarts[username].push({ productId, quantity });
  }
  return { success: true };
}

// Add to cart endpoint
app.post('/cart/add', verifyToken, (req, res) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const username = req.user.username;
  console.log("Adding items to cart for user:", username);

  const cartItems = Array.isArray(req.body) ? req.body : [req.body];

  try {
    cartItems.forEach(item => {
      const { productId, quantity } = item;
      addProductToUserCart(username, productId, quantity);
    });

    console.log("Final userCarts structure after /cart/add:", JSON.stringify(userCarts, null, 2));
    res.json({ success: true, message: 'Products added to cart successfully' });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: 'Failed to add products to cart' });
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
  if (req.isAuthenticated) {
    const username = req.user.username;
    // console.log("Fetching cart for user:", username);

    const userCart = userCarts[username] || []; // Isolate cart by username

    try {
      const cartWithImages = await Promise.all(userCart.map(async item => {
        const product = await fetchProductDetails(item.productId);
        return {
          ...item,
          imageUrl: product ? product.imageUrl : '/path/to/default-image.png',
          price: product ? product.price : '0.00'
        };
      }));

      console.log("Cart returned for user", username, ":", JSON.stringify(cartWithImages, null, 2));
      res.json({ cart: cartWithImages });
    } catch (error) {
      console.error("Error fetching cart with images:", error);
      res.status(500).json({ success: false, message: 'Error retrieving cart.' });
    }
  } else {
    console.warn("Unauthenticated user attempted to view cart.");
    res.status(401).json({ success: false, message: 'Access denied to cart.' });
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
      res.status(400).json({ success: false, message: 'Error!\nCarrito no encontrado.' });
  }
});

const { generateInvoicePDF, sendInvoiceEmail } = require('./invoice');

app.post('/api/proceed-payment', verifyToken, async (req, res) => {
  if (!req.isAuthenticated) {
      return res.status(401).json({ message: 'Error! Usuario no autenticado.' });
  }

  try {
      const cart = req.body.cart;
      const username = req.user.username; // Get the username from the verified token

      if (!cart.length) {
          return res.status(400).json({ message: 'Datos carrito faltantes.' });
      }

      // Load user data from users.json
      const usersFilePath = path.join(__dirname, '../data/users/users.json');
      fs.readFile(usersFilePath, 'utf8', async (err, data) => {
          if (err) {
              console.error('Error reading users file:', err);
              return res.status(500).json({ message: 'Error al leer los datos de usuarios.' });
          }

          try {
              const users = JSON.parse(data);
              const user = users.find(user => user.username === username);

              if (!user) {
                  return res.status(404).json({ message: 'Usuario no encontrado.' });
              }

              // Enhance cart data with product details
              const detailedCart = [];
              for (const item of cart) {
                  const productDetails = await fetchProductDetails(item.productId);
                  if (productDetails) {
                      detailedCart.push({
                          productId: productDetails.productId,
                          imageUrl: productDetails.imageUrl,
                          quantity: item.quantity,
                          price: productDetails.price
                      });
                  } else {
                      console.warn(`Product ID ${item.productId} not found.`);
                  }
              }

              // Generate the invoice PDF
              generateInvoicePDF(user, detailedCart, Date.now())
                  .then(async (filePath) => {
                      // Send the invoice email to the user and yourself
                      await sendInvoiceEmail(user, filePath);
                      res.status(200).json({ message: 'Exito! \nFactura generada y enviada correctamente.' });
                  })
                  .catch(err => {
                      console.error('Error generating invoice:', err);
                      res.status(500).json({ message: 'Error al generar la factura.' });
                  });
          } catch (parseError) {
              console.error('Error parsing users data:', parseError);
              return res.status(500).json({ message: 'Error al procesar los datos de usuarios.' });
          }
      });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Error al procesar el pago.' });
  }
});


// ========================================== //
// =========== CAMBIO CONTRASEÑA =========== //
// ======================================== //

const fsP = require('fs').promises;
const usersFilePath = path.join(__dirname, '../data/users/users.json');

app.post('/auth/reset-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username; // Extracted from the token

  try {
      const data = await fsP.readFile(usersFilePath, 'utf-8');
      const users = JSON.parse(data);
      const user = users.find(user => user.username.toLowerCase() === username.toLowerCase());

      if (!user) return res.json({ message: "User not found." });

      if (!user.password || !currentPassword) {
          console.log("Either current password or stored hashed password is missing.");
          return res.json({ message: "Error! Contraseña actual vacía." });
      }

      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      if (!isMatch) return res.json({ message: "Error! Contraseña actual incorrecta." });

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      user.password = hashedNewPassword;

      await fsP.writeFile(usersFilePath, JSON.stringify(users, null, 2));
      res.json({ message: "Exito! Contraseña actualizada correctamente!" });
  } catch (error) {
      console.error("Error updating password:", error); 
      res.status(500).json({ message: "Error! No se ha podido actualizar tu contraseña." });
  }
});


app.listen(8000, () => console.log('Server running on http://localhost:8000'));
