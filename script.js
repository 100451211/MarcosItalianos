let cart = [];
let total = 0;

// Añadir productos al carrito
function addToCart(product, price) {
  cart.push({ product, price });
  total += price;
  updateCart();
  alert(`${product} añadido a la cesta.`);
}

// Actualiza el carrito
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  if (cartItems) {
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
      cartItems.innerHTML += `<p>${item.product} - €${item.price} <button onclick="removeFromCart(${index})">Eliminar</button></p>`;
    });
    document.getElementById('cart-total').textContent = `€${total}`;
  }
}

// Eliminar productos del carrito
function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}

// Filtrar productos por atributos
function filterProducts() {
  const style = document.getElementById('style-filter').value;
  const material = document.getElementById('material-filter').value;
  const color = document.getElementById('color-filter').value;

  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach((item) => {
    const itemStyle = item.getAttribute('data-style');
    const itemMaterial = item.getAttribute('data-material');
    const itemColor = item.getAttribute('data-color');

    if ((style === '' || itemStyle === style) &&
        (material === '' || itemMaterial === material) &&
        (color === '' || itemColor === color)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Asigna eventos a los filtros
document.getElementById('style-filter').addEventListener('change', filterProducts);
document.getElementById('material-filter').addEventListener('change', filterProducts);
document.getElementById('color-filter').addEventListener('change', filterProducts);
