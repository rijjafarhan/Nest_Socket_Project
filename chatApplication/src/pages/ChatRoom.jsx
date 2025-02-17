import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatRoom = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io('http://localhost:30001'); // Replace with your server URL

    // Join the chat room
    socketRef.current.emit('joinChat', chatId);

    // Listen for incoming messages
    socketRef.current.on('messageReceived', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    // Fetch initial chat messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:30001/chats/${chatId}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Send message to the server
    socketRef.current.emit('sendMessage', { chatId, message });

    // Update UI optimistically
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === userId ? 'my-message' : 'other-message'
            }`}
          >
            <div className="sender">{message.sender}</div>
            <div className="content">{message.content}</div>
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
