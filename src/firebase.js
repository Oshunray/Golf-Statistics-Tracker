// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH0IQ-N2gT9g7nmM7rxl_tVAz5pHBhGME",
  authDomain: "golf-statistics-tracker.firebaseapp.com",
  projectId: "golf-statistics-tracker",
  storageBucket: "golf-statistics-tracker.firebasestorage.app",
  messagingSenderId: "1044896537058",
  appId: "1:1044896537058:web:6c861cf7e9cce2cd09c1bb",
  measurementId: "G-F3BP26RVHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export { db };