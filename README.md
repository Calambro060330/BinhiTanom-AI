# BinhiTanom AI — Local Demo

A local Flask + TensorFlow prototype for eight vegetable seed classes, with English/Hiligaynon gardening guides.

## 1. Install dependencies (Windows PowerShell / CMD)

Open the terminal in this project folder, activate your virtual environment, then run:

```powershell
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

## 2. Add your dataset

Create `train`, `val`, and `test` folders inside `dataset`. Each split must contain these exact folder names:

`okra`, `eggplant`, `bitter_melon`, `water_spinach`, `malabar_spinach`, `jute_mallow`, `squash`, `yardlong_bean`

Example: `dataset/train/okra/seed01.jpg`

Use correctly labelled images. Keep test images separate from training images and avoid duplicates across splits.

## 3. Train the model

```powershell
python ml/train_classifier.py
```

The script downloads pretrained MobileNetV2 weights on first use, so internet access is needed during the initial training setup. Training can take time on a CPU. It saves `ml/vegetable_model.keras`.

## 4. Start the local website

```powershell
python app.py
```

Open http://127.0.0.1:5000 in your browser. Do not open `frontend/index.html` directly; the Flask server serves the website and API from the same origin.

## Notes

- Before training, the site and manual gardening guide work, but image identification returns a clear “model not trained” message.
- Model predictions are not guaranteed to be correct. The confidence threshold is configured in `app.py`.
- Gardening information is general guidance; verify local advice with an agricultural expert.
