# Zara Menswear Sales Prediction

Predicting sales volume for 252 Zara men's clothing products using regression models.

## Setup

```bash
pip install -r requirements.txt
```

## Running the analysis

Run the notebook end-to-end:
```bash
jupyter notebook zara_analysis.ipynb
```

Or run the script directly:
```bash
python zara_analysis.py
```

This trains all models, saves them to `models/`, and generates plots.

## Streamlit dashboard

```bash
streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`.

## Project structure

- `zara_analysis.py` — full pipeline (EDA, modelling, SHAP)
- `zara_analysis.ipynb` — same thing as a notebook
- `streamlit_app.py` — interactive dashboard
- `models/` — saved model files (created after running analysis)
- `data/` — dataset folder
