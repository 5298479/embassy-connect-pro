
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

// Show toast notification
function showToast(message, duration = 3000) {
  toastMessage.textContent = message;
  toast.style.display = 'flex';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// Check if user is logged in
function checkAuth() {
  // Initialize Firebase
  const firebase = initializeFirebase();
  
  // Set up auth state listener
  onAuthStateChanged((user) => {
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
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Handle logout
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await logoutUser();
        showToast('Logged out successfully');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        showToast('Logout failed: ' + error.message);
      }
    });
  }
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        await loginUser(email, password);
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
        await registerUser(firstName, lastName, email, password);
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
