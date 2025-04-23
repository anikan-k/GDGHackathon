import os

from gemini import send_to_gemini, clean_json_from_gemini_output



combined_prompt = (
    "You are an AI that scores the sustainability of items from an image. "
    "First, determine whether the item is a food or drink product (something meant to be eaten or consumed). "
    "If so, use the Food/Drink scoring format. Otherwise, use the General Consumer scoring format.\n\n"

    "Return your answer as a raw JSON object. Do not include any text outside the JSON. "
    "Use the following formats strictly, including double quotes around all keys and strings.\n\n"

    "**If the item is a Food/Drink product, output JSON in this exact format:**\n"
    "{\n"
    "  \"Name\": string,\n"
    "  \"Packaging Impact\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Product Ingredients\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Manufacturing Process\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Supply Chain & Distribution\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Reliability\": string,\n"
    "  \"Total Score\": number,\n"
    "  \"Industry Average Score\": number\n"
    "}\n\n"

    "**If the item is a General (non-food) product, output JSON in this exact format:**\n"
    "{\n"
    "  \"Name\": string,\n"
    "  \"Material Impact\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Manufacturing & Energy Use\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Transport & Distribution\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"End-of-Life\": {\n"
    "    \"score\": number,\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Reliability\": string,\n"
    "  \"Total Score\": number,\n"
    "  \"Industry Average Score\": number\n"
    "}\n\n"

    "**Important:** Do not include markdown, backticks, explanations, or any extra text. "
    "Only return a clean JSON object that follows the correct structure for the item type."
)







if __name__ == "__main__":
    raw_result = send_to_gemini("banana.jpg", combined_prompt)
    cleaned_result = clean_json_from_gemini_output(raw_result)
    print(cleaned_result)
