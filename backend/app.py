"""Flask API for the house price and area models.

Run:  python app.py        then open http://127.0.0.1:5000
"""
from pathlib import Path
import pickle

import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE = Path(__file__).resolve().parent
FRONTEND = BASE.parent / "frontend"

# Same columns, same order as X.columns in the notebook.
FEATURES = [
    "bedrooms", "bathrooms", "stories", "mainroad", "guestroom", "basement",
    "hotwaterheating", "airconditioning", "parking", "prefarea",
    "furnishingstatus_semi-furnished", "furnishingstatus_unfurnished",
]


def load_model(name):
    path = BASE / "models" / name
    if not path.exists():
        raise SystemExit(
            f"Missing {path}. Copy your .pkl files into backend/models/ "
            "or run  python train_model.py  first."
        )
    with open(path, "rb") as f:
        return pickle.load(f)


price_model = load_model("price_model.pkl")
area_model = load_model("area_model.pkl")

app = Flask(__name__)
CORS(app)  # lets the GitHub Pages site call this API


@app.get("/")
def home():
    return send_from_directory(FRONTEND, "index.html")


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    missing = [c for c in FEATURES if c not in data]
    if missing:
        return jsonify(error="Missing fields: " + ", ".join(missing)), 400
    try:
        row = pd.DataFrame([[float(data[c]) for c in FEATURES]], columns=FEATURES)
    except (TypeError, ValueError):
        return jsonify(error="All fields must be numbers."), 400

    area = float(area_model.predict(row)[0])
    price = float(price_model.predict(row)[0])
    return jsonify(area=round(area, 2), price=round(price, 2))


@app.get("/<path:filename>")
def assets(filename):
    return send_from_directory(FRONTEND, filename)


if __name__ == "__main__":
    app.run(debug=True)
