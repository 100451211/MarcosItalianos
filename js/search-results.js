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

// Function to determine the category based on the search term
function getCategory(searchTerm) {
    // Adjust this to match how you categorize products
    if (searchTerm.toLowerCase().includes('color')) {
        return 'colores';
    } else if (searchTerm.toLowerCase().includes('clasico')) {
        return 'clasico';
    } else if (searchTerm.toLowerCase().includes('moderno')) {
        return 'moderno';
    } else if (searchTerm.toLowerCase().includes('natural')) {
        return 'natural';
    } else {
        return null; // If no category is found
    }
}

// Function to fetch products from the corresponding category JSON file
async function fetchProducts(category) {
    try {
        const response = await fetch(`../data/${category}.json`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Function to display search results
async function displaySearchResults() {
    const searchTerm = getQueryParams();
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const noResultsContainer = document.getElementById('noResultsContainer'); // New container for no results

    // Clear previous results
    searchResultsContainer.innerHTML = '';

    // Determine the category based on the search term
    const category = getCategory(searchTerm);
    if (!category) {
        const dizzyFaceImg = '<img src="../images/noResults.jpg" alt="No Results" class="no-results">';
        noResultsContainer.innerHTML = `
            <div class="no-results-container">
                ${dizzyFaceImg}
                <p>No hemos encontrado productos con la referencia "${searchTerm}".</p>
            </div>`;
        return;
    }

    // Fetch products from the appropriate JSON file
    const products = await fetchProducts(category);

    // Filter the products based on the search term
    const filteredProducts = products.filter(product => 
        product.id.includes(searchTerm) || product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredProducts.length > 0) {
        // Display the filtered products with carousel and buttons
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
                    <p>${product.description}</p>
                    <p>Precio: ${product.price}</p>
                </div>
            `;
            searchResultsContainer.innerHTML += productHTML;
        });
    } else {
        // Display message if no products are found
        searchResultsContainer.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
    }
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
