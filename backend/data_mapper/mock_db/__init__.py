__all__ = ["DB"]

from datetime import datetime

from ...domain.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderSession,
)
from ...domain.entities.users import User, UserType, Warehouse
from ...services.interfaces.data_gateway import (
    DBGateway,
    FulfillmentGateway,
    UserGateway,
)
from .fulfillment_orders import (
    FULFILLMENT_ORDER_LINE_PICKS,
    FULFILLMENT_ORDER_SESSIONS,
    FULFILLMENT_ORDERS,
    FULFILLMENT_ORDERS_PRODUCTS,
)
from .types import (
    FulfillmentOrderLinePickRow,
    FulfillmentOrderLineRow,
    FulfillmentOrderRow,
    FulfillmentOrderSessionRow,
    UserRow,
    UserTypeRow,
)
from .users import USERS


def _encode_id(prefix: str, id: int) -> str:
    return f"{prefix}-{id:04d}"


def _decode_id(prefix: str, id: str) -> int:
    return int(id.split(f"{prefix}-")[1])


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
                id=_encode_id("FO", f.id),
                created_at=f.date,
            )
            for f in FULFILLMENT_ORDERS
        ]
        return sorted(data, key=lambda order: order.created_at)

    @staticmethod
    def get(id: int) -> FulfillmentOrder:
        res: list[FulfillmentOrderRow] = [f for f in FULFILLMENT_ORDERS if f.id == id]
        assert len(res) == 1
        data: FulfillmentOrderRow = res[0]
        return FulfillmentOrder(
            id=_encode_id("FO", data.id),
            created_at=data.date,
        )

    @staticmethod
    def get_sessions(id: int) -> set[FulfillmentOrderSession]:
        return {
            FulfillmentOrderSession(
                id=_encode_id("FO-SESS", row.id),
                operator_id=row.operator_id,
                fulfillment_order_id=_encode_id("FO", row.fulfillment_order_id),
                started_at=row.started_at,
            )
            for row in FULFILLMENT_ORDER_SESSIONS
            if row.fulfillment_order_id == id
        }

    @staticmethod
    def assign(id: int, operator: str) -> set[FulfillmentOrderSession]:
        _FulfillmentGateway.get(id)
        if not any(
            row.fulfillment_order_id == id and row.operator_id == operator
            for row in FULFILLMENT_ORDER_SESSIONS
        ):
            FULFILLMENT_ORDER_SESSIONS.append(
                FulfillmentOrderSessionRow(
                    id=max((row.id for row in FULFILLMENT_ORDER_SESSIONS), default=0)
                    + 1,
                    operator_id=operator,
                    fulfillment_order_id=id,
                    started_at=datetime.now(),
                )
            )
        return _FulfillmentGateway.get_sessions(id)

    @staticmethod
    def unassign(id: int, operator: str) -> set[FulfillmentOrderSession]:
        _FulfillmentGateway.get(id)
        FULFILLMENT_ORDER_SESSIONS[:] = [
            row
            for row in FULFILLMENT_ORDER_SESSIONS
            if not (row.fulfillment_order_id == id and row.operator_id == operator)
        ]
        return _FulfillmentGateway.get_sessions(id)

    @staticmethod
    def get_lines(id: int) -> list[FulfillmentOrderLine]:
        return [
            FulfillmentOrderLine(
                id=_encode_id("FO-LINE", e.id),
                fulfillment_order_id=_encode_id("FO", e.fulfillment_order_id),
                sku=e.sku,
                position_code=e.position_code,
                quantity_required=e.quantity_required,
                name=e.name,
            )
            for e in FULFILLMENT_ORDERS_PRODUCTS
            if e.fulfillment_order_id == id
        ]

    @staticmethod
    def new_pick(
        fulfillment_order_session_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
    ) -> FulfillmentOrderLinePick:
        if quantity_picked <= 0:
            raise ValueError("quantity_picked must be > 0")

        session_id: int = _decode_id("FO-SESS", fulfillment_order_session_id)
        session_rows: list[FulfillmentOrderSessionRow] = [
            row for row in FULFILLMENT_ORDER_SESSIONS if row.id == session_id
        ]
        assert len(session_rows) > 0
        session_row: FulfillmentOrderSessionRow = session_rows[0]

        line_id: int = _decode_id("FO-LINE", fulfillment_order_line_id)
        line_rows: list[FulfillmentOrderLineRow] = [
            row
            for row in FULFILLMENT_ORDERS_PRODUCTS
            if row.id == line_id
            and row.fulfillment_order_id == session_row.fulfillment_order_id
        ]
        assert len(line_rows) > 0

        row_id = max((row.id for row in FULFILLMENT_ORDER_LINE_PICKS), default=0) + 1
        pick_row = FulfillmentOrderLinePickRow(
            id=row_id,
            fulfillment_order_session_id=session_id,
            fulfillment_order_line_id=line_id,
            quantity_picked=quantity_picked,
            picked_at=datetime.now(),
        )
        FULFILLMENT_ORDER_LINE_PICKS.append(pick_row)

        return FulfillmentOrderLinePick(
            id=_encode_id("LINE-PICK", pick_row.id),
            fulfillment_order_session_id=fulfillment_order_session_id,
            fulfillment_order_line_id=fulfillment_order_line_id,
            quantity_picked=pick_row.quantity_picked,
            picked_at=pick_row.picked_at,
        )

    @staticmethod
    def get_picks() -> list[FulfillmentOrderLinePick]:
        return [
            FulfillmentOrderLinePick(
                id=_encode_id("LINE-PICK", row.id),
                fulfillment_order_session_id=_encode_id(
                    "FO-SESS", row.fulfillment_order_session_id
                ),
                fulfillment_order_line_id=_encode_id(
                    "FO-LINE", row.fulfillment_order_line_id
                ),
                quantity_picked=row.quantity_picked,
                picked_at=row.picked_at,
            )
            for row in FULFILLMENT_ORDER_LINE_PICKS
        ]


class DB(DBGateway):
    def __init__(self) -> None:
        self.user: UserGateway = _UserGateway()
        self.fulfillment: FulfillmentGateway = _FulfillmentGateway()
