
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCywzEAAjt3tyED4OvRygvl4I-qvFx5uk0",
  authDomain: "embassy-connect-pro.firebaseapp.com",
  projectId: "embassy-connect-pro",
  storageBucket: "embassy-connect-pro.appspot.com",
  messagingSenderId: "900708378334",
  appId: "1:900708378334:web:4ec9b4848cf03cbfa7444f",
  measurementId: "G-7VGCKRFTX2"
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
    console.log("Attempting to register user:", email);
    // Create user with email and password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("User created in Authentication:", user.uid);
    
    // Add user details to Firestore
    await db().collection('users').doc(user.uid).set({
      firstName,
      lastName,
      email,
      created_at: new Date().toISOString()
    });
    
    console.log("User data stored in Firestore");
    
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
    console.log("Attempting to login user:", email);
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("User authenticated:", user.uid);
    
    // Get user details from Firestore
    const userDoc = await db().collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log("User data retrieved from Firestore");
      return {
        id: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        created_at: userData.created_at
      };
    }
    console.log("User document not found in Firestore");
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
      console.log("Auth state changed: User is signed in", user.uid);
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
        console.log("User document not found in Firestore");
        callback(null);
      }
    } else {
      console.log("Auth state changed: User is signed out");
      callback(null);
    }
  });
};

// Logout
const logoutUser = () => {
  console.log("Logging out user");
  return auth().signOut();
};
