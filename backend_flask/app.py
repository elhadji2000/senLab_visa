from flask import Flask, request, jsonify
from flask_cors import CORS
from model.chatbot_model import generate_response  # Fonction à créer

app = Flask(__name__)
CORS(app)  # Autorise les requêtes cross-origin

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    
    # Appel du modèle IA pour générer une réponse
    bot_response = generate_response(user_message)
    
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)