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