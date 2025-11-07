from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Remove the dot from imports
import models, schemas, crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Task Manager API",
    description="A production-ready task management API built with FastAPI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Smart Task Manager API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/tasks", response_model=List[schemas.Task])
def get_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all tasks with pagination"""
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@app.post("/tasks", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    return crud.create_task(db=db, task=task)

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int, 
    task: schemas.TaskUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing task"""
    db_task = crud.update_task(db, task_id=task_id, task=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = crud.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return None

@app.get("/tasks/stats/summary", response_model=schemas.TaskStats)
def get_stats(db: Session = Depends(get_db)):
    """Get task statistics"""
    return crud.get_task_stats(db)