from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("message")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # ou gpt-4 / gpt-4o
            messages=[
                {"role": "system", "content": "Tu es un assistant éducatif du laboratoire senLab. Aide les élèves à comprendre les simulations scientifiques."},
                {"role": "user", "content": question}
            ]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "Une erreur est survenue : " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
