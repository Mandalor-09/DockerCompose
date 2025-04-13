import React, { useState } from 'react';
import apiClient from '../../services/api';

function TodoForm({ onTodoAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    try {
      const response = await apiClient.post('/todos/', {
        title,
        description,
      });
      setTitle('');
      setDescription('');
      onTodoAdded(response.data); // Callback to update the list in parent
    } catch (err) {
      console.error('Error adding todo:', err.response?.data || err.message);
      setError('Failed to add todo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New Todo</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description (optional):</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;