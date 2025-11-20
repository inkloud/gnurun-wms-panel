__all__ = ["FulfillmentOrder"]

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    date: datetime
    assigned_to: list[str] = field(default_factory=list)
