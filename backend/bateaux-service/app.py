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

@app.route("/api/bateaux", methods=["GET"])
def get_bateaux():
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM bateaux WHERE disponible = true ORDER BY id")
            return jsonify([dict(r) for r in cur.fetchall()])

@app.route("/api/bateaux/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "bateaux-service"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)