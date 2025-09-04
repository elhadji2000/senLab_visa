import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import "./styles.css";

const API_BASE = "http://127.0.0.1:5050";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Bonjour ! Posez-moi une question (STEM uniquement)." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.body) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "⚠️ Pas de flux reçu du serveur." },
        ]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botAnswer = "";
      let done = false;

      setMessages((prev) => [...prev, { role: "bot", content: "" }]);

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
                setIsLoading(false);
                return;
              }

              try {
                const json = JSON.parse(payload);
                if (json.token) {
                  botAnswer += json.token;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = botAnswer;
                    return updated;
                  });
                }
              } catch (err) {
                console.error("Erreur JSON SSE:", err);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Impossible de contacter le serveur." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="chatbot-button">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2>Assistant IA STEM</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Écrivez votre question…"
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
