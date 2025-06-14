// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqrqjHX2CjuE-raFsWs2ZwIWv8Znrtro4",
  authDomain: "eventwise-25.firebaseapp.com",
  projectId: "eventwise-25",
  storageBucket: "eventwise-25.firebasestorage.app",
  messagingSenderId: "484809724771",
  appId: "1:484809724771:web:a261829426415737b8b956"
};

// console.log(import.meta.env.VITE_FIREBASE_APPID)
// console.log(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID)
// console.log(import.meta.env.VITE_FIREBASE_APIKEY)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { storage, auth, onAuthStateChanged, db };
// const analytics = getAnalytics(app);