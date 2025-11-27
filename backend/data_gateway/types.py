__all__ = [
    "UserRow",
    "FulfillmentOrderRow",
    "FulfillmentOrderProductRow",
    "Warehouse",
    "UserType",
    "UserGateway",
    "FulfillmentGateway",
    "DBGateway",
]

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Protocol


class UserType(Enum):
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"


@dataclass(frozen=True)
class Warehouse:
    id: int
    name: str


@dataclass(frozen=True)
class FulfillmentOrderRow:
    id: str
    date: datetime
    assigned_to: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class FulfillmentOrderProductRow:
    id: int
    sku: str
    name: str
    quantity: int
    fulfillment_order_id: int


@dataclass(frozen=True)
class UserRow:
    username: str
    name: str
    pwd: str
    type: UserType
    warehouse: Warehouse


class UserGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> UserRow | None: ...

    @staticmethod
    def get_operators(username: str) -> list[UserRow]: ...


class FulfillmentGateway(Protocol):
    @staticmethod
    def get_fulfillment_orders() -> list[FulfillmentOrderRow]: ...

    @staticmethod
    def assign(id: str, operator: str) -> FulfillmentOrderRow: ...

    @staticmethod
    def unassign(id: str, operator: str) -> FulfillmentOrderRow: ...

    @staticmethod
    def get_products(fulfillment_order_id: int) -> list[FulfillmentOrderProductRow]: ...


class DBGateway(Protocol):
    user: UserGateway
    fulfillment: FulfillmentGateway
