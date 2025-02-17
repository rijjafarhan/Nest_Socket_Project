import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

// Connect to the backend WebSocket server

const Profile = () => {
    const socket = io("http://localhost:30001");
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;
  const navigate =useNavigate()

  useEffect(() => {
    fetchUsers();
    fetchChats();
   // fetchGroups();
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
    
        console.log("in creating chat")
      // If chat doesn't exist yet, create it first
      socket.emit(
        "createChat",
        {
          memberIds: [userId, receiverId], // Array of user IDs
          isGroup: false, // Since it's a private chat
        }
    )
    console.log(receiverId)
    console.log(userId)
    navigate(`/chat/${receiverId}`,{ state: { userId } }); 
  };

  const openChat = (chatId) => {
    navigate(`/${chatId}`)
  };

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen p-6">
      <div className="container max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Users</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">All Users</h3>
            <ul className="bg-gray-700 p-4 rounded-md">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-2 border-b border-gray-600"
                >
                  <span>{user.name} ({user.email})</span>
                  <button
                    onClick={() => startChat(user.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Chats & Groups</h3>
            <div className="mb-4">
              <h4 className="text-lg font-semibold">User Chats</h4>
              <ul className="bg-gray-700 p-4 rounded-md">
                {chats.map((chat) => (
                  <li key={chat.id} className="p-2 border-b border-gray-600">
                    <span>{chat.name}</span>
                    <button
                      onClick={() => openChat(chat.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Groups</h4>
              <ul className="bg-gray-700 p-4 rounded-md">
                {groups.map((group) => (
                  <li key={group.id} className="p-2 border-b border-gray-600">
                    <span>{group.name}</span>
                    <button
                      onClick={() => openChat(group.id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700"
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

export default Profile;
