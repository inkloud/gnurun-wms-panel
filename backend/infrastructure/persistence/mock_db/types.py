__all__ = [
    "UserRow",
    "FulfillmentOrderRow",
    "FulfillmentOrderAssignmentRow",
    "FulfillmentOrderLineRow",
    "FulfillmentOrderLinePickRow",
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
    requires_serial_tracking: bool
    where: list[LocationInfo]
    warehouse_id: int

    def get_stock(self) -> int:
        return sum(p.stock for p in self.where)


@dataclass(frozen=True)
class FulfillmentOrderRow:
    id: int
    date: datetime


@dataclass(frozen=True)
class FulfillmentOrderAssignmentRow:
    id: int
    operator_id: str
    fulfillment_order_id: int
    started_at: datetime


@dataclass(frozen=True)
class FulfillmentOrderLineRow:
    id: int
    fulfillment_order_id: int
    sku: str
    position_code: str
    quantity_required: int
    name: str
    requires_serial_tracking: bool


@dataclass(frozen=True)
class FulfillmentOrderLinePickRow:
    id: int
    fulfillment_order_assignment_id: int
    fulfillment_order_line_id: int
    quantity_picked: int
    serial_numbers: list[str]
    picked_at: datetime


@dataclass(frozen=True)
class UserRow:
    username: str
    name: str
    pwd: str
    type: UserTypeRow
    warehouse: WarehouseRow
