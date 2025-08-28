// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCywzEAAjt3tyED4OvRygvl4I-qvFx5uk0",
    authDomain: "embassy-connect-pro.firebaseapp.com",
    databaseURL: "https://embassy-connect-pro-default-rtdb.firebaseio.com",
    projectId: "embassy-connect-pro",
    storageBucket: "embassy-connect-pro.firebasestorage.app",
    messagingSenderId: "900708378334",
    appId: "1:900708378334:web:495fd4b3fad1bdb8a7444f",
    measurementId: "G-07WHFVWJ75"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
