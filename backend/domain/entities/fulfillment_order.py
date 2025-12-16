__all__ = [
    "FulfillmentOrder",
    "FulfillmentOrderLine",
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
    operator_id: str
    fulfillment_order_id: str
    started_at: datetime


@dataclass(frozen=True)
class FulfillmentOrderLine:
    fulfillment_order_id: str
    sku: str
    position_code: str
    quantity_required: int
    name: str


@dataclass(frozen=True)
class SimpleProduct:
    sku: str
    name: str


@dataclass(frozen=True)
class SimpleOrder:
    id: str
    quantity: int


@dataclass(frozen=True)
class FulfillmentOrderPosition:
    position: str
    product: SimpleProduct
    orders: list[SimpleOrder]
