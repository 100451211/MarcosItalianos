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
    document.getElementById('breadcrumb-category').href = `../categories/${category}.html`;
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
                <button class="nav-button prev-button" id="prev-button">&#8249;</button>
                <button class="nav-button next-button" id="next-button">&#8250;</button>
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
        <a href="../login.html"><button class="button-add-to-cart">Añadir al Carrito</button></a>
    `;
    
    document.querySelector('.product-info').innerHTML += productDetails;

    // Add navigation buttons
    const navigationButtonsHtml = `
        <div class="nav-container">
            <button class="nav-button prev-button" onclick="showPreviousImage()">&#8249;</button>
            <button class="nav-button next-button" onclick="showNextImage()">&#8250;</button>
        </div>
    `;
    
    document.querySelector('.image-container').insertAdjacentHTML('beforeend', navigationButtonsHtml);


    const productCare = `
        <div>
            <p>${product.cuidado}</p>
        </div>
    `;

    document.querySelector('.product-care').innerHTML += productCare;


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

    // Create the carousel container
    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrapper');

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

    carouselWrapper.appendChild(carouselContainer);
    similarProductsSection.appendChild(carouselWrapper);

    // Add navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.classList.add('carousel-prev');
    prevArrow.innerHTML = '&#8249;';
    similarProductsSection.appendChild(prevArrow);

    const nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = '&#8250;';
    similarProductsSection.appendChild(nextArrow);

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
    const maxPosition = Math.ceil(totalItems / itemsToScroll) * itemsToScroll - itemsToShow;

    // Handle "next" arrow click
    nextArrow.addEventListener('click', () => {
        if (position < maxPosition) {
            position += itemsToScroll;
            moveCarousel();
        }
    });

    // Handle "prev" arrow click
    prevArrow.addEventListener('click', () => {
        if (position > 0) {
            position -= itemsToScroll;
            moveCarousel();
        }
    });

    // Function to move the carousel
    function moveCarousel() {
        carouselContainer.style.transform = `translateX(-${(position * itemWidth)}%)`;
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
                position += itemsToScroll;
                moveCarousel();
            }
        } else if (swipeDistance < -50) { // Swipe right
            if (position > 0) {
                position -= itemsToScroll;
                moveCarousel();
            }
        }
    }
}

function redirectToProductPage(productId, category) {
    window.location.href = `product.html?category=${category}&id=${productId}`;
}




