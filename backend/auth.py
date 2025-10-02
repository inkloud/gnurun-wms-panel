from datetime import datetime, timedelta, timezone

import jwt

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {"pwd": "bacchilu", "name": "Luca Bacchi"},
    "luca@life365.eu": {"pwd": "luca", "name": "Bacchi Luca"},
}
SECRET: str = "Salve, mondo!"
ALGORITHM: str = "HS256"
EXP: datetime = datetime.now(timezone.utc) + timedelta(hours=24)


def check_credentials(username: str, password: str) -> dict | None:
    user_data = USERS[username]
    if user_data is not None and user_data["pwd"] == password:
        token = jwt.encode(
            {"username": username, "exp": EXP}, SECRET, algorithm=ALGORITHM
        )
        return {
            "access_token": token,
            "user": {"username": username, "name": user_data["name"]},
        }
    return None


def check_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        username = payload["username"]
        return {
            "access_token": token,
            "user": {"username": username, "name": USERS[username]["name"]},
        }
    except jwt.InvalidTokenError as exc:
        raise Exception() from exc
