// app.js
// All DOM lookups/listeners inside DOMContentLoaded for safe initialization
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded; DOM ready");

  // Elements
  const formBox = document.querySelector(".form-box");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginMessage = document.getElementById("loginMessage");
  const registerMessage = document.getElementById("registerMessage");

  // Sanity checks
  if (!formBox || !loginBtn || !registerBtn || !loginForm || !registerForm) {
    console.error("❌ Required elements are missing. Check HTML ids/classes.");
    return;
  }

  // --- Switch functions (also manage ARIA) ---
  function showLogin() {
    formBox.classList.remove("show-register");
    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");
    loginBtn.setAttribute("aria-selected", "true");
    registerBtn.setAttribute("aria-selected", "false");
    // move focus to first login input for accessibility
    document.getElementById("loginEmail").focus();
  }

  function showRegister() {
    formBox.classList.add("show-register");
    registerBtn.classList.add("active");
    loginBtn.classList.remove("active");
    registerBtn.setAttribute("aria-selected", "true");
    loginBtn.setAttribute("aria-selected", "false");
    // move focus to first register input
    document.getElementById("registerName").focus();
  }

  // Attach tab toggle events
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });

  // --- Simple client-side validation helper ---
  function sanitize(str) {
    return String(str).trim();
  }

  // Emulate submitting to server (placeholder). Replace with fetch to real API.
  async function fakeSubmit(data, endpoint) {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 700));
    return { ok: true, message: `${endpoint} success (demo)` };
  }

  // Login submit handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.textContent = "";
    const email = sanitize(document.getElementById("loginEmail").value);
    const password = sanitize(document.getElementById("loginPassword").value);

    if (!email || !password) {
      loginMessage.textContent = "Please provide email and password.";
      return;
    }

    // Disable submit while processing
    const submitBtn = loginForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.8;

    try {
      const res = await fakeSubmit({ email, password }, "login");
      if (res.ok) {
        loginMessage.textContent = "✅ Login successful (demo).";
      } else {
        loginMessage.textContent = res.message || "Login failed.";
      }
    } catch (err) {
      console.error(err);
      loginMessage.textContent = "Network error. Try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = 1;
    }
  });

  // Register submit handler
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = "";
    const name = sanitize(document.getElementById("registerName").value);
    const email = sanitize(document.getElementById("registerEmail").value);
    const password = sanitize(document.getElementById("registerPassword").value);

    if (!name || !email || !password) {
      registerMessage.textContent = "All fields are required.";
      return;
    }

    // Example: minimal password strength check
    if (password.length < 6) {
      registerMessage.textContent = "Password must be at least 6 characters.";
      return;
    }

    const submitBtn = registerForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.8;

    try {
      const res = await fakeSubmit({ name, email, password }, "register");
      if (res.ok) {
        registerMessage.textContent = "✅ Registered (demo). Now logging in...";
        // switch back to login or clear form
        setTimeout(() => {
          registerForm.reset();
          showLogin();
        }, 1000);
      } else {
        registerMessage.textContent = res.message || "Registration failed.";
      }
    } catch (err) {
      console.error(err);
      registerMessage.textContent = "Network error. Try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = 1;
    }
  });

  // Ensure initial focus on the first field
  document.getElementById("loginEmail").focus();
});
