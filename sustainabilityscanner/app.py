from flask import Flask, request, jsonify
from gemini import send_to_gemini, results_clean
from main import combined_prompt

app = Flask(__name__)

@app.route("/score", methods=["POST"])
def score():
    data = request.json
    image_name = data["imageName"]

    raw_result = send_to_gemini(image_name, combined_prompt)
    try:
        clean_result = results_clean(raw_result)
        return jsonify(clean_result)
    except Exception as e:
        return jsonify({"error": str(e), "raw_output": raw_result}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
