"""
Zara Menswear Sales Prediction
Full analysis pipeline: EDA, model training, evaluation, SHAP explainability.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor, plot_tree
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
import shap

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

# create output dirs
os.makedirs("models", exist_ok=True)
os.makedirs("plots", exist_ok=True)


# ── 1. Load & explore data ──────────────────────────────────────────

df = pd.read_csv("data/zara_menswear.csv")
print(f"Shape: {df.shape}")
print(df.head())
print(df.describe())
print(f"\nMissing values:\n{df.isnull().sum()}")


# ── 2. Data preparation ─────────────────────────────────────────────

# define features and target
target = "salesVolume"
num_features = ["price"]
cat_features = ["productPosition", "promotion", "seasonal", "category"]

X = df[num_features + cat_features]
y = df[target]

# 70/30 split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=RANDOM_STATE
)
print(f"\nTrain: {X_train.shape[0]}, Test: {X_test.shape[0]}")

# preprocessing: scale numericals, one-hot encode categoricals
preprocessor = ColumnTransformer([
    ("num", StandardScaler(), num_features),
    ("cat", OneHotEncoder(drop="first", sparse_output=False), cat_features),
])


# ── helper to evaluate and print metrics ─────────────────────────────

def evaluate(model_name, y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    print(f"\n{model_name}")
    print(f"  MAE:  {mae:.1f}")
    print(f"  RMSE: {rmse:.1f}")
    print(f"  R²:   {r2:.3f}")
    return {"model": model_name, "mae": mae, "rmse": rmse, "r2": r2}


results = []


# ── 3. Linear Regression (baseline) ─────────────────────────────────

lr_pipe = Pipeline([
    ("prep", preprocessor),
    ("model", LinearRegression()),
])
lr_pipe.fit(X_train, y_train)
y_pred_lr = lr_pipe.predict(X_test)
results.append(evaluate("Linear Regression", y_test, y_pred_lr))
joblib.dump(lr_pipe, "models/linear_regression.pkl")


# ── 4. Decision Tree with GridSearchCV ───────────────────────────────

dt_pipe = Pipeline([
    ("prep", preprocessor),
    ("model", DecisionTreeRegressor(random_state=RANDOM_STATE)),
])

dt_params = {
    "model__max_depth": [3, 5, 7, 10],
    "model__min_samples_leaf": [5, 10, 20, 50],
}

dt_grid = GridSearchCV(
    dt_pipe, dt_params, cv=5,
    scoring="neg_mean_squared_error", n_jobs=-1
)
dt_grid.fit(X_train, y_train)
print(f"\nDT best params: {dt_grid.best_params_}")

y_pred_dt = dt_grid.predict(X_test)
results.append(evaluate("Decision Tree", y_test, y_pred_dt))
joblib.dump(dt_grid.best_estimator_, "models/decision_tree.pkl")

# visualize the tree
fig, ax = plt.subplots(figsize=(20, 10))
plot_tree(dt_grid.best_estimator_.named_steps["model"], max_depth=3,
          filled=True, rounded=True, ax=ax, fontsize=8)
plt.title("Decision Tree (top 3 levels)")
plt.tight_layout()
plt.savefig("plots/decision_tree.png", dpi=150)
plt.close()


# ── 5. Random Forest with GridSearchCV ───────────────────────────────

rf_pipe = Pipeline([
    ("prep", preprocessor),
    ("model", RandomForestRegressor(random_state=RANDOM_STATE)),
])

rf_params = {
    "model__n_estimators": [50, 100, 200],
    "model__max_depth": [3, 5, 8],
}

rf_grid = GridSearchCV(
    rf_pipe, rf_params, cv=5,
    scoring="neg_mean_squared_error", n_jobs=-1
)
rf_grid.fit(X_train, y_train)
print(f"\nRF best params: {rf_grid.best_params_}")

y_pred_rf = rf_grid.predict(X_test)
results.append(evaluate("Random Forest", y_test, y_pred_rf))
joblib.dump(rf_grid.best_estimator_, "models/random_forest.pkl")

# predicted vs actual scatter
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred_rf, alpha=0.6, edgecolors="k", linewidth=0.5)
plt.plot([y.min(), y.max()], [y.min(), y.max()], "r--", lw=2)
plt.xlabel("Actual Sales")
plt.ylabel("Predicted Sales")
plt.title("Random Forest — Predicted vs Actual")
plt.tight_layout()
plt.savefig("plots/rf_pred_vs_actual.png", dpi=150)
plt.close()


# ── 6. XGBoost with GridSearchCV ─────────────────────────────────────

xgb_pipe = Pipeline([
    ("prep", preprocessor),
    ("model", XGBRegressor(random_state=RANDOM_STATE, verbosity=0)),
])

xgb_params = {
    "model__n_estimators": [50, 100, 200],
    "model__max_depth": [3, 4, 5, 6],
    "model__learning_rate": [0.01, 0.05, 0.1],
}

xgb_grid = GridSearchCV(
    xgb_pipe, xgb_params, cv=5,
    scoring="neg_mean_squared_error", n_jobs=-1
)
xgb_grid.fit(X_train, y_train)
print(f"\nXGB best params: {xgb_grid.best_params_}")

y_pred_xgb = xgb_grid.predict(X_test)
results.append(evaluate("XGBoost", y_test, y_pred_xgb))
joblib.dump(xgb_grid.best_estimator_, "models/xgboost.pkl")

# predicted vs actual
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred_xgb, alpha=0.6, edgecolors="k", linewidth=0.5)
plt.plot([y.min(), y.max()], [y.min(), y.max()], "r--", lw=2)
plt.xlabel("Actual Sales")
plt.ylabel("Predicted Sales")
plt.title("XGBoost — Predicted vs Actual")
plt.tight_layout()
plt.savefig("plots/xgb_pred_vs_actual.png", dpi=150)
plt.close()


# ── 7. Neural Network (MLP) ─────────────────────────────────────────

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.optimizers import Adam

# preprocess data for keras
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

model_nn = Sequential([
    Input(shape=(X_train_processed.shape[1],)),
    Dense(128, activation="relu"),
    Dense(64, activation="relu"),
    Dense(1, activation="linear"),
])
model_nn.compile(optimizer=Adam(learning_rate=0.001), loss="mse", metrics=["mae"])

history = model_nn.fit(
    X_train_processed, y_train,
    validation_split=0.2,
    epochs=100, batch_size=32,
    verbose=0,
)

y_pred_nn = model_nn.predict(X_test_processed).flatten()
results.append(evaluate("Neural Network (MLP)", y_test, y_pred_nn))
model_nn.save("models/neural_network.keras")

# training curves
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.plot(history.history["loss"], label="Train")
ax1.plot(history.history["val_loss"], label="Val")
ax1.set_xlabel("Epoch")
ax1.set_ylabel("MSE Loss")
ax1.set_title("Loss Curve")
ax1.legend()

ax2.plot(history.history["mae"], label="Train")
ax2.plot(history.history["val_mae"], label="Val")
ax2.set_xlabel("Epoch")
ax2.set_ylabel("MAE")
ax2.set_title("MAE Curve")
ax2.legend()

plt.tight_layout()
plt.savefig("plots/nn_training_history.png", dpi=150)
plt.close()


# ── 8. Model comparison ─────────────────────────────────────────────

results_df = pd.DataFrame(results)
print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)
print(results_df.to_string(index=False))

# bar chart
fig, ax = plt.subplots(figsize=(10, 5))
x = range(len(results_df))
width = 0.35
ax.bar([i - width/2 for i in x], results_df["rmse"], width, label="RMSE", color="#2563eb")
ax.bar([i + width/2 for i in x], results_df["mae"], width, label="MAE", color="#7c3aed")
ax.set_xticks(x)
ax.set_xticklabels(results_df["model"], rotation=15, ha="right")
ax.set_ylabel("Error")
ax.set_title("Model Comparison — RMSE & MAE")
ax.legend()
plt.tight_layout()
plt.savefig("plots/model_comparison.png", dpi=150)
plt.close()


# ── 9. SHAP explainability (on XGBoost) ─────────────────────────────

# get the xgb model and transformed data
best_xgb = xgb_grid.best_estimator_
X_test_transformed = best_xgb.named_steps["prep"].transform(X_test)

# get feature names after encoding
feature_names = (num_features +
    list(best_xgb.named_steps["prep"]
         .named_transformers_["cat"]
         .get_feature_names_out(cat_features)))

explainer = shap.TreeExplainer(best_xgb.named_steps["model"])
shap_values = explainer.shap_values(X_test_transformed)

# summary beeswarm plot
plt.figure()
shap.summary_plot(shap_values, X_test_transformed,
                  feature_names=feature_names, show=False)
plt.tight_layout()
plt.savefig("plots/shap_summary.png", dpi=150, bbox_inches="tight")
plt.close()

# bar plot of mean |SHAP|
plt.figure()
shap.summary_plot(shap_values, X_test_transformed,
                  feature_names=feature_names, plot_type="bar", show=False)
plt.tight_layout()
plt.savefig("plots/shap_bar.png", dpi=150, bbox_inches="tight")
plt.close()

# waterfall for one prediction (pick a high-price item)
idx = 0  # first test sample
plt.figure()
shap.waterfall_plot(shap.Explanation(
    values=shap_values[idx],
    base_values=explainer.expected_value,
    data=X_test_transformed[idx],
    feature_names=feature_names,
), show=False)
plt.tight_layout()
plt.savefig("plots/shap_waterfall.png", dpi=150, bbox_inches="tight")
plt.close()

print("\nDone! Check plots/ and models/ folders.")
