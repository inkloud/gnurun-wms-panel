from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

SECRET: str = "Salve, mondo!"
ALGORITHM: str = "HS256"


def encode_jwt(payload: dict[str, Any]) -> str:
    exp: datetime = datetime.now(timezone.utc) + timedelta(hours=24)
    return jwt.encode({**payload, "exp": exp}, SECRET, algorithm=ALGORITHM)  # type: ignore


def decode_jwt(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGORITHM])  # type: ignore
    except jwt.InvalidTokenError as exc:
        raise Exception() from exc
