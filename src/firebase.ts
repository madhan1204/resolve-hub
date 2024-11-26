// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbz0h-u4RFtKjfZjDs3bOtWI1rlQJjbNU",
  authDomain: "resolve-hub-d03dd.firebaseapp.com",
  projectId: "resolve-hub-d03dd",
  storageBucket: "resolve-hub-d03dd.appspot.com",
  messagingSenderId: "103764782513",
  appId: "1:103764782513:web:992daf5451460f8b1ae190",
  measurementId: "G-M0T2NVHC7D" // Optional: only needed if using Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment if needed later
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage

// Exporting Firebase services for use in other parts of the app
export { auth, db, storage }; // Add storage to exports
