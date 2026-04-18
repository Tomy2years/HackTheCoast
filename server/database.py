import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), "portrait.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String)
    raw_code = Column(String)
    grade = Column(Float)
    term = Column(String)
    syllabus = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    name = Column(String)
    due_at = Column(DateTime, nullable=True)
    points_possible = Column(Float)
    submission_types = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    message = Column(Text)
    posted_at = Column(DateTime)
    author_name = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

class SyncMeta(Base):
    __tablename__ = "sync_meta"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True)
    last_sync = Column(DateTime)

def init_db():
    Base.metadata.create_all(bind=engine)
