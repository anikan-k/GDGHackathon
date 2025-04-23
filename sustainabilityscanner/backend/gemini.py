import requests
import base64
import os
from dotenv import load_dotenv
import json
import re




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


def clean_json_from_gemini_output(result: str) -> str:
    """
    Remove triple backticks and optional 'json' label from Gemini's response.
    Returns a raw JSON string, not a Python dict.
    """
    return re.sub(r"^```json|^```|```$", "", result.strip(), flags=re.IGNORECASE).strip()

