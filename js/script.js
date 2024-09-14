// Carousel functionality and changing color header
const heroImages = document.querySelectorAll('.hero-image');
const header = document.querySelector('header');
const logo = document.querySelector('.logo');
const menuLinks = document.querySelectorAll('.menu a');
const dropdownIcons = document.querySelectorAll('.menu svg path');
const searchIcon = document.querySelector('#searchButton svg'); // Target the SVG search icon directly
let currentIndex = 0;
let transitioning = false; // Flag to prevent multiple transitions

// Array of background-specific color schemes (one per image)
const colorSchemes = [
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#f5f5f5' },   // For the first image
    { headerColor: 'white', textColor: 'white', dropdownBgColor: '#333' },   // For the second image
    { headerColor: 'black', textColor: 'black', dropdownBgColor: '#f5f5f5' },   // For the third image
];
// Function to handle sliding of images and change header/nav colors
function changeHeroBackground() {
    if (transitioning) return; // Prevent multiple transitions
    transitioning = true; // Set flag to true during transition

    const currentImage = heroImages[currentIndex]; // Current active image
    let nextIndex = (currentIndex + 1) % heroImages.length; // Get the next image index
    const nextImage = heroImages[nextIndex]; // Next image to show

    // Start sliding the current image out and the next image in
    currentImage.style.transition = 'left 1s ease-in-out';
    nextImage.style.transition = 'none'; // Disable transition for the next image initially
    nextImage.style.left = '100%'; // Position next image off-screen (right side)

    setTimeout(() => {
        nextImage.style.transition = 'left 1s ease-in-out';
        currentImage.style.left = '-100%'; // Move current image off-screen (left side)
        nextImage.style.left = '0'; // Move next image into view (from the right)

        setTimeout(() => {
            currentImage.style.left = '100%'; // Reset position for next transition

            // Update the color scheme based on the next image
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

            // Update search icon color
            searchIcon.setAttribute('stroke', textColor);

            // Update the dropdown background color
            const dropdownContents = document.querySelectorAll('.dropdown-content');
            dropdownContents.forEach(dropdown => {
                dropdown.style.backgroundColor = dropdownBgColor;
            });

            // Update current index
            currentIndex = nextIndex;
            transitioning = false; // Reset flag to allow the next transition
        }, 500);
    }, 10);
}

// Initialize the first image as active
heroImages.forEach(image => {
    image.style.position = 'absolute';
    image.style.top = '0';
    image.style.left = '100%'; // Position all images off-screen initially
});
heroImages[currentIndex].style.left = '0'; // Set the first image to be visible

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
            alert('Please enter something to search.');
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

    // If the click is outside the search bar and search button, close the search bar
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

// Event listener to trigger search on 'Enter' key press
document.getElementById('searchInput').addEventListener('keypress', handleSearch);

// -------------------------------------------------------------------------------------------


// Side Menu - Get elements
const menuIcon = document.getElementById('menuIcon');
const sideMenu = document.getElementById('sideMenu');
const closeBtn = document.getElementById('closeBtn');

// Open the side menu when the menu icon is clicked
menuIcon.onclick = function () {
    sideMenu.style.width = '290px'; // Show the side menu
    menuIcon.display= none;
}

// Close the side menu when the close button is clicked
closeBtn.onclick = function () {
    sideMenu.style.width = '0'; // Hide the side menu
}

// Get all dropdowns in the side menu
const dropdowns = document.querySelectorAll('.side-menu .dropdown');

// Loop through each dropdown
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function() {
        // Toggle 'active' class on the clicked dropdown
        this.classList.toggle('active');
        
        // Toggle the dropdown content visibility
        const dropdownContent = this.querySelector('.dropdown-content');
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    });
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
