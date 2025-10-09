__all__ = ["get_by_username", "UserRow"]

from dataclasses import dataclass


@dataclass(frozen=True)
class UserRow:
    username: str
    name: str
    pwd: str


USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {"pwd": "bacchilu", "name": "Luca Bacchi"},
    "luca@life365.eu": {"pwd": "luca", "name": "Bacchi Luca"},
}


def get_by_username(username: str) -> UserRow | None:
    user_data = USERS.get(username)
    return None if user_data is None else UserRow(**{**user_data, "username": username})
