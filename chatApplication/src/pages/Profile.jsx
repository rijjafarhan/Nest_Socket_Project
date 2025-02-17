import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";

// Connect to the backend WebSocket server
const socket = io("http://localhost:30001");

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchChats();
    // fetchGroups(); // Uncomment if needed later
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:30001/user/getUsers");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(`http://localhost:30001/user/getChats/${userId}`);
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:30001/groups");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const startChat = (receiverId) => {
    console.log("Creating chat...");
    socket.emit(
      "createChat",
      {
        memberIds: [userId, receiverId],
        isGroup: false, // Private chat
      }
    );
    navigate(`/chat/${receiverId}`, { state: { userId } });
  };

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Users</h2>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.subtitle}>All Users</h3>
            <ul style={styles.list}>
              {users.map((user) => (
                <li key={user.id} style={styles.listItem}>
                  <span>{user.name} ({user.email})</span>
                  <button
                    onClick={() => startChat(user.id)}
                    style={styles.button}
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={styles.subtitle}>Chats & Groups</h3>
            <div style={styles.chatSection}>
              <h4 style={styles.chatTitle}>User Chats</h4>
              <ul style={styles.list}>
                {chats.map((chat) => (
                  <li key={chat.id} style={styles.listItem}>
                    <span>{chat.name}</span>
                    <button
                      onClick={() => openChat(chat.id)}
                      style={styles.openButton}
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={styles.chatTitle}>Groups</h4>
              <ul style={styles.list}>
                {groups.map((group) => (
                  <li key={group.id} style={styles.listItem}>
                    <span>{group.name}</span>
                    <button
                      onClick={() => openChat(group.id)}
                      style={styles.openButton}
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    color:"white"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  subtitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  list: {
    backgroundColor: "#4a5568",
    padding: "1rem",
    borderRadius: "8px",
    listStyleType: "none",
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #2d3748",
  },
  button: {
    backgroundColor: "#3182ce",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#2b6cb0",
  },
  chatSection: {
    marginBottom: "1.5rem",
  },
  chatTitle: {
    fontSize: "1.125rem",
    fontWeight: "500",
    marginBottom: "0.75rem",
  },
  openButton: {
    backgroundColor: "#38a169",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default Profile;
