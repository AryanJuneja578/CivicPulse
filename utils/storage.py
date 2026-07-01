"""
JSON file storage for Community Hero reports.

All reports are persisted in data/reports.json.
Safe for concurrent updates via file locking + atomic writes.
"""

from __future__ import annotations

import json
import os
import sys
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# ── Paths ─────────────────────────────────────────────────────────────────────

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = _PROJECT_ROOT / "data"
REPORTS_FILE = DATA_DIR / "reports.json"
LOCK_FILE = DATA_DIR / "reports.lock"

# Required fields on every saved report (user_description / lat / lon may be null)
REQUIRED_FIELDS = {
    "image_path",
    "category",
    "severity",
    "description",
}


# ── File locking (cross-platform, stdlib only) ──────────────────────────────


@contextmanager
def _file_lock():
    """
    Exclusive lock around read/modify/write so concurrent Streamlit
    sessions don't corrupt the JSON file.
    """
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    lock_handle = open(LOCK_FILE, "a+b")

    try:
        if sys.platform == "win32":
            import msvcrt

            lock_handle.seek(0)
            # Lock 1 byte at start of lock file
            msvcrt.locking(lock_handle.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl

            fcntl.flock(lock_handle.fileno(), fcntl.LOCK_EX)

        yield
    finally:
        try:
            if sys.platform == "win32":
                import msvcrt

                lock_handle.seek(0)
                msvcrt.locking(lock_handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                import fcntl

                fcntl.flock(lock_handle.fileno(), fcntl.LOCK_UN)
        finally:
            lock_handle.close()


# ── Internal I/O ──────────────────────────────────────────────────────────────


def _ensure_reports_file() -> None:
    """Create data/reports.json with an empty list if it does not exist."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not REPORTS_FILE.exists():
        REPORTS_FILE.write_text("[]", encoding="utf-8")


def _read_reports_unlocked() -> list[dict[str, Any]]:
    """Read reports from disk (caller must hold the file lock)."""
    _ensure_reports_file()

    try:
        raw = REPORTS_FILE.read_text(encoding="utf-8").strip()
        if not raw:
            return []
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Corrupted file — start fresh for MVP resilience
        return []

    if not isinstance(data, list):
        raise ValueError("reports.json must contain a JSON array.")

    return data


def _write_reports_unlocked(reports: list[dict[str, Any]]) -> None:
    """Atomically write reports to disk (caller must hold the file lock)."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    temp_path = REPORTS_FILE.with_suffix(".json.tmp")

    with open(temp_path, "w", encoding="utf-8") as handle:
        json.dump(reports, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    # Atomic replace — avoids partial writes on crash
    os.replace(temp_path, REPORTS_FILE)


def _normalize_report(report_dict: dict[str, Any]) -> dict[str, Any]:
    """
    Validate and normalize a report before saving.
    Adds id and timestamp when missing.
    """
    missing = REQUIRED_FIELDS - report_dict.keys()
    if missing:
        raise ValueError(f"Report is missing required fields: {sorted(missing)}")

    report = {
        "id": str(report_dict.get("id") or uuid.uuid4()),
        "image_path": str(report_dict["image_path"]),
        "category": str(report_dict["category"]),
        "severity": str(report_dict["severity"]),
        "description": str(report_dict["description"]),
        "user_description": report_dict.get("user_description") or None,
        "latitude": _coerce_float_or_none(report_dict.get("latitude")),
        "longitude": _coerce_float_or_none(report_dict.get("longitude")),
        "timestamp": report_dict.get("timestamp")
        or datetime.now(timezone.utc).isoformat(),
    }

    return report


def _coerce_float_or_none(value: Any) -> float | None:
    """Convert latitude/longitude to float, or None if empty."""
    if value is None or value == "":
        return None
    return float(value)


# ── Public API ────────────────────────────────────────────────────────────────


def save_report(report_dict: dict[str, Any]) -> dict[str, Any]:
    """
    Append a report to data/reports.json.

    Args:
        report_dict: Report fields (id/timestamp added automatically if omitted).

    Returns:
        The saved report including id and timestamp.
    """
    report = _normalize_report(report_dict)

    with _file_lock():
        reports = _read_reports_unlocked()
        reports.append(report)
        _write_reports_unlocked(reports)

    return report


def load_reports() -> list[dict[str, Any]]:
    """
    Load all reports from data/reports.json.

    Returns:
        List of report dictionaries, newest last.
    """
    with _file_lock():
        return _read_reports_unlocked()


def get_report_stats() -> dict[str, Any]:
    """
    Compute summary statistics from stored reports.

    Returns:
        {
            "total_reports": int,
            "critical_count": int,          # severity "High" or "Critical"
            "category_counts": dict[str, int],
            "severity_counts": dict[str, int],
        }
    """
    reports = load_reports()

    category_counts: dict[str, int] = {}
    severity_counts: dict[str, int] = {}
    critical_count = 0

    for report in reports:
        category = str(report.get("category", "Unknown"))
        severity = str(report.get("severity", "Unknown"))

        category_counts[category] = category_counts.get(category, 0) + 1
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

        if severity.lower() in {"high", "critical"}:
            critical_count += 1

    return {
        "total_reports": len(reports),
        "critical_count": critical_count,
        "category_counts": category_counts,
        "severity_counts": severity_counts,
    }