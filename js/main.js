// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get('query'); // This will return the search query, or null if not present
}

// ---- search-results.html script content ----
// Function to handle search bar toggle
function toggleSearchBar(event) {
    event.preventDefault(); // Prevent default behavior on button click
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.log("No search input found!");
        return; // Exit if searchInput is not found
    }else{
        console.log("searchInput found!")
    }

    if (searchInput.classList.contains('visible')) {
        const searchText = searchInput.value.trim();
        if (searchText) {
            // Perform the search if there's a query, redirecting to the search-results page
            window.location.href = `../search-results.html?query=${encodeURIComponent(searchText)}`;
        } else {
            // Close the search bar if it's open and no search text is entered
            searchInput.classList.remove('visible'); // Hide the input field
            searchInput.value = ''; // Optionally clear the search bar input
        }
    } else {
        // Show the search bar and focus the input
        searchInput.classList.add('visible');
        searchInput.focus(); // Focus the input for typing
    }
}

// Function to hide search bar when clicking outside
function hideSearchBarIfClickedOutside(event) {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (searchInput && searchButton) {
        // If the search input is visible and the click is outside both the search input and the search button
        if (searchInput.classList.contains('visible') && 
            !searchInput.contains(event.target) && 
            !searchButton.contains(event.target)) {
            searchInput.classList.remove('visible'); // Hide the search bar
            searchInput.value = ''; // Optionally clear the search bar input
        }
    }
}
// Lógica para abrir, cerrar barra de búsqueda y obtener resultados.
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchInput) {
    // Event listener to toggle search bar visibility on button click
    searchButton.addEventListener('click', function(e) {
        searchInput.classList.add('visible');
        console.log("Search button clicked!");
        toggleSearchBar(e); // Pass the event to toggleSearchBar
    });

    // Event listener to hide search bar when clicking outside
    document.addEventListener('click', hideSearchBarIfClickedOutside);

    // Optional: Trigger search on 'Enter' key press in the search input field
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form behavior
            const searchText = e.target.value.trim();
            if (searchText) {
                window.location.href = `../search-results.html?query=${encodeURIComponent(searchText)}`;
            }
        }
    });
}

// ---- natural.html script content ----

// Individual view of product 
function redirectToProduct(productId, category) {
    window.location.href = `product.html?id=${productId}&category=${category}`;
}

// Function to handle image navigation
function handleClick(event, button, direction) {
    event.preventDefault(); // Prevent default action (if any)
    event.stopPropagation(); // Stop the event from bubbling up to the parent div

    const productItem = button.parentElement; // Get the parent container (the product item)
    const carousel = productItem.querySelector('.carousel'); // Find the carousel within the product item
    const items = carousel.querySelectorAll('.item'); // Get all images
    let currentIndex = 0;

    // Find the current visible image
    items.forEach((item, index) => {
        if (window.getComputedStyle(item).display !== "none") {
            currentIndex = index;
        }
    });

    // Determine the next index based on the button clicked
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % items.length; // Move to the next image, loop back if needed
    } else if (direction === 'previous') {
        currentIndex = (currentIndex - 1 + items.length) % items.length; // Move to the previous image, loop back if needed
    }

    // Hide all items
    items.forEach(item => {
        item.style.display = 'none';
    });

    // Show the new current item
    items[currentIndex].style.display = 'block';
}


/* =======================================
   General Script (From script.js)
======================================= */
// -------------------------------------------------------------------------------------------

/* General - Fondo con imagenes en bucle y ajuste de colores */
// Carousel functionality and changing color header
const heroImages = document.querySelectorAll('.hero-image'); // Get all hero images
const logo = document.querySelector('.logo'); // Get the logo
const menuLinks = document.querySelectorAll('.menu a'); // Get all menu links
const dropdownIcons = document.querySelectorAll('.menu svg path'); // Get dropdown icons
const searchIcon = document.querySelector('#searchButton svg'); // Get search icon
let currentIndex = 0; // Start with the first image
let transitioning = false; // To prevent multiple transitions

// Array of background-specific color schemes (one per image)
const colorSchemes = [
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#333' },   // For the first image
    { headerColor: 'white', textColor: 'white', dropdownBgColor: '#333' },   // For the second image
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#333' },   // For the third image
];

