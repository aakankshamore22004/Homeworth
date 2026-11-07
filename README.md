# 🏠 HomeWorth — House Price & Area Estimator

> Predict a house's **area (sq.ft)** and **price (₹)** from its features using two Random Forest models trained on 2,000 real housing records.

---

## 📸 Preview

| Feature | Detail |
|---|---|
| **Models** | 2 × Random Forest (100 trees each) |
| **Training data** | 2,000 house records (1,600 train / 400 test) |
| **Price model R²** | ~0.51 |
| **Area model R²** | ~0.88 |
| **Tech stack** | Python · Flask · scikit-learn · Vanilla JS |

---

## 📁 Project Structure

```
house-price-project/
│
├── frontend/                  # Static UI (HTML + CSS + JS)
│   ├── index.html             # Main page
│   ├── css/
│   │   └── style.css          # All styles
│   └── js/
│       ├── config.js          # API endpoint configuration
│       ├── drawing.js         # Live house illustration (SVG/Canvas)
│       └── app.js             # Form logic, API calls, results
│
├── backend/                   # Python Flask API
│   ├── app.py                 # Flask server (serves frontend + /predict)
│   ├── train_model.py         # Trains & saves the ML models
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Trained model files (generated — not in git)
│   │   ├── price_model.pkl
│   │   └── area_model.pkl
│   └── data/                  # Dataset (not in git — add your own CSV)
│       └── Housing_Prices_Dataset_2000_Records.csv
│
├── .gitignore
└── README.md
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.9+
- pip

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/aakankshamore22004/Homeworth.git
cd Homeworth
```

**2. Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

**3. Add the dataset**

Place your `Housing_Prices_Dataset_2000_Records.csv` inside `backend/data/`.

The CSV must have these columns:
```
price, area, bedrooms, bathrooms, stories,
mainroad, guestroom, basement, hotwaterheating,
airconditioning, parking, prefarea, furnishingstatus
```

**4. Train the models**
```bash
python train_model.py
```
This generates `backend/models/price_model.pkl` and `backend/models/area_model.pkl`.

**5. Start the server**
```bash
python app.py
```

**6. Open in browser**
```
http://127.0.0.1:5000
```

---

## 🌐 Deploy Online

### Backend (Render / PythonAnywhere)
- Upload the `backend/` folder
- Start command: `gunicorn app:app`
- Match your local scikit-learn version: `pip show scikit-learn`

### Frontend (GitHub Pages)
- Set `API_URL` in `frontend/js/config.js` to your deployed backend URL
- Publish `frontend/` via GitHub Pages (root or `docs/` folder)

---

## 🧠 Model Details

| Input Feature | Type |
|---|---|
| Bedrooms | Integer (1–6) |
| Bathrooms | Integer (1–4) |
| Stories | Integer (1–4) |
| Parking spots | Integer (0–3) |
| Main road access | Yes / No |
| Guest room | Yes / No |
| Basement | Yes / No |
| Hot water heating | Yes / No |
| Air conditioning | Yes / No |
| Preferred area | Yes / No |
| Furnishing status | Furnished / Semi / Unfurnished |

---

## 📬 Contact

Questions or feedback? Reach out:  
**aakankshamore22004@gmail.com**

---

> ⚠️ Estimates are indicative only — not a formal property valuation.
