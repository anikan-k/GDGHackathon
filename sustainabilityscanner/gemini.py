import requests
import base64
import os
from dotenv import load_dotenv
import json



# --- Config ---
load_dotenv()
api_key = os.getenv("API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-03-25:generateContent?key={api_key}"
IMAGES_DIR = "images"

# --- Load and Encode Image ---
def encode_image(image_name: str) -> str:
    image_path = os.path.join(IMAGES_DIR, image_name)
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

# --- Send to Gemini ---
def send_to_gemini(image_name: str, prompt: str) -> str:
    encoded_image = encode_image(image_name)

    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inlineData": {
                        "mimeType": "image/jpeg",
                        "data": encoded_image
                    }
                }
            ]
        }]
    }

    response = requests.post(GEMINI_URL, json=payload)
    response.raise_for_status()

    return response.json()["candidates"][0]["content"]["parts"][0]["text"]


def results_clean(result):
    removed_slash = result.strip().replace('```json', '').replace('```', '').strip()
    cleaned = json.loads(removed_slash)
    return cleaned

