
function loadProduct() {
    console.log("loadProduct();");
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const productId = urlParams.get('id');
    console.log("id:", productId, "category:", category);

    if (!category || !productId) {
        document.getElementById('product-details').innerText = 'Producto no encontrado.';
        return;
    }

    fetch(`../data/${category}.json`)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                displayProduct(product, category);
            } else {
                document.getElementById('product-details').innerText = 'Producto no encontrado.';
            }
        })
        .catch(error => console.error('Error loading product:', error));
}

function displayProduct(product, category) {
    // Update the page title
    document.title = `${product.name} - AURIDAL S.L.`;

    // Update the breadcrumb navigation
    document.getElementById('breadcrumb-category').textContent = capitalizeFirstLetter(category);
    document.getElementById('breadcrumb-category').href = `../producto/${category}.html`;
    document.getElementById('breadcrumb-product').textContent = product.name;

    // Update the product name and description
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;

    // Update the main product image and thumbnails only if there are images
    if (product.images && product.images.length > 0) {
        document.getElementById('main-product-image').src = product.images[0];

        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const imagesHtml = product.images.map((imgSrc, index) => `
            <img src="${imgSrc}" alt="${product.name} ${index + 1}" class="thumbnail-image" onclick="changeMainImage('${imgSrc}')">
        `).join('');
        
        thumbnailContainer.innerHTML = imagesHtml;
    } else {
        // Handle if no images are provided
        document.getElementById('main-product-image').src = '../images/hero-image.png';  // You can set a default image here
    }

    // Dynamically update the product details
    const productDetails = `
        <ul>
            <li><strong>Material:</strong> ${product.details.material}</li>
            <li><strong>Ancho:</strong> ${product.details.dimensions.ancho} cm</li>
            <li><strong>Largo:</strong> ${product.details.dimensions.largo} cm</li>
            <li><strong>Rebajo:</strong> ${product.details.dimensions.rebajo} cm</li>
            <li><strong>Disponibilidad:</strong> ${product.details.availability}</li>
        </ul>
        <p class="product-price">Precio Madrid: ${product.price.madrid || 'Consultar'}</p>
        <button class="button-add-to-cart">Añadir al Carrito</button>
    `;
    
    // Append product details to the correct element
    document.querySelector('.product-info').innerHTML = productDetails;
}

function changeMainImage(imageSrc) {
    document.getElementById('main-product-image').src = imageSrc;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
