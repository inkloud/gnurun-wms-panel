__all__ = ["UserRow", "DBGateway", "Warehouse", "UserType", "FulfillmentOrder"]

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
class UserRow:
    username: str
    name: str
    pwd: str
    type: UserType
    warehouse: Warehouse


class DBGateway(Protocol):
    @staticmethod
    def get_user(username: str) -> UserRow | None: ...

    @staticmethod
    def get_operators(username: str) -> list[UserRow]: ...

    @staticmethod
    def get_fulfillment_orders() -> list["FulfillmentOrder"]: ...


@dataclass(frozen=True)
class FulfillmentOrder:
    id: str
    date: datetime
    assigned_to: list[str] = field(default_factory=list)
