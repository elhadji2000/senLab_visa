from flask import Flask, request, Response
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
CORS(app)

# Prompt système global
system_prompt = (
    "Tu es un assistant spécialisé uniquement dans les sciences STEM "
    "(Mathématiques, Physique, Chimie, Informatique, Biologie). "
    "Ne réponds jamais à des questions hors STEM. "
    "Limite strictement chaque réponse à un maximum de 3 phrases. "
    "Donne des explications claires pour élèves du secondaire au Sénégal."
)

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
                model="llama3.2:3b",  # 🔥 version légère
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                stream=True
            )

            for chunk in stream:
                if "message" in chunk and "content" in chunk["message"]:
                    token = chunk["message"]["content"]
                    yield f"data: {json.dumps({'token': token})}\n\n"

            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(generate(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(port=5050, debug=True, threaded=True)
