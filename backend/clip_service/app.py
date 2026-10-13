import os

import clip
import requests
import torch
from flask import Flask, jsonify, request
from PIL import Image

app = Flask(__name__)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load the model once at startup, not on every request
model, preprocess = clip.load("ViT-B/32", device=device)
LABELS = ["t-shirt", "shirt", "jacket", "jeans", "saree", "kurta", "shorts", "coat", "sweater", "dress"]
text_inputs = clip.tokenize(LABELS).to(device)


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/suggest", methods=["POST"])
def suggest():
    data = request.get_json(silent=True) or {}
    image_url = data.get("imageUrl") or data.get("image_url")

    if not image_url:
        return jsonify({"error": "imageUrl required"}), 400

    try:
        resp = requests.get(image_url, stream=True, timeout=10)
        resp.raise_for_status()
        img = Image.open(resp.raw).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Failed to fetch image: {e}"}), 400

    image_input = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_inputs)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        # CLIP's standard scaling: cosine similarity x 100, then softmax
        probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)[0].cpu().numpy()

    best_idx = int(probs.argmax())
    return jsonify({"label": LABELS[best_idx], "confidence": float(probs[best_idx])})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    # debug=False: Flask's debugger allows running code remotely and must never be on in deployment
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
