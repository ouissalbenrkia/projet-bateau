import os
import psycopg2
import psycopg2.extras
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_conn():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        dbname=os.environ.get("DB_NAME", "tpfullstack"),
        user=os.environ.get("DB_USER", "tpadmin"),
        password=os.environ.get("DB_PASSWORD"),
        connect_timeout=5,
    )

@app.route("/api/reservations", methods=["GET"])
def get_reservations():
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT r.*, b.nom as bateau_nom 
                FROM reservations r 
                JOIN bateaux b ON r.bateau_id = b.id 
                ORDER BY r.created_at DESC
            """)
            return jsonify([dict(r) for r in cur.fetchall()])

@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json()
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT prix_heure, caution FROM bateaux WHERE id = %s", (data["bateau_id"],))
            bateau = cur.fetchone()
            montant = float(bateau["prix_heure"]) * int(data["duree_heures"])
            cur.execute("""
                INSERT INTO reservations 
                (client_nom, client_email, bateau_id, date_debut, duree_heures, montant_total)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (data["client_nom"], data["client_email"], data["bateau_id"],
                  data["date_debut"], data["duree_heures"], montant))
            new_res = dict(cur.fetchone())
        conn.commit()
    return jsonify(new_res), 201

@app.route("/api/reservations/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "reservations-service"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)