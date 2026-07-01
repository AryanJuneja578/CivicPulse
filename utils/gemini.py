"""
Gemini image analysis utilities for Community Hero.

Sends a local image to Google's Gemini API and returns structured
issue metadata: category, severity, and a short description.
"""

from __future__ import annotations

import json
import logging
import mimetypes
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import errors as genai_errors
from google.genai import types

# ── Configuration ─────────────────────────────────────────────────────────────

logger = logging.getLogger(__name__)

# Project root is one level above utils/
_PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Load environment variables from .env at project root
load_dotenv(_PROJECT_ROOT / ".env")

# Gemini model used for vision + structured JSON output
GEMINI_MODEL = "gemini-2.0-flash"

# Allowed values — kept in sync with the Report Issue page categories
ISSUE_CATEGORIES = [
    "Road & Infrastructure",
    "Sanitation & Waste",
    "Water & Drainage",
    "Public Safety",
    "Parks & Green Spaces",
    "Street Lighting",
    "Other",
]

SEVERITY_LEVELS = ["Low", "Medium", "High"]

# JSON schema so Gemini returns a predictable dictionary shape
RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "category": {
            "type": "string",
            "description": "Issue category from the allowed list.",
            "enum": ISSUE_CATEGORIES,
        },
        "severity": {
            "type": "string",
            "description": "Urgency level: Low, Medium, or High.",
            "enum": SEVERITY_LEVELS,
        },
        "description": {
            "type": "string",
            "description": "2–3 sentence summary of the visible issue.",
        },
    },
    "required": ["category", "severity", "description"],
}

ANALYSIS_PROMPT = """You are an expert community issue analyst for a hyperlocal
problem-reporting app called Community Hero.

Examine the uploaded image and identify any visible community or civic issue
(potholes, litter, broken infrastructure, flooding, safety hazards, etc.).

Return:
- category: pick the best match from the allowed categories
- severity: Low (minor/cosmetic), Medium (noticeable inconvenience),
  or High (safety risk or significant disruption)
- description: a clear 2–3 sentence summary of what you see

If the image is unclear or shows no obvious issue, use category "Other",
severity "Low", and describe what is visible."""


class GeminiAnalysisError(Exception):
    """Raised when image analysis fails due to config, input, or API errors."""


# ── Internal helpers ──────────────────────────────────────────────────────────


def _get_api_key() -> str:
    """Read the Gemini API key from environment (loaded via .env)."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key or not api_key.strip():
        raise GeminiAnalysisError(
            "Gemini API key not found. Set GEMINI_API_KEY in your .env file."
        )
    return api_key.strip()


def _create_client() -> genai.Client:
    """Create an authenticated Gemini client."""
    return genai.Client(api_key=_get_api_key())


def _resolve_image_path(image_path: str) -> Path:
    """Validate that the image path exists and is a file."""
    path = Path(image_path).expanduser().resolve()
    if not path.exists():
        raise GeminiAnalysisError(f"Image file not found: {image_path}")
    if not path.is_file():
        raise GeminiAnalysisError(f"Path is not a file: {image_path}")
    return path


def _detect_mime_type(path: Path) -> str:
    """Guess MIME type from file extension; default to image/jpeg."""
    mime_type, _ = mimetypes.guess_type(path.name)
    if mime_type and mime_type.startswith("image/"):
        return mime_type
    # Fallback for common extensions mimetypes may miss
    extension_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }
    return extension_map.get(path.suffix.lower(), "image/jpeg")


def _normalize_result(data: dict[str, Any]) -> dict[str, str]:
    """
    Ensure returned fields are strings and values fall within allowed enums.
    Falls back safely if Gemini returns unexpected values.
    """
    category = str(data.get("category", "Other")).strip()
    severity = str(data.get("severity", "Low")).strip()
    description = str(data.get("description", "")).strip()

    if category not in ISSUE_CATEGORIES:
        category = "Other"

    # Case-insensitive severity matching (e.g. "high" → "High")
    severity_lookup = {level.lower(): level for level in SEVERITY_LEVELS}
    severity = severity_lookup.get(severity.lower(), "Low")

    if not description:
        description = "No description could be generated for this image."

    return {
        "category": category,
        "severity": severity,
        "description": description,
    }


def _parse_response_text(raw_text: str | None) -> dict[str, str]:
    """Parse Gemini's JSON text response into the expected result dict."""
    if not raw_text or not raw_text.strip():
        raise GeminiAnalysisError("Gemini returned an empty response.")

    try:
        payload = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Gemini JSON response: %s", raw_text)
        raise GeminiAnalysisError(
            "Gemini returned invalid JSON. Please try again."
        ) from exc

    if not isinstance(payload, dict):
        raise GeminiAnalysisError("Gemini response was not a JSON object.")

    return _normalize_result(payload)


# ── Public API ────────────────────────────────────────────────────────────────


def analyze_image(image_path: str) -> dict[str, str]:
    """
    Analyze a community-issue image with Gemini.

    Args:
        image_path: Path to a local image file (jpg, png, webp, etc.).

    Returns:
        Dictionary with keys:
            - category: str
            - severity: str  ("Low", "Medium", or "High")
            - description: str

    Raises:
        GeminiAnalysisError: On missing API key, invalid path, or API failure.
    """
    path = _resolve_image_path(image_path)
    mime_type = _detect_mime_type(path)

    try:
        # Read image bytes from disk
        image_bytes = path.read_bytes()
    except OSError as exc:
        raise GeminiAnalysisError(f"Could not read image file: {path}") from exc

    if not image_bytes:
        raise GeminiAnalysisError("Image file is empty.")

    try:
        with _create_client() as client:
            # Send image + prompt; request structured JSON output
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[
                    ANALYSIS_PROMPT,
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                ],
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json",
                    response_json_schema=RESPONSE_SCHEMA,
                ),
            )
    except genai_errors.APIError as exc:
        logger.exception("Gemini API error during image analysis")
        raise GeminiAnalysisError(f"Gemini API error: {exc}") from exc
    except Exception as exc:
        logger.exception("Unexpected error during image analysis")
        raise GeminiAnalysisError(f"Image analysis failed: {exc}") from exc

    return _parse_response_text(response.text)