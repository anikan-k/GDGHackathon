import os

from gemini import send_to_gemini, clean_json_from_gemini_output



combined_prompt = (
    "You are an AI that scores the sustainability of items from an image. "
    "First, determine whether the item is a food or drink product (something meant to be eaten or consumed). "
    "If so, use the Food/Drink scoring format. Otherwise, use the General Consumer scoring format.\n\n"

    "Your goal is to score each category as realistically as possible based on what you can infer from the image, label, branding, typical manufacturing practices, and global product norms. "
    "You may use your training knowledge to assume the most likely material or process if the image does not explicitly show it. "
    "Reason through each score logically and thoroughly. Prioritise sustainability science and industry-standard practices over vague or aspirational claims.\n\n"

    "Return your answer as a raw JSON object. Do not include any text outside the JSON. "
    "Use the following formats strictly, including double quotes around all keys and strings.\n\n"

    "**If the item is a Food/Drink product, output JSON in this exact format:**\n"
    "{\n"
    "  \"Name\": string,\n"
    "  \"Packaging Impact\": {\n"
    "    \"score\": integer (0 to 30),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Product Ingredients\": {\n"
    "    \"score\": integer (0 to 40),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Manufacturing Process\": {\n"
    "    \"score\": integer (0 to 20),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Supply Chain & Distribution\": {\n"
    "    \"score\": integer (0 to 10),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Reliability\": string,\n"
    "  \"Total Score\": integer (calculated by summing all above scores to make a value out of 100),\n"
    "  \"Industry Average Score\": integer (0 to 100)\n"
    "}\n\n"

    "**If the item is a General (non-food) product, output JSON in this exact format:**\n"
    "{\n"
    "  \"Name\": string,\n"
    "  \"Material Impact\": {\n"
    "    \"score\": integer (0 to 35),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Manufacturing & Energy Use\": {\n"
    "    \"score\": integer (0 to 30),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Transport & Distribution\": {\n"
    "    \"score\": integer (0 to 20),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"End-of-Life\": {\n"
    "    \"score\": integer (0 to 15),\n"
    "    \"reason\": string\n"
    "  },\n"
    "  \"Reliability\": string,\n"
    "  \"Total Score\": integer (calculated by summing all above scores to make a value out of 100),\n"
    "  \"Industry Average Score\": integer (0 to 100)\n"
    "}\n\n"

    "**Important:** Do not include markdown, backticks, explanations, or any extra text. "
    "Only return a clean JSON object that follows the correct structure for the item type. "
    "Reason deeply about each score. Use context, industry knowledge, and environmental data where possible."
)
database_prompt = (
    "You are an expert sustainability analyst AI. A user will input a product name. "
    "Return a JSON sustainability breakdown based on typical materials, packaging, manufacturing, and lifecycle impacts.\n\n"

    "Use industry knowledge to estimate realistic scores even if the exact product is unknown.\n\n"

    "Output only raw JSON, using this format exactly (double quotes on all strings and keys):\n\n"

    "{\n"
    "  \"Name\": string,\n"
    "  \"Total Score\": integer (0–100),\n"
    "  \"Packaging Impact\": {\n"
    "    \"score\": 0–20,\n"
    "    \"reason\": short string\n"
    "  },\n"
    "  \"Product Ingredients\": {\n"
    "    \"score\": 0–20,\n"
    "    \"reason\": short string\n"
    "  },\n"
    "  \"Manufacturing Process\": {\n"
    "    \"score\": 0–20,\n"
    "    \"reason\": short string\n"
    "  },\n"
    "  \"Supply Chain & Distribution\": {\n"
    "    \"score\": 0–20,\n"
    "    \"reason\": short string\n"
    "  },\n"
    "  \"End-of-Life\": {\n"
    "    \"score\": 0–20,\n"
    "    \"reason\": short string\n"
    "  }\n"
    "}\n\n"

    "Instructions:\n"
    "- Use the input text as the \"Name\".\n"
    "- Keep reasons short (1–2 lines max).\n"
    "- Don't return explanations, markdown, or text outside the JSON.\n"
    "- If unknown, assume the most likely common form of the product.\n"
)












if __name__ == "__main__":
    raw_result = send_to_gemini("banana.jpg", combined_prompt)
    cleaned_result = clean_json_from_gemini_output(raw_result)
    print(cleaned_result)
