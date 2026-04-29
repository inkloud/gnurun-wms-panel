from __future__ import annotations

__all__ = [
    "DBGateway",
    "FulfillmentOrderAssignmentGateway",
    "FulfillmentOrderGateway",
    "FulfillmentPickGateway",
    "UserGateway",
]

from typing import Protocol

from backend.application.entities.fulfillment_order import (
    FulfillmentOrder,
    FulfillmentOrderAssignment,
    FulfillmentOrderLine,
    FulfillmentOrderLinePick,
)
from backend.application.entities.users import User


class UserGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> User | None: ...

    @staticmethod
    def get_operators(username: str) -> list[User]: ...


class FulfillmentOrderGateway(Protocol):
    @staticmethod
    def get_ready(warehouse_id: int) -> list[FulfillmentOrder]: ...

    @staticmethod
    def get(id: int) -> FulfillmentOrder: ...

    @staticmethod
    def get_lines(id: int) -> list[FulfillmentOrderLine]: ...


class FulfillmentOrderAssignmentGateway(Protocol):
    @staticmethod
    def get_assignments(id: int) -> set[FulfillmentOrderAssignment]: ...

    @staticmethod
    def assign(id: int, operator: str) -> set[FulfillmentOrderAssignment]: ...

    @staticmethod
    def unassign(id: int, operator: str) -> set[FulfillmentOrderAssignment]: ...


class FulfillmentPickGateway(Protocol):
    @staticmethod
    def new_pick(
        fulfillment_order_assignment_id: str,
        fulfillment_order_line_id: str,
        quantity_picked: int,
        serial_numbers: list[str],
    ) -> FulfillmentOrderLinePick: ...

    @staticmethod
    def get_picks() -> list[FulfillmentOrderLinePick]: ...


class DBGateway(Protocol):
    user: UserGateway
    fulfillment_order: FulfillmentOrderGateway
    fulfillment_assignment: FulfillmentOrderAssignmentGateway
    fulfillment_pick: FulfillmentPickGateway
