// ============================================================
// Login.jsx — Pantalla de inicio de sesión con Google
// ============================================================
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  // Iniciar sesión con la cuenta de Google del usuario
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // App.jsx detecta el cambio y muestra el Dashboard automáticamente
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("No se pudo iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">🎵</span>
          <h1>Music Manager</h1>
          <p className="login-subtitle">Tus listas de música, siempre contigo</p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <span>🎧</span>
            <span>Crea listas personalizadas</span>
          </div>
          <div className="feature-item">
            <span>➕</span>
            <span>Añade y edita canciones</span>
          </div>
          <div className="feature-item">
            <span>☁️</span>
            <span>Guardado automático en la nube</span>
          </div>
        </div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width="20"
            height="20"
          />
          Continuar con Google
        </button>

        <p className="login-footer">
          Solo tú puedes ver y editar tus listas
        </p>
      </div>
    </div>
  );
}

export default Login;
