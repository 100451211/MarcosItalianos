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
    // Remove previous flag to prevent multiple transitions
    if (transitioning) return;
    transitioning = true; // Set flag to prevent double transitions

    const currentImage = heroImages[currentIndex]; // Get current image
    let nextIndex = (currentIndex + 1) % heroImages.length; // Next image index
    const nextImage = heroImages[nextIndex]; // Next image

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
    menuIcon.style.display = 'none'; // Hide the menu icon
}

// Close the side menu when the close button is clicked
closeBtn.onclick = function () {
    sideMenu.style.width = '0'; // Hide the side menu
    menuIcon.style.display = 'inline-block'; // Show the menu icon again
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
