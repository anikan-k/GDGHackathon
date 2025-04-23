from flask import Flask, request, jsonify
from gemini import send_to_gemini, clean_json_from_gemini_output
from main import combined_prompt
from flask_cors import CORS
import json



app = Flask(__name__)
CORS(app)


@app.route("/score", methods=["POST"])
def score():
    image_name = request.json["imageName"]
    raw_result = send_to_gemini(image_name, combined_prompt)
    clean_json_str = clean_json_from_gemini_output(raw_result)

    try:
        parsed = json.loads(clean_json_str)  # now it's real JSON
        return jsonify(parsed)
    except Exception as e:
        return jsonify({"error": str(e), "raw_output": clean_json_str}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
