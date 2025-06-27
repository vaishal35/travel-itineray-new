// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyDK5q6dKh1LOO4UyqmbAEokMPqSSQ2HK2c",
    authDomain: "itinerary-87c8a.firebaseapp.com",
    projectId: "itinerary-87c8a",
    storageBucket: "itinerary-87c8a.firebasestorage.app",
    messagingSenderId: "896853687698",
    appId: "1:896853687698:web:7a6e70d500483d8733154b",
    measurementId: "G-PJ9L0KH0YB"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
