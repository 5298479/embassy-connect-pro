
// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const initializeFirebase = () => {
  // Initialize Firebase only if it hasn't been initialized yet
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase;
};

// Auth functions
const auth = () => firebase.auth();
const db = () => firebase.firestore();

// User registration
const registerUser = async (firstName, lastName, email, password) => {
  try {
    // Create user with email and password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Add user details to Firestore
    await db().collection('users').doc(user.uid).set({
      firstName,
      lastName,
      email,
      created_at: new Date().toISOString()
    });
    
    return {
      id: user.uid,
      firstName,
      lastName,
      email,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// User login
const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Get user details from Firestore
    const userDoc = await db().collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return {
        id: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        created_at: userData.created_at
      };
    }
    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Check auth state
const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        callback({
          id: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          created_at: userData.created_at
        });
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Logout
const logoutUser = () => {
  return auth().signOut();
};

