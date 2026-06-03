# 🎵 Music Manager

Aplicación web para gestionar listas de música personales. Cada usuario puede crear, editar y eliminar sus propias playlists y canciones.

**Tecnologías:** React · Firebase Authentication · Firestore · Vite

---

## ⚙️ Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/TU_USUARIO/music-manager.git
cd music-manager
npm install
```

### 2. Configura Firebase

1. Ve a [firebase.google.com](https://firebase.google.com) e inicia sesión.
2. Crea un nuevo proyecto.
3. En **Authentication → Sign-in method**, activa **Google**.
4. En **Firestore Database**, crea una base de datos en modo producción.
5. En **Configuración del proyecto → Tus apps**, añade una app web y copia el objeto `firebaseConfig`.
6. Pega la configuración en `src/firebase.js`.

### 3. Configura las reglas de seguridad

En Firebase Console → Firestore → Rules, copia el contenido de `firestore.rules`.

### 4. Ejecuta la app

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📦 Despliegue en GitHub Pages

```bash
npm run build
# Sube la carpeta dist/ a la rama gh-pages
```

O usa el paquete `gh-pages`:

```bash
npm install --save-dev gh-pages
```

Añade en `package.json`:
```json
"homepage": "https://TU_USUARIO.github.io/music-manager",
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Luego: `npm run build && npm run deploy`

---

## 📁 Estructura del proyecto

```
src/
├── firebase.js              # Configuración de Firebase
├── App.jsx                  # Componente raíz + gestión de auth
├── index.css                # Estilos globales
├── main.jsx                 # Punto de entrada
└── components/
    ├── Login.jsx             # Pantalla de inicio de sesión
    ├── Dashboard.jsx         # Lista de playlists (CRUD)
    └── PlaylistDetail.jsx    # Canciones de una playlist (CRUD)
```

---

## 🔒 Seguridad implementada

- **Autenticación con Google** via Firebase Auth
- **Reglas de Firestore**: cada usuario solo puede leer y escribir sus propios documentos
- **Filtrado por userId** en todas las consultas a la base de datos

---

## 📖 Manual de usuario

Ver el archivo [MANUAL_USUARIO.md](./MANUAL_USUARIO.md)
