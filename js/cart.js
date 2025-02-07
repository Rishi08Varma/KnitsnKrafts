// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Load products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
        products.forEach((product, index) => {
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-outline-primary btn-sm" 
                                onclick="quickView(${index})">Quick View</button>
                            <button class="btn btn-primary btn-sm" 
                                onclick="addToCart(${index})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });
    }
}

// Quick view functionality
function quickView(productIndex) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products[productIndex];
    
    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quickViewDescription').textContent = product.description;
    
    // Store current product index for add to cart functionality
    document.getElementById('quickViewQuantity').dataset.productIndex = productIndex;
    
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

// Add to cart from quick view modal
function addToCartFromModal() {
    const productIndex = document.getElementById('quickViewQuantity').dataset.productIndex;
    const quantity = parseInt(document.getElementById('quickViewQuantity').value);
    addToCart(parseInt(productIndex), quantity);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
    modal.hide();
}

// Add to cart functionality
function addToCart(productIndex, quantity = 1) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const product = products[productIndex];

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productIndex);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            productId: productIndex,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showToast('Product added to cart successfully!');
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.getElementsByClassName('cart-count');
    
    Array.from(cartCountElements).forEach(element => {
        element.textContent = totalItems;
    });
}

// Load cart items
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5">
                    <h4>Your cart is empty</h4>
                    <a href="products.html" class="btn btn-primary mt-3">Continue Shopping</a>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image img-fluid">
                        </div>
                        <div class="col-md-4">
                            <h5>${item.name}</h5>
                            <p class="text-muted">Price: $${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="quantity-control input-group">
                                <button class="btn btn-outline-secondary" 
                                    onclick="updateQuantity(${index}, -1)">-</button>
                                <input type="number" class="form-control text-center" 
                                    value="${item.quantity}" min="1" readonly>
                                <button class="btn btn-outline-secondary" 
                                    onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <p class="subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div class="col-md-1">
                            <button class="btn btn-danger btn-sm" 
                                onclick="removeFromCart(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        updateCartSummary();
    }
}

// Update item quantity in cart
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newQuantity = cart[index].quantity + change;
    
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0; // Fixed shipping cost
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Proceed to checkout
function proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Here you would typically redirect to a checkout page
    // For this example, we'll just create an order
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    const order = {
        id: Date.now(),
        userId: user.email,
        items: cart,
        total: calculateTotal(cart),
        status: 'pending',
        date: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));

    // Show success message and redirect
    showToast('Order placed successfully!', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
}

// Calculate total including tax and shipping
function calculateTotal(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
}

// Show toast messages
function showToast(message, type = 'success') {
    // You can implement a toast notification system here
    alert(message); // For simplicity, using alert
}

// Apply filters
function applyFilters() {
    const priceRange = document.getElementById('priceRange').value;
    const categories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filteredProducts = products.filter(product => {
        const matchesPrice = product.price <= priceRange;
        const matchesCategory = categories.length === 0 || categories.includes(product.category);
        return matchesPrice && matchesCategory;
    });

    displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        productsGrid.innerHTML = products.length === 0 ? 
            '<div class="col-12 text-center"><h3>No products found</h3></div>' : 
            products.map((product, index) => `
                <div class="col-md-4 mb-4">
                    <div class="card product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-outline-primary btn-sm" 
                                onclick="quickView(${index})">Quick View</button>
                            <button class="btn btn-primary btn-sm" 
                                onclick="addToCart(${index})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
    }
}

// Initialize price range value display
document.addEventListener('DOMContentLoaded', () => {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const priceValue = document.getElementById('priceValue');
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
        });
    }
});