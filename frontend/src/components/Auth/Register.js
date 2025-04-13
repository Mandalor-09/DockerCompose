import React, { useState } from 'react';
import apiClient from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Optional
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/register/', {
        username,
        password,
        email, // Include if you want to collect email
      });
      // Store token and user info (optional)
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', response.data.username);
      console.log('Registration successful:', response.data);
      navigate('/'); // Redirect to home/todo list after successful registration
      window.location.reload(); // Force reload to update auth state in App.js
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError( 'Registration failed. Please check your input.' );
      // Handle specific errors, e.g., username taken
      if (err.response?.data?.username) {
          setError(`Registration failed: ${err.response.data.username.join(' ')}`);
      } else if (err.response?.data?.password) {
          setError(`Registration failed: ${err.response.data.password.join(' ')}`);
      } else {
          setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
         <div>
          <label>Email (optional):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
    </div>
  );
}

export default Register;