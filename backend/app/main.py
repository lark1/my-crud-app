from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models,database,schemas,crud
import os
from dotenv import load_dotenv

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# --- CORS設定 (重要!) ---
# Next.js(3000番)からFastAPI(8000番)へのアクセスを許可します
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/todos",response_model=list[schemas.Todo])
def read_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

@app.post("/todos",response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate,db:Session = Depends(get_db)):
    return crud.create_todo(todo=todo, db=db)

@app.put("/todos/{todo_id}",response_model=schemas.Todo)
def update_todo(todo_id: int, db: Session = Depends(get_db)):
    return crud.update_todo(db=db, todo_id=todo_id)

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id:int, db: Session = Depends(get_db)):
    crud.delete_todo(db=db, todo_id=todo_id)
    return {"message":"削除しました"}
