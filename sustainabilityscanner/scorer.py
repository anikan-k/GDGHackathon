import json
from main import get_result, general_prompt, food_prompt, detect_food

image_path = "banana.png"

is_food = detect_food(image_path)
prompt = food_prompt if is_food else general_prompt
result = get_result(image_path, prompt)

#JSON FILE - remove '''json and ''' at the start and end of the output
if result:
    try:
        result_clean = result.strip().replace('```json', '').replace('```', '').strip()
        parsed = json.loads(result_clean)
        print(result_clean)

    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
else:
    print("Result is empty.")
