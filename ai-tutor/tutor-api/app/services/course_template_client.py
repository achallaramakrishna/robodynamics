from __future__ import annotations

import os
import time
from typing import Any, Dict, Optional

import httpx


class CourseTemplateClient:
    def __init__(self) -> None:
        self._endpoint = os.getenv(
            "AI_TUTOR_TEMPLATE_API_URL",
            "http://localhost:8085/api/ai-tutor/course-template",
        ).strip()
        self._api_key = os.getenv("TUTOR_INTERNAL_KEY", "").strip()
        self._timeout_sec = max(2.0, float(os.getenv("AI_TUTOR_TEMPLATE_TIMEOUT_SEC", "8")))
        self._cache_ttl_sec = max(10, int(os.getenv("AI_TUTOR_TEMPLATE_CACHE_TTL_SEC", "120")))
        self._cache: Dict[str, Dict[str, Any]] = {}

    def fetch(self, template_course_id: str | int | None) -> Optional[Dict[str, Any]]:
        cid = str(template_course_id or "").strip()
        if not cid:
            return None

        now = time.time()
        cached = self._cache.get(cid)
        if cached and now < float(cached.get("expiresAt", 0)):
            payload = cached.get("payload")
            return payload if isinstance(payload, dict) else None

        if not self._endpoint:
            return None

        headers: Dict[str, str] = {}
        if self._api_key:
            headers["X-AI-TUTOR-KEY"] = self._api_key

        try:
            with httpx.Client(timeout=self._timeout_sec) as client:
                resp = client.get(
                    self._endpoint,
                    params={"courseId": cid},
                    headers=headers,
                )
                resp.raise_for_status()
                payload = resp.json()
                if isinstance(payload, dict):
                    self._cache[cid] = {
                        "payload": payload,
                        "expiresAt": now + self._cache_ttl_sec,
                    }
                    return payload
        except Exception:
            return None
        return None

