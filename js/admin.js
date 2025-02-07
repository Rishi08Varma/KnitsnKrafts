// Check if user is admin
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        window.location.href = '../index.html';
    }
}

// Show different sections
function showDashboard() {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('customers-section').style.display = 'none';
    loadDashboardData();
}

function showProducts() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('products-section').style.display = 'block';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('customers-section').style.display = 'none';
    loadProducts();
}

function showOrders() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'block';
    document.getElementById('customers-section').style.display = 'none';
    loadOrders();
}

function showCustomers() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('customers-section').style.display = 'block';
    loadCustomers();
}

// Load dashboard data
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalCustomers').textContent = users.length - 1; // Exclude admin
}

// Product Management
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${product.image}" alt="${product.name}" style="height: 50px;"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push({ name, price, stock, image, description });
    localStorage.setItem('products', JSON.stringify(products));

    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    loadProducts();
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
}

// Order Management
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';

    orders.forEach((order, index) => {
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>$${order.total}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${index})">Update Status</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Customer Management
function loadCustomers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.getElementById('customersTableBody');
    tableBody.innerHTML = '';

    users.forEach((user, index) => {
        if (!user.isAdmin) {
            const row = `
                <tr>
                    <td>${index}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>0</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewCustomerDetails(${index})">View Details</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    });
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    showDashboard();
});