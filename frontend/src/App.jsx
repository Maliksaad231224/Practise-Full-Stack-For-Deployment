import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to load todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const createdTodo = await response.json();
      setTodos((current) => [createdTodo, ...current]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to create todo');
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">React + FastAPI + PostgreSQL</p>
        <h1>Simple todo stack</h1>
        <p className="lead">A minimal full-stack starter connected to a Postgres-backed API.</p>
      </section>

      <section className="panel">
        <h2>Add todo</h2>
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Todos</h2>
          <button type="button" onClick={loadTodos}>Refresh</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <strong>{todo.title}</strong>
                {todo.description && <span>{todo.description}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
