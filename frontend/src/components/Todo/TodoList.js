import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import TodoForm from './TodoForm';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/todos/');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err.response?.data || err.message);
      setError('Failed to load todos. Are you logged in?');
      // If unauthorized, could redirect to login here
      if (err.response?.status === 401) {
         setError('Authentication failed. Please log in again.');
         // Potentially clear token and redirect:
         // localStorage.removeItem('authToken');
         // localStorage.removeItem('username');
         // navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures it's created once

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Depend on fetchTodos callback

  const handleTodoAdded = (newTodo) => {
    // Add the new todo to the top of the list
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  const toggleComplete = async (id, currentStatus) => {
      try {
          const response = await apiClient.patch(`/todos/${id}/`, {
              completed: !currentStatus
          });
          // Update the specific todo in the state
          setTodos(prevTodos =>
              prevTodos.map(todo =>
                  todo.id === id ? { ...todo, completed: response.data.completed } : todo
              )
          );
      } catch (err) {
           console.error('Error updating todo:', err.response?.data || err.message);
           setError('Failed to update todo status.');
      }
  }

  const deleteTodo = async (id) => {
       if (window.confirm('Are you sure you want to delete this todo?')) {
           try {
               await apiClient.delete(`/todos/${id}/`);
               // Remove the todo from the state
               setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
           } catch (err) {
               console.error('Error deleting todo:', err.response?.data || err.message);
               setError('Failed to delete todo.');
           }
       }
  }

  if (loading) {
    return <p>Loading todos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>My Todos</h2>
      <TodoForm onTodoAdded={handleTodoAdded} />
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: todo.completed ? 'line-through' : 'none' }}>
             <div>
                <strong>{todo.title}</strong>
                {todo.description && <p style={{margin: '5px 0 0 0', fontSize: '0.9em', color: '#555'}}>{todo.description}</p>}
                <small style={{fontSize: '0.8em', color: '#777'}}>By {todo.owner} on {new Date(todo.created_at).toLocaleDateString()}</small>
             </div>
              <div>
                <button onClick={() => toggleComplete(todo.id, todo.completed)} style={{marginRight: '5px'}}>
                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button onClick={() => deleteTodo(todo.id)} style={{backgroundColor: '#dc3545', color: 'white'}}>
                    Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;