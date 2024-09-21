/* ================ GENERALES - USADAS MUCHO ======================= */

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get('query'); // This will return the search query, or null if not present
}

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

/* ================ LÓGICA PARA BARRA DE BÚSQUEDA ======================= */

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
            window.location.href = `../search-results.html?query=${encodeURIComponent(searchText)}`;
        }
    }
});

// -------------------------------------------------------------------------------------------

/* ========== LÓGICA PARA FONDO CAMBIANTE Y AJUSTE DE COLORES  ================= */

/* General - Fondo con imagenes en bucle y ajuste de colores */
// Carousel functionality and changing color header
const heroImages = document.querySelectorAll('.hero-image');
const logo = document.querySelector('.logo');
const menuLinks = document.querySelectorAll('.menu a');
const dropdownIcons = document.querySelectorAll('.menu svg path');
const searchIcon = document.querySelector('#searchButton svg');
let currentIndex = 0;
let transitioning = false;

// Array of background-specific color schemes (one per image)
const colorSchemes = [
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#333' },   // For the first image
    { headerColor: 'white', textColor: 'white', dropdownBgColor: '#333' },   // For the second image
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#333' },   // For the third image
];

// Function to change hero background and colors
function changeHeroBackground() {
    console.log("changeHeroBackground images:", heroImages.length);
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

// Set an interval to change the background every 4 seconds
if (heroImages.length > 0){
    setInterval(changeHeroBackground, 4000);
}else{
    console.log("No hero-images element found!");
}

// -------------------------------------------------------------------------------------------

/* ========== LÓGICA PARA MÓVIL ========== */ 

/* Barra de navegacion lateral */
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

/* Producto - [Móvil] Navegacion por imagenes */
// Function to handle image navigation
function handleClick(event, button, direction) {
    event.preventDefault(); // Prevent default action (if any)
    event.stopPropagation(); // Stop the event from bubbling up to the parent div

    const productItem = button.parentElement; // Get the parent container (the product item)
    const carousel = productItem.querySelector('.carousel'); // Find the carousel within the product item
    const items = carousel.querySelectorAll('.item'); // Get all images
    let thisIndex = 0;

    // Find the current visible image
    items.forEach((item, index) => {
        if (window.getComputedStyle(item).display !== "none") {
            thisIndex = index;
        }
    });

    // Determine the next index based on the button clicked
    if (direction === 'next') {
        thisIndex = (thisIndex + 1) % items.length; // Move to the next image, loop back if needed
    } else if (direction === 'previous') {
        thisIndex = (thisIndex - 1 + items.length) % items.length; // Move to the previous image, loop back if needed
    }

    // Hide all items
    items.forEach(item => {
        item.style.display = 'none';
    });

    // Show the new current item
    items[thisIndex].style.display = 'block';
}
// Add swipe functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if the screen is mobile-sized
    if (window.innerWidth <= 768) {  // 768px is a common breakpoint for mobile devices
        document.querySelectorAll('.product-item').forEach(productItem => {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            let isSwiping = false;

            const wrapper = productItem.querySelector('.list-wrapper');

            // Touch start event - start tracking swipe
            wrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                isSwiping = false;  // Reset swiping flag
            });

            // Touch move event - detect swiping gesture
            wrapper.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;

                if (Math.abs(startX - currentX) > 10) {  // Consider a swipe if movement > 10px
                    isSwiping = true;
                }
            });

            // Touch end event - process swipe or tap
            wrapper.addEventListener('touchend', () => {
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
    }
});

let isTouchMoving = false;

window.addEventListener('touchmove', () => {
    isTouchMoving = true;
});

window.addEventListener('touchend', () => {
    setTimeout(() => {
        isTouchMoving = false;
    }, 100); // Delay to ensure swipe completes
});

document.addEventListener('click', (e) => {
    if (isTouchMoving) {
        e.preventDefault(); // Stop clicks after swiping
        console.log("Click prevented due to touchmove");
    }
});

