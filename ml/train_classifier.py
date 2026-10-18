"""Train an eight-class vegetable seed image classifier with MobileNetV2 transfer learning.

Expected folders:
dataset/train/<class_name>/
dataset/val/<class_name>/
dataset/test/<class_name>/

Run from the project root:
    python ml/train_classifier.py
"""
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

ROOT = Path(__file__).resolve().parents[1]
DATASET_DIR = ROOT / "dataset"
MODEL_PATH = ROOT / "ml" / "vegetable_model.keras"
CLASS_NAMES_PATH = ROOT / "ml" / "class_names.json"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS_HEAD = 8
EPOCHS_FINE_TUNE = 5
SEED = 42

with CLASS_NAMES_PATH.open("r", encoding="utf-8") as file:
    CLASS_NAMES = json.load(file)

def load_split(split):
    folder = DATASET_DIR / split
    if not folder.exists():
        raise FileNotFoundError(f"Missing folder: {folder}")
    ds = tf.keras.utils.image_dataset_from_directory(
        folder,
        labels="inferred",
        label_mode="int",
        class_names=CLASS_NAMES,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=(split == "train"),
        seed=SEED,
    )
    # image_dataset_from_directory returns 0..255 float pixels; MobileNetV2 expects -1..1.
    ds = ds.map(lambda x, y: (preprocess_input(tf.cast(x, tf.float32)), y),
                num_parallel_calls=tf.data.AUTOTUNE)
    return ds.prefetch(tf.data.AUTOTUNE)

train_ds = load_split("train")
val_ds = load_split("val")
test_ds = load_split("test")

base_model = MobileNetV2(
    input_shape=(*IMAGE_SIZE, 3),
    include_top=False,
    weights="imagenet",
)
base_model.trainable = False

inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3))
x = base_model(inputs, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.25)(x)
outputs = layers.Dense(len(CLASS_NAMES), activation="softmax")(x)
model = tf.keras.Model(inputs, outputs)
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=3, restore_best_weights=True
    ),
    tf.keras.callbacks.ModelCheckpoint(
        MODEL_PATH, monitor="val_accuracy", save_best_only=True
    ),
]
print("Training classifier head...")
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_HEAD, callbacks=callbacks)

print("Fine-tuning the final MobileNetV2 layers...")
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_FINE_TUNE, callbacks=callbacks)

# Reload best checkpoint, then evaluate on the held-out test set.
best_model = tf.keras.models.load_model(MODEL_PATH)
loss, accuracy = best_model.evaluate(test_ds, verbose=1)
print(f"Test loss: {loss:.4f}")
print(f"Test accuracy: {accuracy:.4f}")

y_true = np.concatenate([labels.numpy() for _, labels in test_ds])
y_prob = best_model.predict(test_ds, verbose=1)
y_pred = np.argmax(y_prob, axis=1)
print("\nClassification report:")
print(classification_report(y_true, y_pred, target_names=CLASS_NAMES, zero_division=0))
print("Confusion matrix:")
print(confusion_matrix(y_true, y_pred))
print(f"\nSaved model: {MODEL_PATH}")
