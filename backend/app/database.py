from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get Neon connection string from environment variable
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Replace postgres:// with postgresql:// for SQLAlchemy compatibility
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with Neon PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
try:
    with engine.connect() as connection:
        print("Successfully connected to Neon PostgreSQL database!")
except Exception as e:
    print(f"Failed to connect to database: {e}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()