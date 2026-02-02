// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const promoInput = document.getElementById('promoInput');
    const applyPromoBtn = document.getElementById('applyPromo');
    const promoMessage = document.getElementById('promoMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    let discount = 0;
    
    // Valid promo codes
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };
    
    // Display cart
    function displayCart() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCart.style.display = 'block';
            checkoutBtn.style.display = 'none';
            updateTotals();
            return;
        }
        
        cartItemsContainer.style.display = 'block';
        emptyCart.style.display = 'none';
        checkoutBtn.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItemsContainer.appendChild(cartItem);
        });
        
        updateTotals();
    }
    
    // Create cart item element
    function createCartItem(item) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeCartItem(${item.id})">Remove</button>
                </div>
            </div>
            <div class="cart-item-total">
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
        return div;
    }
    
    // Update totals
    function updateTotals() {
        const totals = calculateCartTotals();
        const subtotal = parseFloat(totals.subtotal);
        const shipping = parseFloat(totals.shipping);
        const tax = parseFloat(totals.tax);
        
        // Apply discount
        const discountAmount = subtotal * discount;
        const finalSubtotal = subtotal - discountAmount;
        const finalTax = finalSubtotal * 0.1;
        const finalTotal = finalSubtotal + shipping + finalTax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${finalTax.toFixed(2)}`;
        totalElement.textContent = `$${finalTotal.toFixed(2)}`;
        
        if (discount > 0) {
            // Show discount row
            const discountRow = document.querySelector('.discount-row');
            if (!discountRow) {
                const row = document.createElement('div');
                row.className = 'summary-row discount-row';
                row.style.color = '#27ae60';
                row.innerHTML = `
                    <span>Discount (${(discount * 100)}%):</span>
                    <span>-$${discountAmount.toFixed(2)}</span>
                `;
                taxElement.parentElement.insertAdjacentElement('beforebegin', row);
            } else {
                discountRow.innerHTML = `
                    <span>Discount (${(discount * 100)}%):</span>
                    <span>-$${discountAmount.toFixed(2)}</span>
                `;
            }
        }
    }
    
    // Apply promo code
    applyPromoBtn.addEventListener('click', function() {
        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message error';
            return;
        }
        
        if (promoCodes[code]) {
            discount = promoCodes[code];
            promoMessage.textContent = `Promo code "${code}" applied! You saved ${(discount * 100)}%`;
            promoMessage.className = 'promo-message success';
            promoInput.disabled = true;
            applyPromoBtn.disabled = true;
            updateTotals();
        } else {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
        }
    });
    
    // Global functions for cart actions
    window.updateCartQuantity = function(productId, change) {
        updateQuantity(productId, change);
        displayCart();
    };
    
    window.removeCartItem = function(productId) {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(productId);
            displayCart();
            showNotification('Item removed from cart');
        }
    };
    
    // Initial display
    displayCart();
});
