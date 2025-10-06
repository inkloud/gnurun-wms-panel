from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import jwt

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {"pwd": "bacchilu", "name": "Luca Bacchi"},
    "luca@life365.eu": {"pwd": "luca", "name": "Bacchi Luca"},
}
SECRET: str = "Salve, mondo!"
ALGORITHM: str = "HS256"
EXP: datetime = datetime.now(timezone.utc) + timedelta(hours=24)


@dataclass(frozen=True)
class AuthUser:
    username: str
    name: str


@dataclass(frozen=True)
class AuthPayload:
    access_token: str
    user: AuthUser


def check_credentials(username: str, password: str) -> AuthPayload | None:
    user_data = USERS.get(username)
    if user_data is not None and user_data.get("pwd") == password:
        token = jwt.encode(
            {"username": username, "exp": EXP}, SECRET, algorithm=ALGORITHM
        )
        return AuthPayload(
            access_token=token, user=AuthUser(username=username, name=user_data["name"])
        )
    return None


def check_token(token: str) -> AuthPayload:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        username = payload["username"]
        user_data = USERS.get(username)
        if user_data is None:
            raise KeyError(f"Unknown user '{username}'")
        return AuthPayload(
            access_token=token, user=AuthUser(username=username, name=user_data["name"])
        )
    except jwt.InvalidTokenError as exc:
        raise Exception() from exc
