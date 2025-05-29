import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';

// Pages to be created
import Home from './pages/Home';
import Board from './pages/Board';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import ChatPage from './pages/ChatPage';
import FriendsPage from './pages/FriendsPage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Components to be created
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Simulate checking for authentication
  useEffect(() => {
    // In a real app, you would check for a valid token in localStorage or cookies
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token with backend (not implemented here)
      setIsLoggedIn(true);
      setUser({ name: '테스트 사용자', id: 1 }); // Mock user data
    }
  }, []);

  const handleLogin = (userData) => {
    // In a real app, this would make an API call to authenticate
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('authToken', 'mock-token'); // Mock token storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/new" element={<CreatePost />} />
            <Route path="/board/:postId" element={<PostDetail />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
