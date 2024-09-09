// Function to toggle visibility of the search bar
document.getElementById('searchButton').addEventListener('click', function(e) {
    e.preventDefault();  // Prevent default behavior if the button is inside a form

    const searchInput = document.getElementById('searchInput');

    if (searchInput.classList.contains('visible')) {
        const searchText = searchInput.value;
        if (searchText) {
            console.log('Searching for:', searchText);
            alert('Searching for: ' + searchText);  // Placeholder for real search functionality
        } else {
            alert('Please enter something to search.');
        }
    } else {
        searchInput.classList.add('visible'); // Show the input field
        searchInput.focus();  // Focus the input for typing
    }
});

// Function to close the search bar if clicked outside
document.addEventListener('click', function(e) {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // If the click is outside the search bar and search button, close the search bar
    if (searchInput.classList.contains('visible') && !searchInput.contains(e.target) && !searchButton.contains(e.target)) {
        searchInput.classList.remove('visible'); // Hide the search bar
        searchInput.value = ''; // Optionally clear the search bar input
    }
});
