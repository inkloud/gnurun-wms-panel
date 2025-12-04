__all__ = ["FulfillmentOrder", "FulfillmentOrderProduct", "FulfillmentOrderPosition"]

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    date: datetime
    assigned_to: list[str]


@dataclass(frozen=True)
class FulfillmentOrderProduct:
    id: str
    sku: str
    name: str
    quantity: int
    fulfillment_order_id: str
    position: str


@dataclass(frozen=True)
class FulfillmentOrderPosition:
    position: str
    products: list[FulfillmentOrderProduct]
