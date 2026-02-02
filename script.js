// Product Data
const productsData = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 79.99,
        image: "🎧",
        rating: 4.5,
        description: "Premium wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 199.99,
        image: "⌚",
        rating: 4.8,
        description: "Feature-packed smartwatch with health tracking"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        category: "fashion",
        price: 49.99,
        image: "🎒",
        rating: 4.3,
        description: "Durable backpack perfect for laptops and travel"
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "sports",
        price: 89.99,
        image: "👟",
        rating: 4.6,
        description: "Comfortable running shoes for all terrains"
    },
    {
        id: 5,
        name: "Coffee Maker",
        category: "home",
        price: 129.99,
        image: "☕",
        rating: 4.4,
        description: "Programmable coffee maker with thermal carafe"
    },
    {
        id: 6,
        name: "Yoga Mat",
        category: "sports",
        price: 34.99,
        image: "🧘",
        rating: 4.7,
        description: "Non-slip yoga mat with carrying strap"
    },
    {
        id: 7,
        name: "Desk Lamp",
        category: "home",
        price: 45.99,
        image: "💡",
        rating: 4.2,
        description: "LED desk lamp with adjustable brightness"
    },
    {
        id: 8,
        name: "Sunglasses",
        category: "fashion",
        price: 59.99,
        image: "🕶️",
        rating: 4.5,
        description: "Polarized sunglasses with UV protection"
    },
    {
        id: 9,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 69.99,
        image: "🔊",
        rating: 4.6,
        description: "Portable speaker with 12-hour battery life"
    },
    {
        id: 10,
        name: "Gaming Mouse",
        category: "electronics",
        price: 54.99,
        image: "🖱️",
        rating: 4.7,
        description: "High-precision gaming mouse with RGB lighting"
    },
    {
        id: 11,
        name: "Winter Jacket",
        category: "fashion",
        price: 149.99,
        image: "🧥",
        rating: 4.8,
        description: "Warm and stylish winter jacket"
    },
    {
        id: 12,
        name: "Blender",
        category: "home",
        price: 89.99,
        image: "🥤",
        rating: 4.3,
        description: "High-speed blender for smoothies and more"
    },
    {
        id: 13,
        name: "Basketball",
        category: "sports",
        price: 29.99,
        image: "🏀",
        rating: 4.5,
        description: "Professional-grade basketball"
    },
    {
        id: 14,
        name: "Tablet",
        category: "electronics",
        price: 399.99,
        image: "📱",
        rating: 4.9,
        description: "10-inch tablet with stunning display"
    },
    {
        id: 15,
        name: "Handbag",
        category: "fashion",
        price: 119.99,
        image: "👜",
        rating: 4.4,
        description: "Elegant handbag with multiple compartments"
    },
    {
        id: 16,
        name: "Wall Clock",
        category: "home",
        price: 39.99,
        image: "🕐",
        rating: 4.2,
        description: "Modern wall clock with silent movement"
    }
];

// Get products
function getProducts() {
    return productsData;
}

// Get product by ID
function getProductById(id) {
    return productsData.find(product => product.id === parseInt(id));
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    
    return card;
}

// Cart functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const cart = getCart();
    const product = getProductById(productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
