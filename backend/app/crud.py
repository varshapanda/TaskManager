from sqlalchemy.orm import Session
from sqlalchemy import func
# Remove dot from imports
import models, schemas

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskUpdate):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        update_data = task.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

def get_task_stats(db: Session):
    total = db.query(func.count(models.Task.id)).scalar()
    completed = db.query(func.count(models.Task.id)).filter(
        models.Task.completed == True
    ).scalar()
    high_priority = db.query(func.count(models.Task.id)).filter(
        models.Task.priority == "high"
    ).scalar()
    
    return {
        "total": total,
        "completed": completed,
        "pending": total - completed,
        "high_priority": high_priority
    }