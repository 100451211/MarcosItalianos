/* ======================================== */
/* ========= FONDO CAMBIANTE ============== */
/* ======================================== */
const heroImages = document.querySelectorAll('.hero-image');
const logo = document.querySelector('.logo');
const menuLinks = document.querySelectorAll('.menu a');
const dropdownIcons = document.querySelectorAll('.menu svg path');
const searchIcon = document.querySelector('#searchButton svg');
const profileSvg = document.querySelector("#profileButton svg");
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

    // Update menu icon color too
    profileSvg.setAttribute('stroke', textColor); // Change the color of the SVG icon

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
        console.log('No hero-images element found!');
    }
});

// Set an interval to change the background every 4 seconds
if (heroImages.length > 0){
    setInterval(changeHeroBackground, 4000);
}else{
    console.log("No hero-images element found!");
}


/* ================================================== */
/* =========== SCROLL BARRA NAVEGACIÓN ============== */
/* ================================================== */

// Ajuste color barra de navegación en scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const top_menu = document.querySelector('.top-menu');
    
    if (top_menu) {
        const heroHeight = top_menu.offsetHeight;
        
        if (window.scrollY > heroHeight) {
            header.style.backgroundColor = 'white';
        } else {
            header.style.backgroundColor = 'transparent';
        }
    } else {
        console.log("No hero element found!");
    }
});


/* ================================================== */
/* ========= MANEJAR BARRA DE BUSQUEDA ============== */
/* ================================================== */

// Function to handle search bar toggle
function toggleSearchBar(event) {
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
            alert("Término a buscar...", searchText)
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

// Enables the search bar toggle functionality
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


/* ================================================== */
/* ========= MANEJAR BARRA LATERAL [MOVIL] ========== */
/* ================================================== */

/* Barra de navegacion lateral */
document.addEventListener('DOMContentLoaded', function() {
    // Side Menu - Get elements
    const menuIcon = document.getElementById('menuIcon');
    const sideMenu = document.getElementById('sideMenu');
    const closeBtn = document.getElementById('closeBtn');
    const logo = document.querySelector('.logo'); // Select the logo outside the side menu
    const profileSvg = document.querySelector("#profileButton svg");

    // Ensure the menuIcon exists
    if (menuIcon) {
        // Open the side menu when the menu icon is clicked
        menuIcon.addEventListener('click', function () {
            console.log('Menu icon clicked'); // Debugging: Check if the click event fires
            sideMenu.style.width = '290px'; // Show the side menu
            menuIcon.style.display = 'none'; // Hide the menu icon
            logo.style.display = 'none'; // Hide the logo in the main header
            profileSvg.style.display = 'none'; // Hide the logo in the main header
        });
    }

    // Ensure the closeBtn exists
    if (closeBtn) {
        // Close the side menu when the close button is clicked
        closeBtn.addEventListener('click', function () {
            sideMenu.style.width = '0'; // Hide the side menu
            menuIcon.style.display = 'inline-block'; // Show the menu icon again
            logo.style.display = 'block'; // Show the logo in the main header again
            profileSvg.style.display = 'block'; // Hide the logo in the main header
            searchSvg.style.display = 'block'; // Hide the logo in the main header
        });
    }
});


// ========================================== //
// ======== INICIAR SESION / PERFIL ========= //
// ========================================== //

// Function to check if the user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/check-auth', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'  // Include cookies in the request
        });
        const data = await response.json();
        console.log("check/auth - Authenticated:", data.authenticated);
        return data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Function to update the dropdown menu based on authentication status
async function updateUserDropdown() {
    const isAuthenticated = await checkAuthStatus();
    console.log("update - isAuthenticated:", isAuthenticated);
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.innerHTML = ''; // Clear previous dropdown content

    if (isAuthenticated) {
        // If authenticated, show "Perfil" and "Cerrar sesión"
        const profileLink = document.createElement('a');
        profileLink.href = '#';
        profileLink.textContent = 'Perfil';
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'profile.html'; // Redirect to profile page
        });

        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Cerrar sesión';
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();
            await fetch('/auth/sign-out', { method: 'POST' });
            // Redirect to the stored URL or a default page if none is found
            const redirectUrl = localStorage.getItem('redirectAfterLogout');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogout'); // Clean up the storage
                window.location.href = redirectUrl; // Redirect to the previous page
            } else {
                window.location.href = '../index.html'; // Fallback if no URL is found
            }
        });

        userDropdown.appendChild(profileLink);
        userDropdown.appendChild(logoutLink);
    } else {
        // If not authenticated, show "Inicia sesión"
        const loginLink = document.createElement('a');
        loginLink.href = '../login.html';
        loginLink.textContent = 'Inicia sesión';
        userDropdown.appendChild(loginLink);
    }

    // Update the side menu based on authentication status
    const sideMenuAuthLink = document.getElementById('sideMenuAuthLink');

    if (isAuthenticated) {
        // Change to "Perfil" if authenticated
        sideMenuAuthLink.textContent = 'Perfil';
        sideMenuAuthLink.href = 'profile.html'; // Redirect to profile page
    } else {
        // Change back to "Inicia sesión" if not authenticated
        sideMenuAuthLink.textContent = 'Inicia sesión';
        sideMenuAuthLink.href = 'login.html'; // Redirect to login page
    }
}

