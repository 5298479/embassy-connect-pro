
// DOM Elements
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const logoutButton = document.getElementById('logoutButton');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');
const userGreeting = document.getElementById('userGreeting');

// Check if user is logged in
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user) {
    if (authButtons) {
      authButtons.style.display = 'none';
    }
    
    if (userMenu) {
      userMenu.style.display = 'flex';
    }
    
    if (userGreeting) {
      userGreeting.textContent = `Welcome, ${user.firstName}!`;
    }
    
    // Redirect if on login/register page
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    if (authButtons) {
      authButtons.style.display = 'flex';
    }
    
    if (userMenu) {
      userMenu.style.display = 'none';
    }
    
    // Redirect if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
  }
}

// Show toast notification
function showToast(message, duration = 3000) {
  toastMessage.textContent = message;
  toast.style.display = 'flex';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Handle logout
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('user');
      showToast('Logged out successfully');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        // In a real application, this would be an API call
        // For this demo, we'll use localStorage to simulate backend
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);
        
        if (!user) {
          showToast('User not found');
          return;
        }
        
        if (user.password !== password) {
          showToast('Invalid password');
          return;
        }
        
        // Save user to localStorage (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        showToast('Login successful');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } catch (error) {
        showToast('Login failed: ' + error.message);
      }
    });
  }
  
  // Handle register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        // In a real application, this would be an API call
        // For this demo, we'll use localStorage to simulate backend
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
          showToast('Email already registered');
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now(),
          firstName,
          lastName,
          email,
          password,
          created_at: new Date().toISOString()
        };
        
        // Add user to "database"
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Log user in automatically
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        showToast('Registration successful');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } catch (error) {
        showToast('Registration failed: ' + error.message);
      }
    });
  }
  
  // Close toast on click
  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.style.display = 'none';
    });
  }
});

// Create placeholder image if not available
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzY0NzQ4YiI+RW1iYXNzeUNvbm5lY3QgUHJvPC90ZXh0Pjwvc3ZnPg==';
  }
}, true);
