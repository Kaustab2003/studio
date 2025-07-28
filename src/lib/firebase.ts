// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "photo-poet-6ej5k",
  appId: "1:269705054177:web:fd6efc718f084e4ad574a0",
  storageBucket: "photo-poet-6ej5k.firebasestorage.app",
  apiKey: "AIzaSyB9Khm3E4QQ75GwWvjE6NyZzkYUyjDFKaU",
  authDomain: "photo-poet-6ej5k.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "269705054177"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
