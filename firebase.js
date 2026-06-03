// ============================================================
// firebase.js — Configuración de Firebase
// Reemplaza los valores de firebaseConfig con los de tu proyecto
// ============================================================
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔧 PASO 1: Ve a https://console.firebase.google.com
// 🔧 PASO 2: Crea un proyecto → Agrega una app web
// 🔧 PASO 3: Copia aquí tu configuración
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usaremos en la app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
