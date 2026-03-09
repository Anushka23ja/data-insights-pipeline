"""
Streamlit dashboard for the Zara sales prediction project.
Run with: streamlit run streamlit_app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import shap
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

st.set_page_config(page_title="Zara Sales Prediction", layout="wide")
st.title("Zara Menswear Sales Prediction")
st.caption("252 products · Feb 2024 · random_state=42")

# ── load data & models ───────────────────────────────────────────────

df = pd.read_csv("data/zara_menswear.csv")

# try loading saved models
try:
    lr_model = joblib.load("models/linear_regression.pkl")
    dt_model = joblib.load("models/decision_tree.pkl")
    rf_model = joblib.load("models/random_forest.pkl")
    xgb_model = joblib.load("models/xgboost.pkl")
    models_loaded = True
except FileNotFoundError:
    st.warning("Run zara_analysis.py first to train and save models.")
    models_loaded = False


# ── sidebar ──────────────────────────────────────────────────────────

tab = st.sidebar.radio("Section", [
    "Executive Summary",
    "Descriptive Analytics",
    "Model Performance",
    "Explainability",
])


# ── Executive Summary ────────────────────────────────────────────────

if tab == "Executive Summary":
    st.header("Executive Summary")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Products", 252)
    col2.metric("Avg Price", f"€{df['price'].mean():.2f}")
    col3.metric("Avg Sales", f"{df['salesVolume'].mean():.0f}")
    col4.metric("Best Model R²", "0.474")

    st.markdown("""
    **Objective:** Predict sales volume for Zara menswear products using product
    attributes (price, position, promotion status, seasonality, category).

    **Key findings:**
    - XGBoost achieved the best performance (R² = 0.474, RMSE = 568.3)
    - Price is the strongest predictor with a negative relationship to sales
    - Aisle positioning correlates with higher sales volume
    - Promotions surprisingly showed a slight negative association with sales
    """)


# ── Descriptive Analytics ────────────────────────────────────────────

elif tab == "Descriptive Analytics":
    st.header("Descriptive Analytics")

    st.subheader("Dataset overview")
    st.dataframe(df.head(10))
    st.write(df.describe())

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Sales distribution")
        fig, ax = plt.subplots()
        ax.hist(df["salesVolume"], bins=20, edgecolor="black", alpha=0.7)
        ax.set_xlabel("Sales Volume")
        ax.set_ylabel("Count")
        st.pyplot(fig)

    with col2:
        st.subheader("Price vs Sales")
        fig, ax = plt.subplots()
        ax.scatter(df["price"], df["salesVolume"], alpha=0.5)
        ax.set_xlabel("Price (€)")
        ax.set_ylabel("Sales Volume")
        st.pyplot(fig)

    st.subheader("Sales by category")
    fig, ax = plt.subplots()
    df.groupby("category")["salesVolume"].mean().sort_values().plot.barh(ax=ax)
    ax.set_xlabel("Avg Sales Volume")
    st.pyplot(fig)

    st.subheader("Correlation heatmap")
    fig, ax = plt.subplots(figsize=(8, 6))
    numeric_df = df.select_dtypes(include=[np.number])
    sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", center=0, ax=ax)
    st.pyplot(fig)


# ── Model Performance ────────────────────────────────────────────────

elif tab == "Model Performance":
    st.header("Model Performance")

    if not models_loaded:
        st.stop()

    # data prep recap
    st.subheader("2.1 Data Preparation")
    st.markdown("""
    - **Features (X):** price, productPosition, promotion, seasonal, category
    - **Target (y):** salesVolume
    - **Split:** 70/30 train/test, `random_state=42`
    - **Preprocessing:** StandardScaler on price, OneHotEncoder on categoricals
    """)

    # get predictions from each model
    from sklearn.model_selection import train_test_split
    num_features = ["price"]
    cat_features = ["productPosition", "promotion", "seasonal", "category"]
    X = df[num_features + cat_features]
    y = df["salesVolume"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    models = {
        "Linear Regression": lr_model,
        "Decision Tree": dt_model,
        "Random Forest": rf_model,
        "XGBoost": xgb_model,
    }

    rows = []
    for name, model in models.items():
        preds = model.predict(X_test)
        rows.append({
            "Model": name,
            "MAE": round(mean_absolute_error(y_test, preds), 1),
            "RMSE": round(np.sqrt(mean_squared_error(y_test, preds)), 1),
            "R²": round(r2_score(y_test, preds), 3),
        })

    results_df = pd.DataFrame(rows)

    # comparison table
    st.subheader("2.7 Model Comparison")
    st.dataframe(results_df, hide_index=True)

    # bar chart
    fig, ax = plt.subplots(figsize=(10, 5))
    x = range(len(results_df))
    width = 0.35
    ax.bar([i - width/2 for i in x], results_df["RMSE"], width, label="RMSE")
    ax.bar([i + width/2 for i in x], results_df["MAE"], width, label="MAE")
    ax.set_xticks(list(x))
    ax.set_xticklabels(results_df["Model"])
    ax.legend()
    ax.set_ylabel("Error")
    ax.set_title("Model Comparison")
    st.pyplot(fig)

    st.markdown("""
    **Analysis:** XGBoost performed best with the lowest RMSE (568.3) and highest R² (0.474).
    The progression from Linear Regression → Decision Tree → Random Forest → XGBoost shows
    consistent improvement. The Neural Network (MLP) performed comparably to Random Forest.
    Tree-based models are preferred here for their balance of accuracy and interpretability
    via SHAP values.
    """)

    # predicted vs actual for best model
    st.subheader("XGBoost — Predicted vs Actual")
    preds_xgb = xgb_model.predict(X_test)
    fig, ax = plt.subplots()
    ax.scatter(y_test, preds_xgb, alpha=0.6, edgecolors="k", linewidth=0.5)
    ax.plot([y.min(), y.max()], [y.min(), y.max()], "r--")
    ax.set_xlabel("Actual")
    ax.set_ylabel("Predicted")
    st.pyplot(fig)


# ── Explainability ───────────────────────────────────────────────────

elif tab == "Explainability":
    st.header("SHAP Explainability")

    if not models_loaded:
        st.stop()

    # show saved plots if available, otherwise generate
    import os
    for plot_name, title in [
        ("shap_summary.png", "SHAP Summary (Beeswarm)"),
        ("shap_bar.png", "Feature Importance (Mean |SHAP|)"),
        ("shap_waterfall.png", "Waterfall — Single Prediction"),
    ]:
        st.subheader(title)
        path = f"plots/{plot_name}"
        if os.path.exists(path):
            st.image(path)
        else:
            st.info(f"Run zara_analysis.py first to generate {plot_name}")

    st.subheader("Interpretation")
    st.markdown("""
    **Key findings from SHAP analysis (XGBoost):**

    1. **Price** has the strongest impact — higher prices consistently push predictions
       downward, confirming the expected inverse price-demand relationship.

    2. **Product position (Aisle)** is the second most important feature. Aisle placement
       is associated with higher predicted sales, possibly due to higher foot traffic.

    3. **Promotion** shows a surprising negative effect. This could indicate that promotions
       are applied to already slow-moving items rather than boosting sales of popular ones.

    4. **Seasonality** has a mixed effect — seasonal items can go either way depending on
       timing relative to the season.

    **Business implications:** Pricing strategy has the biggest lever on sales. Store layout
    decisions (aisle vs end-cap) meaningfully impact volume. The promotion strategy may need
    re-evaluation — current targeting seems reactive rather than proactive.
    """)
