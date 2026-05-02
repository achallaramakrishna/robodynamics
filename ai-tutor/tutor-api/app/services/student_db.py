import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# DATABASE_URL should follow: mysql+mysqlconnector://user:password@host/dbname
# For this task, we use the STUDENT_DB_URL environment variable.
# Falls back to sqlite if not provided.
DB_URL = os.getenv("STUDENT_DB_URL", "sqlite:///./students.db")

engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Student(Base):
    __tablename__ = "students"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
    # Language preference: hindi-full | hindi-english | english-simplified
    language_preference = Column(String(30), default="hindi-full")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Create all tables
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