// Initialize the dropdown when the page loads
document.addEventListener('DOMContentLoaded', async() => {
    // Call function to set dropdown based on auth status
    updateUserDropdown(); 

    
    // const location = await getUserLocation();
    // if (location) {
    //     // Display location or use it in further functions
    //     console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
    // } else {
    //     console.log("Could not retrieve location.");
    // }
    
});

// ========================================== //
// ======== AÑADIR AL CARRITO =============== //
// ========================================== //

// Cart icon HTML template
const cartIconHTML = `
    <li class="cart-icon-container">
        <a href="#" class="cart-icon-link" onclick="toggleCartSidebar()">
            <span class="cart-icon">🛒
                <span id="cart-count" class="cart-count">0</span>
            </span>
        </a>
    </li>
`;

// Global function to add items to the cart
async function globalAddToCart(productId, quantity) {
    try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
            alert("Por favor, inicia sesión para añadir artículos al carrito.");
            window.location.href = '../login.html';
            return;
        }

        // Proceed to add the item to the cart
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log("Artículo añadido al carrito.");
            checkCartStatus();  // Update the cart status globally
        } else {
            console.error("Error adding to cart:", data.message);
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
}


// Function to show the cart icon
function showCartIcon() {
    // Check if the cart icon is already present
    if (!document.querySelector('.cart-icon-container')) {
        // Add the cart icon to a specific part of the header
        const header = document.querySelector('.menu-container'); // Adjust selector to target where you want the icon
        header.insertAdjacentHTML('beforeend', cartIconHTML);
    }

    // Update the cart count
    updateCartCount();
}

// Hide the cart icon if the cart is empty
function hideCartIcon() {
    const cartIconContainer = document.querySelector('.cart-icon-container');
    if (cartIconContainer) {
        cartIconContainer.remove();
    }
}

// Check if there are items in the cart and update the icon visibility accordingly
async function checkCartStatus() {
    try {
        const response = await fetch('/cart/view', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const itemCount = data.cart.length; // Get number of distinct items in the cart

        // Show or hide cart icon based on whether there are items in the cart
        if (itemCount > 0) {
            showCartIcon();
            updateCartCount(itemCount); // Update cart count badge
        } else {
            hideCartIcon();  // Hide cart icon if the cart is empty
        }
    } catch (error) {
        console.error("Error fetching cart status:", error);
        hideCartIcon();  // Hide icon if there's an error (e.g., unauthenticated user)
    }
}

// Function to update the cart count badge
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}


function toggleCartSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');

    // Call viewCart to update items in the sidebar when it opens
    if (cartSidebar.classList.contains('open')) {
        viewCart();
    }
}

async function removeItemFromCart(productId) {
    try {
        const response = await fetch('/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            // Update the cart view after successful deletion
            viewCart();
        } else {
            console.error("Error removing item from cart:", data.message);
        }
    } catch (error) {
        console.error("Error removing item from cart:", error);
    }
}

async function viewCart() {
    try {
        const response = await fetch('/cart/view', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const cartItemsContainer = document.getElementById('cart-items');

        // If the cart is empty
        if (data.cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
            document.getElementById('cart-count').textContent = '0';
            document.getElementById('total-amount').textContent = "€0.00";  // Set total to zero if cart is empty
            return;
        }

        // Update cart count to show the number of distinct products
        const distinctItemCount = data.cart.length;  // Number of unique products in the cart
        console.log("cart length ::", distinctItemCount);
        document.getElementById('cart-count').textContent = data.cart.length;

        // Log each item to inspect its structure
        data.cart.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, item);  // Output the entire item object
            console.log("Product ID:", item.productId);
            console.log("Quantity:", item.quantity);
            console.log("Image URL:", item.imageUrl);
            console.log("Price:", item.price);
        });

        // Calculate total amount
        const totalAmount = data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log("Total amount:", totalAmount);

        // Render cart items with image and delete icon
        cartItemsContainer.innerHTML = data.cart.map(item => `
            <div class="cart-item" data-product-id="${item.productId}">
                <img src="${item.imageUrl}" alt="Producto" class="cart-item-image" />
                <div class="cart-item-details">
                    <p><strong>${item.productId}</strong> </p>
                    <p>${item.quantity}m</p>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart('${item.productId}')">🗑️</button>
            </div>
        `).join('');

         // Display total amount in the sidebar
         document.getElementById('total-amount').textContent = `${totalAmount.toFixed(2)}€`;

    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

document.addEventListener('DOMContentLoaded', checkCartStatus);





/* ======================================== */
/* ============ LOCALIZACIÓN ============== */
/* ======================================== */

// // Function to get the user's location
// async function getUserLocation() {
//     return new Promise((resolve, reject) => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const location = {
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude
//                     };
//                     console.log('User location:', location); // Log location for testing
//                     resolve(location);
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                     resolve(null); // Resolve as null if location can't be accessed
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by this browser.');
//             resolve(null);
//         }
//     });
// }



