from flask import Flask, request, Response
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
CORS(app)

# Précharger le modèle une fois
system_prompt = (
    "Tu es un assistant spécialisé uniquement dans les sciences STEM "
    "(Mathématiques, Physique, Chimie, Informatique, Biologie). "
    "Ne réponds jamais à des questions hors STEM. "
    "Donne des explications claires adaptées à des élèves de niveau secondaire, "
    "avec des exemples simples et pédagogiques si nécessaire."
)

print("⏳ Chargement du modèle llama3 avec spécialisation STEM ...")
ollama.chat(
    model="llama3",
    messages=[{"role": "system", "content": system_prompt}]
)
print("✅ Modèle prêt et spécialisé STEM")

# ==============================
# Endpoint /chat (streaming)
# ==============================
@app.route("/chat", methods=["POST"])
def chat_stream():
    data = request.json
    question = data.get("question", "")

    def generate():
        try:
            # Prompt system amélioré pour spécialisation STEM
            system_prompt = (
                "Tu es un assistant spécialisé uniquement dans les sciences STEM "
                "(Mathématiques, Physique, Chimie, Informatique, Biologie). "
                "Ne réponds jamais à des questions hors STEM. "
                "Donne des explications claires, adaptées à des élèves de niveau secondaire, "
                "avec des exemples simples et pédagogiques si nécessaire."
            )

            stream = ollama.chat(
                model="llama3",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                stream=True  # ⚡ active le streaming
            )

            for chunk in stream:
                if "message" in chunk and "content" in chunk["message"]:
                    token = chunk["message"]["content"]
                    yield f"data: {json.dumps({'token': token})}\n\n"

            # fin du stream
            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(generate(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(port=5050, debug=True, threaded=True)
