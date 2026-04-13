import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# DATABASE_URL should follow: mysql+mysqlconnector://user:password@host/dbname
# For this task, we assume the environment variable MONEYMIND_DB_URL is set.
# Defaulting to a local sqlite if not provided, just for safety, but user wants MySQL.
DB_URL = os.getenv("MONEYMIND_DB_URL", "sqlite:///./moneymind.db")

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class MMUser(Base):
    __tablename__ = "mm_users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    virtual_balance = Column(Float, default=1000.0) # Starting balance for kids

class MMBankAccount(Base):
    __tablename__ = "mm_bank_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mm_users.user_id"))
    account_number = Column(String(20), unique=True)
    balance = Column(Float, default=0.0)
    account_type = Column(String(20)) # Savings, Checking

class MMTransaction(Base):
    __tablename__ = "mm_transactions"
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("mm_bank_accounts.id"))
    transaction_type = Column(String(20)) # CREDIT, DEBIT
    amount = Column(Float)
    description = Column(String(200))
    timestamp = Column(DateTime, default=datetime.utcnow)

class MMSavingGoal(Base):
    __tablename__ = "mm_saving_goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mm_users.user_id"))
    goal_name = Column(String(100))
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)


class MMMerchant(Base):
    __tablename__ = "mm_merchants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    vpa = Column(String(100), unique=True) # UPI ID like merchant@okpay
    category = Column(String(50)) # Food, Stationaries, etc.


class MMChore(Base):
    __tablename__ = "mm_chores"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mm_users.user_id"))
    description = Column(String(200))
    reward_amount = Column(Float)
    status = Column(String(20), default="PENDING") # PENDING, COMPLETED, PAID

class MMProgress(Base):
    """Tracks lesson completion per user. One row per (user_id, lesson_id)."""
    __tablename__ = "mm_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("mm_users.user_id"), nullable=False, index=True)
    level_id = Column(String(10), nullable=False)       # e.g. "L3"
    lesson_id = Column(String(20), nullable=False)      # e.g. "MM_L3_2"
    completed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)


# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
