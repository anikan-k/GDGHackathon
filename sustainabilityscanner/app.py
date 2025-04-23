from flask import Flask, request, jsonify
from main import get_result, detect_food, food_prompt, general_prompt

app = Flask(__name__)

@app.route("/score", methods=["POST"])

def score():
    data = request.json
    image_name = data["imageName"]

    is_food = detect_food(image_name)
    prompt = food_prompt if is_food else general_prompt

    result = get_result(image_name, prompt)
    return jsonify(result_clean)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