/* =======================================
   Search Results Script (From search-results.js)
======================================= */

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


/* ============= LOGICA PARA VISTA INDIVIDUAL PRODUCTOS ========================== */

function redirectToProduct(productId, productCategory) {
    console.log("productId:", productId , "- productCategory:", productCategory);
    // Create the redirection URL with both productId and category
    const redirectUrl = `${window.location.origin}/producto/moderno-details.html`;
    console.log("Redirecting to:", redirectUrl);  // Debugging message
    debugger;
    window.location.assign = redirectUrl;  // Use `href` instead of `replace`
}

document.querySelectorAll('.product-item').forEach(productItem => {
    productItem.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');  // Adjust to your structure
        const category = this.getAttribute('data-category');  // Adjust to your structure
        
        redirectToProduct(productId, category);  // Call the function on click
    });
});

// Function to be triggered once the user lands on the product details page
function loadProductDetails() {
    console.log("Window location search:", window.location.search);
    console.log("loadProductDetails function triggered");

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams:", urlParams);
    const productId = urlParams.get('productId');
    const productCategory = urlParams.get('category'); // Get category from the URL

    if (!productId || !productCategory) {
        alert("Product ID or Category is missing!");
        return;
    }

    console.log("loadProductDetails! :)  - Product ID:", productId, "Category:", productCategory);

    // Determine the correct JSON file based on the product category
    let jsonFilePath = '';
    switch (productCategory) {
        case 'moderno':
            jsonFilePath = '../data/moderno.json';
            break;
        case 'clasico':
            jsonFilePath = '../data/clasico.json';
            break;
        case 'colores':
            jsonFilePath = '../data/colores.json';
            break;
        case 'natural':
            jsonFilePath = '../data/natural.json';
            break;
        default:
            alert('Invalid category! ('+productCategory+')');
            return;
    }

    // Fetch product details from the appropriate JSON file
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            const product = data.find(item => item.id === productId);
            if (product) {
                // Populate product details
                document.querySelector('.product-name').textContent = product.name;
                document.querySelector('.product-description').textContent = product.description;
                document.querySelector('.product-price').textContent = product.price.madrid;

                // Populate product gallery
                const galleryContainer = document.querySelector('.product-gallery');
                galleryContainer.innerHTML = '';  // Clear any existing gallery
                product.images.forEach((imageSrc, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imageSrc;
                    imgElement.dataset.index = index;  // Store index for fullscreen navigation
                    imgElement.style.cursor = 'pointer';
                    imgElement.style.width = '100px'; // Set thumbnail size
                    imgElement.addEventListener('click', () => enterFullScreen(imgElement));
                    galleryContainer.appendChild(imgElement);
                });

                // Save references to images for fullscreen navigation
                images = product.images.map((src, index) => ({
                    src,
                    index
                }));
            } else {
                alert("Product not found!");
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}

// // Ensure that the loadProductDetails function is triggered when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("DOM fully loaded and parsed");
//     loadProductDetails();  // Call the function when the DOM is loaded
// });
    
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
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on a product details page (e.g., *-details.html)
    if (window.location.pathname.includes('-details.html')) {
        // Add event listeners for full-screen controls
        const nextFull = document.getElementById('next-image');
        const prevFull = document.getElementById('prev-image');
        const exitFull = document.getElementById('exit-fullscreen');
        if (nextFull){
            nextFull.addEventListener('click', () => navigateFullscreen('next'));
        }else{
            console.log("No element NEXT-FULL found!");
        }

        if (prevFull) {
            prevFull.addEventListener('click', () => navigateFullscreen('prev'));
        }else{
            console.log("No element PREV-FULL found!");
        }
        if (exitFull) {
            exitFull.addEventListener('click', exitFullScreen);
        }else{
            console.log("No element EXIT-FULL found!");
        }
    }
});


