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
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#f5f5f5' },   // For the first image
    { headerColor: 'white', textColor: 'white', dropdownBgColor: '#333' },   // For the second image
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#f5f5f5' },   // For the third image
];

// Function to change hero background and colors
function changeHeroBackground() {
    // // Remove previous flag to prevent multiple transitions
    // if (transitioning) return;
    // transitioning = true; // Set flag to prevent double transitions

    // const currentImage = heroImages[currentIndex]; // Get current image
    // let nextIndex = (currentIndex + 1) % heroImages.length; // Next image index
    // const nextImage = heroImages[nextIndex]; // Next image

    // CORRECCIÓN DE ERRORES ---------------------------------------------
    // Remove previous flag to prevent multiple transitions
    if (transitioning) return;
    transitioning = true; // Set flag to prevent double transitions

    // Ensure currentIndex is valid and the element exists
    if (!heroImages[currentIndex]) {
        console.error('No image found for currentIndex: ' + currentIndex);
        return;
    }

    const currentImage = heroImages[currentIndex]; // Get current image
    let nextIndex = (currentIndex + 1) % heroImages.length; // Next image index
    const nextImage = heroImages[nextIndex];

    if (!nextImage) {
        console.error('No next image found for index: ' + nextIndex);
        return;
    }

    // Remove the active class from the current image
    currentImage.classList.remove('active');
    
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
heroImages[currentIndex].classList.add('active'); // Set first image visible

// Set an interval to change the background every 4 seconds
setInterval(changeHeroBackground, 4000);


// -------------------------------------------------------------------------------------------

// Function to handle search bar toggle
function toggleSearchBar() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput.classList.contains('visible')) {
        const searchText = searchInput.value.trim();

        if (searchText) {
            // Redirect to the search results page with the search term in the URL
            window.location.href = `search-results.html?query=${encodeURIComponent(searchText)}`;
        } else {
            // Close the search bar if it's already open
            searchInput.classList.remove('visible'); // Hide the input field
            searchInput.value = ''; // Optionally clear the search bar input
        }
    } else {
        searchInput.classList.add('visible'); // Show the input field
        searchInput.focus(); // Focus the input for typing
    }
}

// Function to hide search bar when clicking outside
function hideSearchBarIfClickedOutside(event) {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // If the search input is visible and the click is outside both the search input and the search button
    if (searchInput.classList.contains('visible') && 
        !searchInput.contains(event.target) && 
        !searchButton.contains(event.target)) {
        searchInput.classList.remove('visible'); // Hide the search bar
        searchInput.value = ''; // Optionally clear the search bar input
    }
}

// Event listener to toggle search bar visibility on button click
document.getElementById('searchButton').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default behavior if inside a form
    toggleSearchBar();
});

// Event listener to hide search bar when clicking outside
document.addEventListener('click', hideSearchBarIfClickedOutside);

// // Event listener to trigger search on 'Enter' key press
// document.getElementById('searchInput').addEventListener('keypress', handleSearch);

// -------------------------------------------------------------------------------------------

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

/* Producto - Navegar por imágenes */
function handleClick(button, direction) {
    const listWrapper = button.closest('.list-wrapper');
    const list = listWrapper.querySelector('.list');
    const item = list.querySelector('.item');
    const itemWidth = item.offsetWidth;

    if (direction === 'previous') {
        list.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    } else {
        list.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
}
