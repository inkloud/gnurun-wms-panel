__all__ = [
    "FulfillmentOrder",
    "FulfillmentOrderLine",
    "FulfillmentOrderLinePick",
    "FulfillmentOrderPosition",
    "FulfillmentOrderSession",
    "SimpleOrder",
    "SimpleProduct",
]

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    created_at: datetime


@dataclass(frozen=True)
class FulfillmentOrderSession:
    id: str
    operator_id: str
    fulfillment_order_id: str
    started_at: datetime


@dataclass(frozen=True)
class FulfillmentOrderLine:
    id: str
    fulfillment_order_id: str
    sku: str
    position_code: str
    quantity_required: int
    name: str
    requires_serial_tracking: bool


@dataclass(frozen=True)
class FulfillmentOrderLinePick:
    id: str
    fulfillment_order_session_id: str
    fulfillment_order_line_id: str
    quantity_picked: int
    serial_numbers: list[str]
    picked_at: datetime


@dataclass(frozen=True)
class SimpleProduct:
    sku: str
    name: str
    requires_serial_tracking: bool


@dataclass(frozen=True)
class SimpleOrder:
    id: str
    quantity: int


@dataclass(frozen=True)
class FulfillmentOrderPosition:
    position: str
    product: SimpleProduct
    orders: list[SimpleOrder]
