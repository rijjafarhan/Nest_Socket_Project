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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Chat with User {receiverId}</h2>

      <div className="h-64 overflow-y-auto bg-gray-700 p-4 rounded-md mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            <span className={`inline-block px-3 py-1 rounded-md ${
              msg.senderId === userId ? "bg-blue-600" : "bg-gray-600"
            }`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="w-full p-2 text-black rounded-l-md"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700"
          onClick={sendChatMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;