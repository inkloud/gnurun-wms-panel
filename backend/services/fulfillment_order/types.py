__all__ = ["FulfillmentOrder", "FulfillmentOrderProduct"]

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    date: datetime
    assigned_to: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class FulfillmentOrderProduct:
    id: int
    sku: str
    name: str
    quantity: int
    fulfillment_order_id: int
