# 🏠 HomeWorth — House Price & Area Estimator

> Predict a house's **area (sq.ft)** and **price (₹)** from its features using two Random Forest models.

---

## 📌 Features

- **Dual Prediction:** Estimates both area and price simultaneously
- **Live House Illustration:** Interactive drawing that updates based on chosen inputs
- **Pre-trained Models:** 2 × Random Forest Regressors trained on 2,000 housing records
- **Interactive UI:** Clean web interface built with vanilla HTML, CSS, and JavaScript
- **REST API:** Lightweight Flask backend with `/predict` and `/health` endpoints

---

## 📁 Project Structure

```
Homeworth/
├── frontend/                  # Web interface (HTML, CSS, JS)
│   ├── index.html             # Main application page
│   ├── css/style.css          # Styling
│   └── js/
│       ├── app.js             # Form handling & prediction display
│       ├── config.js          # API URL configuration
│       └── drawing.js         # Dynamic house visualization
├── backend/                   # Python Flask API & ML pipeline
│   ├── app.py                 # Flask server
│   ├── train_model.py         # Model training script
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Saved models (price_model.pkl, area_model.pkl)
│   └── data/                  # Dataset folder
├── docs/                      # GitHub Pages deployment build
├── LICENSE                    # MIT License
└── README.md
```

---

## 🧠 Model Details

- **Algorithm:** Random Forest Regressor (100 estimators each)
- **Dataset:** 2,000 records (80% train / 20% test split)
- **Area Model Performance:** $R^2 \approx 0.88$, $\text{MAE} \approx 146\text{ sq.ft}$
- **Price Model Performance:** $R^2 \approx 0.51$, $\text{MAE} \approx ₹62,880$

### Input Features

| Feature | Type / Options | Description |
|---|---|---|
| `bedrooms` | Integer (1–6) | Number of bedrooms |
| `bathrooms` | Integer (1–4) | Number of bathrooms |
| `stories` | Integer (1–4) | Number of floors |
| `parking` | Integer (0–3) | Parking spaces |
| `mainroad` | Yes / No | Connected to main road |
| `guestroom` | Yes / No | Dedicated guest room |
| `basement` | Yes / No | Basement available |
| `hotwaterheating` | Yes / No | Hot water heating system |
| `airconditioning` | Yes / No | Central air conditioning |
| `prefarea` | Yes / No | Located in preferred area |
| `furnishingstatus` | Furnished / Semi-Furnished / Unfurnished | Furnishing state |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](https://github.com/aakankshamore22004/Homeworth/blob/main/LICENSE) file for details.

---

## 📬 Contact

Questions or feedback? Reach out: [aakankshamore22004@gmail.com](mailto:aakankshamore22004@gmail.com)

> ⚠️ Estimates are indicative only — not a formal property valuation.
