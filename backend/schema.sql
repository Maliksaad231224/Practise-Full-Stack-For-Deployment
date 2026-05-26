-- Schema for the todo app
-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS todos;

-- Create todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE
);

-- Index on title for faster search (optional)
CREATE INDEX idx_todos_title ON todos(title);