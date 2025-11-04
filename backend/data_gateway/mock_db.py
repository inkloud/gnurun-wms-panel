__all__ = ["DB"]

from datetime import datetime

from .types import DBGateway, FulfillmentOrder, UserRow, UserType, Warehouse

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


FULFILLMENT_ORDERS: list[FulfillmentOrder] = [
    FulfillmentOrder(id="FO-1001", date=datetime(2024, 2, 6)),
    FulfillmentOrder(id="FO-1002", date=datetime(2024, 2, 7)),
    FulfillmentOrder(id="FO-1003", date=datetime(2024, 2, 8)),
]


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

    @staticmethod
    def get_operators(user_name: str) -> list[UserRow]:
        manager_user = [
            UserRow(
                username=username,
                name=user_data["name"],
                pwd=user_data["pwd"],
                type=UserType(user_data["type"]),
                warehouse=Warehouse(
                    id=user_data["warehouse"]["id"], name=user_data["warehouse"]["name"]
                ),
            )
            for username, user_data in USERS.items()
            if username == user_name
        ]
        assert len(manager_user) == 1
        assert manager_user[0].type == UserType.MANAGER
        warehouse_id = manager_user[0].warehouse.id

        return [
            UserRow(
                username=username,
                name=user_data["name"],
                pwd=user_data["pwd"],
                type=UserType(user_data["type"]),
                warehouse=Warehouse(
                    id=user_data["warehouse"]["id"],
                    name=user_data["warehouse"]["name"],
                ),
            )
            for username, user_data in USERS.items()
            if user_data["type"] == "OPERATOR"
            and user_data["warehouse"]["id"] == warehouse_id
        ]

    @staticmethod
    def get_fulfillment_orders() -> list[FulfillmentOrder]:
        return FULFILLMENT_ORDERS
