// ============================================================
// Dashboard.jsx — Panel principal con las listas del usuario
// CRUD de playlists: crear, leer, editar, eliminar
// ============================================================
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import PlaylistDetail from "./PlaylistDetail";

function Dashboard({ user }) {
  const [playlists, setPlaylists] = useState([]);       // Lista de playlists
  const [loading, setLoading] = useState(true);          // Estado de carga
  const [newName, setNewName] = useState("");             // Nombre nueva playlist
  const [newDesc, setNewDesc] = useState("");             // Descripción nueva playlist
  const [editingId, setEditingId] = useState(null);      // ID playlist en edición
  const [editName, setEditName] = useState("");           // Nombre en edición
  const [editDesc, setEditDesc] = useState("");           // Descripción en edición
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Playlist abierta
  const [showForm, setShowForm] = useState(false);        // Mostrar formulario

  // Cargar playlists del usuario al montar el componente
  useEffect(() => {
    loadPlaylists();
  }, []);

  // ── READ ──────────────────────────────────────────────────
  // Obtener solo las playlists que pertenecen al usuario actual
  const loadPlaylists = async () => {
    try {
      const q = query(
        collection(db, "playlists"),
        where("userId", "==", user.uid),   // Seguridad: solo mis playlists
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlaylists(data);
    } catch (error) {
      console.error("Error al cargar playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── CREATE ────────────────────────────────────────────────
  // Crear nueva playlist en Firestore
  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "playlists"), {
        name: newName.trim(),
        description: newDesc.trim(),
        userId: user.uid,           // Asociar al usuario actual
        userEmail: user.email,
        songCount: 0,
        createdAt: serverTimestamp(),
      });

      // Actualizar estado local sin recargar desde Firebase
      setPlaylists([
        {
          id: docRef.id,
          name: newName.trim(),
          description: newDesc.trim(),
          userId: user.uid,
          songCount: 0,
        },
        ...playlists,
      ]);

      setNewName("");
      setNewDesc("");
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear playlist:", error);
      alert("No se pudo crear la playlist.");
    }
  };

  // ── UPDATE ────────────────────────────────────────────────
  // Guardar cambios de nombre y descripción
  const saveEdit = async (playlistId) => {
    if (!editName.trim()) return;

    try {
      const ref = doc(db, "playlists", playlistId);
      await updateDoc(ref, {
        name: editName.trim(),
        description: editDesc.trim(),
      });

      // Actualizar estado local
      setPlaylists(
        playlists.map((p) =>
          p.id === playlistId
            ? { ...p, name: editName.trim(), description: editDesc.trim() }
            : p
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo actualizar la playlist.");
    }
  };

  // ── DELETE ────────────────────────────────────────────────
  // Eliminar playlist y todas sus canciones
  const deletePlaylist = async (playlistId) => {
    if (!confirm("¿Eliminar esta playlist y todas sus canciones?")) return;

    try {
      await deleteDoc(doc(db, "playlists", playlistId));
      setPlaylists(playlists.filter((p) => p.id !== playlistId));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la playlist.");
    }
  };

  // Iniciar edición de una playlist
  const startEdit = (playlist) => {
    setEditingId(playlist.id);
    setEditName(playlist.name);
    setEditDesc(playlist.description || "");
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Si hay una playlist seleccionada, mostrar su detalle
  if (selectedPlaylist) {
    return (
      <PlaylistDetail
        playlist={selectedPlaylist}
        user={user}
        onBack={() => {
          setSelectedPlaylist(null);
          loadPlaylists(); // Recargar para actualizar songCount
        }}
      />
    );
  }

  return (
    <div className="dashboard">
      {/* ── HEADER ── */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-logo">🎵</span>
          <div>
            <h1>Music Manager</h1>
            <p className="header-user">{user.email}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancelar" : "+ Nueva lista"}
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── FORMULARIO CREAR ── */}
      {showForm && (
        <form className="create-form" onSubmit={createPlaylist}>
          <h2>Nueva playlist</h2>
          <input
            type="text"
            placeholder="Nombre de la lista *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            maxLength={60}
            autoFocus
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            maxLength={120}
          />
          <button type="submit" className="btn-primary">
            Crear playlist
          </button>
        </form>
      )}

      {/* ── LISTA DE PLAYLISTS ── */}
      <main className="playlists-grid">
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner small" />
            <p>Cargando tus listas...</p>
          </div>
        ) : playlists.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎶</span>
            <h2>Aún no tienes listas</h2>
            <p>Crea tu primera playlist con el botón de arriba</p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              {editingId === playlist.id ? (
                /* ── MODO EDICIÓN ── */
                <div className="edit-form">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={60}
                    autoFocus
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descripción"
                    maxLength={120}
                  />
                  <div className="edit-actions">
                    <button
                      className="btn-primary small"
                      onClick={() => saveEdit(playlist.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn-ghost small"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* ── MODO VISTA ── */
                <>
                  <div
                    className="playlist-info"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <div className="playlist-cover">
                      {playlist.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="playlist-text">
                      <h3>{playlist.name}</h3>
                      {playlist.description && (
                        <p className="playlist-desc">{playlist.description}</p>
                      )}
                      <span className="song-count">
                        {playlist.songCount || 0} canciones
                      </span>
                    </div>
                  </div>
                  <div className="playlist-actions">
                    <button
                      className="btn-icon"
                      onClick={() => setSelectedPlaylist(playlist)}
                      title="Abrir"
                    >
                      ▶
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => startEdit(playlist)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => deletePlaylist(playlist.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;
