# 🏠 HomeWorth — House Price & Area Estimator

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.1-lightgrey)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-orange)

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
│       ├── config.js          # API endpoint configuration ← change this for deployment
│       ├── drawing.js         # Live house illustration
│       └── app.js             # Form logic, API calls, results
│
├── backend/                   # Python Flask API
│   ├── app.py                 # Flask server (serves frontend + /predict)
│   ├── train_model.py         # Trains & saves the ML models
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Trained model files (generated — not in git)
│   │   └── README.txt
│   └── data/                  # Dataset (not in git — add your own CSV)
│       └── README.txt
│
├── render.yaml                # One-click Render deployment config
├── LICENSE                    # MIT License
├── .gitignore
└── README.md
```

---

## 🚀 Run Locally

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

**5. Start the server**
```bash
python app.py
```

**6. Open in browser**
```
http://127.0.0.1:5000
```

---

## ☁️ Deploy Online

### Step 1 — Deploy Backend on Render (Free)

1. Go to **[render.com](https://render.com)** → Sign up / Log in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub repo** → select `Homeworth`
4. Render auto-detects `render.yaml` — it will configure everything automatically
5. Add an **Environment Variable** on the Render dashboard:
   - Key: `DATASET_URL` (optional — only if you host your CSV somewhere)
6. Click **"Deploy"** — wait ~3 minutes
7. Your backend URL will be: `https://homeworth-api.onrender.com`

> ⚠️ **Important:** The dataset CSV is not in git (gitignored). You must either:
> - Add a build step to download it, **OR**
> - Upload it manually in Render's shell: `render shell` → place CSV in `backend/data/`

### Step 2 — Update Frontend Config

Edit `frontend/js/config.js` and replace the local URL with your Render URL:

```js
// Change this line:
const API_URL = "http://127.0.0.1:5000/predict";

// To your Render URL:
const API_URL = "https://homeworth-api.onrender.com/predict";
```

### Step 3 — Deploy Frontend on GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **"Source"** → select branch `main`, folder `/frontend`
3. Click **Save**
4. Your site will be live at:
   ```
   https://aakankshamore22004.github.io/Homeworth/
   ```

> GitHub Pages takes 1–2 minutes to go live after the first deploy.

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

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

Questions or feedback? Reach out:  
**aakankshamore22004@gmail.com**

---

> ⚠️ Estimates are indicative only — not a formal property valuation.
