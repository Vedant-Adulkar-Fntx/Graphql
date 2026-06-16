"""
utils.py — Type-safe conversion helpers
Handles the Excel quirks: serial-integer dates, NaN cells, mixed dtypes.
"""
from __future__ import annotations
import datetime
from typing import Any, Optional
import pandas as pd


# Excel's epoch is Dec 30 1899 (Lotus 1-2-3 bug, preserved forever)
_EXCEL_EPOCH = datetime.date(1899, 12, 30)


def to_date(val: Any) -> Optional[datetime.date]:
    """
    Convert any of these → datetime.date | None:
      • Excel serial int/float   (e.g. 45383 → 2024-03-31)
      • pandas Timestamp
      • datetime.datetime
      • datetime.date
      • ISO string "2024-03-31"
    """
    if val is None:
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass

    if isinstance(val, pd.Timestamp):
        return val.date()
    if isinstance(val, datetime.datetime):
        return val.date()
    if isinstance(val, datetime.date):
        return val
    if isinstance(val, (int, float)):
        try:
            return _EXCEL_EPOCH + datetime.timedelta(days=int(val))
        except (ValueError, OverflowError, OSError):
            return None
    if isinstance(val, str):
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y"):
            try:
                return datetime.datetime.strptime(val[:10], fmt).date()
            except ValueError:
                continue
    return None


def to_datetime(val: Any) -> Optional[datetime.datetime]:
    if val is None:
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass
    if isinstance(val, pd.Timestamp):
        return val.to_pydatetime()
    if isinstance(val, datetime.datetime):
        return val
    if isinstance(val, datetime.date):
        return datetime.datetime(val.year, val.month, val.day)
    if isinstance(val, str):
        try:
            return datetime.datetime.fromisoformat(val)
        except ValueError:
            d = to_date(val)
            return datetime.datetime(d.year, d.month, d.day) if d else None
    return None


def s(val: Any) -> Optional[str]:
    """Safe str: NaN / empty → None."""
    if val is None:
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass
    v = str(val).strip()
    return v if v and v.lower() not in ("nan", "none", "nat") else None


def f(val: Any) -> Optional[float]:
    if val is None:
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def i(val: Any) -> Optional[int]:
    v = f(val)
    return int(v) if v is not None else None


def b(val: Any) -> Optional[bool]:
    if val is None:
        return None
    try:
        if pd.isna(val):
            return None
    except (TypeError, ValueError):
        pass
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    if isinstance(val, str):
        return val.strip().lower() in ("true", "1", "yes", "y")
    return None


def row_dict(row: pd.Series) -> dict:
    """Pandas row → plain dict, NaN → None."""
    out = {}
    for k, v in row.items():
        try:
            out[k] = None if pd.isna(v) else v
        except (TypeError, ValueError):
            out[k] = v
    return out


def paginate(items: list, page: int = 0, page_size: int = 20) -> list:
    start = page * page_size
    return items[start: start + page_size]
