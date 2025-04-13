// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";  // Correct

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt3xrWWKUpeHz4EKt5lxzHbT0FRf2xzEI",
  authDomain: "aitrip-b3f2c.firebaseapp.com",
  projectId: "aitrip-b3f2c",
  storageBucket: "aitrip-b3f2c.firebasestorage.app",
  messagingSenderId: "179244630063",
  appId: "1:179244630063:web:7aba2369804fac561606da",
  measurementId: "G-49RNLHMXEZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const db=getFirestore(app);
// const analytics = getAnalytics(app);