// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const sortBy = document.getElementById('sortBy');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const productCount = document.getElementById('productCount');
    
    let allProducts = getProducts();
    let filteredProducts = [...allProducts];
    
    // Display all products initially
    displayProducts(filteredProducts);
    
    // Apply filters
    function applyFilters() {
        let products = [...allProducts];
        
        // Category filter
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        if (selectedCategory !== 'all') {
            products = products.filter(p => p.category === selectedCategory);
        }
        
        // Price filter
        const selectedPrice = document.querySelector('input[name="price"]:checked').value;
        if (selectedPrice !== 'all') {
            if (selectedPrice === '0-50') {
                products = products.filter(p => p.price < 50);
            } else if (selectedPrice === '50-100') {
                products = products.filter(p => p.price >= 50 && p.price < 100);
            } else if (selectedPrice === '100-500') {
                products = products.filter(p => p.price >= 100 && p.price < 500);
            } else if (selectedPrice === '500+') {
                products = products.filter(p => p.price >= 500);
            }
        }
        
        filteredProducts = products;
        applySorting();
    }
    
    // Apply sorting
    function applySorting() {
        const sortValue = sortBy.value;
        let products = [...filteredProducts];
        
        switch(sortValue) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // default order
                break;
        }
        
        displayProducts(products);
    }
    
    // Display products
    function displayProducts(products) {
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #7f8c8d;">No products found matching your criteria.</p>';
            productCount.textContent = 'No products found';
            return;
        }
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        productCount.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
    }
    
    // Event listeners
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    resetFiltersBtn.addEventListener('click', function() {
        document.querySelector('input[name="category"][value="all"]').checked = true;
        document.querySelector('input[name="price"][value="all"]').checked = true;
        sortBy.value = 'default';
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
    });
    
    sortBy.addEventListener('change', applySorting);
    
    // Check for category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryRadio = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (categoryRadio) {
            categoryRadio.checked = true;
            applyFilters();
        }
    }
});
