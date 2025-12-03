__all__ = [
    "UserRow",
    "FulfillmentOrderRow",
    "FulfillmentOrderProductRow",
    "Warehouse",
    "User",
    "UserType",
    "UserGateway",
    "FulfillmentGateway",
    "DBGateway",
    "ProductRow",
    "LocationInfo",
]

from dataclasses import dataclass
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
class User:
    username: str
    name: str
    pwd: str
    type: UserType
    warehouse: Warehouse


@dataclass(frozen=True)
class LocationInfo:
    stock: int
    position: str


@dataclass(frozen=True)
class ProductRow:
    id: int
    sku: str
    name: str
    where: list[LocationInfo]

    def get_stock(self) -> int:
        return sum(p.stock for p in self.where)


@dataclass(frozen=True)
class FulfillmentOrderRow:
    id: int
    date: datetime
    assigned_to: list[str]


@dataclass(frozen=True)
class FulfillmentOrderProductRow:
    id: int
    sku: str
    name: str
    quantity: int
    fulfillment_order_id: int
    position: str


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
    def assign(id: int, operator: str) -> FulfillmentOrderRow: ...

    @staticmethod
    def unassign(id: int, operator: str) -> FulfillmentOrderRow: ...

    @staticmethod
    def get_products(id: int) -> list[FulfillmentOrderProductRow]: ...


class DBGateway(Protocol):
    user: UserGateway
    fulfillment: FulfillmentGateway
