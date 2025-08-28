import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5050/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { type: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Erreur : impossible de contacter le serveur." },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div>
      {/* Bouton flottant */}
      <motion.button
        onClick={toggleChat}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 65,
          height: 65,
          background: "linear-gradient(135deg, #007bff, #00d4ff)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 26,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        💬
      </motion.button>

      {/* Modal Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: 100,
              right: 20,
              width: 380,
              height: 520,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: 20,
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "15px",
                background: "linear-gradient(135deg, #007bff, #00d4ff)",
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🔮 Assistant IA
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: 15, overflowY: "auto" }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.type === "user" ? "right" : "left",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      background:
                        msg.type === "user"
                          ? "linear-gradient(135deg, #007bff, #00d4ff)"
                          : "#f1f1f1",
                      color: msg.type === "user" ? "#fff" : "#000",
                      padding: "8px 14px",
                      borderRadius: 18,
                      display: "inline-block",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      boxShadow:
                        msg.type === "user"
                          ? "0 4px 10px rgba(0,123,255,0.3)"
                          : "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}

              {/* Loader quand bot réfléchit */}
              {loading && (
                <div style={{ textAlign: "left", marginBottom: 10 }}>
                  <span
                    style={{
                      background: "#f1f1f1",
                      color: "#555",
                      padding: "8px 14px",
                      borderRadius: 18,
                      display: "inline-block",
                      fontStyle: "italic",
                    }}
                  >
                    ...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                padding: 12,
                borderTop: "1px solid #eee",
                background: "#fafafa",
              }}
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 25,
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: 14,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendQuestion();
                }}
              />
              <button
                onClick={sendQuestion}
                disabled={loading}
                style={{
                  marginLeft: 8,
                  padding: "10px 16px",
                  borderRadius: 25,
                  background: "linear-gradient(135deg, #007bff, #00d4ff)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(0,123,255,0.3)",
                }}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
