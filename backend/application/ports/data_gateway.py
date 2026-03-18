from __future__ import annotations

__all__ = ["DBGateway", "UserGateway", "FulfillmentGateway"]

from typing import Protocol

from backend.application.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
    FulfillmentOrderSession,
)
from backend.application.entities.users import User


class UserGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> User | None: ...

    @staticmethod
    def get_operators(username: str) -> list[User]: ...


class FulfillmentGateway(Protocol):
    @staticmethod
    def get_ready() -> list[FulfillmentOrder]: ...

    @staticmethod
    def get(id: int) -> FulfillmentOrder: ...

    @staticmethod
    def get_sessions(id: int) -> set[FulfillmentOrderSession]: ...

    @staticmethod
    def assign(id: int, operator: str) -> set[FulfillmentOrderSession]: ...

    @staticmethod
    def unassign(id: int, operator: str) -> set[FulfillmentOrderSession]: ...

    @staticmethod
    def get_lines(id: int) -> list[FulfillmentOrderLine]: ...

    @staticmethod
    def new_pick(
        fulfillment_order_session_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
    ) -> FulfillmentOrderLinePick: ...

    @staticmethod
    def get_picks() -> list[FulfillmentOrderLinePick]: ...


class DBGateway(Protocol):
    user: UserGateway
    fulfillment: FulfillmentGateway
