import { Routes, Route } from "react-router-dom";
import  LoginPage  from './pages/Login';
import Signup  from "./pages/Signup";
import Profile from './pages/Profile'
import ChatPage from './pages/Chat'
import ChatRoom  from './pages/ChatRoom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat/:receiverId" element={<ChatPage />} />
      <Route path="/:chatId" element={<ChatRoom />} />
     
    </Routes>
  );
}

export default App;
