"""
AI Tutor API - FastAPI Application
Main entry point for AI tutor services

Routes registered:
  - /ai-tutor-api/student/* (student preferences, language settings)
  - /ai-tutor-api/neet/* (NEET tutoring, doubts, progress)
  - /ai-tutor-api/moneymind/* (financial literacy game)
"""
from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.token_service import TokenService
from app.services.session_store import SessionStore
from app.services.orchestrator import TutorOrchestrator
from app.services.engine_registry import TutorEngineRegistry
from app.services.generic_course_engine import GenericCourseEngine

# Import route registration functions
from app.student_routes import register_student_routes
from app.moneymind_routes import register_moneymind_routes
from app.neet_routes import register_neet_routes


def create_app() -> FastAPI:
    """Create and configure FastAPI application with all dependencies."""

    app = FastAPI(
        title="RoboDynamics AI Tutor API",
        description="AI-powered tutoring system for multiple courses",
        version="2.0.0",
    )

    # ─────────────────────────────────────────────────────────────────────────────
    # CORS Middleware
    # ─────────────────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ─────────────────────────────────────────────────────────────────────────────
    # Initialize Core Services
    # ─────────────────────────────────────────────────────────────────────────────
    token_service = TokenService()
    session_store = SessionStore()
    orchestrator = TutorOrchestrator()

    # Initialize course engines for all available courses
    course_engines = {}
    courses = [
        "vedic_math",
        "neet_physics",
        "neet_chemistry",
        "neet_biology",
        "aptitude_reasoning",
        "financial_literacy",
        "coding_python_basics",
    ]

    for course_id in courses:
        try:
            engine = GenericCourseEngine(course_id)
            course_engines[course_id] = engine
        except Exception as e:
            print(f"⚠️  Warning: Failed to load course engine for {course_id}: {e}")

    engine_registry = TutorEngineRegistry(course_engines)

    # ─────────────────────────────────────────────────────────────────────────────
    # Register Routes
    # ─────────────────────────────────────────────────────────────────────────────

    # 1. Student Preferences (language, settings)
    register_student_routes(app)

    # 2. MoneyMind Financial Literacy
    register_moneymind_routes(app)

    # 3. NEET Tutoring (physics, chemistry, biology)
    register_neet_routes(app, token_service, engine_registry, session_store, orchestrator)

    # ─────────────────────────────────────────────────────────────────────────────
    # Health Check Endpoint
    # ─────────────────────────────────────────────────────────────────────────────
    @app.get("/health")
    def health_check():
        """Health check endpoint."""
        return {
            "status": "ok",
            "service": "ai-tutor-api",
            "version": "2.0.0",
            "courses_loaded": len(course_engines),
        }

    return app


# Create app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8091)
