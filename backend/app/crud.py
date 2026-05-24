from sqlalchemy.orm import Session

from .models import Todo
from .schemas import TodoCreate


def list_todos(db: Session) -> list[Todo]:
    return db.query(Todo).order_by(Todo.id.desc()).all()


def create_todo(db: Session, todo_in: TodoCreate) -> Todo:
    todo = Todo(title=todo_in.title, description=todo_in.description, completed=todo_in.completed)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo
