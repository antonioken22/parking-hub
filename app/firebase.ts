// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALmOScT9q_Hz9hFpdATwkLoROMQ9aut78",
  authDomain: "parking-hub-5a342.firebaseapp.com",
  projectId: "parking-hub-5a342",
  storageBucket: "parking-hub-5a342.appspot.com",
  messagingSenderId: "914749719709",
  appId: "1:914749719709:web:c0fdcddeac137bd7094074"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const firestore = getFirestore(app);

export { app, auth, firestore };
