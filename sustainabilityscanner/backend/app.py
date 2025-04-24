from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from gemini import send_to_gemini, clean_json_from_gemini_output, send_text_to_gemini
from main import combined_prompt, database_prompt
import json
import base64
from io import BytesIO
from PIL import Image  # You may need to `pip install pillow`
import os

app = Flask(
    __name__,
    static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/dist')),
    static_url_path=""
)

CORS(app)

# ✅ Serve frontend + support React routing
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    target = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(target):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# Handle scoring
@app.route("/score", methods=["POST"])
def score():
    data = request.json
    image_data_url = data.get("imageBase64")

    if not image_data_url:
        return jsonify({"error": "No image provided"}), 400

    # Extract Base64 part from 'data:image/jpeg;base64,...'
    header, encoded = image_data_url.split(",", 1)
    image_data = base64.b64decode(encoded)

    # Save image temporarily
    image_path = os.path.join("images", "captured.jpg")
    with open(image_path, "wb") as f:
        f.write(image_data)

    # Now process the saved image as normal
    raw_result = send_to_gemini("captured.jpg", combined_prompt)
    print("🔍 Raw Gemini Output:\n", raw_result)


    clean_json_str = clean_json_from_gemini_output(raw_result)

    print("Reformatted output: ", clean_json_str)

    try:
        parsed = json.loads(clean_json_str)
        return jsonify(parsed)
    except Exception as e:
        return jsonify({"error": str(e), "raw_output": clean_json_str}), 500


@app.route("/product-info", methods=["POST"])
def product_info():
    data = request.json
    query = data.get("product")

    if not query:
        return jsonify({"error": "No product input provided"}), 400

    prompt = database_prompt + f'\n\nProduct: "{query}"'
    raw_result = send_text_to_gemini(prompt)  # ✅ use this

    print("🔍 Raw Gemini Output:\n", raw_result)

    clean_json_str = clean_json_from_gemini_output(raw_result)

    try:
        parsed = json.loads(clean_json_str)
        return jsonify(parsed)
    except Exception as e:
        return jsonify({"error": str(e), "raw_output": clean_json_str}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