// Function to change hero background and colors
function changeHeroBackground() {
    console.log("heroImages: "+heroImages);
    if (heroImages > 0){
        // Remove previous flag to prevent multiple transitions
        if (transitioning) return;
        transitioning = true; // Set flag to prevent double transitions

        const currentImage = heroImages[currentIndex]; // Get current image
        let nextIndex = (currentIndex + 1) % heroImages.length; // Next image index
        const nextImage = heroImages[nextIndex]; // Next image

        // Remove the active class from the current image
        // Check if the current image exists before removing the class
        if (currentImage) {
            // Remove the active class from the current image
            currentImage.classList.remove('active');
        } else {
            console.log(currentImage.classList)
            console.log("No active image found.");
        }
        
        // Add the active class to the next image
        nextImage.classList.add('active');

        // Update colors based on the next image
        const { headerColor, textColor, dropdownBgColor } = colorSchemes[nextIndex];

        // Update logo and menu link colors
        logo.style.color = textColor;
        menuLinks.forEach(link => {
            link.style.color = textColor;
        });

        // Update dropdown icon colors
        dropdownIcons.forEach(icon => {
            icon.setAttribute('fill', textColor);
        });

        // Update the dropdown background color
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        dropdownContents.forEach(dropdown => {
            dropdown.style.backgroundColor = dropdownBgColor;
        });

        // Update search icon color
        searchIcon.setAttribute('stroke', textColor);

        // Update menu icon color too
        menuSvg.setAttribute('stroke', textColor); // Change the color of the SVG icon

        // Wait for the transition to finish before allowing the next one
        setTimeout(() => {
            // Update current index
            currentIndex = nextIndex;
            transitioning = false; // Reset the transition flag
        }, 1000); // Match the duration of the transition (1 second)
    }else{
        console.log("No hero-images element found!");
    }
}

// Initialize the first image as active
document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;

    // Ensure there are images to work with
    if (heroImages.length > 0) {
        // Initialize the first image as active
        heroImages[currentIndex].classList.add('active'); // Set first image visible
    } else {
        console.warn('No images found!');
    }
});
// heroImages[currentIndex].classList.add('active'); // Set first image visible

// Set an interval to change the background every 4 seconds
setInterval(changeHeroBackground, 4000);

// -------------------------------------------------------------------------------------------

/* General - Ajusta color barra de navegación en scroll */
window.addEventListener('scroll', function() {
    const header = document.querySelector('header'); // Select the header element
    const heroSection = document.querySelector('.hero'); // Select the hero section or the top section
    const heroHeight = heroSection.offsetHeight; // Get the height of the hero section
    
    if (window.scrollY > heroHeight) {
        header.style.backgroundColor = 'white'; // Change the header background to white
    } else {
        header.style.backgroundColor = 'transparent'; // Reset header background when not scrolling over an image
    }
});

// -------------------------------------------------------------------------------------------

/* General - Barra de búsqueda */

// Permite aparicion de barra de busqueda click en icono
document.getElementById('searchButton').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default behavior if inside a form
    toggleSearchBar(e); // Pass the event to toggleSearchBar
});

// Cierra barra de busqueda cuando click fuera 
document.addEventListener('click', hideSearchBarIfClickedOutside);

// Permite busqueda con darle a "Enter"
document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form behavior

        const searchText = e.target.value.trim();
        if (searchText) {
            window.location.href = `http://localhost:8000/search-results.html?query=${encodeURIComponent(searchText)}`;
        }
    }
});

// -------------------------------------------------------------------------------------------
 
/* General -  Barra de navegacion lateral */
document.addEventListener('DOMContentLoaded', function() {
    // Side Menu - Get elements
    const menuIcon = document.getElementById('menuIcon');
    const sideMenu = document.getElementById('sideMenu');
    const closeBtn = document.getElementById('closeBtn');
    const logo = document.querySelector('.logo'); // Select the logo outside the side menu

    // Ensure the menuIcon exists
    if (menuIcon) {
        // Open the side menu when the menu icon is clicked
        menuIcon.addEventListener('click', function () {
            console.log('Menu icon clicked'); // Debugging: Check if the click event fires
            sideMenu.style.width = '290px'; // Show the side menu
            menuIcon.style.display = 'none'; // Hide the menu icon
            logo.style.display = 'none'; // Hide the logo in the main header
        });
    }

    // Ensure the closeBtn exists
    if (closeBtn) {
        // Close the side menu when the close button is clicked
        closeBtn.addEventListener('click', function () {
            sideMenu.style.width = '0'; // Hide the side menu
            menuIcon.style.display = 'inline-block'; // Show the menu icon again
            logo.style.display = 'block'; // Show the logo in the main header again
        });
    }
});

// -------------------------------------------------------------------------------------------

/* Producto - [Móvil] Navegacion por imagenes */
// Add swipe functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.list-wrapper').forEach(wrapper => {
        console.log('Event listeners attached to', wrapper);
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        wrapper.addEventListener('touchstart', (e) => {
            console.log("Touch started:", e.touches[0].clientX);
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            console.log("Touch moved:", currentX);
        });

        wrapper.addEventListener('touchend', () => {
            console.log("Touch ended. StartX:", startX, " CurrentX:", currentX);
            if (!isDragging) return;
            isDragging = false;

            const list = wrapper.querySelector('.list');
            const item = list.querySelector('.item');
            const itemWidth = item.offsetWidth;

            if (startX - currentX > 50) {
                // Swiped left, show next image
                list.scrollBy({ left: itemWidth, behavior: 'smooth' });
            } else if (currentX - startX > 50) {
                // Swiped right, show previous image
                list.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        });
    });
});


