// Fetch product data from the correct JSON file based on the category
async function loadProductPage() {
    // Get the product ID and category from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const category = urlParams.get('category');

    // Determine which JSON file to fetch based on the category
    let jsonFile;
    if (category === 'colores') {
        jsonFile = '../data/colores.json';
    } else if (category === 'clasico') {
        jsonFile = '../data/clasico.json';
    } else if (category === 'moderno') {
        jsonFile = '../data/moderno.json';
    } else if (category === 'natural') {
        jsonFile = '../data/natural.json';
    } else {
        // If no valid category is found, show an error message
        document.getElementById('product-container').innerHTML = `<h1>Categoría no válida</h1>`;
        return;
    }

    // Fetch the product data from the appropriate JSON file
    try {
        const response = await fetch(jsonFile);
        const products = await response.json();

        // Find the product that matches the product ID
        const product = products.find(p => p.id === productId);

        // If the product is found, display it
        if (product) {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = `
                <!-- Breadcrumb Navigation -->
                <div class="breadcrumb">
                    <p>
                        <a href="../index.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 .134l6.571 5.428c.326.27.429.745.245 1.12a.857.857 0 0 1-.794.48H12.86v5.527a.857.857 0 0 1-.857.857h-1.715a.857.857 0 0 1-.857-.857V9.429H6.571v3.857a.857.857 0 0 1-.857.857H4a.857.857 0 0 1-.857-.857V7.163H2.128a.857.857 0 0 1-.794-.48.857.857 0 0 1 .245-1.12L8 .134z"/>
                            </svg>
                        </a>
                        <a href="../product.html"> > Producto</a>
                        <span> > </span>
                        <a href="../${category}.html"> ${category.charAt(0).toUpperCase() + category.slice(1)}</a>
                    </p>
                </div>

                <section class="product-detail">
                    <div class="product-gallery">
                        <div class="carousel">
                            ${product.images.map((img, index) => `<img src="${img}" alt="${product.name}" class="${index === 0 ? 'active' : ''}" data-index="${index}">`).join('')}
                        </div>
                        <div class="thumbnails">
                            ${product.images.map((img, index) => `<img src="${img}" alt="Thumbnail" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">`).join('')}
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h1 class="product-name">${product.name}</h1>
                        <p class="product-price">${product.price}</p>
                        <p class="product-description">${product.description}</p>
                        <ul class="product-details">
                            <li>Material: ${product.details.material}</li>
                            <li>Dimensiones: Ancho: ${product.details.dimensions.width} cm, Largo: ${product.details.dimensions.length} cm, Altura: ${product.details.dimensions.height} cm</li>
                            <li>Disponibilidad: ${product.details.availability}</li>
                        </ul>
                        <button class="add-to-cart">Añadir al carrito</button>
                    </div>
                </section>
            `;

            // After the product details are loaded, apply thumbnail click functionality
            images = document.querySelectorAll('.carousel img'); // Store all images
            const thumbnails = document.querySelectorAll('.thumbnail');

            // Image click handler for full-screen functionality
            images.forEach(image => {
                image.addEventListener('click', () => enterFullScreen(image));
            });

            thumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', () => {
                    // Remove active class from all images and thumbnails
                    images.forEach(image => image.classList.remove('active'));
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));

                    // Add active class to the clicked thumbnail and corresponding image
                    images[index].classList.add('active');
                    thumbnail.classList.add('active');
                });
            });

        } else {
            // If product is not found, show an error message
            document.getElementById('product-container').innerHTML = `<h1>Producto no encontrado</h1>`;
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        document.getElementById('product-container').innerHTML = `<h1>Error al cargar los datos del producto</h1>`;
    }
}

// Initialize the product page
loadProductPage();



// Enter full-screen mode and display the clicked image
function enterFullScreen(image) {
    currentFullscreenIndex = parseInt(image.dataset.index, 10); // Get the current image index
    const fullscreenImage = document.getElementById('fullscreen-image');
    fullscreenImage.src = image.src; // Set the full-screen image source

    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    fullscreenOverlay.style.display = 'flex'; // Show the full-screen overlay
}

// Navigate through the full-screen images
function navigateFullscreen(direction) {
    if (direction === 'next') {
        currentFullscreenIndex = (currentFullscreenIndex + 1) % images.length;
    } else if (direction === 'prev') {
        currentFullscreenIndex = (currentFullscreenIndex - 1 + images.length) % images.length;
    }
    const fullscreenImage = document.getElementById('fullscreen-image');
    fullscreenImage.src = images[currentFullscreenIndex].src; // Update the image in full screen
}

// Exit full-screen mode
function exitFullScreen() {
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    fullscreenOverlay.style.display = 'none'; // Hide the full-screen overlay
}
