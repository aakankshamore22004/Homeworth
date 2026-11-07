"""Trains the price and area models (same steps as the notebook) and saves them.

Put Housing_Prices_Dataset_2000_Records.csv in backend/data/, then run:
    python train_model.py
"""
from pathlib import Path
import pickle

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

BASE = Path(__file__).resolve().parent
CSV = BASE / "data" / "Housing_Prices_Dataset_2000_Records.csv"
OUT = BASE / "models"
OUT.mkdir(exist_ok=True)

df = pd.read_csv(CSV)

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
