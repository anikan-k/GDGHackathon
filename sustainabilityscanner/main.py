from gemini import send_to_gemini

if __name__ == "__main__":
    result = send_to_gemini("product-jpeg.jpg", "Give a sustainability score out of 100 with breakdowns.")
    print(result)
