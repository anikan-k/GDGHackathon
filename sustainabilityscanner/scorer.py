import json
from main import get_result, general_prompt

image_path = "banana.png"
result = get_result(image_path, general_prompt)


#JSON FILE - remove '''json and ''' at the start and end of the output
if result:
    try:
        result_clean = result.strip().replace('```json', '').replace('```', '').strip()
        
        parsed = json.loads(result_clean)
        
        print("Name: " + parsed["Name"])
        print(f"Material Impact: " + parsed["Material Impact"]["reason"])
        print("Manufacturing & Energy Use: " + parsed["Manufacturing & Energy Use"]["reason"])
        print("Transport & Distribution: " + parsed["Transport & Distribution"]["reason"])
        print("End-of-Life: " + parsed["End-of-Life"]["reason"])


    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
else:
    print("Result is empty.")
