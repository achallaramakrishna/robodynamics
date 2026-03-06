from __future__ import annotations

import os
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

