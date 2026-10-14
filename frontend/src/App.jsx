import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PHOTOS = {
  "Le Mistral": "https://d44zgudklhaaj.cloudfront.net/mistral.jpg",
  "Jet Ski Pro 300": "https://d44zgudklhaaj.cloudfront.net/jetski-pro.jpg",
  "Le Soleil": "https://d44zgudklhaaj.cloudfront.net/soleil.jpg",
  "Jet Ski Speed X": "https://d44zgudklhaaj.cloudfront.net/jetski-speed.jpg",
};

function App() {
  const [bateaux, setBateaux] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({
    client_nom: "",
    client_email: "",
    bateau_id: "",
    date_debut: "",
    duree_heures: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/bateaux`).then(r => setBateaux(r.data)).catch(() => {});
    axios.get(`${API_URL}/api/reservations`).then(r => setReservations(r.data)).catch(() => {});
  }, []);

  const handleReserver = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/reservations`, {
        ...newReservation,
        duree_heures: parseInt(newReservation.duree_heures),
      });
      setReservations([...reservations, res.data]);
      setNewReservation({ client_nom: "", client_email: "", bateau_id: "", date_debut: "", duree_heures: "" });
      alert("Réservation confirmée !");
    } catch (err) {
      alert("Erreur lors de la réservation");
    }
  };

  const inputStyle = { padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", width: "100%", fontSize: 14 };
  const btnStyle = { padding: "12px 24px", background: "#0C2340", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16, width: "100%" };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ color: "#0C2340", fontSize: 32 }}>⛵ Plateforme de Réservation de Bateaux</h1>
        <p style={{ color: "#0F6E56", fontWeight: "bold", fontSize: 16 }}>Ouissal Benrkia & Aya Ramdani & Abdellah raqni & Mohammed Amine Arrabat — 4GI E</p>
      </div>

      {/* Bateaux disponibles */}
      <section style={{ marginBottom: 30 }}>
        <h2 style={{ color: "#0C2340", borderBottom: "2px solid #0F6E56", paddingBottom: 8 }}>🚤 Bateaux & Jet Skis disponibles</h2>
        {bateaux.length === 0 ? <p>Chargement...</p> :
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {bateaux.map(b => (
              <div key={b.id} style={{ background: "#E1F5EE", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <img
                  src={PHOTOS[b.nom]}
                  alt={b.nom}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=" + b.nom}
                />
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: "0 0 8px", color: "#0C2340" }}>{b.nom}</h3>
                  <p style={{ margin: "4px 0", color: "#5F5E5A" }}>Type : <b>{b.type}</b></p>
                  <p style={{ margin: "4px 0", color: "#5F5E5A" }}>Prix : <b style={{ color: "#0F6E56" }}>{b.prix_heure} MAD/h</b></p>
                  <p style={{ margin: "4px 0", color: "#5F5E5A" }}>Caution : <b>{b.caution} MAD</b></p>
                </div>
              </div>
            ))}
          </div>
        }
      </section>

      {/* Formulaire réservation */}
      <section style={{ background: "#E6F1FB", padding: 24, borderRadius: 12, marginBottom: 30 }}>
        <h2 style={{ color: "#0C2340", marginTop: 0 }}>📋 Faire une réservation</h2>
        <form onSubmit={handleReserver} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input style={inputStyle} placeholder="Votre nom complet" value={newReservation.client_nom}
            onChange={e => setNewReservation({ ...newReservation, client_nom: e.target.value })} required />
          <input style={inputStyle} placeholder="Votre email" type="email" value={newReservation.client_email}
            onChange={e => setNewReservation({ ...newReservation, client_email: e.target.value })} required />
          <select style={inputStyle} value={newReservation.bateau_id}
            onChange={e => setNewReservation({ ...newReservation, bateau_id: e.target.value })} required>
            <option value="">-- Choisir un bateau --</option>
            {bateaux.map(b => <option key={b.id} value={b.id}>{b.nom} — {b.prix_heure} MAD/h</option>)}
          </select>
          <input style={inputStyle} type="datetime-local" value={newReservation.date_debut}
            onChange={e => setNewReservation({ ...newReservation, date_debut: e.target.value })} required />
          <input style={inputStyle} placeholder="Durée (heures)" type="number" min="1" value={newReservation.duree_heures}
            onChange={e => setNewReservation({ ...newReservation, duree_heures: e.target.value })} required />
          <button type="submit" style={btnStyle}>⛵ Confirmer la réservation</button>
        </form>
      </section>

      {/* Liste réservations */}
      <section style={{ background: "#f5f5f5", padding: 24, borderRadius: 12 }}>
        <h2 style={{ color: "#0C2340", marginTop: 0 }}>📅 Réservations en cours</h2>
        {reservations.length === 0 ? <p>Aucune réservation</p> :
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reservations.map(r => (
              <li key={r.id} style={{ background: "white", padding: 12, borderRadius: 8, marginBottom: 8, borderLeft: "4px solid #0F6E56" }}>
                <b>{r.client_nom}</b> — {r.bateau_nom} — {r.duree_heures}h — <b style={{ color: "#0F6E56" }}>{r.montant_total} MAD</b>
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
}

export default App;