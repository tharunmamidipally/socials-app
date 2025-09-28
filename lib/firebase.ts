// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBD3Dty4pxkk2TXkZiBOLekUcDD5Vfahlk",
  authDomain: "socials-9a194.firebaseapp.com",
  projectId: "socials-9a194",
  storageBucket: "socials-9a194.firebasestorage.app",
  messagingSenderId: "576279866599",
  appId: "1:576279866599:web:248b562f22ff05d7870642",
}

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig)

// ✅ Initialize Firestore and Auth
export const db = getFirestore(app)
export const auth = getAuth(app)
