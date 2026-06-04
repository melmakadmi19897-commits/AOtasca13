// ============================================================
// firebase.js — Configuración de Firebase
// Reemplaza los valores de firebaseConfig con los de tu proyecto
// ============================================================
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1g2Za33HW7CFBWqltXS42V8o70uUkiLU",
  authDomain: "appmoha-f8a02.firebaseapp.com",
  projectId: "appmoha-f8a02",
  storageBucket: "appmoha-f8a02.firebasestorage.app",
  messagingSenderId: "915035597905",
  appId: "1:915035597905:web:c0dd2be404a4ef6cb1dc70",
  measurementId: "G-4SKY6BFZMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar servicios que usaremos en la app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
