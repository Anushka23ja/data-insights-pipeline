# Zara Menswear Sales Prediction — Submission

Predicting sales volume for 252 Zara men's clothing products using regression models.

## Files

| File | Description |
|------|-------------|
| `zara_analysis.py` | Full analysis pipeline (EDA → models → SHAP) |
| `streamlit_app.py` | Interactive Streamlit dashboard |
| `requirements.txt` | Python dependencies (pinned versions) |
| `data/zara_menswear.csv` | Source dataset (place here before running) |
| `models/` | Saved model files (generated after running analysis) |
| `plots/` | Generated visualizations (generated after running analysis) |

## Setup

```bash
cd submission
pip install -r requirements.txt
```

## Run the analysis

```bash
python zara_analysis.py
```

This trains all 5 models (Linear Regression, Decision Tree, Random Forest, XGBoost, Neural Network), saves them to `models/`, and generates all plots in `plots/`.

## Run the Streamlit dashboard

```bash
streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`. Make sure you've run `zara_analysis.py` first so the models and plots exist.

## Notes

- `random_state=42` is used everywhere for reproducibility.
- All models are tuned via 5-fold GridSearchCV (except Linear Regression baseline and the MLP).
- SHAP explainability is run on the best model (XGBoost).
