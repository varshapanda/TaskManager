from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    completed: bool = False
    priority: str = Field(default="medium")

    class Config:
        schema_extra = {
            "example": {
                "title": "Sample task",
                "description": "This is a sample task",
                "completed": False,
                "priority": "medium"
            }
        }

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None)

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class TaskStats(BaseModel):
    total: int
    completed: int
    pending: int
    high_priority: int