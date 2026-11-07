// Address of the Flask backend that runs the trained models.
//
//  - Local dev:   "http://127.0.0.1:5000/predict"
//  - Production:  "https://homeworth-api.onrender.com/predict"
//  - Design-only: "" — shows placeholder numbers, no backend needed
//
// Auto-detects local vs. deployed:
const API_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://127.0.0.1:5000/predict"
  : "https://homeworth-api.onrender.com/predict";
