__all__ = ["DB"]

from .types import DBGateway, UserRow, Warehouse

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {
        "pwd": "bacchilu",
        "name": "Luca Bacchi",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "luca@life365.eu": {
        "pwd": "luca",
        "name": "Bacchi Luca",
        "warehouse": {"id": 4, "name": "Gnu102 forlì Srl"},
    },
}


class DB(DBGateway):
    @staticmethod
    def get_user(username: str) -> UserRow | None:
        user_data = USERS.get(username)
        return (
            None
            if user_data is None
            else UserRow(
                username=username,
                name=user_data["name"],
                pwd=user_data["pwd"],
                warehouse=Warehouse(
                    id=user_data["warehouse"]["id"], name=user_data["warehouse"]["name"]
                ),
            )
        )
