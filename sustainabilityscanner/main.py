from gemini import send_to_gemini

food_prompt = (
"You are an AI that scores the sustainability of FMCG products (e.g., food, beverages, toiletries) from an image."
"Rate the product out of 100, broken into the following categories:"
"Name"
"Packaging Impact (30) – based on material, recyclability, and bulk"
"Product Ingredients (35) – based on presence of animal products, organic/certified ingredients, or processed additives"
"Manufacturing Process (20) – based on country of origin or visible sustainability labels"
"Supply Chain & Distribution (15) – based on manufacturing location, transport emissions, and refrigeration needs"
"For each category, give:"
"score"
"reason"
"Then, provide:"
"Reliability"
"Total Score"
"Industry Average Score"
"**IMPORTANT:**"
"Output must be PURE JSON without any triple backticks or 'json' labels."
"Start with '{' and end with '}'. Do not use markdown formatting."
"Ensure that the output uses the following exact variable names (case-sensitive):"
"\"Name\""
"\"Packaging Impact\""
"\"Product Ingredients\""
"\"Manufacturing Process\""
"\"Supply Chain & Distribution\""
"\"Reliability\""
"\"Total Score\""
"\"Industry Average Score\""

)

general_prompt = (
    "You are an AI that scores the sustainability of general consumer items from an image. "
    "Rate the item out of 100, broken into categories: "
    "Material Impact (30) – based on materials used, recyclability, and durability; "
    "Manufacturing & Energy Use (30) – based on item type, production processes, and energy intensity; "
    "Transport & Distribution (20) – based on item size, likely shipping distance, and logistics; "
    "End-of-Life (20) – based on ease of disassembly, reusability, or likelihood of landfill. "
    "Give for each category: score and one-line reason. "
    "Also provide a reliability score (out of 10), total score (out of 100), and industry average score. "
    "**IMPORTANT: Output must be PURE JSON without any triple backticks or 'json' labels. "
    "Start with '{' and end with '}'. Do not use markdown formatting.**"
    "Follow this structure: "
  "Name" 
  "Material Impact" 
    "score"
    "reason"
  "Manufacturing & Energy Use" 
    "score"
    "reason"
  "Transport & Distribution"
    "score"
    "reason"
  "End-of-Life"
    "score"
    "reason"
  "Reliability"
  "Total Score"
  "Industry Average Score"
)

food_check_prompt = (
    "You are an AI that identifies objects from images. "
    "Look at the item and answer with only one word: 'yes' if it is a food, beverage, or toiletry product; "
    "'no' if it is a general consumer item that is not food, beverage, or toiletry. "
    "ONLY reply 'True' or 'False'. No other words."
)


def get_result(image_path, prompt):
    return send_to_gemini(image_path, prompt)

def detect_food(image_path):
    answer = send_to_gemini(image_path, food_check_prompt)
    if answer == True:
        return answer
    else:
        return False


if __name__ == "__main__":
    result = send_to_gemini("banana.png",general_prompt)
    print(result)
