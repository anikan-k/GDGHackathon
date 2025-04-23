from gemini import send_to_gemini, results_clean

image_path = "hilux.jpg"


combined_prompt = (
    "You are an AI that scores the sustainability of items from an image. "
    "First, determine whether the item is a food or drink product (i.e. something meant to be eaten or consumed). "
    "If it is, use the **Food/Drink scoring**. Otherwise, use the **General Consumer scoring**.\n\n"

    "For **Food/Drink items**, return the following keys:\n"
    "- \"Name\"\n"
    "- \"Packaging Impact\" (30): score, reason — based on material, recyclability, and bulk\n"
    "- \"Product Ingredients\" (35): score, reason — based on presence of animal products, organic/certified ingredients, or processed additives\n"
    "- \"Manufacturing Process\" (20): score, reason — based on country of origin or visible sustainability certifications\n"
    "- \"Supply Chain & Distribution\" (15): score, reason — based on manufacturing location, transport emissions, and refrigeration\n"
    "- \"Reliability\"\n"
    "- \"Total Score\"\n"
    "- \"Industry Average Score\"\n\n"

    "For **Non-Food items** (all other general consumer goods like furniture, clothing, electronics, etc.), return the following keys:\n"
    "- \"Name\"\n"
    "- \"Material Impact\" (30): score, reason — based on materials used, recyclability, and durability\n"
    "- \"Manufacturing & Energy Use\" (30): score, reason — based on item type, production process, and energy use\n"
    "- \"Transport & Distribution\" (20): score, reason — based on item size, likely shipping distance, and logistics\n"
    "- \"End-of-Life\" (20): score, reason — based on disassembly ease, reusability, or landfill likelihood\n"
    "- \"Reliability\"\n"
    "- \"Total Score\"\n"
    "- \"Industry Average Score\"\n\n"

    "**IMPORTANT:** Output MUST be raw JSON — do not use markdown, triple backticks, or any labels. "
    "Start with '{' and end with '}'. Use only the keys listed above, exactly as written. Return only the applicable structure."
)






if __name__ == "__main__":
    uncleaned_result = send_to_gemini(image_path,combined_prompt)

    cleaned_result = results_clean(uncleaned_result)
    print(cleaned_result["End-of-Life"])
