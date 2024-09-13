// Carousel functionality and changing color header
const heroImages = document.querySelectorAll('.hero-image');
const header = document.querySelector('header');
const logo = document.querySelector('.logo');
const menuLinks = document.querySelectorAll('.menu a');
const dropdownIcons = document.querySelectorAll('.menu svg path');
let currentIndex = 0;

// Array of background-specific color schemes (one per image)
const colorSchemes = [
    { headerColor: 'black', textColor: 'black' },   // For the first image
    { headerColor: 'white', textColor: 'white' },   // For the second image
    { headerColor: 'black', textColor: 'black' },   // For the third image
    { headerColor: 'white', textColor: 'white' }    // For the fourth image
];

// Function to slide the images and change header/nav colors
function changeHeroBackground() {
    const currentImage = heroImages[currentIndex]; // Current active image
    const nextIndex = (currentIndex + 1) % heroImages.length;
    const nextImage = heroImages[nextIndex]; // Next image to show

    // Remove active class from current image and add 'previous' to slide it out
    currentImage.classList.remove('active');
    currentImage.classList.add('previous');

    // Add 'active' class to the next image to slide it in
    nextImage.classList.add('active');
    nextImage.classList.remove('previous');

    // Change the color scheme based on the next image
    const { headerColor, textColor } = colorSchemes[nextIndex];
    
    // Update logo and menu link colors
    logo.classList.remove('light', 'dark');
    logo.classList.add(textColor === 'white' ? 'light' : 'dark');
    
    menuLinks.forEach(link => {
        link.classList.remove('light', 'dark');
        link.classList.add(textColor === 'white' ? 'light' : 'dark');
    });

    // Update dropdown icon colors
    dropdownIcons.forEach(icon => {
        icon.setAttribute('fill', textColor === 'white' ? 'white' : 'black');
    });

    // Update the current index
    currentIndex = nextIndex;
}

// Initialize the first image as active
heroImages[currentIndex].classList.add('active');

// Set an interval to change the background every 2 seconds (2000 milliseconds)
setInterval(changeHeroBackground, 4000);


// -------------------------------------------------------------------------------------------


// Function to handle search bar toggle
function toggleSearchBar() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput.classList.contains('visible')) {
        const searchText = searchInput.value.trim();
        if (searchText) {
            console.log('Searching for:', searchText);
            alert('Searching for: ' + searchText); // Placeholder for real search functionality
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
