// firebaseauth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCywzEAAjt3tyED4OvRygvl4I-qvFx5uk0",
  authDomain: "embassy-connect-pro.firebaseapp.com",
  databaseURL: "https://embassy-connect-pro-default-rtdb.firebaseio.com",
  projectId: "embassy-connect-pro",
  storageBucket: "embassy-connect-pro.appspot.com", // fixed
  messagingSenderId: "900708378334",
  appId: "1:900708378334:web:495fd4b3fad1bdb8a7444f",
  measurementId: "G-07WHFVWJ75"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
