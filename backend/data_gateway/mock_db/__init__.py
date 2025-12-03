__all__ = ["DB"]

from ..types import (
    DBGateway,
    FulfillmentGateway,
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
    User,
    UserGateway,
    UserRow,
    UserType,
)
from .fulfillment_orders import FULFILLMENT_ORDERS, FULFILLMENT_ORDERS_PRODUCTS
from .users import USERS


def _to_user_row(username: str, user_data: User) -> UserRow:
    return UserRow(
        username=username,
        name=user_data.name,
        pwd=user_data.pwd,
        type=user_data.type,
        warehouse=user_data.warehouse,
    )


class _UserGateway(UserGateway):
    @staticmethod
    def get_user(username: str) -> UserRow | None:
        user_data = USERS.get(username)
        return None if user_data is None else _to_user_row(username, user_data)

    @staticmethod
    def get_operators(username: str) -> list[UserRow]:
        manager_user: UserRow | None = _UserGateway.get_user(username)
        if manager_user is None:
            raise KeyError(f"Unknown manager '{username}'")
        assert manager_user.type == UserType.MANAGER
        warehouse_id: int = manager_user.warehouse.id

        return [
            _to_user_row(username, user_data)
            for username, user_data in USERS.items()
            if user_data.type == UserType.OPERATOR
            and user_data.warehouse.id == warehouse_id
        ]


class _FulfillmentGateway(FulfillmentGateway):
    @staticmethod
    def get_fulfillment_orders() -> list[FulfillmentOrderRow]:
        return sorted(FULFILLMENT_ORDERS, key=lambda order: order.date)

    @staticmethod
    def assign(id: int, operator: str) -> FulfillmentOrderRow:
        res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
        assert len(res) == 1
        data: FulfillmentOrderRow = res[0]
        if operator not in data.assigned_to:
            data.assigned_to.append(operator)
        return data

    @staticmethod
    def unassign(id: int, operator: str) -> FulfillmentOrderRow:
        res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
        assert len(res) == 1
        data: FulfillmentOrderRow = res[0]
        try:
            data.assigned_to.remove(operator)
        except ValueError:
            pass
        return data

    @staticmethod
    def get_products(id: int) -> list[FulfillmentOrderProductRow]:
        return [e for e in FULFILLMENT_ORDERS_PRODUCTS if e.fulfillment_order_id == id]


class DB(DBGateway):
    def __init__(self) -> None:
        self.user: UserGateway = _UserGateway()
        self.fulfillment: FulfillmentGateway = _FulfillmentGateway()
