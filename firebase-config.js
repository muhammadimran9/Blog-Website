// Firebase Configuration - Client-side only
// No server required - works directly with GitHub Pages

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAHggfL_VVnMnVUKqV92r8gtd6WE6IWohE",
    authDomain: "blogstech-51a16.firebaseapp.com",
    projectId: "blogstech-51a16",
    storageBucket: "blogstech-51a16.firebasestorage.app",
    messagingSenderId: "648513363852",
    appId: "1:648513363852:web:6fd46645ca30fbaf1080a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export Firestore functions
export { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit };

// Export Auth functions
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };

console.log("🔥 Firebase initialized - No server required!");