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
/* ================================================== */
/* ================================================== */
/* ================================================== */


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ========================================== //
// ======== INICIAR SESION / PERFIL ========= //
// ========================================== //

const profileBtn = document.getElementById('profileButton')
if (profileBtn){
    profileBtn.addEventListener('click', function(event) {
        console.log("profileBtn clicked!");
        event.preventDefault(); // Prevent default link behavior
        
        // Check if the user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        console.log(localStorage);
    
        if (isLoggedIn === 'true') {
            // Redirect to profile page
            window.location.href = 'profile.html';
        } else {
            // Store the current URL to redirect after login
            localStorage.setItem('redirectAfterLogin', window.location.href);
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// ========================================== //
// ======== AÑADIR AL CARRITO =============== //
// ========================================== //

// Function to update the cart count indicator
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalUniqueItems = cart.length;  // Number of different products in the cart

    if (totalUniqueItems > 0) {
        cartCountElement.textContent = totalUniqueItems;
        cartCountElement.classList.remove('hidden');  // Show the cart count
    } else {
        cartCountElement.classList.add('hidden');  // Hide the cart count if empty
    }
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);  // Remove item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart));  // Save updated cart to localStorage
    updateCartDisplay();  // Update the cart display
    updateCartCount();    // Update the cart count
}

// Function to toggle cart sidebar visibility
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');  // Toggle the 'active' class
}

// Close the cart sidebar when the close button is clicked
document.querySelector('.close-cart').addEventListener('click', function() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.remove('active');  // Remove the 'active' class to hide the sidebar
});

// Function to proceed to checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        // Implement checkout logic
        alert('Proceeding to checkout...');
    }
}

// Utility function to get URL query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Call updatePrice and set up the cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePrice();
    updateCartDisplay();  // Load and display cart items if any
    updateCartCount();    // Update cart count on page load
    checkIfUserLoggedIn();  // Check if the user is logged in when the page loads
    
});

// Function to log the user out
function signOut() {
    // Send a POST request to the backend to clear the token
    fetch('/auth/sign-out', {
        method: 'POST',
        credentials: 'include'  // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);  // Handle the response, e.g., log the success message
    })
    .catch(error => {
        console.error('Error during sign-out:', error);
    });
}