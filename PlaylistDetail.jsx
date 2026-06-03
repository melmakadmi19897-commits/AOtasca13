// ============================================================
// PlaylistDetail.jsx — Vista de canciones dentro de una playlist
// CRUD completo de canciones
// ============================================================
import { useState, useEffect } from "react";
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
import { db } from "../firebase";

function PlaylistDetail({ playlist, user, onBack }) {
  const [songs, setSongs] = useState([]);          // Canciones de la playlist
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Campos para nueva canción
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    genre: "",
  });

  // Campos para canción en edición
  const [editSong, setEditSong] = useState({});

  // Géneros musicales disponibles
  const genres = ["Pop", "Rock", "Hip-Hop", "R&B", "Electrónica", "Jazz",
                  "Clásica", "Reggaeton", "Latin", "Metal", "Indie", "Otro"];

  useEffect(() => {
    loadSongs();
  }, []);

  // ── READ ──────────────────────────────────────────────────
  const loadSongs = async () => {
    try {
      const q = query(
        collection(db, "songs"),
        where("playlistId", "==", playlist.id),
        where("userId", "==", user.uid),    // Seguridad: solo mis canciones
        orderBy("createdAt", "asc")
      );
      const snapshot = await getDocs(q);
      setSongs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error al cargar canciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── CREATE ────────────────────────────────────────────────
  const addSong = async (e) => {
    e.preventDefault();
    if (!newSong.title.trim() || !newSong.artist.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "songs"), {
        ...newSong,
        title: newSong.title.trim(),
        artist: newSong.artist.trim(),
        album: newSong.album.trim(),
        playlistId: playlist.id,
        userId: user.uid,             // Asociar al usuario
        createdAt: serverTimestamp(),
      });

      // Actualizar estado local
      setSongs([...songs, { id: docRef.id, ...newSong, playlistId: playlist.id }]);

      // Actualizar contador de canciones en la playlist
      await updateDoc(doc(db, "playlists", playlist.id), {
        songCount: songs.length + 1,
      });

      setNewSong({ title: "", artist: "", album: "", duration: "", genre: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error al añadir canción:", error);
      alert("No se pudo añadir la canción.");
    }
  };

  // ── UPDATE ────────────────────────────────────────────────
  const saveEditSong = async (songId) => {
    if (!editSong.title?.trim() || !editSong.artist?.trim()) return;

    try {
      await updateDoc(doc(db, "songs", songId), {
        title: editSong.title.trim(),
        artist: editSong.artist.trim(),
        album: editSong.album?.trim() || "",
        duration: editSong.duration || "",
        genre: editSong.genre || "",
      });

      setSongs(songs.map((s) => (s.id === songId ? { ...s, ...editSong } : s)));
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo actualizar la canción.");
    }
  };

  // ── DELETE ────────────────────────────────────────────────
  const deleteSong = async (songId) => {
    if (!confirm("¿Eliminar esta canción?")) return;

    try {
      await deleteDoc(doc(db, "songs", songId));
      const newSongs = songs.filter((s) => s.id !== songId);
      setSongs(newSongs);

      // Actualizar contador
      await updateDoc(doc(db, "playlists", playlist.id), {
        songCount: newSongs.length,
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const startEditSong = (song) => {
    setEditingId(song.id);
    setEditSong({ ...song });
  };

  return (
    <div className="playlist-detail">
      {/* ── HEADER ── */}
      <header className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← Mis listas
        </button>
        <div className="detail-title">
          <div className="playlist-cover large">
            {playlist.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{playlist.name}</h1>
            {playlist.description && <p>{playlist.description}</p>}
            <span className="song-count">{songs.length} canciones</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancelar" : "+ Añadir canción"}
        </button>
      </header>

      {/* ── FORMULARIO NUEVA CANCIÓN ── */}
      {showForm && (
        <form className="create-form song-form" onSubmit={addSong}>
          <h2>Nueva canción</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Título *"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              required
              maxLength={100}
              autoFocus
            />
            <input
              type="text"
              placeholder="Artista *"
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              required
              maxLength={100}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Álbum (opcional)"
              value={newSong.album}
              onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
              maxLength={100}
            />
            <input
              type="text"
              placeholder="Duración (ej: 3:45)"
              value={newSong.duration}
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
              maxLength={10}
            />
          </div>
          <select
            value={newSong.genre}
            onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
          >
            <option value="">Género (opcional)</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button type="submit" className="btn-primary">
            Añadir canción
          </button>
        </form>
      )}

      {/* ── LISTA DE CANCIONES ── */}
      <main className="songs-list">
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner small" />
            <p>Cargando canciones...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎸</span>
            <h2>Esta lista está vacía</h2>
            <p>Añade tu primera canción con el botón de arriba</p>
          </div>
        ) : (
          <table className="songs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Artista</th>
                <th>Álbum</th>
                <th>Género</th>
                <th>⏱</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.id}>
                  {editingId === song.id ? (
                    /* ── FILA EN EDICIÓN ── */
                    <>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          value={editSong.title}
                          onChange={(e) =>
                            setEditSong({ ...editSong, title: e.target.value })
                          }
                          className="inline-input"
                          autoFocus
                        />
                      </td>
                      <td>
                        <input
                          value={editSong.artist}
                          onChange={(e) =>
                            setEditSong({ ...editSong, artist: e.target.value })
                          }
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <input
                          value={editSong.album || ""}
                          onChange={(e) =>
                            setEditSong({ ...editSong, album: e.target.value })
                          }
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <select
                          value={editSong.genre || ""}
                          onChange={(e) =>
                            setEditSong({ ...editSong, genre: e.target.value })
                          }
                          className="inline-input"
                        >
                          <option value="">—</option>
                          {genres.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          value={editSong.duration || ""}
                          onChange={(e) =>
                            setEditSong({ ...editSong, duration: e.target.value })
                          }
                          className="inline-input"
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td className="action-cell">
                        <button
                          className="btn-primary small"
                          onClick={() => saveEditSong(song.id)}
                        >
                          ✓
                        </button>
                        <button
                          className="btn-ghost small"
                          onClick={() => setEditingId(null)}
                        >
                          ✕
                        </button>
                      </td>
                    </>
                  ) : (
                    /* ── FILA NORMAL ── */
                    <>
                      <td className="song-number">{index + 1}</td>
                      <td className="song-title">{song.title}</td>
                      <td className="song-artist">{song.artist}</td>
                      <td className="song-album">{song.album || "—"}</td>
                      <td>
                        {song.genre ? (
                          <span className="genre-badge">{song.genre}</span>
                        ) : "—"}
                      </td>
                      <td className="song-duration">{song.duration || "—"}</td>
                      <td className="action-cell">
                        <button
                          className="btn-icon"
                          onClick={() => startEditSong(song)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => deleteSong(song.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default PlaylistDetail;
