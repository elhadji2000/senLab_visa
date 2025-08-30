from flask import Flask, request, Response
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
CORS(app)

# Précharger le modèle une fois
print("⏳ Chargement du modèle llama3 ...")
ollama.chat(
    model="llama3",
    messages=[{"role": "system", "content": "Initialisation du modèle..."}]
)
print("✅ Modèle prêt en mémoire")


# ==============================
# Endpoint /chat (streaming)
# ==============================
@app.route("/chat", methods=["POST"])
def chat_stream():
    data = request.json
    question = data.get("question", "")

    def generate():
        try:
            stream = ollama.chat(
                model="llama3",
                messages=[
                    {"role": "system", "content": "Tu es un assistant spécialisé uniquement dans les sciences STEM."},
                    {"role": "user", "content": question}
                ],
                stream=True  # ⚡ active le streaming
            )

            for chunk in stream:
                if "message" in chunk and "content" in chunk["message"]:
                    token = chunk["message"]["content"]
                    # on envoie un JSON ligne par ligne
                    yield f"data: {json.dumps({'token': token})}\n\n"

            # fin du stream
            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(generate(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(port=5050, debug=True, threaded=True)
