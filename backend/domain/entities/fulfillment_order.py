__all__ = [
    "FulfillmentOrder",
    "FulfillmentOrderLine",
    "FulfillmentOrderPosition",
    "SimpleOrder",
    "SimpleProduct",
]

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    date: datetime
    assigned_to: list[str]


@dataclass(frozen=True)
class FulfillmentOrderLine:
    id: str
    fulfillment_order_id: str
    sku: str
    position_code: str
    quantity_required: int
    name: str


@dataclass(frozen=True)
class SimpleProduct:
    id: str
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
