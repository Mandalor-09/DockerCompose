import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodoList from './components/Todo/TodoList';
import apiClient from './services/api';
import './App.css'; // Optional: for basic styling

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Check token validity initially

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
        // Optional: Validate token with backend here if needed
        // For simplicity, we assume the token is valid if present
        setIsAuthenticated(true);
        setUsername(storedUsername);
    }
    setIsLoading(false); // Done checking
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            await apiClient.post('/auth/logout/');
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
            // Still proceed with local logout even if backend fails
        } finally {
             // Clear local storage regardless of backend response
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            setIsAuthenticated(false);
            setUsername('');
            // Use navigate hook here if needed, or let Routes handle redirect
            // navigate('/login'); // Navigate might be needed if not using Navigate component
             window.location.href = '/login'; // Hard refresh can be simpler sometimes
        }
    }
  };

  if (isLoading) {
      return <div>Loading application...</div>; // Or a proper spinner
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Todo App</h1>
          <ul>
            {isAuthenticated ? (
              <>
                <li>Welcome, {username}!</li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>

        <main>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
             />
            <Route
                path="/register"
                element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
             />
             {/* Catch-all or 404 route */}
             <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;