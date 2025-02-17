import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

// Connect to the backend WebSocket server
const socket = io("http://localhost:30001");

const ChatPage = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState(0);

  useEffect(() => {
    // Join chat room when component mounts
    if (userId && receiverId) {
      // Create a unique integer chatId based on participants
      const participants = [userId, receiverId].sort(); // Sort to ensure consistent order
      const newChatId = participants.reduce((acc, id) => acc * 31 + id, 0); // Generate a unique integer
      setChatId(newChatId);
      socket.emit("joinChat", newChatId);
    }

    // Listen for incoming messages
    socket.on("messageReceived", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (chatId) {
        socket.emit("leaveChat", chatId);
      }
      socket.off("messageReceived");
    };
  }, [userId, receiverId, chatId]);

  const sendChatMessage = () => {
    if (!inputMessage.trim() || !chatId) return;

    const newMessage = {
      chatId,
      senderId: userId,
      receiverId: receiverId,
      content: inputMessage,
    };

    socket.emit("sendMessage", newMessage);
    setInputMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Chat with User {receiverId}</h2>

        <div style={styles.chatSection}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  textAlign: msg.senderId === userId ? "right" : "left",
                }}
              >
                <span
                  style={{
                    ...styles.messageContent,
                    backgroundColor: msg.senderId === userId ? "#3182ce" : "#4a5568",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
          />
          <button
            style={styles.button}
            onClick={sendChatMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

const styles = {
  container: {
    backgroundColor: "#1f2937",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "1.5rem",
  },
  card: {
    backgroundColor: "#2d3748",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "1rem",
    color: "white",
  },
  chatSection: {
    marginBottom: "1.5rem",
  },
  messages: {
    height: "300px",
    overflowY: "auto",
    backgroundColor: "#333",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  message: {
    marginBottom: "10px",
  },
  messageContent: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "20px",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    width: "80%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    color: "black",
    marginRight: "10px",
  },
  button: {
    backgroundColor: "#3182ce",
    color: "white",
    padding: "12px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonHover: {
    backgroundColor: "#2b6cb0",
  },
};
