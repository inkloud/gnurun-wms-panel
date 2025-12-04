from __future__ import annotations

__all__ = ["DBGateway", "UserGateway", "FulfillmentGateway"]

from typing import Protocol

from ..entities.fulfillment_order import FulfillmentOrder, FulfillmentOrderProduct
from ..entities.users import User


class UserGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> User | None: ...

    @staticmethod
    def get_operators(username: str) -> list[User]: ...


class FulfillmentGateway(Protocol):
    @staticmethod
    def get_ready() -> list[FulfillmentOrder]: ...

    @staticmethod
    def assign(id: int, operator: str) -> FulfillmentOrder: ...

    @staticmethod
    def unassign(id: int, operator: str) -> FulfillmentOrder: ...

    @staticmethod
    def get_products(id: int) -> list[FulfillmentOrderProduct]: ...


class DBGateway(Protocol):
    user: UserGateway
    fulfillment: FulfillmentGateway
