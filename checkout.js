// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    const orderItems = document.getElementById('orderItems');
    const cardDetails = document.getElementById('cardDetails');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    
    // Check if cart is empty
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Display order summary
    displayOrderSummary();
    
    // Payment method toggle
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                // Make card fields required
                document.getElementById('cardNumber').required = true;
                document.getElementById('cardName').required = true;
                document.getElementById('expiry').required = true;
                document.getElementById('cvv').required = true;
            } else {
                cardDetails.style.display = 'none';
                // Make card fields optional
                document.getElementById('cardNumber').required = false;
                document.getElementById('cardName').required = false;
                document.getElementById('expiry').required = false;
                document.getElementById('cvv').required = false;
            }
        });
    });
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Display order summary
    function displayOrderSummary() {
        orderItems.innerHTML = '';
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-image">${item.image}</div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItems.appendChild(orderItem);
        });
        
        // Update totals
        const totals = calculateCartTotals();
        document.getElementById('summarySubtotal').textContent = `$${totals.subtotal}`;
        document.getElementById('summaryShipping').textContent = `$${totals.shipping}`;
        document.getElementById('summaryTax').textContent = `$${totals.tax}`;
        document.getElementById('summaryTotal').textContent = `$${totals.total}`;
    }
    
    // Form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            shipping: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            },
            payment: {
                method: formData.get('paymentMethod')
            },
            items: cart,
            totals: calculateCartTotals(),
            orderDate: new Date().toISOString(),
            orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
        
        // Save order to localStorage (in real app, this would go to server)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Show processing animation
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate processing
        setTimeout(() => {
            // Clear cart
            clearCart();
            
            // Redirect to confirmation page with order number
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            window.location.href = 'order-confirmation.html';
        }, 2000);
    });
});
