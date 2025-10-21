__all__ = ["DB"]

from .types import DBGateway, UserRow, UserType, Warehouse

USERS: dict[str, dict] = {
    "bacchilu@gmail.com": {
        "pwd": "bacchilu",
        "name": "Luca Bacchi",
        "type": "MANAGER",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "alice.porter@gnurun.example": {
        "pwd": "alice.porter",
        "name": "Alice Porter",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "marco.jimenez@gnurun.example": {
        "pwd": "marco.jimenez",
        "name": "Marco Jimenez",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "priya.desai@gnurun.example": {
        "pwd": "priya.desai",
        "name": "Priya Desai",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "ethan.wright@gnurun.example": {
        "pwd": "ethan.wright",
        "name": "Ethan Wright",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "sofia.conti@gnurun.example": {
        "pwd": "sofia.conti",
        "name": "Sofia Conti",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
    },
    "luca@life365.eu": {
        "pwd": "luca",
        "name": "Luca Bacchi",
        "type": "OPERATOR",
        "warehouse": {"id": 1, "name": "Gnu000 Test"},
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
                type=UserType(user_data["type"]),
                warehouse=Warehouse(
                    id=user_data["warehouse"]["id"], name=user_data["warehouse"]["name"]
                ),
            )
        )
