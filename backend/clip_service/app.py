from flask import Flask, request, jsonify
from PIL import Image
import requests
import clip
import torch
import io

app = Flask(__name__)

# Device setup
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🚀 Using device: {device}")

# Load CLIP model
model, preprocess = clip.load("ViT-B/32", device=device)
LABELS = ["t-shirt", "shirt", "jacket", "jeans", "saree", "kurta", "shorts", "coat", "sweater", "dress"]

@app.route("/suggest", methods=["POST"])
def suggest():
    data = request.json
    image_url = data.get("imageUrl") or data.get("image_url")  # ✅ Accept both keys

    if not image_url:
        return jsonify({"error": "imageUrl required"}), 400

    try:
        resp = requests.get(image_url, stream=True)
        resp.raise_for_status()
        img = Image.open(resp.raw).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 400

    image_input = preprocess(img).unsqueeze(0).to(device)
    text_inputs = clip.tokenize(LABELS).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_inputs)
        logits = (image_features @ text_features.T)[0]
        probs = logits.softmax(dim=0).cpu().numpy()

    best_idx = int(probs.argmax())
    return jsonify({"label": LABELS[best_idx], "confidence": float(probs[best_idx])})



if __name__ == "__main__":
    print("🔧 CLIP Suggestion API running at http://127.0.0.1:5001/suggest")
    app.run(port=5001, debug=True)
