__all__ = ["DB"]

from ..types import (
    DBGateway,
    FulfillmentGateway,
    FulfillmentOrderProductRow,
    FulfillmentOrderRow,
    UserGateway,
    UserRow,
    UserTypeRow,
)
from .fulfillment_orders import FULFILLMENT_ORDERS, FULFILLMENT_ORDERS_PRODUCTS
from .users import USERS


def _to_user_row(user_data: UserRow) -> UserRow:
    return user_data


class _UserGateway(UserGateway):
    @staticmethod
    def get_user(username: str) -> UserRow | None:
        user_data = USERS.get(username)
        return None if user_data is None else _to_user_row(user_data)

    @staticmethod
    def get_operators(username: str) -> list[UserRow]:
        manager_user: UserRow | None = _UserGateway.get_user(username)
        if manager_user is None:
            raise KeyError(f"Unknown manager '{username}'")
        assert manager_user.type == UserTypeRow.MANAGER
        warehouse_id: int = manager_user.warehouse.id

        return [
            _to_user_row(user_data)
            for user_data in USERS.values()
            if user_data.type == UserTypeRow.OPERATOR
            and user_data.warehouse.id == warehouse_id
        ]


class _FulfillmentGateway(FulfillmentGateway):
    @staticmethod
    def get_ready() -> list[FulfillmentOrderRow]:
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
