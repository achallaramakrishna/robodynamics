from __future__ import annotations

import os
import time
import uuid
from typing import Any, Dict
import jwt


class TokenService:
    def __init__(self) -> None:
        self.secret = os.getenv("AI_TUTOR_JWT_SECRET", "change_me_ai_tutor_secret")
        self.issuer = os.getenv("AI_TUTOR_JWT_ISSUER", "robodynamics-java")
        self.audience = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")

    def decode(self, token: str) -> Dict[str, Any]:
        return jwt.decode(
            token,
            self.secret,
            algorithms=["HS256"],
            issuer=self.issuer,
            audience=self.audience,
            options={"require": ["exp", "iat", "iss", "aud", "sub"]},
        )

    def issue_guest(self, chapter_code: str, grade: str = "8") -> str:
        """Issue a short-lived guest JWT for demo access (no login required)."""
        now = int(time.time())
        guest_id = abs(hash(uuid.uuid4().hex)) % 10_000_000  # positive pseudo-random int
        payload = {
            "sub": f"guest_{guest_id}",
            "iss": self.issuer,
            "aud": self.audience,
            "iat": now,
            "exp": now + 3600,          # 1-hour demo session
            "user_id": guest_id,
            "child_id": guest_id,
            "role": "GUEST",
            "grade": grade,
            "module": "VEDIC_MATH",
            "chapter_code": chapter_code,
            "is_demo": True,
            "demo_max_groups": 3,       # limit to first 3 exercise groups
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")

