import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import {  useLocation } from "react-router-dom";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId,setReceiverId] =useState(null)
  const [isGroupChat, setIsGroupChat] = useState(false); 
  const socketRef = useRef(null);
  const { chatId } = useParams();
  const location = useLocation();
  const userId = location.state?.userId;
  const groupName = location.state?.groupName;
  

  useEffect(() => {
    console.log("in chat room, chatid: ", chatId);
  
    console.log("user Id: ", userId)
    socketRef.current = io('http://localhost:30001'); 
    socketRef.current.emit('joinChat', chatId);
    socketRef.current.on('messageReceived', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("in fetching msg");
        console.log("chatId: ", chatId);

        const response = await fetch(`http://localhost:30001/chat/${chatId}/messages`);
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Chat details:", data);

        
        if (data.messages[0]?.receiverId === null) {
          setIsGroupChat(true);
          setReceiverId(null);
        } else {
          setIsGroupChat(false);
          setReceiverId(data.messages[0]?.receiverId); 
        }
        if(groupName)
        {
          setIsGroupChat(true);
        }

        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = () => {
    console.log("group chat:  ",isGroupChat)
    
  if (isGroupChat) {
    sendGroupMessage(); 
  } else {
    sendPrivateMessage(); 
  }
  
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setNewMessage('');




    
  };

  const sendPrivateMessage=()=>{
    if (!newMessage.trim()) return;
    console.log("sender: ",userId)
    const message = {
      chatId,
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
    };
  
    
    socketRef.current.emit("sendMessage", message);
  }

  const sendGroupMessage=()=>{
    if (!newMessage.trim()) return;
    console.log("sender: ",userId)
    const message = {
      chatId,
      senderId: userId,
      content: newMessage,
    };
  
    
    socketRef.current.emit("sendGroupMessage", message);
    
  }
  
 
 
  
  return (
    <div style={styles.chatRoom}>
      <div style={styles.messagesContainer}>
      {messages && messages.length > 0 ? (
  messages.map((message) => (
    <div
      key={message.id}
      style={{
        ...styles.message,
        ...(message.senderId === userId ? styles.myMessage : styles.otherMessage),
      }}
    >
      <div style={styles.sender}>{message.sender}</div>
      <div style={styles.content}>{message.content}</div>
      
    </div>
  ))
) : (
  <div style={styles.noMessages}>No messages available</div>
)}

      </div>
      <div style={styles.messageInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button 
          onClick={handleSendMessage} 
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
const styles = {
  chatRoom: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'scroll',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
  },
  message: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#e2e2e2',
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#80c7f7',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e2e2e2',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  content: {
    fontSize: '1rem',
    marginTop: '5px',
  },
  timestamp: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '5px',
  },
  messageInput: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  input: {
    width: '80%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px 15px',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};
