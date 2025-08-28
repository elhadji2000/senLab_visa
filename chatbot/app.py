from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)

# Endpoint /chat
@app.route("/chat", methods=["POST"])
def chat_postman():
    data = request.json
    question = data.get("question", "")

    try:
        # envoie directement à Ollama (modèle déjà en mémoire)
        response = ollama.chat(model="llama3", messages=[
            {"role": "system", "content": "Tu es un assistant spécialisé uniquement dans les sciences STEM. Ignore tout ce qui n’est pas STEM."},
            {"role": "user", "content": question}
        ])
        answer = response["message"]["content"]
    except Exception as e:
        answer = f"Erreur : {str(e)}"

    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5050, debug=True)
