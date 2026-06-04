// ============================================================
// App.jsx — Componente raíz con gestión de autenticación
// ============================================================
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  // Estado: usuario autenticado o null
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios de sesión (login / logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Limpiar suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  // Si hay usuario autenticado → Dashboard, si no → Login
  return user ? <Dashboard user={user} /> : <Login />;
}

export default App;
