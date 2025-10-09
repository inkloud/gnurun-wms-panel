__all__ = ["DB"]

from .types import DBGateway, UserRow

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {"pwd": "bacchilu", "name": "Luca Bacchi"},
    "luca@life365.eu": {"pwd": "luca", "name": "Bacchi Luca"},
}


class DB(DBGateway):
    @staticmethod
    def get_user(username: str) -> UserRow | None:
        user_data = USERS.get(username)
        return (
            None
            if user_data is None
            else UserRow(**{**user_data, "username": username})
        )
