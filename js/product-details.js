
function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const productId = urlParams.get('id');

    if (!category || !productId) {
        document.getElementById('product-details').innerText = 'Producto no encontrado.';
        return;
    }

    fetch(`../data/products/${category}.json`)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                displayProduct(product, category);
            } else {
                document.getElementById('product-details').innerText = 'Producto no encontrado.';
            }
        })
        .catch(error => console.error('Error loading product:', error));
}

function displayProduct(product, category) {
    // Update the page title
    document.title = `${product.name} - AURIDAL S.L.`;

    // Update the breadcrumb navigation
    document.getElementById('breadcrumb-category').textContent = capitalizeFirstLetter(category);
    document.getElementById('breadcrumb-category').href = `../producto/${category}.html`;
    document.getElementById('breadcrumb-product').textContent = product.name;

    // Update the product name and description
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;

    // Update the main product image and thumbnails only if there are images
    if (product.images && product.images.length > 0) {
        document.getElementById('main-product-image').src = product.images[0];

        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const imagesHtml = product.images.map((imgSrc, index) => `
            <img src="${imgSrc}" alt="${product.name} ${index + 1}" class="thumbnail-image" onclick="changeMainImage('${imgSrc}')">
        `).join('');
        
        thumbnailContainer.innerHTML = imagesHtml;
    } else {
        // Handle if no images are provided
        document.getElementById('main-product-image').src = '../images/hero-image.png';  // You can set a default image here
    }

    // Dynamically update the product details
    const productDetails = `
        <h2>${product.name}</h2>
        <ul>
            <li><strong>Material:</strong> ${product.details.material}</li>
            <li><strong>Ancho:</strong> ${product.details.dimensions.ancho} cm</li>
            <li><strong>Largo:</strong> ${product.details.dimensions.largo} cm</li>
            <li><strong>Rebajo:</strong> ${product.details.dimensions.rebajo} cm</li>
            <div class="quantity-selector">
                <label for="quantity">Metros:</label>
                <div id="quantity-alert" class="quantity-alert"></div> <!-- Message will appear here -->
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn decrease">-</button>
                    <input type="number" id="quantity" name="quantity" min="${product.min_meters}" max="${product.max_meters || ''}" value="${product.min_meters}" step="${product.jump}">
                    <button type="button" class="quantity-btn increase">+</button>
                </div>
            </div>
        </ul>
        <a href="../login.html"><button class="button-add-to-cart">Añadir al Carrito</button></a>
    `;
    
    // Append product details to the correct element
    document.querySelector('.product-info').innerHTML = productDetails;

    // Get product-specific values
    const minMeters = product.min_meters;
    const maxMeters = product.max_meters || Infinity; // Set to a very large number if no max_meters is defined
    const jump = product.jump;
    const availableMeters = product.details.availability; // Available meters for the product

    // After appending the product details, add the event listeners to the quantity buttons
    const plus = document.querySelector(".quantity-btn.increase");
    const minus = document.querySelector(".quantity-btn.decrease");
    const quantityInput = document.getElementById('quantity');
    const alertMessage = document.getElementById('quantity-alert'); // Where the alert message will be displayed

    // Function to show alert message
    function showAlert(message, icon = '⚠️') {
        alertMessage.innerHTML = `<span class="icon">${icon}</span> ${message}`;
        alertMessage.style.color = 'black'; // You can style the message as needed
    }

    // Function to clear alert message
    function clearAlert() {
        alertMessage.textContent = ''; // Clear the alert message
    }

    // Increase quantity when plus button is clicked
    plus.addEventListener('click', function() {
        const currentQuantity = parseInt(quantityInput.value);
        const newQuantity = currentQuantity + jump;
    
        // Check if newQuantity exceeds either the maxMeters or availableMeters
        if (newQuantity <= availableMeters && newQuantity <= maxMeters) {
            quantityInput.value = newQuantity;
            clearAlert(); // Clear any alert message if the action is valid
        } else if (newQuantity > availableMeters) {
            showAlert(`No se permiten pedidos de menos de ${minMeters} metros.`, '☹️');
            quantityInput.value = availableMeters; // Set to available meters if exceeded
        } else if (newQuantity > maxMeters) {
            showAlert(`No se permiten pedidos de más de ${minMeters} metros.`, '☹️');
            quantityInput.value = maxMeters; // Set to max meters if exceeded
        }
    });

    // Decrease quantity when minus button is clicked
    minus.addEventListener('click', function() {
        const currentQuantity = parseInt(quantityInput.value);
        
        // Ensure the new quantity is greater than or equal to min meters
        if (currentQuantity > minMeters) {
            const newQuantity = currentQuantity - jump;
            
            // Ensure the quantity doesn't go below the minimum allowed
            if (newQuantity >= minMeters) {
                quantityInput.value = newQuantity;
                clearAlert(); // Clear any alert message if the action is valid
            }
        } else {
            showAlert(`No se permiten pedidos de menos de ${minMeters} metros.`, '☹️');
        }
    });

    quantityInput.addEventListener('input', function() {
        const currentQuantity = parseInt(quantityInput.value);
    
        if (currentQuantity < minMeters) {
            showAlert(`No se permiten pedidos de menos de ${minMeters} metros.`, '☹️');
            quantityInput.value = minMeters; // Reset to minimum allowed
        } else if (currentQuantity > maxMeters) {
            showAlert(`No se permiten pedidos de más de ${minMeters} metros.`, '☹️');
            quantityInput.value = maxMeters; // Reset to maximum allowed
        } else if (currentQuantity > availableMeters) {
            showAlert(`Metros en stock insuficientes! Contáctanos para encargarlo.`, '☹️');
            quantityInput.value = availableMeters; // Reset to available meters
        } else {
            clearAlert(); // Clear any alert if the quantity is valid
        }
    });
}

function showAlert(message, icon = '⚠️') {
    alertMessage.innerHTML = `<span class="icon">${icon}</span> ${message}`;
    alertMessage.style.color = 'black'; // You can style the message as needed
}