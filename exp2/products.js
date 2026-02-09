// Product data stored as JSON object
const productsData = {
    "products": [
        {
            "id": 1,
            "name": "Laptop",
            "category": "Electronics",
            "price": 899.99,
            "description": "High-performance laptop with 16GB RAM",
            "inStock": true
        },
        {
            "id": 2,
            "name": "Wireless Mouse",
            "category": "Electronics",
            "price": 29.99,
            "description": "Ergonomic wireless mouse",
            "inStock": true
        },
        {
            "id": 3,
            "name": "Mechanical Keyboard",
            "category": "Electronics",
            "price": 149.99,
            "description": "RGB mechanical keyboard",
            "inStock": false
        },
        {
            "id": 4,
            "name": "Monitor",
            "category": "Electronics",
            "price": 349.99,
            "description": "27-inch 4K monitor",
            "inStock": true
        },
        {
            "id": 5,
            "name": "USB-C Cable",
            "category": "Accessories",
            "price": 12.99,
            "description": "Fast charging USB-C cable",
            "inStock": true
        },
        {
            "id": 6,
            "name": "Gaming Chair",
            "category": "Furniture",
            "price": 299.99,
            "description": "Ergonomic gaming chair",
            "inStock": true
        },
        {
            "id": 7,
            "name": "Webcam",
            "category": "Electronics",
            "price": 79.99,
            "description": "1080p HD webcam",
            "inStock": true
        },
        {
            "id": 8,
            "name": "Desk Lamp",
            "category": "Furniture",
            "price": 24.99,
            "description": "LED desk lamp with adjustable brightness",
            "inStock": true
        },
        {
            "id": 9,
            "name": "External Hard Drive",
            "category": "Storage",
            "price": 89.99,
            "description": "1TB external hard drive",
            "inStock": true
        },
        {
            "id": 10,
            "name": "Smartphone",
            "category": "Electronics",
            "price": 699.99,
            "description": "Latest model smartphone",
            "inStock": false
        }
    ]
};

// Function to display all products in the console
function displayProducts(products) {
    console.log("=".repeat(60));
    console.log("PRODUCT LIST");
    console.log("=".repeat(60));
    
    if (products.length === 0) {
        console.log("No products found.");
        return;
    }

    products.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`  ID: ${product.id}`);
        console.log(`  Name: ${product.name}`);
        console.log(`  Category: ${product.category}`);
        console.log(`  Price: $${product.price.toFixed(2)}`);
        console.log(`  Description: ${product.description}`);
        console.log(`  In Stock: ${product.inStock ? 'Yes' : 'No'}`);
        console.log("-".repeat(60));
    });

    console.log(`\nTotal Products: ${products.length}`);
    console.log("=".repeat(60));
}

// Function to filter products based on minimum price
function filterProductsByPrice(minPrice) {
    if (minPrice === null || minPrice === undefined || minPrice === '') {
        return productsData.products;
    }

    const price = parseFloat(minPrice);
    
    if (isNaN(price) || price < 0) {
        console.warn("Invalid price value. Showing all products.");
        return productsData.products;
    }

    const filtered = productsData.products.filter(product => product.price >= price);
    return filtered;
}

// Function to display products on the webpage
function displayProductsOnPage(products, title = "All Products") {
    const displayDiv = document.getElementById('products-display');
    const titleElement = document.getElementById('results-title');
    
    titleElement.textContent = `${title} (${products.length} ${products.length === 1 ? 'product' : 'products'})`;

    if (products.length === 0) {
        displayDiv.innerHTML = '<div class="no-products">No products found matching the criteria.</div>';
        return;
    }

    displayDiv.innerHTML = products.map(product => `
        <div class="product-card ${!product.inStock ? 'out-of-stock' : ''}">
            <div class="product-header">
                <h3>${product.name}</h3>
                <span class="product-id">#${product.id}</span>
            </div>
            <div class="product-body">
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock-badge'}">
                        ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Display all products initially
    console.log("Initializing Product Filter Application...\n");
    displayProducts(productsData.products);
    displayProductsOnPage(productsData.products);

    // Filter button event listener
    const filterBtn = document.getElementById('filter-btn');
    const resetBtn = document.getElementById('reset-btn');
    const minPriceInput = document.getElementById('min-price');

    filterBtn.addEventListener('click', () => {
        const minPrice = minPriceInput.value;
        const filteredProducts = filterProductsByPrice(minPrice);
        
        console.log(`\n🔍 Filtering products with minimum price: $${minPrice || 'N/A'}\n`);
        displayProducts(filteredProducts);
        displayProductsOnPage(filteredProducts, `Filtered Products (Min Price: $${minPrice || '0'})`);
    });

    // Reset button event listener
    resetBtn.addEventListener('click', () => {
        minPriceInput.value = '';
        console.log("\n🔄 Resetting to show all products...\n");
        displayProducts(productsData.products);
        displayProductsOnPage(productsData.products);
    });

    // Allow Enter key to trigger filter
    minPriceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterBtn.click();
        }
    });

    console.log("\n✅ Application ready! Use the filter to search products by minimum price.");
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        displayProducts,
        filterProductsByPrice,
        productsData
    };
}
