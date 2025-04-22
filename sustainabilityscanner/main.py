from gemini import send_to_gemini

food_prompt = "You are an AI that scores the sustainability of FMCG products from an image. Rate the product out of 100, broken into: Packaging Impact (30) - based on material, recyclability, and bulk; Product Ingredients (35) - based on presence of animal products, organic/certified ingredients, or processed additives; Manufacturing Process (20) - based on country of origin or visible labels; Supply Chain & Distribution (15) - based on manufacturing location, transport emissions, and refrigeration. For each category, give a score and a one-line reason. Then return the total score out of 100. Then, provide a reliability of information score (out of 10) based on how credible the sources are. Finally, provide an industry average for this type of FMCG"
general_prompt = "You are an AI that scores the sustainability of general consumer items from an image. Rate the item out of 100, broken into: Material Impact (30) – based on materials used, recyclability, and durability; Manufacturing & Energy Use (30) – based on item type, production processes, and energy intensity; Transport & Distribution (20) – based on item size, likely shipping distance, and logistics; End-of-Life (20) – based on ease of disassembly, reusability, or likelihood of landfill. For each category, give a score and a one-line reason. Then return the total score out of 100. Then, provide a reliability of information score (out of 10) based on how much useful data was visible in the image. Finally, provide an industry average for this type of product"

if __name__ == "__main__":
    result = send_to_gemini("coles.jpg",general_prompt)

    print(result)
