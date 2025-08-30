import React from "react";
import ChatBot from "react-chatbotify";

const API_BASE = "http://localhost:5050";

export default function ChatbotWidget() {
  // --- Flow chatbot ---
  const flow = {
    start: {
      message: "👋 Bonjour ! Posez-moi une question (STEM uniquement).",
      path: "user_input",
    },
    user_input: {
      message: "Écrivez votre question ci-dessous 👇",
      user: true,
      async: true,
      function: async ({ userInput }) => {
        try {
          const response = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput }),
          });

          if (!response.body) {
            return "⚠️ Pas de flux reçu du serveur.";
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let botAnswer = "";
          let done = false;

          while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
              const text = decoder.decode(value, { stream: true });
              const lines = text.split("\n\n");

              for (const line of lines) {
                if (line.startsWith("data:")) {
                  const payload = line.replace("data: ", "").trim();
                  if (payload === "[DONE]") {
                    return botAnswer; // fin du flux
                  }

                  try {
                    const json = JSON.parse(payload);
                    if (json.token) {
                      botAnswer += json.token;
                    }
                  } catch (err) {
                    console.error("Erreur JSON SSE:", err);
                  }
                }
              }
            }
          }

          return botAnswer || "⚠️ Réponse vide du serveur.";
        } catch (err) {
          console.error(err);
          return (
            "⚠️ Impossible de contacter le serveur. Vérifie que le backend tourne sur : " + API_BASE
          );
        }
      },
      path: "user_input",
    },
  };

  // --- Settings chatbot ---
  const settings = {
    showHeader: true,
    headerTitle: "Assistant IA STEM",
    hideBranding: true,
    floating: true,
    width: "380px",
    height: "520px",
    autoFocus: true,
    placeholder: "Tapez votre question (maths, physique, info, etc.)…",
  };

  const containerStyle = {
    zIndex: 2000,
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      <ChatBot flow={flow} settings={settings} />
    </div>
  );
}
