__all__ = [
    "UserRow",
    "FulfillmentOrderRow",
    "FulfillmentOrderProductRow",
    "FulfillmentOrderSessionRow",
    "WarehouseRow",
    "UserTypeRow",
    "ProductRow",
    "LocationInfo",
]

from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class UserTypeRow(Enum):
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"


@dataclass(frozen=True)
class WarehouseRow:
    id: int
    name: str


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


@dataclass(frozen=True)
class FulfillmentOrderSessionRow:
    operator_id: str
    fulfillment_order_id: int
    started_at: datetime


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
    type: UserTypeRow
    warehouse: WarehouseRow
