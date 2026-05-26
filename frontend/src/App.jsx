import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_API_URL ?? '';

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBaseUrl}/todos/`);
        if (!response.ok) {
          throw new Error(`Failed to load todos: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        setError('Unable to load todos. Make sure the backend is running.');
        console.error('Error fetching todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [apiBaseUrl]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/todos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status}`);
      }

      const newTodo = await response.json();
      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (error) {
      setError('Unable to add the todo. Try again.');
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status}`);
      }

      const updatedTodo = await response.json();
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setError('');
    } catch (error) {
      setError('Unable to update the todo. Try again.');
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.status}`);
      }

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      setError('');
    } catch (error) {
      setError('Unable to delete the todo. Try again.');
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-shell">
      <main className="todo-card">
        <div className="hero">
          <p className="eyebrow">React + FastAPI + PostgreSQL</p>
          <h1>Todo workflow that stays out of your way.</h1>
          <p className="subheading">
            Capture tasks, mark them complete, and keep the list synced with the backend.
          </p>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Todo title"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Todo description"
          />
          <button type="submit">Add todo</button>
        </form>

        {error ? <p className="status status-error">{error}</p> : null}
        {isLoading ? <p className="status">Loading todos...</p> : null}

        <section className="todo-list" aria-label="Todo list">
          {todos.length === 0 && !isLoading ? (
            <p className="empty-state">No todos yet. Add the first one above.</p>
          ) : null}

          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'todo-item completed' : 'todo-item'}>
                <div className="todo-content">
                  <strong>{todo.title}</strong>
                  {todo.description ? <span>{todo.description}</span> : <span className="muted">No description</span>}
                </div>
                <div className="todo-actions">
                  <button type="button" onClick={() => toggleTodo(todo.id, todo.completed)}>
                    {todo.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button type="button" className="destructive" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;