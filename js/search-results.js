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

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get('query');
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
    searchTerm = searchTerm || getQueryParams(); // Fallback to URL if no param provided

    // If no search term is found, do not proceed
    if (!searchTerm) {
        console.log("No search term found."); // Debugging
        return;
    }

    // Fetch products from all categories
    const allProducts = await fetchAllProducts();

    // Modify the filtering logic to match any part of the product ID
    const filteredProducts = allProducts.filter(product =>
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) || // Match part of the ID
        product.name.toLowerCase().includes(searchTerm.toLowerCase())  // Match part of the name
    );

    if (filteredProducts.length > 0) {
        // Clear previous search results
        searchResultsContainer.innerHTML = '';

        // Display the filtered products
        filteredProducts.forEach(product => {
            const productHTML = `
                <div class="product-item">
                    <div class="list-wrapper">
                        <ul class="list carousel">
                            ${product.images.map(imgSrc => `
                                <li class="item"><img src="${imgSrc}" alt="${product.name}" class="carousel-image"></li>
                            `).join('')}
                        </ul>
                        <!-- Arrow buttons for navigating images of this product -->
                        <button onclick="handleClick(this, 'previous')" class="button button--previous" type="button">❮</button>
                        <button onclick="handleClick(this, 'next')" class="button button--next" type="button">❯</button>
                    </div>
                    <h2>${product.name}</h2>
                </div>
            `;
            searchResultsContainer.innerHTML += productHTML;
        });
    } else {
        // Display a message if no products are found
        noResultsContainer.innerHTML = `
            <div class="no-results-container">
                <img src="../images/noResults.jpg" alt="No Results" class="no-results">
                <p>No hemos encontrado productos con la referencia "${searchTerm}".</p>
            </div>`;
    }
}

// Initialize search results on page load if a query is present
const searchTerm = getQueryParams();
if (searchTerm) {
    displaySearchResults(searchTerm);
}


// Function to handle carousel navigation
function handleClick(button, direction) {
    const list = button.parentElement.querySelector('.list');
    const items = list.querySelectorAll('.item');
    const currentItem = list.querySelector('.item:first-child');

    if (direction === 'previous') {
        list.insertBefore(items[items.length - 1], currentItem);
    } else {
        list.appendChild(currentItem);
    }
}

// Add an event listener to detect the Enter key press on the search input
document.getElementById('searchInput').addEventListener('keypress', handleEnterKeyPress);

// Call the function when the page loads
window.onload = displaySearchResults;
