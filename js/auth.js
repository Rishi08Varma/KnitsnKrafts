// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        document.getElementById('loginBtn').classList.add('d-none');
        document.getElementById('signupBtn').classList.add('d-none');
        document.getElementById('logoutBtn').classList.remove('d-none');
        return JSON.parse(user);
    }
    return null;
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '../index.html';
    } else {
        alert('Invalid credentials');
    }
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // For demo purposes, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Email already exists');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        isAdmin: false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    window.location.href = '../index.html';
}

// Handle Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth);