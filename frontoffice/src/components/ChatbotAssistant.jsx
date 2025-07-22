import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPaperPlane, FaRobot, FaCommentDots } from "react-icons/fa";
import "./Chatbot.css";

function Assistant() {
  const [show, setShow] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  // Pour le défilement automatique vers le dernier message
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Ajoute la question de l'utilisateur
    const userMessage = { sender: "user", text: inputMessage };
    setConversation([...conversation, userMessage]);
    setInputMessage("");

    // Simulation de réponse (remplace par ton API)
    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: `Voici une réponse à : "${inputMessage}"`,
      };
      setConversation((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Bouton flottant style assistant avec pulsation */}
      <div onClick={() => setShow(true)} className="assistant-float">
        <div className="pulse-circle" />
        <img
          src="/src/assets/icons8-siri.svg"
          alt="Assistant"
          className="assistant-icon"
        />
      </div>

      {/* Modal amélioré */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="md"
        dialogClassName="chatbot-modal"
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#25D366", color: "white" }}
        >
          <Modal.Title>
            <FaRobot style={{ marginRight: "10px" }} />
            Assistant senLab
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0" }}>
          {/* Zone de conversation */}
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              padding: "15px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {conversation.length === 0 ? (
              <div className="text-center text-muted mt-4">
                Posez votre première question !
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 15px",
                      borderRadius:
                        msg.sender === "user"
                          ? "18px 18px 0 18px"
                          : "18px 18px 18px 0",
                      backgroundColor:
                        msg.sender === "user" ? "#DCF8C6" : "#fff",
                      boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire d'envoi */}
          <Form
            onSubmit={handleSubmit}
            style={{ padding: "15px", borderTop: "1px solid #eee" }}
          >
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Écrivez votre message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ borderRadius: "20px", marginRight: "10px" }}
              />
              <Button
                variant="success"
                type="submit"
                style={{ borderRadius: "50%", width: "40px", height: "40px" }}
              >
                <FaPaperPlane />
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Petit CSS pour l'animation du bouton */}
      <style>
        {`
          .hover-scale:hover {
            transform: scale(1.1);
          }
          .chatbot-modal .modal-content {
            border-radius: 15px;
            overflow: hidden;
          }
        `}
      </style>
    </>
  );
}

export default Assistant;
