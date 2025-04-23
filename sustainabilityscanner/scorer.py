'''#JSON FILE - remove '''json and ''' at the start and end of the output
if result:
    try:
        result_clean = result.strip().replace('```json', '').replace('```', '').strip()
        parsed = json.loads(result_clean)
        print(result_clean)

    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
else:
    print("Result is empty.")'''
