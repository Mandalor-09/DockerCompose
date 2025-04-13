import React, { useState } from 'react';
import apiClient from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      });
      // Store token and user info
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', response.data.username);
      console.log('Login successful:', response.data);
      navigate('/'); // Redirect to home/todo list
       window.location.reload(); // Force reload to update auth state in App.js
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed. Check credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
       <p>Don't have an account? <button onClick={() => navigate('/register')}>Register</button></p>
    </div>
  );
}

export default Login;