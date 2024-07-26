import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8_dkUAnbZQWK72eU87mVp_mo9DyU4Aew",
  authDomain: "parking-hub-presentation.firebaseapp.com",
  projectId: "parking-hub-presentation",
  storageBucket: "parking-hub-presentation.appspot.com",
  messagingSenderId: "372530545580",
  appId: "1:372530545580:web:d7cddb183cb1e06137f009",
  measurementId: "G-92695FGRDC"
};

// Spinning up Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication
const auth = getAuth(app);

// Firebase Firestore
const firestore = getFirestore(app);

// Firebase Messaging
const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

//Firebase Storage
const storage = getStorage(app);

export { app, auth, firestore, storage, messaging };
