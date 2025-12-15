__all__ = ["DB"]


from ...domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
)
from ...domain.entities.users import User, UserType, Warehouse
from ...domain.interfaces.data_gateway import (
    DBGateway,
    FulfillmentGateway,
    UserGateway,
)
from .fulfillment_orders import FULFILLMENT_ORDERS, FULFILLMENT_ORDERS_PRODUCTS
from .types import FulfillmentOrderRow, UserRow, UserTypeRow
from .users import USERS


def _encode_id(prefix: str, id: int) -> str:
    return f"{prefix}-{id:04d}"


def _to_user_row(user_data: UserRow) -> User:
    return User(
        username=user_data.username,
        name=user_data.name,
        pwd=user_data.pwd,
        type=UserType(user_data.type.value),
        warehouse=Warehouse(id=user_data.warehouse.id, name=user_data.warehouse.name),
    )


class _UserGateway(UserGateway):
    @staticmethod
    def get_user(username: str) -> User | None:
        user_data: UserRow | None = USERS.get(username)
        return None if user_data is None else _to_user_row(user_data)

    @staticmethod
    def get_operators(username: str) -> list[User]:
        manager_user: User | None = _UserGateway.get_user(username)
        if manager_user is None:
            raise KeyError(f"Unknown manager '{username}'")
        assert manager_user.type == UserType.MANAGER
        warehouse_id: int = manager_user.warehouse.id

        return [
            _to_user_row(user_data)
            for user_data in USERS.values()
            if user_data.type == UserTypeRow.OPERATOR
            and user_data.warehouse.id == warehouse_id
        ]


class _FulfillmentGateway(FulfillmentGateway):
    @staticmethod
    def get_ready() -> list[FulfillmentOrder]:
        data: list[FulfillmentOrder] = [
            FulfillmentOrder(
                id=_encode_id("FO", f.id), date=f.date, assigned_to=f.assigned_to[:]
            )
            for f in FULFILLMENT_ORDERS
        ]
        return sorted(data, key=lambda order: order.date)

    @staticmethod
    def assign(id: int, operator: str) -> FulfillmentOrder:
        res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
        assert len(res) == 1
        data: FulfillmentOrderRow = res[0]
        if operator not in data.assigned_to:
            data.assigned_to.append(operator)
        return FulfillmentOrder(
            id=_encode_id("FO", data.id),
            date=data.date,
            assigned_to=data.assigned_to[:],
        )

    @staticmethod
    def unassign(id: int, operator: str) -> FulfillmentOrder:
        res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
        assert len(res) == 1
        data: FulfillmentOrderRow = res[0]
        try:
            data.assigned_to.remove(operator)
        except ValueError:
            pass
        return FulfillmentOrder(
            id=_encode_id("FO", data.id),
            date=data.date,
            assigned_to=data.assigned_to[:],
        )

    @staticmethod
    def get_lines(id: int) -> list[FulfillmentOrderLine]:
        return [
            FulfillmentOrderLine(
                id=_encode_id("PR", e.id),
                fulfillment_order_id=_encode_id("FO", e.fulfillment_order_id),
                sku=e.sku,
                position_code=e.position,
                quantity_required=e.quantity,
                name=e.name,
            )
            for e in FULFILLMENT_ORDERS_PRODUCTS
            if e.fulfillment_order_id == id
        ]


class DB(DBGateway):
    def __init__(self) -> None:
        self.user: UserGateway = _UserGateway()
        self.fulfillment: FulfillmentGateway = _FulfillmentGateway()
