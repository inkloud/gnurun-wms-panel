__all__ = ["DB"]

from datetime import datetime, timedelta

from .types import (
    DBGateway,
    FulfillmentGateway,
    FulfillmentOrder,
    UserGateway,
    UserRow,
    UserType,
    Warehouse,
)

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

NOW = datetime.now()
FULFILLMENT_ORDERS: list[FulfillmentOrder] = [
    FulfillmentOrder(
        id="FO-1001",
        date=NOW - timedelta(hours=23, minutes=15),
        assigned_to=["luca@life365.eu"],
    ),
    FulfillmentOrder(id="FO-1002", date=NOW - timedelta(hours=21, minutes=40)),
    FulfillmentOrder(
        id="FO-1003",
        date=NOW - timedelta(hours=19, minutes=5),
        assigned_to=["luca@life365.eu", "alice.porter@gnurun.example"],
    ),
    FulfillmentOrder(id="FO-1004", date=NOW - timedelta(hours=17, minutes=20)),
    FulfillmentOrder(
        id="FO-1005",
        date=NOW - timedelta(hours=15, minutes=45),
        assigned_to=["marco.jimenez@gnurun.example"],
    ),
    FulfillmentOrder(id="FO-1006", date=NOW - timedelta(hours=13, minutes=10)),
    FulfillmentOrder(id="FO-1007", date=NOW - timedelta(hours=10, minutes=30)),
    FulfillmentOrder(id="FO-1008", date=NOW - timedelta(hours=7, minutes=55)),
    FulfillmentOrder(id="FO-1009", date=NOW - timedelta(hours=5, minutes=15)),
    FulfillmentOrder(id="FO-1010", date=NOW - timedelta(hours=2, minutes=45)),
]


def _to_user_row(username: str, user_data: dict) -> UserRow:
    return UserRow(
        username=username,
        name=user_data["name"],
        pwd=user_data["pwd"],
        type=UserType(user_data["type"]),
        warehouse=Warehouse(
            id=user_data["warehouse"]["id"],
            name=user_data["warehouse"]["name"],
        ),
    )


class _UserGateway(UserGateway):
    @staticmethod
    def get_user(username: str) -> UserRow | None:
        user_data = USERS.get(username)
        return None if user_data is None else _to_user_row(username, user_data)

    @staticmethod
    def get_operators(user_name: str) -> list[UserRow]:
        manager_user = _UserGateway.get_user(user_name)
        if manager_user is None:
            raise KeyError(f"Unknown manager '{user_name}'")
        assert manager_user.type == UserType.MANAGER
        warehouse_id = manager_user.warehouse.id

        return [
            _to_user_row(username, user_data)
            for username, user_data in USERS.items()
            if user_data["type"] == "OPERATOR"
            and user_data["warehouse"]["id"] == warehouse_id
        ]


class _FulfillmentGateway(FulfillmentGateway):
    @staticmethod
    def get_fulfillment_orders() -> list[FulfillmentOrder]:
        return sorted(FULFILLMENT_ORDERS, key=lambda order: order.date)


class DB(DBGateway):
    def __init__(self) -> None:
        self.user: UserGateway = _UserGateway()
        self.fulfillment: FulfillmentGateway = _FulfillmentGateway()
