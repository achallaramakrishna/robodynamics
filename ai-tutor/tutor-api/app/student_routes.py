"""
Student preferences and settings routes.

Endpoints:
  GET  /ai-tutor-api/student/preferences/{user_id}
  POST /ai-tutor-api/student/preferences/{user_id}
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.student_db import SessionLocal, Student, get_db

router = APIRouter(prefix="/ai-tutor-api/student", tags=["Student"])


class LanguagePreferenceUpdate(BaseModel):
    language_preference: str  # hindi-full | hindi-english | english-simplified


class LanguagePreferenceResponse(BaseModel):
    language_preference: str
    saved: bool = True


@router.get("/preferences/{user_id}", response_model=LanguagePreferenceResponse)
async def get_language_preference(user_id: int, db: Session = Depends(get_db)):
    """
    Fetch student's saved language preference.

    Returns default (hindi-full) if student not found.
    """
    try:
        student = db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            # Create a new student record with default language
            student = Student(user_id=user_id, language_preference="hindi-full")
            db.add(student)
            db.commit()
            db.refresh(student)
        return LanguagePreferenceResponse(
            language_preference=student.language_preference,
            saved=True
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/preferences/{user_id}", response_model=LanguagePreferenceResponse)
async def set_language_preference(
    user_id: int,
    data: LanguagePreferenceUpdate,
    db: Session = Depends(get_db)
):
    """
    Save student's language preference.

    Valid values: hindi-full | hindi-english | english-simplified
    """
    # Validate language preference
    valid_preferences = ["hindi-full", "hindi-english", "english-simplified"]
    if data.language_preference not in valid_preferences:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid language_preference. Must be one of: {', '.join(valid_preferences)}"
        )

    try:
        student = db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            # Create new student record
            student = Student(
                user_id=user_id,
                language_preference=data.language_preference
            )
            db.add(student)
        else:
            # Update existing student
            student.language_preference = data.language_preference

        db.commit()
        db.refresh(student)
        return LanguagePreferenceResponse(
            language_preference=student.language_preference,
            saved=True
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


def register_student_routes(app):
    """Register student routes with the FastAPI app."""
    app.include_router(router)
