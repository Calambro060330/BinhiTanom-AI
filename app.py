from pathlib import Path
import json
import time

import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from PIL import Image, UnidentifiedImageError
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT / "frontend"
MODEL_PATH = ROOT / "ml" / "vegetable_model.keras"
CLASS_NAMES_PATH = ROOT / "ml" / "class_names.json"
IMAGE_SIZE = (224, 224)
CONFIDENCE_THRESHOLD = 0.65
MAX_UPLOAD_BYTES = 8 * 1024 * 1024

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES

with CLASS_NAMES_PATH.open("r", encoding="utf-8") as file:
    CLASS_NAMES = json.load(file)

_model = None
_model_error = None

def get_model():
    """Load the trained model only when a prediction is requested."""
    global _model, _model_error
    if _model is not None:
        return _model
    if not MODEL_PATH.exists():
        return None
    try:
        _model = tf.keras.models.load_model(MODEL_PATH)
        _model_error = None
        return _model
    except Exception as exc:
        _model_error = str(exc)
        app.logger.exception("Could not load the trained model")
        return None

@app.get("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.get("/health")
def health():
    model_ready = MODEL_PATH.exists() and get_model() is not None
    return jsonify({
        "status": "ok",
        "model_ready": model_ready,
        "classes": CLASS_NAMES,
        "message": "Model is ready." if model_ready else
            "Model file is missing or could not be loaded. Train the model first."
    }), 200

@app.post("/predict")
def predict():
    model = get_model()
    if model is None:
        message = (
            "The AI model is not trained yet. Add dataset images and run "
            "'python ml/train_classifier.py' first."
        )
        if _model_error:
            message += " Model loading details are available in the terminal."
        return jsonify({"error": message, "model_ready": False}), 503

    if "image" not in request.files:
        return jsonify({"error": "Please attach an image using the 'image' field."}), 400

    uploaded = request.files["image"]
    if not uploaded.filename:
        return jsonify({"error": "Choose an image file first."}), 400

    try:
        with Image.open(uploaded.stream) as img:
            img = img.convert("RGB").resize(IMAGE_SIZE)
            array = np.asarray(img, dtype=np.float32)
    except (UnidentifiedImageError, OSError, ValueError):
        return jsonify({"error": "That file is not a readable image. Try a JPG or PNG."}), 400

    # Keep inference preprocessing identical to the MobileNetV2 training pipeline.
    batch = preprocess_input(np.expand_dims(array, axis=0))
    started = time.perf_counter()
    probabilities = model.predict(batch, verbose=0)[0]
    elapsed_ms = round((time.perf_counter() - started) * 1000, 1)

    if len(probabilities) != len(CLASS_NAMES):
        app.logger.error("Model output count does not match class_names.json")
        return jsonify({"error": "Model classes do not match the configured class list."}), 500

    index = int(np.argmax(probabilities))
    confidence = float(probabilities[index])
    if confidence < CONFIDENCE_THRESHOLD:
        return jsonify({
            "identified": False,
            "label": None,
            "confidence": confidence,
            "confidence_percent": round(confidence * 100, 1),
            "prediction_ms": elapsed_ms,
            "message": "Unable to identify this seed confidently. Try a clearer photo."
        })

    return jsonify({
        "identified": True,
        "label": CLASS_NAMES[index],
        "confidence": confidence,
        "confidence_percent": round(confidence * 100, 1),
        "prediction_ms": elapsed_ms
    })

@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "Image is too large. Please choose an image under 8 MB."}), 413

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
    print("BinhiTanom AI local demo: http://127.0.0.1:5000")
   
    if not MODEL_PATH.exists():
        print("NOTE: No trained model found yet. Manual gardening guides will work; AI uploads need a trained model.")
    app.run(host="127.0.0.1", port=5000, debug=True)
