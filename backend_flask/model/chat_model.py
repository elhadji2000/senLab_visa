from transformers import pipeline

# Charger un modèle de chatbot (ex: DialoGPT, GPT-2)
chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")

def generate_response(user_message):
    response = chatbot(user_message, max_length=100)[0]["generated_text"]
    return response