from . import models, schemas
from sqlalchemy.orm import Session

# 全件取得
def get_todos(db: Session):
    return db.query(models.Todo).all()

# 新規作成
def create_todo(db:Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(title=todo.title, is_completed=todo.is_completed)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 更新（完了フラグの切り替え）
def update_todo(db: Session, todo_id: int):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo:
        db_todo.is_completed = not db_todo.is_completed
        db.commit()
        db.refresh(db_todo)
    return db_todo

#　削除
def delete_todo(db:Session, todo_id: int):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo