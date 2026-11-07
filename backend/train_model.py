"""Trains the price and area models (same steps as the notebook) and saves them.

Put Housing_Prices_Dataset_2000_Records.csv in backend/data/, then run:
    python train_model.py

If the CSV is missing (e.g. on a fresh Render deploy), a synthetic dataset is
generated automatically so the app can still start and run.
"""
from pathlib import Path
import pickle

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

BASE = Path(__file__).resolve().parent
CSV = BASE / "data" / "Housing_Prices_Dataset_2000_Records.csv"
OUT = BASE / "models"
OUT.mkdir(exist_ok=True)


def generate_synthetic_data(n: int = 2000) -> pd.DataFrame:
    """Generate a realistic synthetic housing dataset when the real CSV is absent."""
    print("⚠️  CSV not found — generating synthetic dataset for training...")
    rng = np.random.default_rng(42)
    bedrooms   = rng.integers(1, 7, n)
    bathrooms  = rng.integers(1, 5, n)
    stories    = rng.integers(1, 5, n)
    parking    = rng.integers(0, 4, n)
    yn_cols    = ["mainroad", "guestroom", "basement",
                  "hotwaterheating", "airconditioning", "prefarea"]
    yn_data    = {c: rng.choice(["yes", "no"], n, p=[0.6, 0.4]) for c in yn_cols}
    furnishing = rng.choice(["furnished", "semi-furnished", "unfurnished"], n,
                            p=[0.33, 0.34, 0.33])
    area = (bedrooms * 300 + bathrooms * 150 + stories * 100 + parking * 50
            + (yn_data["airconditioning"] == "yes").astype(int) * 200
            + (yn_data["prefarea"] == "yes").astype(int) * 300
            + rng.normal(0, 150, n)).clip(500, 5000).round(0)
    price = (area * 150 + bedrooms * 20000 + bathrooms * 15000
             + stories * 10000 + parking * 5000
             + (yn_data["mainroad"] == "yes").astype(int) * 25000
             + (yn_data["guestroom"] == "yes").astype(int) * 15000
             + (yn_data["basement"] == "yes").astype(int) * 10000
             + (yn_data["hotwaterheating"] == "yes").astype(int) * 8000
             + (yn_data["airconditioning"] == "yes").astype(int) * 20000
             + (yn_data["prefarea"] == "yes").astype(int) * 50000
             + (furnishing == "furnished").astype(int) * 30000
             + (furnishing == "semi-furnished").astype(int) * 15000
             + rng.normal(0, 20000, n)).clip(50000, 2_000_000).round(0)
    return pd.DataFrame({
        "price": price.astype(int), "area": area.astype(int),
        "bedrooms": bedrooms, "bathrooms": bathrooms,
        "stories": stories, **yn_data, "parking": parking,
        "furnishingstatus": furnishing,
    })


if CSV.exists():
    print(f"✅  Loading dataset from {CSV}")
    df = pd.read_csv(CSV)
else:
    df = generate_synthetic_data()

yes_no = ["mainroad", "guestroom", "basement", "hotwaterheating", "airconditioning", "prefarea"]
for col in yes_no:
    df[col] = df[col].map({"yes": 1, "no": 0})
df = pd.get_dummies(df, columns=["furnishingstatus"], drop_first=True, dtype=int)

X = df.drop(["price", "area"], axis=1)
y_price, y_area = df["price"], df["area"]

X_train, X_test, yp_train, yp_test = train_test_split(X, y_price, test_size=0.2, random_state=42)
_, _, ya_train, ya_test = train_test_split(X, y_area, test_size=0.2, random_state=42)

models = {
    "price_model.pkl": (RandomForestRegressor(n_estimators=100, random_state=42), yp_train, yp_test),
    "area_model.pkl": (RandomForestRegressor(n_estimators=100, random_state=42), ya_train, ya_test),
}

print("Features:", X.columns.tolist())
for name, (model, y_tr, y_te) in models.items():
    model.fit(X_train, y_tr)
    pred = model.predict(X_test)
    print(f"{name}: R2 = {r2_score(y_te, pred):.3f}, MAE = {mean_absolute_error(y_te, pred):,.2f}")
    with open(OUT / name, "wb") as f:
        pickle.dump(model, f)
print("Saved to", OUT)