/* =======================================
   Search Results Script (From search-results.js)
======================================= */

// Function to handle the Enter key press
function handleEnterKeyPress(event) {
    if (event.key === 'Enter') { // Check if the Enter key is pressed
        event.preventDefault(); // Prevent the default form submission behavior
        const searchInput = document.getElementById('searchInput');
        const searchText = searchInput.value.trim();

        if (searchText) {
            // Redirect to the search results page with the search term in the URL
            window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`;
        } else {
            alert('Please enter something to search.');
        }
    }
}

// Function to update the breadcrumb with the search term
function updateBreadcrumbWithSearchTerm(searchTerm) {
    const breadcrumbSearchTerm = document.getElementById('breadcrumb-search-term');
    if (breadcrumbSearchTerm && searchTerm) {
        // Insert the search term into the breadcrumb
        breadcrumbSearchTerm.textContent = `"${searchTerm}"`;
    }
}

// Get the search term and update the breadcrumb
const searching = getQueryParams();
if (searching) {
    updateBreadcrumbWithSearchTerm(searching);
}

// Function to fetch products from all categories
async function fetchAllProducts() {
    const categories = ['colores', 'clasico', 'moderno', 'natural'];
    let allProducts = [];

    for (let category of categories) {
        try {
            const response = await fetch(`../data/${category}.json`);
            const products = await response.json();
            allProducts = allProducts.concat(products); // Add products to the list
        } catch (error) {
            console.error(`Error fetching ${category} products:`, error);
        }
    }

    return allProducts;
}

// Function to display search results (with optional search term)
async function displaySearchResults(searchTerm) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const noResultsContainer = document.getElementById('noResultsContainer');

    // Use the passed search term or get it from the URL
    searchTerm = (typeof searchTerm === 'string') ? searchTerm : getQueryParams(); // Fallback to URL if no param provided

    // If no search term is found, do not proceed
    if (!searchTerm) {
        console.log("No search term found."); // Debugging
        return;
    }

    // Fetch products from all categories
    const allProducts = await fetchAllProducts();

    console.log("Search Term: "+ searchTerm + " Type: "+ typeof searchTerm);

    // Modify the filtering logic to match any part of the product ID or name
    const filteredProducts = allProducts.filter(product => {
        console.log("Product ID: " + product.id); // Logging product ID
        return product.id.toLowerCase().includes(String(searchTerm).toLowerCase()) || // Match part of the ID
               product.name.toLowerCase().includes(String(searchTerm).toLowerCase());  // Match part of the name
    });

    if (filteredProducts.length > 0) {
        console.log("filteredProd: "+filteredProducts.length);
        // Clear previous search results
        searchResultsContainer.innerHTML = '';

        // Display the filtered products
        filteredProducts.forEach(product => {
            // Corregiir onclick="redirectToProduct('6006', 'moderno')>
            const productHTML = ` 
                <div class="product-item" onclick="redirectToProduct('${product.id}', '${product.category}')>
                    <div class="list-wrapper">
                        <ul class="list carousel">
                            ${product.images.map(imgSrc => `
                                <li class="item"><img src="${imgSrc}" alt="${product.name}" class="carousel-image"></li>
                            `).join('')}
                        </ul>
                        <!-- Update the buttons to pass the event object -->
                        <button onclick="handleClick(event, this, 'previous')" class="button button--previous" type="button">❮</button>
                        <button onclick="handleClick(event, this, 'next')" class="button button--next" type="button">❯</button>
                    </div>
                    <h2>${product.name}</h2>
                </div>
            `;
            searchResultsContainer.innerHTML += productHTML;
        });
    } else {
        if (noResultsContainer) {
            // Display a message if no products are found
            noResultsContainer.innerHTML = `
                <div class="no-results-container">
                    <img src="../images/noResults.jpg" alt="No Results" class="no-results">
                    <p>No hemos encontrado productos con la referencia "${searchTerm}".</p>
                </div>`;
        } else {
            console.warn('No results container element found.');
        }
    }
}


// Initialize search results on page load if a query is present
const searchTerm = getQueryParams();
if (searchTerm) {
    displaySearchResults(searchTerm);
}

// Add an event listener to detect the Enter key press on the search input
document.getElementById('searchInput').addEventListener('keypress', handleEnterKeyPress);

// Call the function when the page loads
window.onload = displaySearchResults;


/* =======================================
   Product Script (From product.js)
======================================= */
// Fetch product data from the correct JSON file based on the category
async function loadProductPage() {
    // Get the product ID and category from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const category = urlParams.get('category');
    console.log("urlParams: "+productId+" "+category)

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
        document.addEventListener('DOMContentLoaded', function() {
            // If no valid category is found, show an error message
            const productContainer = document.getElementById('product-container');
            if (productContainer) {
                productContainer.innerHTML = `<h1>Categoría no válida</h1>`;
            } else {
                console.warn('Element #product-container not found.');
            }
        });
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
