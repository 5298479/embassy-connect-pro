// app.js (ES module)

// Top-level imports — MUST be here (not inside DOMContentLoaded)
import { auth, db } from "./firebaseauth.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

  // Guard: fail fast if HTML doesn't match expected IDs/classes
  if (!formBox || !loginBtn || !registerBtn || !loginForm || !registerForm) {
    console.error("❌ Required elements missing. Check HTML ids/classes.");
    return;
  }

  // --- Switch functions (UI toggle) ---
  function showLogin() {
    formBox.classList.remove("show-register");
    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");
    loginBtn.setAttribute("aria-selected", "true");
    registerBtn.setAttribute("aria-selected", "false");
    const el = document.getElementById("loginEmail");
    if (el) el.focus();
  }

  function showRegister() {
    formBox.classList.add("show-register");
    registerBtn.classList.add("active");
    loginBtn.classList.remove("active");
    registerBtn.setAttribute("aria-selected", "true");
    loginBtn.setAttribute("aria-selected", "false");
    const el = document.getElementById("registerName");
    if (el) el.focus();
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

  // --- Helpers ---
  function sanitize(str) {
    return String(str).trim();
  }

  // --- Login handler ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.textContent = "";

    const email = sanitize(document.getElementById("loginEmail").value);
    const password = sanitize(document.getElementById("loginPassword").value);

    if (!email || !password) {
      loginMessage.textContent = "Please provide email and password.";
      return;
    }

    const submitBtn = loginForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = 0.8;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      loginMessage.textContent = `✅ Welcome back, ${userCred.user.email}`;
      console.log("Logged in user:", userCred.user);

      // Redirect to homepage after login
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1200);
    } catch (err) {
      console.error("Login error:", err);
      loginMessage.textContent = err.message || "Login failed";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
      }
    }
  });

  // --- Register handler ---
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

    if (password.length < 6) {
      registerMessage.textContent = "Password must be at least 6 characters.";
      return;
    }

    const submitBtn = registerForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = 0.8;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      // Store user info in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
      });

      registerMessage.textContent = "✅ Registered successfully. Redirecting...";
      console.log("New user stored in Firestore:", userCred.user);

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      registerMessage.textContent = err.message || "Registration failed";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
      }
    }
  });

  // Initial focus
  const loginEmailInput = document.getElementById("loginEmail");
  if (loginEmailInput) loginEmailInput.focus();
});
