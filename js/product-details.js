function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    // const category = urlParams.get('category');
    const cat = urlParams.get('category');
    const productId = urlParams.get('id');

    const category =  cat.replace("products/", "");
    console.log("URL error, fixed. Loading products/"+ category+"/ file");

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
                loadSimilarProducts(productId, category, products); // Load similar products
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

    let currentImageIndex = 0;  // Track the current image index

    // Function to update the main product image based on index
    function updateMainImage(index) {
        const mainImageElement = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail-image');
        const productImages = product.images;

        // Update the main image
        if (productImages && productImages.length > 0) {
            mainImageElement.src = productImages[index];
            currentImageIndex = index;  // Update the current index
        }

        // Remove active class from all thumbnails
        thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active'));

        // Add active class to the current thumbnail
        thumbnails[index].classList.add('active');
    }

    // Function to handle "next" button click
    function showNextImage() {
        if (currentImageIndex < product.images.length - 1) {
            updateMainImage(currentImageIndex + 1);
        } else {
            updateMainImage(0);  // Wrap around to first image
        }
    }

    // Function to handle "previous" button click
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            updateMainImage(currentImageIndex - 1);
        } else {
            updateMainImage(product.images.length - 1);  // Wrap around to last image
        }
    }

    // Function to toggle full screen
    function toggleFullScreen() {
        const mainImageElement = document.getElementById('main-product-image');
        
        if (!document.fullscreenElement) {
            if (mainImageElement.requestFullscreen) {
                mainImageElement.requestFullscreen();
            } else if (mainImageElement.mozRequestFullScreen) { // Firefox
                mainImageElement.mozRequestFullScreen();
            } else if (mainImageElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                mainImageElement.webkitRequestFullscreen();
            } else if (mainImageElement.msRequestFullscreen) { // IE/Edge
                mainImageElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Add event listeners for both full-screen icon click and image double-click
    document.getElementById('main-product-image').addEventListener('dblclick', toggleFullScreen);
    document.querySelector('.fullscreen-icon').addEventListener('click', toggleFullScreen);
    

    // Add event listeners for navigation in full-screen mode
    document.addEventListener('keydown', (e) => {
        if (document.fullscreenElement) {
            if (e.key === 'ArrowRight') {
                showNextImage();  // Navigate to the next image
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();  // Navigate to the previous image
            }
        }
    });

    // Add an "X" button for closing full-screen
    const closeButtonHtml = `
        <div id="fullscreen-close-button"">&times;</div>
    `;
    document.querySelector('.main-image-wrapper').insertAdjacentHTML('beforeend', closeButtonHtml);

    // Function to exit full-screen when the "X" button is clicked
    function closeFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    // Attach event listener to "X" button
    document.getElementById('fullscreen-close-button').addEventListener('click', closeFullScreen);

    // Event listener to show the "X" button in full-screen mode
    document.addEventListener('fullscreenchange', () => {
        const closeButton = document.getElementById('fullscreen-close-button');
        if (document.fullscreenElement) {
            closeButton.style.display = 'block';
        } else {
            closeButton.style.display = 'none';
        }
    });

    // Update the main product image and thumbnails only if there are images
    if (product.images && product.images.length > 0) {
        document.getElementById('main-product-image').src = product.images[0];  // Set the first image as default
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const imagesHtml = product.images.map((imgSrc, index) => `
            <img src="${imgSrc}" alt="${product.name} ${index + 1}" class="thumbnail-image ${index === 0 ? 'active' : ''}" onclick="updateMainImage(${index})">
        `).join('');
        
        thumbnailContainer.innerHTML = imagesHtml;
        
        // Add navigation buttons
        const navigationButtonsHtml = `
            <div class="nav-container">
                <button class="prev-button" id="prev-button">&#8249;</button>
                <button class="next-button" id="next-button">&#8250;</button>
            </div>
        `;
        
        document.querySelector('.main-image-wrapper').insertAdjacentHTML('beforeend', navigationButtonsHtml);

        // Attach event listeners to buttons
        document.getElementById('prev-button').addEventListener('click', showPreviousImage);
        document.getElementById('next-button').addEventListener('click', showNextImage);
    } else {
        // Handle if no images are provided
        document.getElementById('main-product-image').src = '../images/hero-image.png';  // Set a default image
    }

    // Product details section with quantity controls
    const productDetails = `
        <ul>
            <li><strong>Material:</strong> ${product.details.material}</li>
            <li><strong>Ancho:</strong> ${product.details.dimensions.ancho} cm</li>
            <li><strong>Largo:</strong> ${product.details.dimensions.largo} cm</li>
            <li><strong>Rebajo:</strong> ${product.details.dimensions.rebajo} cm</li>
            <li id="priceMessage"><strong>Precio:</strong> Inicia sesión para visualizar precios.</li>
            <div class="quantity-selector">
                <label for="quantity">Metros:</label>
                <div id="quantity-alert" class="quantity-alert"></div>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn decrease">-</button>
                    <input type="number" id="quantity" name="quantity" min="${product.min_meters}" max="${product.max_meters || ''}" value="${product.min_meters}" step="${product.jump}">
                    <button type="button" class="quantity-btn increase">+</button>
                </div>
            </div>
        </ul>
        <a><button id="addToCartButton" class="button-add-to-cart" onclick="addToCart()"> Añadir al Carrito</button></a>
    `;
    
    document.querySelector('.product-info').innerHTML += productDetails;

    const productCare = `
        <div>
            <p>${product.cuidado}</p>
        </div>
    `;

    document.querySelector('.product-care').innerHTML += productCare;

    const addToCart = document.getElementById('addToCartButton');
    if (addToCart){
        addToCart.addEventListener('click', function() {
            // Store the current URL in localStorage
            localStorage.setItem('redirectAfterLogin', window.location.href);
        
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }else{
        console.log("No add-to-cart id found!");
    }


    /* ======================================== */
    /* ========= CANTIDAD DE METROS =========== */
    /* ======================================== */

    // Variables for handling quantity
    const minMeters = product.min_meters;
    const maxMeters = product.max_meters || Infinity;
    const jump = product.jump;
    const availableMeters = product.details.availability;

    // Handle quantity buttons and input
    const plus = document.querySelector(".quantity-btn.increase");
    const minus = document.querySelector(".quantity-btn.decrease");
    const quantityInput = document.getElementById('quantity');
    const alertMessage = document.getElementById('quantity-alert');

    // Show alert message
    function showAlert(message, icon = '⚠️') {
        alertMessage.innerHTML = `<span class="icon">${icon}</span> <p>${message}</p>`;
        alertMessage.style.display = 'flex';
    }

    // Clear alert message
    function clearAlert() {
        alertMessage.innerHTML = '';
        alertMessage.style.display = 'none';
    }

    // Increase quantity
    plus.addEventListener('click', function() {
        let currentQuantity = parseInt(quantityInput.value);

        if ((currentQuantity - minMeters) % jump !== 0) {
            currentQuantity = Math.round((currentQuantity - minMeters) / jump) * jump + minMeters;
            quantityInput.value = currentQuantity;
        }

        const newQuantity = currentQuantity + jump;
    
        if (newQuantity <= availableMeters && newQuantity <= maxMeters) {
            quantityInput.value = newQuantity;
            clearAlert();
        } else if (newQuantity > availableMeters) {
            quantityInput.value = availableMeters;
            showAlert(`Metros en stock insuficientes! Contáctanos para encargarlo.`, '⚠️');
        } else if (newQuantity > maxMeters) {
            quantityInput.value = maxMeters;
            showAlert(`No se permiten pedidos de más de ${maxMeters} metros.`, '⚠️');
        }
    });

    // Decrease quantity
    minus.addEventListener('click', function() {
        const currentQuantity = parseInt(quantityInput.value);

        if (currentQuantity > minMeters) {
            const newQuantity = currentQuantity - jump;
            if (newQuantity >= minMeters) {
                quantityInput.value = newQuantity;
                clearAlert();
            }
        } else {
            showAlert(`No se permiten pedidos de menos de ${minMeters} metros.`, '⚠️');
        }
    });

    // Sanitize input
    quantityInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, ''); 
    });

    quantityInput.addEventListener('blur', function() {
        const currentQuantity = parseInt(quantityInput.value);

        if (isNaN(currentQuantity)) {
            quantityInput.value = minMeters;
            showAlert('Por favor introduce un número válido.', '⚠️');
        } else if (currentQuantity < minMeters) {
            quantityInput.value = minMeters;
            showAlert(`No se permiten pedidos de menos de ${minMeters} metros.`, '⚠️');
        } else if (currentQuantity > maxMeters) {
            quantityInput.value = maxMeters;
            showAlert(`No se permiten pedidos de más de ${maxMeters} metros.`, '⚠️');
        } else if (currentQuantity > availableMeters) {
            quantityInput.value = availableMeters;
            showAlert(`Metros en stock insuficientes! Contáctanos para encargarlo.`, '⚠️');
        } else if ((currentQuantity - minMeters) % jump !== 0) {
            const nearestValidQuantity = Math.round((currentQuantity - minMeters) / jump) * jump + minMeters;
            quantityInput.value = nearestValidQuantity;
        } else {
            clearAlert();
        }
    });   

}

function loadSimilarProducts(productId, category, products) {
    const similarProductsSection = document.querySelector('.similar-products');

    // Filter out the current product from the list of products
    const similarProducts = products.filter(product => product.id !== productId);

    if (similarProducts.length === 0) {
        similarProductsSection.innerText = 'No hay productos similares disponibles.';
        return;
    }

    // Create the carousel wrapper
    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrapper');

    const carouselInnerWrapper = document.createElement('div');
    carouselInnerWrapper.classList.add('carousel-inner-wrapper'); // For positioning arrows inside

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel-container');

    similarProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');

        // Add product content (image, name)
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <h3>${product.name}</h3>
        `;

        // Make the entire div clickable
        productDiv.addEventListener('click', () => {
            window.location.href = `product.html?category=${category}&id=${product.id}`;
        });

        carouselContainer.appendChild(productDiv);
    });

    carouselInnerWrapper.appendChild(carouselContainer);
    carouselWrapper.appendChild(carouselInnerWrapper);
    similarProductsSection.appendChild(carouselWrapper);

    // Add navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.classList.add('carousel-prev');
    prevArrow.innerHTML = '&#8249;';

    const nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = '&#8250;';

    carouselWrapper.appendChild(prevArrow); // Add arrows outside carouselInnerWrapper
    carouselWrapper.appendChild(nextArrow); 

    // Add functionality to move the carousel
    let position = 0;
    const itemsToShow = 4;
    const itemsToScroll = 2;
    const itemWidth = 100 / itemsToShow; // Percentage width for each item

    // Set dynamic styles for the carousel
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        item.style.width = `${itemWidth}%`;
    });

    const totalItems = productItems.length;
    const maxPosition = Math.max(0, Math.ceil((totalItems - itemsToShow) / itemsToScroll));

    function updateArrowVisibility() {
        // Hide left arrow if we're at the first position
        prevArrow.style.display = (position === 0) ? 'none' : 'block';
        // Hide right arrow if we're at the last position
        nextArrow.style.display = (position >= maxPosition) ? 'none' : 'block';
    }

    updateArrowVisibility(); // Initial update

    // Handle "next" arrow click
    nextArrow.addEventListener('click', () => {
        if (position < maxPosition) {
            position += 1;
            moveCarousel();
            updateArrowVisibility();
        }
    });

    // Handle "prev" arrow click
    prevArrow.addEventListener('click', () => {
        if (position > 0) {
            position -= 1;
            moveCarousel();
            updateArrowVisibility();
        }
    });

    // Function to move the carousel
    function moveCarousel() {
        carouselContainer.style.transform = `translateX(-${(position * itemWidth * itemsToScroll)}%)`;
    }

    // Add touch/swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;

        if (swipeDistance > 50) { // Swipe left
            if (position < maxPosition) {
                position += 1;
                moveCarousel();
                updateArrowVisibility();
            }
        } else if (swipeDistance < -50) { // Swipe right
            if (position > 0) {
                position -= 1;
                moveCarousel();
                updateArrowVisibility();
            }
        }
    }

    // Conditionally show arrows based on the number of items
    if (totalItems <= 4) {
        // If 4 or fewer items, hide both arrows
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
    } else if (totalItems === 5) {
        // If exactly 5 items, show only the right arrow initially
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'block';
    } else {
        // For more than 5 items, start with both arrows enabled
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'block';
    }
}

function redirectToProductPage(productId, category) {
    window.location.href = `product.html?category=${category}&id=${productId}`;
}

// Update the price based on user login status
async function updatePrice() {
    const category = getQueryParam('category');
    const productId = getQueryParam('id');

    try {
        // Fetch product data
        const response = await fetch(`/data/products/${category}.json`);
        const products = await response.json();
        const product = products.find(p => p.id === productId);

        if (product) {
            const isLoggedIn = await checkIfUserLoggedIn();
            const priceMessage = document.getElementById('priceMessage');

            if (isLoggedIn) {
                priceMessage.textContent = `Precio: ${product.supplier_prices.madrid}€`;
            } else {
                priceMessage.textContent = 'Precio: Inicia sesión para ver los precios.';
            }
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}
// Define the cart array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to check if the user is logged in
async function checkIfUserLoggedIn() {
    const authIcons = document.getElementById('authIcons');  // Get the icons container

    try {
        const response = await fetch('/auth/check-auth');
        const data = await response.json();

        if (data.authenticated) {
            // User is authenticated, show the profile and cart icons
            authIcons.classList.remove('hidden');
            console.log('User is authenticated');
            return true;
        } else {
            // User is not authenticated, hide the profile and cart icons
            authIcons.classList.add('hidden');
            console.log('User is not authenticated');
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        // In case of an error, assume user is not authenticated and hide the icons
        authIcons.classList.add('hidden');
        return false;
    }
}


// Function to add the product to the cart
function addToCart() {
    if (!checkIfUserLoggedIn) {
        // If the user is not logged in, store the current URL and redirect to the login page
        localStorage.setItem('redirectAfterLogin', window.location.href);
        return;
    }

    // User is logged in, proceed to add the product to the cart
    const category = getQueryParam('category');
    const productId = getQueryParam('id');
    const quantityInput = document.getElementById('quantity');  // Get quantity input field
    const quantity = parseInt(quantityInput.value);  // Parse the selected quantity

    if (isNaN(quantity) || quantity < 1) {
        alert('Por favor, seleccione una cantidad válida.');
        return;
    }

    try {
        // Fetch product data
        fetch(`/data/products/${category}.json`)
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);

                if (product) {
                    const cartItem = {
                        id: productId,
                        name: product.name,
                        price: product.supplier_prices.madrid,
                        quantity: quantity  // Use the selected quantity
                    };

                    // Check if item is already in the cart
                    const existingItemIndex = cart.findIndex(item => item.id === productId);
                    if (existingItemIndex > -1) {
                        // Update the quantity if the item is already in the cart
                        cart[existingItemIndex].quantity += quantity;
                    } else {
                        // Add new item to the cart
                        cart.push(cartItem);
                    }

                    // Save the updated cart in localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Update the cart display
                    updateCartDisplay();

                    // Update the cart count indicator
                    updateCartCount();
                }
            })
            .catch(error => console.error('Error añadiendo el producto al carrito:', error));
    } catch (error) {
        console.error('Error añadiendo el producto al carrito:', error);
    }
}


// Function to update the cart display in the sidebar
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cartItemsElement.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <p><strong>${item.name}</strong></p>
                    <p>${item.quantity}m x €${item.price}</p>
                </div>
                <div class="cart-item-total">
                    <p>€${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <!-- Delete button to remove the item from the cart -->
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `).join('');
    }
}